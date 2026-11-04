# Technical Design: India Local Problems OS MVP

## 1. System Overview

### 1.1 Architecture Style
**Modular Monolith** - Single deployable application with clear module boundaries, avoiding premature microservices complexity while maintaining scalability path.

### 1.2 Technology Stack

**Frontend:**
- React 18+ with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- TanStack Query for server state
- Leaflet + React-Leaflet for maps
- Axios for HTTP client

**Backend:**
- Java 21+
- Spring Boot 3+
- Spring Web (REST APIs)
- Spring Data JPA (ORM)
- Spring Security (Authentication/Authorization)
- JWT for stateless auth
- Bean Validation
- Flyway for database migrations

**Database:**
- PostgreSQL 15+
- PostGIS extension for geospatial queries

**Future AI Service (Not MVP):**
- Python + FastAPI
- Vision models for image classification
- LLMs for text analysis
- Vector embeddings for semantic search

### 1.3 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend (SPA)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐ │
│  │ Citizen  │  │ Officer  │  │  Admin   │  │   Leaflet   │ │
│  │   Pages  │  │  Pages   │  │  Pages   │  │  Map View   │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────────┘ │
│                          │                                    │
│                    TanStack Query                            │
│                          │                                    │
│                    Axios HTTP Client                         │
└──────────────────────────┼──────────────────────────────────┘
                           │
                    HTTPS / REST API
                           │
┌──────────────────────────┼──────────────────────────────────┐
│                   Spring Boot Backend                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                  Web Layer (Controllers)                │ │
│  │  AuthController │ IssueController │ OfficerController   │ │
│  │  AdminController │ FileController                       │ │
│  └────────────────────────────────────────────────────────┘ │
│                           │                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │               Service Layer (Business Logic)            │ │
│  │  AuthService │ IssueService │ DuplicateDetectionService │ │
│  │  AssignmentService │ VerificationService │ FileService  │ │
│  └────────────────────────────────────────────────────────┘ │
│                           │                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │             Repository Layer (Data Access)              │ │
│  │  UserRepository │ IssueRepository │ ReportRepository    │ │
│  │  DepartmentRepository │ EvidenceRepository              │ │
│  └────────────────────────────────────────────────────────┘ │
│                           │                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                  Domain Layer (Entities)                │ │
│  │  User │ Issue │ IssueReport │ Department │ Evidence     │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────┼──────────────────────────────────┘
                           │
                     JPA / JDBC
                           │
┌──────────────────────────┼──────────────────────────────────┐
│              PostgreSQL + PostGIS Database                   │
│  ┌──────────┐  ┌──────────┐  ┌─────────────┐  ┌──────────┐│
│  │  users   │  │  issues  │  │issue_reports│  │departments││
│  └──────────┘  └──────────┘  └─────────────┘  └──────────┘│
│  ┌──────────┐  ┌──────────┐  ┌─────────────┐              │
│  │ evidence │  │verification│ │issue_history│              │
│  └──────────┘  └──────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

### 1.4 Future AI Service Integration

```
┌──────────────────────────────────────┐
│       Spring Boot Backend            │
│  ┌────────────────────────────────┐  │
│  │   IssueClassificationService   │  │
│  │   (Interface)                  │  │
│  │   - classifyImage()            │  │
│  │   - classifyText()             │  │
│  │   - calculateSeverity()        │  │
│  └────────────────────────────────┘  │
│              │                        │
│    ┌─────────┴─────────┐             │
│    │                   │             │
│    v                   v             │
│  ┌──────────┐    ┌──────────────┐   │
│  │ RuleBased│    │ RestClient   │   │
│  │   Impl   │    │  (AI Service)│   │
│  │ (MVP)    │    │  (Future)    │   │
│  └──────────┘    └──────────────┘   │
└──────────────────────────┼───────────┘
                           │
                    HTTP REST API
                           │
┌──────────────────────────┼───────────┐
│        Python FastAPI                │
│  ┌────────────────────────────────┐  │
│  │   Vision Model (Pothole Det)   │  │
│  │   Text Classifier (Category)   │  │
│  │   Embedding Model (Similarity) │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

## 2. Data Model Design

### 2.1 Entity Relationship Diagram

```
┌──────────────┐          ┌──────────────┐
│     User     │          │     Role     │
├──────────────┤          ├──────────────┤
│ id (PK)      │◄────────┤│ id (PK)      │
│ email        │  M     1 │ name         │
│ password_hash│          │ description  │
│ phone        │          └──────────────┘
│ name         │
│ role_id (FK) │
│ is_active    │
│ created_at   │
└──────┬───────┘
       │ 1
       │ owns
       │ M
       ▼
┌──────────────┐
│ CitizenProfile│
├──────────────┤
│ id (PK)      │
│ user_id (FK) │
│ address      │
│ ward_id (FK) │
│ verified     │
└──────────────┘

┌──────────────────┐         ┌─────────────────┐
│  IssueCategory   │         │   Department    │
├──────────────────┤         ├─────────────────┤
│ id (PK)          │         │ id (PK)         │
│ name             │         │ name            │
│ description      │         │ contact_email   │
│ severity_default │         │ contact_phone   │
│ is_active        │         │ head_officer_id │
└────────┬─────────┘         │ is_active       │
         │                   └────────┬────────┘
         │ 1                          │ 1
         │                            │ handles
         │ categorizes                │ M
         │ M                          │
         ▼                            ▼
    ┌─────────────────────────────────────┐
    │             Issue                   │
    ├─────────────────────────────────────┤
    │ id (PK)                             │
    │ category_id (FK)                    │
    │ location (PostGIS GEOGRAPHY)        │
    │ latitude (DECIMAL)                  │
    │ longitude (DECIMAL)                 │
    │ address                             │
    │ ward_id (FK)                        │
    │ department_id (FK)                  │
    │ status (ENUM)                       │
    │ severity (ENUM)                     │
    │ report_count (INT)                  │
    │ support_count (INT)                 │
    │ description_summary                 │
    │ created_at                          │
    │ updated_at                          │
    │ assigned_officer_id (FK)            │
    └──┬──────────────────────────────┬───┘
       │ 1                            │ 1
       │ aggregates                   │ assigned_to
       │ M                            │ M
       ▼                              ▼
