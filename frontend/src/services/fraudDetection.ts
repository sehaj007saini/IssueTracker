/**
 * Advanced Fraud Detection System
 * Prevents fake issues using multiple validation layers
 */

interface FraudCheckResult {
  isValid: boolean
  score: number // 0-100, higher is more legitimate
  reasons: string[]
  warnings: string[]
  blockers: string[]
}

interface IssueData {
  description: string
  location: {
    latitude: number
    longitude: number
    accuracy?: number
  }
  photos: File[]
  userId: string
  timestamp: Date
}

interface UserHistory {
  reportsCount: number
  rejectedCount: number
  verifiedCount: number
  accountAge: number // days
  lastReportTime?: Date
  spamScore: number
}

/**
 * Main fraud detection orchestrator
 */
export async function detectFraud(
  issueData: IssueData,
  userHistory: UserHistory
): Promise<FraudCheckResult> {
  const checks = await Promise.all([
    checkContentQuality(issueData.description),
    checkLocationValidity(issueData.location),
    checkPhotoAuthenticity(issueData.photos),
    checkUserBehavior(userHistory, issueData.timestamp),
    checkRateLimits(issueData.userId, userHistory),
    checkDuplicateContent(issueData)
  ])

  const scores = checks.map(c => c.score)
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length

  const allReasons = checks.flatMap(c => c.reasons)
  const allWarnings = checks.flatMap(c => c.warnings)
  const allBlockers = checks.flatMap(c => c.blockers)

  return {
    isValid: allBlockers.length === 0 && avgScore >= 60,
    score: Math.round(avgScore),
    reasons: allReasons,
    warnings: allWarnings,
    blockers: allBlockers
  }
}

/**
 * Check content quality and detect spam
 */
async function checkContentQuality(description: string): Promise<FraudCheckResult> {
  const reasons: string[] = []
  const warnings: string[] = []
  const blockers: string[] = []
  let score = 100

  // Length check
  if (description.length < 20) {
    score -= 30
    blockers.push('Description too short (minimum 20 characters)')
  } else if (description.length < 50) {
    score -= 10
    warnings.push('Description is brief, consider adding more details')
  } else {
    reasons.push('Adequate description length')
  }

  // Spam keywords detection
  const spamKeywords = ['click here', 'buy now', 'limited offer', 'call now', 'free money', 'winner', 'congratulations']
  const hasSpam = spamKeywords.some(keyword => description.toLowerCase().includes(keyword))
  if (hasSpam) {
    score -= 50
    blockers.push('Description contains spam keywords')
  }

  // Repeated characters check
  const hasRepeatedChars = /(.)\1{5,}/.test(description)
  if (hasRepeatedChars) {
    score -= 20
    warnings.push('Description contains excessive repeated characters')
  }

  // All caps check
  const capsRatio = (description.match(/[A-Z]/g) || []).length / description.length
  if (capsRatio > 0.7 && description.length > 20) {
    score -= 15
    warnings.push('Excessive use of capital letters detected')
  } else {
    reasons.push('Proper text formatting')
  }

  // Profanity check (basic)
  const profanityWords = ['bad', 'hate', 'stupid'] // Add more as needed
  const hasProfanity = profanityWords.some(word => 
    description.toLowerCase().includes(word)
  )
  if (hasProfanity) {
    score -= 10
    warnings.push('Description may contain inappropriate language')
  }

  // URL/Link check
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const hasLinks = urlRegex.test(description)
  if (hasLinks) {
    score -= 30
    blockers.push('Description contains external links')
  } else {
    reasons.push('No suspicious links found')
  }

  // Special characters ratio
  const specialCharsRatio = (description.match(/[^a-zA-Z0-9\s.,!?]/g) || []).length / description.length
  if (specialCharsRatio > 0.3) {
    score -= 20
    warnings.push('High ratio of special characters')
  }

  // Word diversity check
  const words = description.toLowerCase().split(/\s+/)
  const uniqueWords = new Set(words)
  const diversityRatio = uniqueWords.size / words.length
  if (diversityRatio < 0.5 && words.length > 10) {
    score -= 15
    warnings.push('Low word diversity detected')
  } else {
    reasons.push('Good content diversity')
  }

  return {
    isValid: blockers.length === 0,
    score: Math.max(0, score),
    reasons,
    warnings,
    blockers
  }
}

/**
 * Verify location accuracy and validity
 */
