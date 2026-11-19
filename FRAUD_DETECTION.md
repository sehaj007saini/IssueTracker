# Advanced Fraud Detection System

## Overview

The IssueTracker application includes a comprehensive, multi-layered fraud detection system designed to prevent fake, spam, and malicious issue reports. The system operates at both frontend and backend levels to ensure maximum security.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND VALIDATION                       │
├─────────────────────────────────────────────────────────────┤
│  1. CAPTCHA Verification (Math Challenge)                   │
│  2. GPS Location with High Accuracy                          │
│  3. Required Photo Evidence                                  │
│  4. Minimum Description Length (20 chars)                    │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND VALIDATION                        │
├─────────────────────────────────────────────────────────────┤
│  1. Content Quality Check (6 sub-checks)                    │
│  2. Location Validity Check (4 sub-checks)                  │
│  3. User Reputation Check (5 sub-checks)                    │
│  4. Rate Limiting Check (2 sub-checks)                      │
│  5. Duplicate Content Check (2 sub-checks)                  │
│  6. Photo Requirements Check                                 │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                  VALIDATION SCORING                          │
├─────────────────────────────────────────────────────────────┤
│  • Average score calculated from all checks (0-100)         │
│  • Minimum 60/100 required to pass                          │
│  • Zero blockers required                                    │
│  • Visual feedback to user with detailed results            │
└─────────────────────────────────────────────────────────────┘
```

## Validation Layers

### 1. Content Quality Check (Score: 0-100)

**Purpose:** Detect spam, inappropriate content, and low-quality submissions

**Checks:**
- **Length Validation**
  - Minimum 20 characters required (blocker if violated)
  - -10 points if less than 50 characters (warning)
  
- **Spam Keywords Detection**
  - Blocks: "click here", "buy now", "limited offer", "call now", "free money", "winner", "congratulations"
  - 2+ matches = blocker (-60 points)
  - 1 match = warning (-20 points)
  
- **URL Detection**
  - External links are blocked (-40 points)
  
- **Phone Number Detection**
  - Phone numbers trigger warning (-15 points)
  
- **Repeated Characters**
  - 5+ consecutive same characters = warning (-20 points)
  
- **Excessive Capitals**
  - More than 70% capitals = warning (-15 points)
  
- **Profanity Check**
  - Basic profanity filter (-25 points per violation)
  
- **Word Diversity**
  - Low unique word ratio < 0.5 = warning (-15 points)
  
- **Special Characters**
  - More than 30% special chars = warning (-20 points)

### 2. Location Validity Check (Score: 0-100)

**Purpose:** Verify GPS coordinates are legitimate and accurate

**Checks:**
- **Coordinate Validation**
  - Latitude must be -90 to +90
  - Longitude must be -180 to +180
  - (0, 0) coordinates are blocked as suspicious
  
- **GPS Accuracy**
  - >100m accuracy = warning (-20 points)
  - 50-100m accuracy = warning (-10 points)
  - <50m accuracy = passed
  
- **Service Area Check**
  - Primary service area: India (8-37°N, 68-97°E)
  - Outside area = warning (-30 points)

### 3. User Reputation Check (Score: 0-120)

**Purpose:** Assess user trustworthiness based on history

**User Reputation Fields:**
- `reputation_score` (0-100): Overall trust score
- `total_reports`: Lifetime reports count
- `verified_reports`: Reports that were verified
- `rejected_reports`: Reports that were rejected
- `spam_flags`: Number of spam violations
- `last_report_time`: For rate limiting

**Checks:**
- **Account Age**
  - <1 day old = warning (-20 points)
  - <7 days old = warning (-10 points)
  - ≥7 days = passed
  
- **Spam Flags**
  - ≥5 flags = blocker (-60 points) + account suspension
  - 3-4 flags = warning (-30 points)
  - 0 flags = passed
  
- **Rejection Rate**
  - >50% rejection rate = warning (-40 points)
  - >30% rejection rate = warning (-20 points)
  - ≤30% = passed
  
- **Reputation Score**
  - <20 = warning (-35 points)
  - >70 = trusted user (+15 bonus points)
  
- **Verification Rate**
  - >70% verification rate (5+ reports) = +10 bonus points

### 4. Rate Limiting Check (Score: 0-100)

**Purpose:** Prevent spam through frequency limits

**Checks:**
- **Time Between Reports**
  - <5 minutes = blocker (-60 points)
  - <15 minutes = warning (-20 points)
  - ≥15 minutes = passed
  
- **Daily Limits**
  - New users (<7 days): 3 reports/day
  - Established users: 10 reports/day
  - Exceeding limit = warning (-30 points)

### 5. Duplicate Content Check (Score: 0-100)

**Purpose:** Detect test/template submissions and duplicate reports

**Checks:**
- **Template Detection**
  - Blocks phrases: "this is a test", "testing 123", "sample issue", "demo report"
  - Match = blocker (-50 points)
  
- **Nearby Recent Reports**
  - Checks for issues in 500m radius within 24 hours
  - Found = warning (-15 points)

### 6. Photo Requirements Check (Score: 0-100)

**Purpose:** Ensure visual evidence is provided

**Checks:**
- Photo required (mandatory)
- No photo = blocker (-50 points)

## Frontend Components

### 1. SimpleCaptcha Component
```typescript
Location: frontend/src/components/security/SimpleCaptcha.tsx
```
- Simple math challenge (addition)
- Prevents automated bot submissions
- Must be completed before validation

### 2. ValidationResults Component
```typescript
Location: frontend/src/components/fraud/ValidationResults.tsx
```
- Visual modal showing validation results
- Color-coded score (green/yellow/red)
- Lists all blockers, warnings, and passed checks
- Shows user reputation score

### 3. ReportIssuePage Integration
```typescript
Location: frontend/src/pages/citizen/ReportIssuePage.tsx
```
- Integrated validation before submission
- Calls `/api/issues/validate` endpoint
- Shows ValidationResults modal
- Prevents submission if validation fails

## Backend Services

### 1. FraudDetectionService
```java
Location: backend/src/main/java/com/localproblems/os/service/FraudDetectionService.java
```

**Key Methods:**
- `validateIssueReport()`: Main validation orchestrator
- `checkContentQuality()`: Content analysis
- `checkLocationValidity()`: GPS verification
- `checkUserReputation()`: User trust assessment
- `checkRateLimits()`: Frequency control
- `checkDuplicateContent()`: Duplicate detection
- `checkPhotoRequirements()`: Photo validation
- `updateUserReputationAfterReport()`: Update reputation post-submission
- `flagUserForSpam()`: Flag user for violations

### 2. IssueController Validation Endpoint
```java
POST /api/issues/validate
```

**Request:**
```json
{
  "description": "string (min 20 chars)",
  "latitude": "number (-90 to 90)",
  "longitude": "number (-180 to 180)",
  "accuracy": "number (optional)",
  "hasPhoto": "boolean"
}
```

**Response:**
```json
{
  "isValid": true,
  "score": 85,
  "blockers": [],
  "warnings": ["Brief description, consider adding more details"],
  "passedChecks": [
    "Valid GPS coordinates",
    "High GPS accuracy",
    "Location within service area",
    "Clean user history",
    "Good report acceptance history"
  ],
  "userReputationScore": 75
}
```

## Database Schema

### User Reputation Fields

```sql
ALTER TABLE users 
ADD COLUMN reputation_score INTEGER DEFAULT 50,
ADD COLUMN total_reports INTEGER DEFAULT 0,
ADD COLUMN verified_reports INTEGER DEFAULT 0,
ADD COLUMN rejected_reports INTEGER DEFAULT 0,
ADD COLUMN spam_flags INTEGER DEFAULT 0,
ADD COLUMN last_report_time TIMESTAMP;
```

**Migration File:** `V3__Add_User_Reputation_Fields.sql`

## Scoring System

### Score Calculation
```
Final Score = Average(All Check Scores)
Valid if: Score ≥ 60 AND Blockers = 0
```

### Score Interpretation
- **80-100**: Excellent - High trust, minimal risk
- **60-79**: Good - Acceptable with minor warnings
- **40-59**: Poor - Multiple concerns, blocked
- **0-39**: Very Poor - Serious violations, blocked

### Reputation Impact
```
Initial Score: 50 (new users)
On Verified Report: +2 points (max 100)
On Rejected Report: -5 points (min 0)
On Spam Flag: -10 points
Account Suspended: spam_flags ≥ 5
```

## API Flow

### Complete Submission Flow

```
1. User fills form → Frontend validation (CAPTCHA, length, photo)
   ↓