┌─────────────────┐          ┌──────────────────┐
│  IssueReport    │          │ IssueAssignment  │
├─────────────────┤          ├──────────────────┤
│ id (PK)         │          │ id (PK)          │
│ issue_id (FK)   │          │ issue_id (FK)    │
│ reporter_id(FK) │          │ officer_id (FK)  │
│ description     │          │ assigned_by (FK) │
│ photo_url       │          │ assigned_at      │
│ is_primary      │          │ accepted_at      │
│ similarity_score│          │ status           │
│ status          │          └──────────────────┘
│ created_at      │
└─────────────────┘
       │ 1
       │ supports
       │ M
       ▼
┌──────────────────┐
│  IssueSupport    │
├──────────────────┤
│ id (PK)          │
│ issue_id (FK)    │
│ citizen_id (FK)  │
│ created_at       │
└──────────────────┘

    ┌──────────────────┐
    │  IssueEvidence   │
    ├──────────────────┤
    │ id (PK)          │
    │ issue_id (FK)    │
    │ uploaded_by (FK) │
    │ evidence_type    │   (REPORT_PHOTO, RESOLUTION_PHOTO)
    │ file_url         │
    │ description      │
    │ uploaded_at      │
    └──────────────────┘

┌──────────────────────┐
│  IssueStatusHistory  │
├──────────────────────┤
│ id (PK)              │
│ issue_id (FK)        │
│ from_status          │
│ to_status            │
│ changed_by (FK)      │
│ comment              │
│ changed_at           │
└──────────────────────┘

┌──────────────────────┐
│ CitizenVerification  │
├──────────────────────┤
│ id (PK)              │
│ issue_id (FK)        │
│ citizen_id (FK)      │
│ verification_result  │   (APPROVED, REJECTED)
│ comment              │
│ created_at           │
└──────────────────────┘

┌──────────────┐
│     Ward     │
├──────────────┤
│ id (PK)      │
│ name         │
│ zone         │
│ boundary     │   (PostGIS GEOGRAPHY - polygon)
└──────────────┘
```

### 2.2 Key Design Decisions

**Issue vs IssueReport Separation:**
- **Issue**: Represents the actual real-world problem (one pothole)
- **IssueReport**: Represents an individual citizen's report
- One Issue can have multiple IssueReports (many citizens reporting same pothole)
- The first report creates the Issue (is_primary = true)
- Subsequent similar reports are linked to the existing Issue
- This enables proper duplicate detection and tracking

**PostGIS Integration:**
- Use `GEOGRAPHY(Point, 4326)` type for location field
- Store latitude/longitude separately for easier querying
- Creates spatial index automatically
- Enables efficient "nearby" queries using ST_DWithin

**Status as Enum:**
- Implemented as database ENUM type
- Valid values: OPEN, ASSIGNED, IN_PROGRESS, RESOLUTION_SUBMITTED, UNDER_VERIFICATION, RESOLVED, REOPENED
- Enforces valid states at database level

**Severity as Enum:**
- Values: LOW, MEDIUM, HIGH, CRITICAL
- Initially set by category default
- Can be updated by AI or officer judgment

## 3. Low-Level Design

### 3.1 Package Structure

```
com.localproblems.os
├── config
│   ├── SecurityConfig.java
│   ├── JwtConfig.java
│   └── FileStorageConfig.java
├── controller
│   ├── AuthController.java
│   ├── IssueController.java
│   ├── OfficerController.java
│   └── AdminController.java
├── dto
│   ├── request
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── CreateIssueReportRequest.java
│   │   ├── AssignIssueRequest.java
│   │   └── VerifyResolutionRequest.java
│   └── response
│       ├── AuthResponse.java
│       ├── IssueResponse.java
│       ├── IssueDetailResponse.java
│       └── NearbyIssuesResponse.java
├── entity
│   ├── User.java
│   ├── Role.java
│   ├── Issue.java
│   ├── IssueReport.java
│   ├── IssueCategory.java
│   ├── Department.java
│   ├── Ward.java
│   ├── IssueAssignment.java
│   ├── IssueEvidence.java
│   ├── IssueStatusHistory.java
│   └── CitizenVerification.java
├── repository
│   ├── UserRepository.java
│   ├── IssueRepository.java
│   ├── IssueReportRepository.java
│   ├── DepartmentRepository.java
│   └── CitizenVerificationRepository.java
├── service
│   ├── AuthService.java
│   ├── IssueService.java
│   ├── DuplicateDetectionService.java
│   ├── AssignmentService.java
│   ├── VerificationService.java
│   ├── FileStorageService.java
│   └── classification
│       ├── IssueClassificationService.java (interface)
│       ├── RuleBasedClassificationService.java (MVP impl)
│       └── AiClassificationService.java (future impl)
├── security
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   └── UserPrincipal.java
├── exception
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   ├── DuplicateResourceException.java
│   └── UnauthorizedException.java
└── util
    ├── GeoUtils.java
    └── ValidationUtils.java