async function checkLocationValidity(location: IssueData['location']): Promise<FraudCheckResult> {
  const reasons: string[] = []
  const warnings: string[] = []
  const blockers: string[] = []
  let score = 100

  // Check if coordinates are valid
  if (Math.abs(location.latitude) > 90 || Math.abs(location.longitude) > 180) {
    score = 0
    blockers.push('Invalid GPS coordinates')
    return { isValid: false, score, reasons, warnings, blockers }
  }

  reasons.push('Valid GPS coordinates')

  // Check location accuracy
  if (location.accuracy) {
    if (location.accuracy > 100) {
      score -= 20
      warnings.push('Low GPS accuracy (>100m), location may be imprecise')
    } else if (location.accuracy > 50) {
      score -= 10
      warnings.push('Moderate GPS accuracy')
    } else {
      reasons.push('High GPS accuracy')
    }
  }

  // Check for common fake coordinates (0,0 or other suspicious patterns)
  if (location.latitude === 0 && location.longitude === 0) {
    score = 0
    blockers.push('Suspicious coordinates detected (0,0)')
  }

  // Check if location is in a valid service area (example: within India)
  // India bounding box: roughly 8-37°N, 68-97°E
  const isInIndia = 
    location.latitude >= 8 && location.latitude <= 37 &&
    location.longitude >= 68 && location.longitude <= 97

  if (!isInIndia) {
    score -= 40
    warnings.push('Location outside primary service area')
  } else {
    reasons.push('Location within service area')
  }

  return {
    isValid: blockers.length === 0,
    score: Math.max(0, score),
    reasons,
    warnings,
    blockers
  }
}

/**
 * Verify photo authenticity using metadata and basic checks
 */
async function checkPhotoAuthenticity(photos: File[]): Promise<FraudCheckResult> {
  const reasons: string[] = []
  const warnings: string[] = []
  const blockers: string[] = []
  let score = 100

  // Check if photos exist
  if (photos.length === 0) {
    score -= 30
    blockers.push('No photo evidence provided')
    return { isValid: false, score, reasons, warnings, blockers }
  }

  reasons.push(`${photos.length} photo(s) provided`)

  // Check each photo
  for (const photo of photos) {
    // Check file size (too small = suspicious, too large = not optimized)
    if (photo.size < 10000) { // Less than 10KB
      score -= 20
      warnings.push('Photo file size suspiciously small')
    } else if (photo.size > 10 * 1024 * 1024) { // More than 10MB
      score -= 10
      warnings.push('Photo file size very large')
    }

    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/webp']
    if (!validTypes.includes(photo.type)) {
      score -= 30
      blockers.push(`Invalid photo format: ${photo.type}`)
    } else {
      reasons.push('Valid photo format')
    }

    // Check timestamp (photo should be recent)
    const photoAge = Date.now() - photo.lastModified
    const hoursSinceModified = photoAge / (1000 * 60 * 60)
    
    if (hoursSinceModified > 720) { // Older than 30 days
      score -= 25
      warnings.push('Photo appears to be old (>30 days)')
    } else if (hoursSinceModified > 168) { // Older than 7 days
      score -= 15
      warnings.push('Photo may be dated (>7 days)')
    } else {
      reasons.push('Recent photo timestamp')
    }
  }

  return {
    isValid: blockers.length === 0,
    score: Math.max(0, score),
    reasons,
    warnings,
    blockers
  }
}

/**
 * Analyze user behavior patterns
 */
async function checkUserBehavior(userHistory: UserHistory, reportTime: Date): Promise<FraudCheckResult> {
  const reasons: string[] = []
  const warnings: string[] = []
  const blockers: string[] = []
  let score = 100

  // Check account age
  if (userHistory.accountAge < 1) {
    score -= 20
    warnings.push('New account (less than 1 day old)')
  } else if (userHistory.accountAge < 7) {
    score -= 10
    warnings.push('Recently created account')
  } else {
    reasons.push('Established account')
  }

  // Check rejection rate
  if (userHistory.reportsCount > 0) {
    const rejectionRate = userHistory.rejectedCount / userHistory.reportsCount
    if (rejectionRate > 0.5) {
      score -= 40
      warnings.push('High rejection rate for previous reports')
    } else if (rejectionRate > 0.3) {
      score -= 20
      warnings.push('Moderate rejection rate')
    } else {
      reasons.push('Good report acceptance history')
    }
  }

  // Check spam score
  if (userHistory.spamScore > 70) {
    score -= 50
    blockers.push('User flagged for spam behavior')
  } else if (userHistory.spamScore > 40) {
    score -= 25
    warnings.push('Elevated spam indicators')
  } else {
    reasons.push('Clean user history')
  }

  // Check verified reports ratio
  if (userHistory.reportsCount >= 5) {
    const verificationRate = userHistory.verifiedCount / userHistory.reportsCount
    if (verificationRate > 0.7) {
      score += 10
      reasons.push('High verification rate - trusted user')
    }
  }

  return {
    isValid: blockers.length === 0,
    score: Math.max(0, score),
    reasons,
    warnings,
    blockers
  }
}

