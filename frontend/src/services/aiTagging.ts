/**
 * AI-powered auto-tagging service
 * Analyzes issue descriptions and suggests tags, categories, and priority
 */

interface TagSuggestion {
  tag: string
  confidence: number
}

interface AutoTagResult {
  category: string
  suggestedTags: TagSuggestion[]
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  sentiment: 'positive' | 'neutral' | 'negative'
  urgencyScore: number
  confidence: number
}

// Keywords for category detection
const categoryKeywords = {
  WATER_SUPPLY: ['water', 'leak', 'pipe', 'supply', 'tap', 'drinking', 'contaminated', 'shortage', 'pressure'],
  WASTE_MANAGEMENT: ['garbage', 'trash', 'waste', 'dustbin', 'dump', 'litter', 'cleaning', 'sanitation', 'disposal'],
  STREET_LIGHTING: ['light', 'lamp', 'street light', 'dark', 'bulb', 'electricity', 'pole', 'illumination'],
  DRAINAGE: ['drain', 'sewage', 'overflow', 'clogged', 'blocked', 'flooding', 'stagnant', 'water logging'],
  ROAD_INFRASTRUCTURE: ['road', 'pothole', 'crack', 'pavement', 'street', 'asphalt', 'traffic', 'bridge', 'footpath']
}

// Urgency indicators
const urgencyKeywords = {
  critical: ['emergency', 'urgent', 'immediate', 'dangerous', 'life-threatening', 'severe', 'critical', 'major'],
  high: ['serious', 'important', 'significant', 'bad', 'terrible', 'horrible', 'awful'],
  medium: ['moderate', 'concerning', 'issue', 'problem', 'needs attention'],
  low: ['minor', 'small', 'slight', 'little']
}

// Sentiment analysis keywords
const sentimentKeywords = {
  negative: ['terrible', 'awful', 'horrible', 'worst', 'disgusting', 'dangerous', 'bad', 'poor'],
  positive: ['good', 'better', 'improving', 'fixed', 'resolved', 'excellent'],
  neutral: ['issue', 'problem', 'report', 'needs', 'requires', 'should']
}

/**
 * Analyze text and suggest category
 */
export function suggestCategory(text: string): { category: string; confidence: number } {
  const lowerText = text.toLowerCase()
  const scores: Record<string, number> = {}

  // Calculate scores for each category
  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    let score = 0
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
      const matches = lowerText.match(regex)
      if (matches) {
        score += matches.length
      }
    })
    scores[category] = score
  })

  // Find category with highest score
  const maxScore = Math.max(...Object.values(scores))
  const suggestedCategory = Object.keys(scores).find(cat => scores[cat] === maxScore) || 'ROAD_INFRASTRUCTURE'
  
  // Calculate confidence (0-1)
  const totalKeywords = Object.values(categoryKeywords).flat().length
  const confidence = Math.min(maxScore / 5, 1) // Normalize to 0-1

  return {
    category: suggestedCategory,
    confidence: confidence
  }
}

/**
 * Determine priority based on text analysis
 */
export function suggestPriority(text: string): { priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; urgencyScore: number } {
  const lowerText = text.toLowerCase()
  let urgencyScore = 0

  // Check for urgency keywords
  urgencyKeywords.critical.forEach(keyword => {
    if (lowerText.includes(keyword)) urgencyScore += 4
  })
  urgencyKeywords.high.forEach(keyword => {
    if (lowerText.includes(keyword)) urgencyScore += 3
  })
  urgencyKeywords.medium.forEach(keyword => {
    if (lowerText.includes(keyword)) urgencyScore += 2
  })
  urgencyKeywords.low.forEach(keyword => {
    if (lowerText.includes(keyword)) urgencyScore += 1
  })

  // Determine priority
  let priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  if (urgencyScore >= 8) priority = 'CRITICAL'
  else if (urgencyScore >= 5) priority = 'HIGH'
  else if (urgencyScore >= 2) priority = 'MEDIUM'
  else priority = 'LOW'

  return { priority, urgencyScore }
}

/**
 * Analyze sentiment of the text
 */