```

### 3.2 Core API Contracts

#### Authentication APIs

```
POST /api/auth/register
Request:
{
  "email": "citizen@example.com",
  "password": "securepass123",
  "name": "John Doe",
  "phone": "+919876543210",
  "role": "CITIZEN"
}
Response: 201 Created
{
  "token": "jwt.token.here",
  "userId": 1,
  "email": "citizen@example.com",
  "role": "CITIZEN",
  "expiresIn": 86400
}

POST /api/auth/login
Request:
{
  "email": "citizen@example.com",
  "password": "securepass123"
}
Response: 200 OK
{
  "token": "jwt.token.here",
  "userId": 1,
  "email": "citizen@example.com",
  "role": "CITIZEN",
  "expiresIn": 86400
}
```

#### Citizen Issue APIs

```
POST /api/issues
Headers: Authorization: Bearer {token}
Content-Type: multipart/form-data
Request:
{
  "categoryId": 1,
  "description": "Large pothole on MG Road near Cafe Coffee Day",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "address": "MG Road, Bangalore",
  "photo": <file>
}
Response: 201 Created
{
  "issueId": 100,
  "reportId": 501,
  "status": "OPEN",
  "isDuplicate": false,
  "message": "New issue created successfully"
}
OR
Response: 201 Created
{
  "issueId": 95,
  "reportId": 502,
  "status": "OPEN",
  "isDuplicate": true,
  "similarityScore": 0.87,
  "message": "Report added to existing issue"
}

GET /api/issues/nearby?lat={lat}&lng={lng}&radius={meters}&category={id}
Headers: Authorization: Bearer {token}
Response: 200 OK
{
  "issues": [
    {
      "id": 100,
      "category": "Pothole",
      "description": "Large pothole on MG Road",
      "latitude": 12.9716,
      "longitude": 77.5946,
      "status": "OPEN",
      "severity": "HIGH",
      "reportCount": 3,
      "supportCount": 12,
      "distance": 45.2,
      "createdAt": "2024-01-15T10:30:00Z",
      "photoUrl": "https://..."
    }
  ],
  "count": 1
}