/**
 * Check rate limits and prevent spam
 */
async function checkRateLimits(userId: string, userHistory: UserHistory): Promise<FraudCheckResult> {
  const reasons: string[] = []
  const warnings: string[] = []
  const blockers: string[] = []
  let score = 100

  // Check if last report was too recent
  if (userHistory.lastReportTime) {
    const timeSinceLastReport = Date.now() - userHistory.lastReportTime.getTime()
    const minutesSinceLastReport = timeSinceLastReport / (1000 * 60)

    if (minutesSinceLastReport < 5) {
      score -= 50
      blockers.push('Too many reports in short time (minimum 5 minutes between reports)')
    } else if (minutesSinceLastReport < 15) {
      score -= 20
      warnings.push('Frequent reporting detected')
    } else {
      reasons.push('Appropriate reporting frequency')
    }
  }

  // Check daily report limit
  const dailyLimit = userHistory.accountAge < 7 ? 3 : 10
  if (userHistory.reportsCount > dailyLimit) {
    score -= 30
    warnings.push(`Approaching daily report limit (${dailyLimit})`)
  }

  return {
    isValid: blockers.length === 0,
    score: Math.max(0, score),
    reasons,
    warnings,
    blockers
  }
}

/**
 * Check for duplicate/similar content
 */
async function checkDuplicateContent(issueData: IssueData): Promise<FraudCheckResult> {
  const reasons: string[] = []
  const warnings: string[] = []
  const blockers: string[] = []
  let score = 100

  // In real implementation, check against database
  // For now, basic validation
  
  // Check for template/copypasta text
  const templatePhrases = [
    'this is a test',
    'testing 123',
    'sample issue',
    'demo report'
  ]
  
  const hasTemplate = templatePhrases.some(phrase => 
    issueData.description.toLowerCase().includes(phrase)
  )
  
  if (hasTemplate) {
    score -= 40
    blockers.push('Description appears to be a test/template')
  } else {
    reasons.push('Original content detected')
  }

  // TODO: Implement similarity check against recent reports in same area
  // Use Levenshtein distance or cosine similarity

  return {
    isValid: blockers.length === 0,
    score: Math.max(0, score),
    reasons,
    warnings,
    blockers
  }
}

/**
 * Calculate user reputation boost/penalty
 */
export function calculateReputationImpact(userHistory: UserHistory): number {
  let impact = 0

  // Positive factors
  if (userHistory.verifiedCount > 10) impact += 15
  if (userHistory.accountAge > 90) impact += 10
  if (userHistory.reportsCount > 0) {
    const successRate = (userHistory.verifiedCount / userHistory.reportsCount)
    if (successRate > 0.8) impact += 20
  }

  // Negative factors
  if (userHistory.spamScore > 50) impact -= 25
  if (userHistory.reportsCount > 0) {
    const rejectionRate = (userHistory.rejectedCount / userHistory.reportsCount)
    if (rejectionRate > 0.4) impact -= 20
  }

  return impact
}

/**
 * Generate human-readable fraud report
 */
export function generateFraudReport(result: FraudCheckResult): string {
  let report = `Validation Score: ${result.score}/100\n\n`

  if (result.blockers.length > 0) {
    report += '❌ BLOCKERS (Must be resolved):\n'
    result.blockers.forEach(b => report += `  • ${b}\n`)
    report += '\n'
  }

  if (result.warnings.length > 0) {
    report += '⚠️ WARNINGS:\n'
    result.warnings.forEach(w => report += `  • ${w}\n`)
    report += '\n'
  }

  if (result.reasons.length > 0) {
    report += '✅ PASSED CHECKS:\n'
    result.reasons.forEach(r => report += `  • ${r}\n`)
  }

  return report
}