export function analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
  const lowerText = text.toLowerCase()
  let sentimentScore = 0

  sentimentKeywords.negative.forEach(keyword => {
    if (lowerText.includes(keyword)) sentimentScore -= 1
  })
  sentimentKeywords.positive.forEach(keyword => {
    if (lowerText.includes(keyword)) sentimentScore += 1
  })

  if (sentimentScore < -1) return 'negative'
  if (sentimentScore > 1) return 'positive'
  return 'neutral'
}

/**
 * Extract relevant tags from text
 */
export function extractTags(text: string, category: string): TagSuggestion[] {
  const tags: TagSuggestion[] = []
  const lowerText = text.toLowerCase()

  // Common issue tags
  const commonTags = {
    safety: ['safety', 'dangerous', 'hazard', 'risk'],
    maintenance: ['repair', 'fix', 'broken', 'damaged', 'maintenance'],
    urgent: ['urgent', 'emergency', 'immediate', 'critical'],
    recurring: ['again', 'repeatedly', 'multiple times', 'ongoing'],
    accessibility: ['accessible', 'disabled', 'elderly', 'wheelchair'],
    environmental: ['pollution', 'environment', 'health', 'contamination']
  }

  // Check for common tags
  Object.entries(commonTags).forEach(([tag, keywords]) => {
    let confidence = 0
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) confidence += 0.25
    })
    if (confidence > 0) {
      tags.push({ tag, confidence: Math.min(confidence, 1) })
    }
  })

  // Add category-specific tags
  const categorySpecificTags = categoryKeywords[category as keyof typeof categoryKeywords] || []
  categorySpecificTags.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      tags.push({ tag: keyword, confidence: 0.8 })
    }
  })

  // Sort by confidence and return top 5
  return tags
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5)
}

/**
 * Main auto-tagging function
 */
export function autoTagIssue(description: string, location?: string): AutoTagResult {
  // Combine description and location for better analysis
  const fullText = location ? `${description} ${location}` : description

  // Get category suggestion
  const { category, confidence: categoryConfidence } = suggestCategory(fullText)

  // Get priority
  const { priority, urgencyScore } = suggestPriority(fullText)

  // Analyze sentiment
  const sentiment = analyzeSentiment(fullText)

  // Extract tags
  const suggestedTags = extractTags(fullText, category)

  return {
    category,
    suggestedTags,
    priority,
    sentiment,
    urgencyScore,
    confidence: categoryConfidence
  }
}

/**
 * Real-time analysis as user types
 */
export function analyzeInRealTime(text: string): {
  wordCount: number
  charCount: number
  hasUrgentKeywords: boolean
  hasLocationInfo: boolean
  completeness: number
} {
  const wordCount = text.trim().split(/\s+/).length
  const charCount = text.length

  // Check for urgent keywords
  const hasUrgentKeywords = urgencyKeywords.critical.some(keyword => 
    text.toLowerCase().includes(keyword)
  )

  // Check if location information is present
  const locationKeywords = ['near', 'at', 'on', 'in', 'beside', 'opposite', 'behind']
  const hasLocationInfo = locationKeywords.some(keyword => 
    text.toLowerCase().includes(keyword)
  )

  // Calculate completeness (0-1)
  let completeness = 0
  if (wordCount >= 10) completeness += 0.3
  if (hasLocationInfo) completeness += 0.3
  if (text.includes('?') || text.includes('.')) completeness += 0.2
  if (charCount >= 50) completeness += 0.2

  return {
    wordCount,
    charCount,
    hasUrgentKeywords,
    hasLocationInfo,
    completeness: Math.min(completeness, 1)
  }
}

/**
 * Suggest improvements to the description
 */
export function suggestImprovements(text: string): string[] {
  const suggestions: string[] = []
  const analysis = analyzeInRealTime(text)

  if (analysis.wordCount < 10) {
    suggestions.push('💡 Add more details about the issue (at least 10 words)')
  }

  if (!analysis.hasLocationInfo) {
    suggestions.push('📍 Include specific location information (e.g., "near City Mall")')
  }

  if (!analysis.hasUrgentKeywords && text.length > 20) {
    suggestions.push('⚠️ Mention if this is urgent or poses a safety risk')
  }

  const { category, confidence } = suggestCategory(text)
  if (confidence < 0.5 && text.length > 20) {
    suggestions.push('🏷️ Description is unclear. Try mentioning specific keywords related to the issue type')
  }

  return suggestions
}