GET /api/issues/{id}
Headers: Authorization: Bearer {token}
Response: 200 OK
{
  "id": 100,
  "category": "Pothole",
  "description": "Large pothole on MG Road near Cafe Coffee Day",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "address": "MG Road, Bangalore",
  "ward": "Ward 23",
  "status": "IN_PROGRESS",
  "severity": "HIGH",
  "reportCount": 3,
  "supportCount": 12,
  "department": {
    "id": 5,
    "name": "Road Infrastructure"
  },
  "assignedOfficer": {
    "id": 25,
    "name": "Officer Kumar"
  },
  "reports": [
    {
      "id": 501,
      "reportedBy": "John Doe",
      "description": "Large pothole...",
      "photoUrl": "https://...",
      "isPrimary": true,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "statusHistory": [
    {
      "fromStatus": "OPEN",
      "toStatus": "ASSIGNED",
      "changedBy": "Admin User",
      "changedAt": "2024-01-15T11:00:00Z"
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T11:00:00Z"
}

POST /api/issues/{id}/support
Headers: Authorization: Bearer {token}
Response: 200 OK
{
  "message": "Issue supported successfully",
  "supportCount": 13
}

POST /api/issues/{id}/verify
Headers: Authorization: Bearer {token}
Request:
{
  "verificationResult": "APPROVED",
  "comment": "Pothole has been properly fixed"
}
Response: 200 OK
{
  "message": "Verification submitted successfully",
  "issueStatus": "RESOLVED"
}
```

#### Officer APIs

```
GET /api/officer/issues?status={status}&department={id}&page={n}&size={n}
Headers: Authorization: Bearer {token}
Response: 200 OK
{
  "issues": [...],
  "totalElements": 45,
  "totalPages": 5,
  "currentPage": 0
}

PATCH /api/officer/issues/{id}/assign
Headers: Authorization: Bearer {token}
Request:
{
  "officerId": 25
}
Response: 200 OK
{
  "message": "Issue assigned successfully",
  "issue": {...}
}

PATCH /api/officer/issues/{id}/status
Headers: Authorization: Bearer {token}
Request:
{
  "status": "IN_PROGRESS",
  "comment": "Work started on site"
}
Response: 200 OK
{
  "message": "Status updated successfully",
  "issue": {...}
}

POST /api/officer/issues/{id}/evidence
Headers: Authorization: Bearer {token}
Content-Type: multipart/form-data
Request:
{
  "evidenceType": "RESOLUTION_PHOTO",
  "description": "Pothole filled and road surface leveled",
  "photo": <file>
}
Response: 201 Created
{
  "message": "Resolution evidence uploaded",
  "evidenceId": 123,
  "issueStatus": "RESOLUTION_SUBMITTED"
}
```

#### Admin APIs

```
GET /api/admin/departments
Headers: Authorization: Bearer {token}
Response: 200 OK
{
  "departments": [...]
}

POST /api/admin/departments
Headers: Authorization: Bearer {token}
Request:
{
  "name": "Road Infrastructure",
  "contactEmail": "roads@city.gov",
  "contactPhone": "+91..."
}
Response: 201 Created

GET /api/admin/analytics
Headers: Authorization: Bearer {token}
Response: 200 OK
{
  "totalIssues": 1247,
  "openIssues": 234,
  "inProgressIssues": 89,
  "resolvedIssues": 924,
  "averageResolutionTime": 4.5,
  "issuesByCategory": {...},
  "issuesByWard": {...}
}
```

### 3.3 Duplicate Detection Algorithm

```java
public class DuplicateDetectionService {
    
    private static final double DUPLICATE_DISTANCE_THRESHOLD_METERS = 50.0;
    private static final double SIMILARITY_THRESHOLD = 0.70;
    
    /**
     * Detects if a new report is a duplicate of an existing issue
     * 
     * Algorithm:
     * 1. Find all issues within distance threshold (using PostGIS)
     * 2. Filter by same category
     * 3. For each candidate, calculate similarity score
     * 4. If score > threshold, consider duplicate
     * 5. Return best match
     */
    public DuplicateDetectionResult detectDuplicate(
            Double latitude, 
            Double longitude,
            Long categoryId,
            String description) {
        
        // Step 1: Find nearby issues (PostGIS query)
        List<Issue> nearbyIssues = issueRepository
            .findNearbyIssues(
                latitude, 
                longitude, 
                DUPLICATE_DISTANCE_THRESHOLD_METERS,
                categoryId,
                List.of(IssueStatus.OPEN, IssueStatus.ASSIGNED, 
                        IssueStatus.IN_PROGRESS)
            );
        
        if (nearbyIssues.isEmpty()) {
            return DuplicateDetectionResult.noDuplicate();
        }
        
        // Step 2: Calculate similarity scores
        Issue bestMatch = null;
        double bestScore = 0.0;
        
        for (Issue candidate : nearbyIssues) {
            double score = calculateSimilarityScore(
                latitude, longitude, description,
                candidate
            );
            
            if (score > bestScore) {
                bestScore = score;
                bestMatch = candidate;
            }
        }
        
        // Step 3: Check threshold
        if (bestScore >= SIMILARITY_THRESHOLD) {
            return DuplicateDetectionResult.duplicate(
                bestMatch, 
                bestScore
            );
        }
        
        return DuplicateDetectionResult.noDuplicate();
    }
    
    /**
     * Calculate similarity score (0.0 to 1.0)
     * 
     * Components:
     * - Distance proximity: 50% weight
     * - Text similarity: 30% weight (future: use embeddings)
     * - Time proximity: 20% weight
     */
    private double calculateSimilarityScore(
            Double lat, Double lng, String description,
            Issue candidate) {
        
        // Distance score (closer = higher score)
        double distance = GeoUtils.calculateDistance(
            lat, lng, 
            candidate.getLatitude(), 
            candidate.getLongitude()
        );
        double distanceScore = Math.max(0, 
            1.0 - (distance / DUPLICATE_DISTANCE_THRESHOLD_METERS)
        );
        
        // Text similarity score (Levenshtein distance for MVP)
        double textScore = calculateTextSimilarity(
            description, 
            candidate.getDescriptionSummary()
        );
        
        // Time proximity score (recent issues more likely duplicate)
        long hoursSinceCreation = Duration.between(
            candidate.getCreatedAt(), 
            LocalDateTime.now()
        ).toHours();
        double timeScore = hoursSinceCreation <= 24 ? 1.0 :
                          hoursSinceCreation <= 72 ? 0.7 :
                          hoursSinceCreation <= 168 ? 0.4 : 0.2;
        
        // Weighted combination
        return (distanceScore * 0.50) + 
               (textScore * 0.30) + 
               (timeScore * 0.20);
    }
    
    /**
     * Text similarity using Levenshtein distance
     * Future: Replace with embedding cosine similarity
     */
    private double calculateTextSimilarity(String text1, String text2) {
        // Normalize
        String t1 = text1.toLowerCase().trim();
        String t2 = text2.toLowerCase().trim();
        
        int distance = StringUtils.getLevenshteinDistance(t1, t2);
        int maxLen = Math.max(t1.length(), t2.length());
        
        return 1.0 - ((double) distance / maxLen);
    }
}
```

**PostGIS Spatial Query:**
```java
@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    
    @Query(value = """
        SELECT i.* FROM issues i
        WHERE i.category_id = :categoryId
        AND i.status IN (:statuses)
        AND ST_DWithin(
            i.location,
            ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
            :radiusMeters
        )
        ORDER BY ST_Distance(
            i.location,
            ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
        )
        """, nativeQuery = true)
    List<Issue> findNearbyIssues(
        @Param("latitude") Double latitude,
        @Param("longitude") Double longitude,
        @Param("radiusMeters") Double radiusMeters,
        @Param("categoryId") Long categoryId,
        @Param("statuses") List<String> statuses
    );
}
```

### 3.4 Resolution Verification Rules

```java
public class VerificationService {
    
    private static final int MIN_VERIFICATIONS_REQUIRED = 1;
    private static final double APPROVAL_THRESHOLD = 0.60; // 60% approval
    
    /**
     * Process citizen verification and update issue status
     * 
     * Rules:
     * 1. Only citizens who reported/supported the issue can verify
     * 2. Each citizen can verify only once
     * 3. Need minimum verifications before auto-resolving
     * 4. If approval rate < threshold, reopen issue
     * 5. Officer who resolved can't verify their own work
     */
    public VerificationResult processVerification(
            Long issueId,
            Long citizenId,
            VerificationRequest request) {
        
        Issue issue = issueRepository.findById(issueId)
            .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));
        
        // Validation 1: Issue must be in UNDER_VERIFICATION status
        if (issue.getStatus() != IssueStatus.UNDER_VERIFICATION) {
            throw new InvalidOperationException(
                "Issue is not under verification"
            );
        }
        
        // Validation 2: Citizen must have reported or supported issue
        boolean isEligible = issueSupportRepository
            .existsByIssueIdAndCitizenId(issueId, citizenId) ||
            issueReportRepository
            .existsByIssueIdAndReporterId(issueId, citizenId);
        
        if (!isEligible) {
            throw new UnauthorizedException(
                "Only citizens who reported/supported can verify"
            );
        }
        
        // Validation 3: Can't verify twice
        if (verificationRepository
                .existsByIssueIdAndCitizenId(issueId, citizenId)) {
            throw new DuplicateResourceException(
                "Already verified this issue"
            );
        }
        
        // Save verification
        CitizenVerification verification = new CitizenVerification();
        verification.setIssueId(issueId);
        verification.setCitizenId(citizenId);
        verification.setVerificationResult(request.getResult());
        verification.setComment(request.getComment());
        verificationRepository.save(verification);
        
        // Check if we should update issue status
        List<CitizenVerification> allVerifications = 
            verificationRepository.findByIssueId(issueId);
        
        if (allVerifications.size() >= MIN_VERIFICATIONS_REQUIRED) {
            long approvals = allVerifications.stream()
                .filter(v -> v.getVerificationResult() == 
                             VerificationResult.APPROVED)
                .count();
            
            double approvalRate = (double) approvals / 
                                  allVerifications.size();
            
            if (approvalRate >= APPROVAL_THRESHOLD) {
                // Mark as resolved
                issue.setStatus(IssueStatus.RESOLVED);
                issueRepository.save(issue);
                
                // Create status history
                createStatusHistory(issue, IssueStatus.UNDER_VERIFICATION,
                                   IssueStatus.RESOLVED, citizenId,
                                   "Verified by citizens");
                
                return VerificationResult.issueResolved();
            } else {
                // Reopen issue
                issue.setStatus(IssueStatus.REOPENED);
                issueRepository.save(issue);
                
                // Notify officer
                notificationService.notifyOfficer(
                    issue.getAssignedOfficerId(),
                    "Issue #" + issueId + " reopened by citizen verification"
                );
                
                createStatusHistory(issue, IssueStatus.UNDER_VERIFICATION,
                                   IssueStatus.REOPENED, citizenId,
                                   "Rejected by citizens");
                
                return VerificationResult.issueReopened();
            }
        }
        
        return VerificationResult.verificationRecorded();
    }
}
```

### 3.5 Core Entity Classes

```java
@Entity
@Table(name = "issues")
public class Issue {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private IssueCategory category;
    
    @Column(columnDefinition = "geography(Point, 4326)", nullable = false)
    private Point location;  // PostGIS type
    
    @Column(nullable = false)
    private Double latitude;
    
    @Column(nullable = false)
    private Double longitude;
    
    @Column(length = 500)
    private String address;
    
    @ManyToOne
    @JoinColumn(name = "ward_id")
    private Ward ward;
    
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IssueStatus status = IssueStatus.OPEN;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Severity severity;
    
    @Column(name = "report_count", nullable = false)
    private Integer reportCount = 0;
    
    @Column(name = "support_count", nullable = false)
    private Integer supportCount = 0;
    
    @Column(name = "description_summary", columnDefinition = "TEXT")
    private String descriptionSummary;
    
    @ManyToOne
    @JoinColumn(name = "assigned_officer_id")
    private User assignedOfficer;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Getters, setters, constructors
}

@Entity
@Table(name = "issue_reports")
public class IssueReport {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "issue_id", nullable = false)
    private Issue issue;
    
    @ManyToOne
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;
    
    @Column(name = "photo_url", length = 500)
    private String photoUrl;
    
    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary = false;
    
    @Column(name = "similarity_score")
    private Double similarityScore;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportStatus status = ReportStatus.ACTIVE;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    // Getters, setters, constructors
}
```

### 3.6 Security Configuration

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    @Autowired
    private JwtAuthenticationFilter jwtFilter;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) 
            throws Exception {
        
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/issues/nearby").permitAll()
                .requestMatchers("/api/issues/**").hasAnyRole("CITIZEN", "OFFICER")
                .requestMatchers("/api/officer/**").hasRole("OFFICER")
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, 
                            UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
```