2. Click "Validate & Submit" → POST /api/issues/validate
   ↓
3. Backend runs 6 validation checks → Returns FraudCheckResponse
   ↓
4. Frontend shows ValidationResults modal
   ↓
5. If valid → User clicks "Proceed" → POST /api/issues
   ↓
6. Backend runs validation again (double-check)
   ↓
7. If still valid → Create issue → Update user stats
   ↓
8. Return success response
```

## Security Features

### 1. **Double Validation**
- Frontend validates before showing modal
- Backend validates again before creating issue
- Prevents bypass attacks

### 2. **CAPTCHA Protection**
- Simple math challenge prevents bots
- Human-verifiable without external services
- Resets on error

### 3. **GPS Verification**
- High accuracy mode enabled
- Timestamp validation
- Service area restrictions

### 4. **Rate Limiting**
- Time-based throttling
- Daily report limits
- Account-age dependent

### 5. **User Reputation System**
- Tracks behavior over time
- Rewards good actors
- Penalizes bad actors
- Auto-suspension for repeat offenders

### 6. **Content Analysis**
- Multiple spam indicators
- Template detection
- Link/phone blocking
- Profanity filtering

## Admin Tools

### Flagging Users for Spam
```java
fraudDetectionService.flagUserForSpam(userId);
```
- Increments spam_flags
- Reduces reputation by 10 points
- Auto-suspends if flags ≥ 5

### Updating Reputation After Resolution
```java
fraudDetectionService.updateUserReputationAfterReport(user, isAccepted);
```
- Called when issue is resolved/rejected
- Updates verified_reports or rejected_reports
- Adjusts reputation score

## Configuration

### Thresholds (Customizable)

```java
// In FraudDetectionService.java
private static final int MIN_DESCRIPTION_LENGTH = 20;
private static final int MIN_SCORE_TO_PASS = 60;
private static final int MIN_MINUTES_BETWEEN_REPORTS = 5;
private static final int DAILY_LIMIT_NEW_USERS = 3;
private static final int DAILY_LIMIT_ESTABLISHED_USERS = 10;
private static final int SPAM_FLAGS_TO_SUSPEND = 5;
private static final double NEARBY_RADIUS_KM = 0.5;
```

## Future Enhancements

### Planned Features
1. **ML-Based Duplicate Detection**
   - Cosine similarity for text comparison
   - Image similarity using perceptual hashing
   
2. **EXIF Metadata Extraction**
   - Verify photo timestamp
   - Check camera information
   - Detect edited images
   
3. **IP-Based Rate Limiting**
   - Track by IP address
   - Detect VPN/proxy usage
   
4. **Behavioral Analysis**
   - Session duration tracking
   - Mouse movement patterns
   - Typing speed analysis
   
5. **Admin Dashboard**
   - Real-time fraud alerts
   - User reputation management
   - Spam report review queue

## Testing

### Manual Testing Scenarios

**Test 1: Short Description**
- Description: "test"
- Expected: Blocker - "Description too short"

**Test 2: Spam Keywords**
- Description: "Click here to buy now! Limited offer!"
- Expected: Blocker - "Description contains multiple spam keywords"

**Test 3: External Links**
- Description: "Check out https://example.com for more info"
- Expected: Blocker - "Description contains external links"

**Test 4: Suspicious Coordinates**
- Location: (0, 0)
- Expected: Blocker - "Suspicious coordinates detected"

**Test 5: Rapid Submission**
- Submit 2 reports within 5 minutes
- Expected: Blocker - "Too many reports in short time"

**Test 6: New Account**
- Account age: <1 day
- Expected: Warning - "New account (less than 1 day old)"

**Test 7: Valid Submission**
- All criteria met
- Expected: Score 80-100, validation passes

## Monitoring

### Key Metrics to Track
- Average validation score
- Blocked submission rate
- False positive rate
- User reputation distribution
- Spam flag frequency

### Logs
- All validation attempts logged
- Failed validations with reasons
- Spam flag incidents
- Account suspensions

## Support

For questions or issues with the fraud detection system:
1. Check validation results modal for specific errors
2. Review this documentation
3. Contact system administrator
4. Check server logs for detailed error messages

---

**Last Updated:** November 19, 2026
**Version:** 1.0.0
**Maintained By:** IssueTracker Development Team