## 4. File Storage Strategy

### 4.1 Storage Options

**MVP Approach: Local Filesystem**
- Store uploaded photos in `uploads/` directory
- Organize by date: `uploads/2024/01/15/uuid-filename.jpg`
- Serve via Spring controller with proper security checks
- Database stores relative path

**Production Approach: Cloud Storage (Future)**
- Use AWS S3 / Azure Blob / Google Cloud Storage
- Generate pre-signed URLs for secure access
- Configure CORS for direct browser upload
- Implement CDN for faster delivery

### 4.2 File Upload Validation

```java
@Service
public class FileStorageService {
    
    private static final Set<String> ALLOWED_EXTENSIONS = 
        Set.of("jpg", "jpeg", "png", "heic");
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    
    public String storeFile(MultipartFile file) {
        // Validate file
        validateFile(file);
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename);
        String filename = UUID.randomUUID().toString() + "." + extension;
        
        // Create date-based directory
        LocalDate today = LocalDate.now();
        Path uploadDir = Paths.get("uploads", 
            String.valueOf(today.getYear()),
            String.format("%02d", today.getMonthValue()),
            String.format("%02d", today.getDayOfMonth())
        );
        
        Files.createDirectories(uploadDir);
        
        // Save file
        Path targetLocation = uploadDir.resolve(filename);
        Files.copy(file.getInputStream(), targetLocation,
                  StandardCopyOption.REPLACE_EXISTING);
        
        return targetLocation.toString();
    }
    
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new InvalidFileException("File is empty");
        }
        
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new InvalidFileException("File size exceeds limit");
        }
        
        String extension = getFileExtension(file.getOriginalFilename());
        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new InvalidFileException("File type not allowed");
        }
    }
}
```

## 5. Frontend Architecture

### 5.1 React Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Spinner.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ProtectedRoute.tsx
│   ├── citizen/
│   │   ├── IssueReportForm.tsx
│   │   ├── IssueCard.tsx
│   │   ├── IssueDetails.tsx
│   │   ├── IssueMap.tsx
│   │   └── VerificationForm.tsx
│   └── officer/
│       ├── OfficerDashboard.tsx
│       ├── IssueList.tsx
│       ├── IssueMapView.tsx
│       └── AssignmentForm.tsx
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── citizen/
│   │   ├── HomePage.tsx
│   │   ├── ReportIssuePage.tsx
│   │   ├── MyReportsPage.tsx
│   │   └── IssueDetailPage.tsx
│   ├── officer/
│   │   ├── OfficerHomePage.tsx
│   │   └── IssueManagementPage.tsx
│   └── admin/
│       └── AdminDashboard.tsx
├── services/
│   ├── api.ts
│   ├── authService.ts
│   ├── issueService.ts
│   └── mapService.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useGeolocation.ts
│   └── useIssues.ts
├── context/
│   └── AuthContext.tsx
├── types/
│   ├── issue.ts
│   ├── user.ts
│   └── api.ts
├── utils/
│   ├── validators.ts
│   └── formatters.ts
├── App.tsx
└── main.tsx
```

### 5.2 Key React Components

```typescript
// Issue Report Form with Photo Upload
interface IssueReportFormProps {
  onSubmit: (data: IssueReportData) => Promise<void>;
}

export function IssueReportForm({ onSubmit }: IssueReportFormProps) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const { getCurrentLocation } = useGeolocation();
  
  useEffect(() => {
    // Auto-capture GPS location
    getCurrentLocation().then(setLocation);
  }, []);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('categoryId', '1'); // Pothole
    formData.append('description', description);
    formData.append('latitude', location.lat.toString());
    formData.append('longitude', location.lng.toString());
    if (photo) formData.append('photo', photo);
    
    await onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Photo capture/upload */}
      {/* Description */}
      {/* Location display with map */}
      {/* Submit button */}
    </form>
  );
}

// Leaflet Map Component
interface IssueMapProps {
  issues: Issue[];
  center: [number, number];
  onIssueClick: (issue: Issue) => void;
}

export function IssueMap({ issues, center, onIssueClick }: IssueMapProps) {
  return (
    <MapContainer center={center} zoom={13} style={{ height: '500px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {issues.map(issue => (
        <Marker
          key={issue.id}
          position={[issue.latitude, issue.longitude]}
          eventHandlers={{
            click: () => onIssueClick(issue)
          }}
        >
          <Popup>
            <div>
              <h3>{issue.category}</h3>
              <p>{issue.description}</p>
              <span className={`status-${issue.status}`}>
                {issue.status}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
```

## 6. Deployment Architecture

### 6.1 MVP Deployment

```
┌─────────────────────────────────────────────┐
│         Single Server (e.g., AWS EC2)       │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │         Nginx (Reverse Proxy)      │    │
│  │  - Serve React build                │    │
│  │  - Proxy /api to Spring Boot        │    │
│  │  - SSL termination                  │    │
│  └────────────┬───────────────────────┘    │
│               │                             │
│  ┌────────────▼───────────────────────┐    │
│  │     Spring Boot App (JAR)          │    │
│  │     Running on port 8080           │    │
│  └────────────┬───────────────────────┘    │
│               │                             │
│  ┌────────────▼───────────────────────┐    │
│  │  PostgreSQL + PostGIS              │    │
│  │  Running on port 5432              │    │
│  └────────────────────────────────────┘    │
│                                             │
│  Local filesystem: /var/app/uploads/       │
└─────────────────────────────────────────────┘
```

### 6.2 Production Deployment (Future)

```
┌──────────────────┐
│   CloudFront CDN │ (React app + static assets)
└────────┬─────────┘
         │
┌────────▼─────────┐
│  Application LB  │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────┐
│App    │ │ App   │  (Spring Boot instances)
│Server1│ │Server2│
└───┬───┘ └──┬────┘
    │        │
    └────┬───┘
         │
┌────────▼─────────┐
│  RDS PostgreSQL  │
│   + PostGIS      │
└──────────────────┘

┌──────────────────┐
│   S3 Bucket      │  (Photo storage)
└──────────────────┘
```

## 7. Database Schema (PostGIS-specific)

```sql
-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Issues table with PostGIS geography column
CREATE TABLE issues (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES issue_categories(id),
    location GEOGRAPHY(Point, 4326) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address VARCHAR(500),
    ward_id BIGINT REFERENCES wards(id),
    department_id BIGINT REFERENCES departments(id),
    status VARCHAR(30) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    report_count INT DEFAULT 0,
    support_count INT DEFAULT 0,
    description_summary TEXT,
    assigned_officer_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create spatial index for efficient nearby queries
CREATE INDEX idx_issues_location ON issues USING GIST(location);

-- Additional indexes
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_category ON issues(category_id);
CREATE INDEX idx_issues_department ON issues(department_id);
```

## 8. Development Milestones

### Phase 1: Foundation (Week 1-2)
- [ ] Spring Boot project setup with dependencies
- [ ] PostgreSQL + PostGIS setup
- [ ] Database schema creation with Flyway
- [ ] React + TypeScript + Vite project setup
- [ ] Basic project structure

### Phase 2: Authentication (Week 3)
- [ ] User entity and repository
- [ ] JWT authentication implementation
- [ ] Login/Register APIs
- [ ] React auth context and pages
- [ ] Protected routes

### Phase 3: Core Issue Management (Week 4-5)
- [ ] Issue and IssueReport entities
- [ ] Create issue report API with file upload
- [ ] PostGIS integration for location storage
- [ ] Issue detail and list APIs
- [ ] React issue reporting form
- [ ] Issue cards and detail page

### Phase 4: Duplicate Detection (Week 6)
- [ ] Nearby issues query (PostGIS)
- [ ] Duplicate detection service
- [ ] Similarity score calculation
- [ ] Link report to existing issue
- [ ] UI for duplicate notification

### Phase 5: Map Integration (Week 7)
- [ ] Leaflet map component
- [ ] Display issues on map
- [ ] Filter by category/status
- [ ] Nearby issues search

### Phase 6: Officer Workflow (Week 8-9)
- [ ] Officer dashboard
- [ ] Issue assignment logic
- [ ] Status transition rules
- [ ] Resolution evidence upload
- [ ] Officer UI components

### Phase 7: Citizen Verification (Week 10)
- [ ] Verification entity and logic
- [ ] Verification rules implementation
- [ ] Reopen issue workflow
- [ ] Verification UI

### Phase 8: Polish & Testing (Week 11-12)
- [ ] Unit tests for critical services
- [ ] Integration tests for APIs
- [ ] UI/UX improvements
- [ ] Error handling
- [ ] Documentation

## 9. Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: User Registration Creates Account with Valid JWT

*For any* valid user registration data (email, password, name, phone, role), the System SHALL create a new user account with a hashed password using BCrypt strength 12, and return a JWT token that includes user ID, email, and role claims with an expiration time of 24 hours.

**Validates: Requirements 1.1, 1.5, 1.6, 1.7**

### Property 2: Authentication Returns Valid JWT for Correct Credentials

*For any* registered user with valid credentials, the System SHALL authenticate successfully and return a JWT token with the correct user claims and 24-hour expiration.

**Validates: Requirements 1.3**

### Property 3: Issue Report Triggers Duplicate Detection

*For any* valid issue report submission, the Duplicate_Detection_Service SHALL query for existing Issues within 50 meters of the reported location, filtered by the same category and status (OPEN, ASSIGNED, or IN_PROGRESS).

**Validates: Requirements 2.2, 3.1, 3.2, 3.3**

### Property 4: New Issue Created When No Duplicate Found

*For any* issue report where duplicate detection finds no matching Issue (no Issues within 50m or similarity score below 0.70), the System SHALL create a new Issue with status OPEN, set the report as primary (isPrimary = true), and assign severity based on the category default.

**Validates: Requirements 2.3, 2.10, 2.11**

### Property 5: Duplicate Report Links to Existing Issue

*For any* issue report where duplicate detection finds a matching Issue with similarity score >= 0.70, the System SHALL link the report to the existing Issue, increment the Issue report count by 1, and return the existing Issue ID with the similarity score.

**Validates: Requirements 2.4, 3.8, 3.9**

### Property 6: Similarity Score Calculation Formula

*For all* candidate Issues within the duplicate detection distance threshold, the calculated similarity score SHALL equal (distance_score * 0.50) + (text_similarity_score * 0.30) + (time_proximity_score * 0.20), where distance_score = max(0, 1.0 - (distance / 50.0)), text_similarity_score uses Levenshtein distance, and time_proximity_score is 1.0 for <24h, 0.7 for 24-72h, 0.4 for 72-168h, and 0.2 for older Issues.

**Validates: Requirements 3.4, 3.5, 3.6, 3.7**

### Property 7: Location Stored as PostGIS Geography Point

*For any* Issue created with latitude and longitude, the System SHALL store the location as a PostGIS GEOGRAPHY(Point, 4326) type in the database.

**Validates: Requirements 2.5, 11.2**

### Property 8: File Upload Validation

*For any* photo upload attempt, the System SHALL validate that the file extension is one of jpg, jpeg, png, or heic, and that the file size does not exceed 5 MB, rejecting uploads that fail either validation.

**Validates: Requirements 2.7, 2.8, 7.2, 12.5, 12.6**

### Property 9: Photo Storage with Unique Filename and Date-Based Directory

*For any* valid photo upload, the System SHALL generate a unique filename using UUID concatenated with the file extension, store the file in a date-based directory structure (uploads/YYYY/MM/DD/), save the file to the filesystem, and store the relative path in the database.

**Validates: Requirements 2.9, 7.3, 12.1, 12.2, 12.3**

### Property 10: Nearby Issues Query Uses Spatial Functions

*For any* nearby issues query with latitude, longitude, and radius, the System SHALL use PostGIS ST_DWithin function to find Issues within the radius, order results by distance using ST_Distance function, and calculate the distance in meters for each result.

**Validates: Requirements 4.1, 4.2, 4.4**

### Property 11: Nearby Issues Response Completeness

*For any* nearby issues query result, each Issue SHALL include ID, category, description, latitude, longitude, status, severity, report count, support count, distance, created timestamp, and photo URL.

**Validates: Requirements 4.3**

### Property 12: Issue Support Increments Count

*For any* valid issue support submission by a Citizen who has not previously supported the Issue, the System SHALL create a support record linking the Citizen to the Issue and increment the Issue support_count field by exactly 1.

**Validates: Requirements 5.2, 5.3**

### Property 13: Issue Assignment Updates Status and Creates History

*For any* Issue assignment by an Admin or Officer, the System SHALL create an assignment record with Issue ID, Officer ID, assigned by user ID, and timestamp; update the Issue status to ASSIGNED; and create a status history record with from status, to status, changed by user ID, and timestamp.

**Validates: Requirements 6.1, 6.2, 6.3**

### Property 14: Valid Status Transitions Enforced

*For any* status update attempt, the System SHALL validate that the transition is valid according to the state machine (OPEN→ASSIGNED, ASSIGNED→IN_PROGRESS, IN_PROGRESS→RESOLUTION_SUBMITTED, RESOLUTION_SUBMITTED→UNDER_VERIFICATION, UNDER_VERIFICATION→RESOLVED, UNDER_VERIFICATION→REOPENED), rejecting invalid transitions.

**Validates: Requirements 6.4, 6.5**

### Property 15: Status Update Creates History Record

*For any* valid Issue status update, the System SHALL create a status history record with from status, to status, changed by user ID, timestamp, and optional comment if provided.

**Validates: Requirements 6.6, 6.7**

### Property 16: Resolution Evidence Upload Updates Status

*For any* valid resolution evidence upload by the assigned Officer, the System SHALL validate the photo file, store the photo, create an evidence record with Issue ID, uploaded by user ID, evidence type RESOLUTION_PHOTO, file URL, description, and timestamp, and update the Issue status to RESOLUTION_SUBMITTED.

**Validates: Requirements 7.1, 7.4, 7.5**

### Property 17: Citizen Verification Eligibility Enforced

*For any* verification submission attempt, the System SHALL validate that the Issue status is UNDER_VERIFICATION and that the submitting Citizen has either reported or supported the Issue, rejecting verifications from ineligible Citizens.

**Validates: Requirements 8.1, 8.2**

### Property 18: Verification Creates Record and Calculates Approval Rate

*For any* valid verification submission, the System SHALL create a verification record with Issue ID, Citizen ID, verification result (APPROVED or REJECTED), comment, and timestamp, then calculate the approval rate as the count of APPROVED verifications divided by total verifications for that Issue.

**Validates: Requirements 8.4, 8.5**

### Property 19: Issue Resolution Based on Approval Threshold

*For any* Issue with at least 1 verification, WHEN the approval rate is >= 0.60, the System SHALL update the Issue status to RESOLVED and create a status history record; WHEN the approval rate is < 0.60, the System SHALL update the Issue status to REOPENED and create a status history record.

**Validates: Requirements 8.6, 8.7**

### Property 20: JWT Token Required for Protected Endpoints

*For any* request to a protected API endpoint (all endpoints except authentication and nearby issues), the System SHALL validate that a JWT token is present, has a valid signature, and is not expired, rejecting requests with missing or invalid tokens with 401 Unauthorized.

**Validates: Requirements 9.2, 9.3, 13.3**

### Property 21: Role-Based Authorization Enforced

*For any* authenticated request, the System SHALL enforce role-based permissions, allowing Citizens to access citizen endpoints, Officers to access officer endpoints, and Admins to access all endpoints, rejecting unauthorized access attempts with 403 Forbidden.

**Validates: Requirements 9.4, 9.5, 9.6, 9.7, 13.4**

### Property 22: Department Creation and Association

*For any* valid department creation by an Admin, the System SHALL store the department record with name, contact email, contact phone, and return the department ID; and *for any* Issue creation, the System SHALL associate the Issue with the appropriate department based on the category-to-department mapping.

**Validates: Requirements 10.1, 10.2, 10.4**

### Property 23: Foreign Key Constraints Enforced

*For any* attempt to create a record with a foreign key reference, the System SHALL validate that the referenced entity exists, rejecting insertions with invalid foreign keys (IssueReport→Issue, IssueReport→User, Issue→IssueCategory, Issue→Department, Issue→Ward, Issue→assigned Officer).

**Validates: Requirements 11.5**

### Property 24: Photo Access Authorization

*For any* request to access an uploaded photo, the System SHALL validate that the requesting user has appropriate authorization to view the photo based on their role and relationship to the Issue.

**Validates: Requirements 12.4**

### Property 25: HTTP Status Codes for Operation Results

*For any* API operation, the System SHALL return 200 OK for successful queries/updates, 201 Created for successful resource creation, 400 Bad Request for invalid input, 401 Unauthorized for missing/invalid authentication, 403 Forbidden for insufficient permissions, 404 Not Found for missing resources, and 500 Internal Server Error for server errors.

**Validates: Requirements 13.1, 13.2, 13.5**

### Property 26: Timestamps in ISO 8601 Format

*For any* API response containing timestamps, the System SHALL format all timestamp fields in ISO 8601 format with timezone information.

**Validates: Requirements 13.7**

### Property 27: Coordinate Precision

*For any* API response containing geographic coordinates, the System SHALL return latitude with 8-digit precision and longitude with 11-digit precision as decimal numbers.

**Validates: Requirements 13.8**

### Property 28: Issue Detail Response Completeness

*For any* issue detail request, the System SHALL return the Issue with all core fields, all associated IssueReport records with complete fields, all status history records ordered by timestamp descending with complete fields, and department information with ID and name.

**Validates: Requirements 14.1, 14.2, 14.3, 14.4**

### Property 29: Geospatial Data Round-Trip Preservation

*For any* valid latitude and longitude pair submitted in an Issue creation request, storing the location as a PostGIS Point geometry and then retrieving it SHALL produce latitude and longitude values equal to the original values within floating-point precision tolerance (epsilon = 0.0000001).

**Validates: Requirements 15.1, 15.2, 15.3, 15.4**

## 10. Next Steps

### Immediate Actions:

1. **Create Spring Boot Project**
   - Use Spring Initializr with dependencies
   - Configure PostgreSQL connection
   - Set up Flyway migrations

2. **Create React Project**
   - Initialize with Vite
   - Configure TypeScript
   - Set up Tailwind CSS

3. **Database Setup**
   - Install PostgreSQL with PostGIS
   - Create database and enable PostGIS
   - Run initial Flyway migration

4. **Define First API Contract**
   - Start with authentication endpoints
   - Document request/response formats

Would you like me to proceed with generating the actual project setup code and initial database migration scripts?
