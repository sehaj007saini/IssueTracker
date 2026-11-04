# Implementation Plan: India Local Problems OS MVP

## Overview

This implementation plan breaks down the India Local Problems OS MVP into discrete coding tasks following the design's development milestones. The plan focuses on building a working system incrementally, starting with core infrastructure, then authentication, issue management, duplicate detection, map integration, officer workflows, and citizen verification. Each task builds upon previous work and includes testing sub-tasks to validate functionality.

The backend uses Java Spring Boot with PostgreSQL + PostGIS for geospatial queries. The frontend uses React with TypeScript, Leaflet for maps, and TanStack Query for data management.

## Tasks

- [ ] 1. Set up Spring Boot backend project infrastructure
  - [ ] 1.1 Create Spring Boot project with required dependencies
    - Use Spring Initializr to generate project with Java 21, Spring Boot 3+
    - Add dependencies: Spring Web, Spring Data JPA, Spring Security, PostgreSQL Driver, Flyway, Bean Validation, JWT libraries, Lombok
    - Configure pom.xml or build.gradle with all required dependencies
    - Create package structure: config, controller, dto, entity, repository, service, security, exception, util
    - _Requirements: 11.7_
  
  - [ ] 1.2 Configure PostgreSQL database connection and PostGIS setup
    - Configure application.yml with PostgreSQL connection properties
    - Add PostGIS dependency configuration
    - Create database initialization script to enable PostGIS extension
    - Configure Flyway migration settings
    - _Requirements: 11.1_
  
  - [ ]* 1.3 Write unit tests for database configuration
    - Test database connectivity
    - Verify PostGIS extension is enabled
    - Test Flyway migration execution
    - _Requirements: 11.1, 11.7_

- [ ] 2. Create initial database schema with Flyway
  - [ ] 2.1 Create V1 migration for core tables
    - Create users table with role_id, email, password_hash, phone, name, is_active
    - Create roles table with predefined CITIZEN, OFFICER, ADMIN roles
    - Create issue_categories table with name, description, severity_default
    - Create departments table with name, contact_email, contact_phone, head_officer_id
    - Create wards table with name, zone, boundary (PostGIS polygon)
    - Add foreign key constraints and indexes
    - _Requirements: 11.1, 11.5, 11.6_
  
  - [ ] 2.2 Create V2 migration for issues and related tables
    - Create issues table with location (GEOGRAPHY Point 4326), latitude, longitude, address, status, severity
    - Add category_id, ward_id, department_id, assigned_officer_id foreign keys
    - Create GIST spatial index on location field
    - Create indexes on status, category_id, department_id
    - Create issue_reports table linking to issues and users
    - Create issue_support table for citizen support tracking
    - Create issue_evidence table for photos and resolution evidence
    - Create issue_status_history table for audit trail
    - Create citizen_verification table for resolution verification
    - _Requirements: 11.2, 11.3, 11.4, 11.5, 11.6_
  
  - [ ] 2.3 Create V3 migration for seed data
    - Insert default roles (CITIZEN, OFFICER, ADMIN)
    - Insert initial issue categories (Pothole with HIGH severity default)
    - Insert sample departments (Road Infrastructure, Water Supply, etc.)
    - Insert sample wards with geographic boundaries
    - _Requirements: 10.4_

- [ ] 3. Implement authentication and JWT security
  - [ ] 3.1 Create User and Role entities with JPA mappings
    - Create Role entity with id, name, description
    - Create User entity with email, passwordHash, name, phone, role relationship, isActive
    - Configure JPA relationships and validation annotations
    - _Requirements: 1.5_
  
  - [ ] 3.2 Create UserRepository with Spring Data JPA
    - Define findByEmail method
    - Define existsByEmail method
    - Add query methods for user management
    - _Requirements: 1.1, 1.3_
  
  - [ ] 3.3 Implement JWT token provider and security filter
    - Create JwtTokenProvider class with token generation and validation methods
    - Implement generateToken method with user claims (id, email, role) and 24-hour expiration
    - Implement validateToken and getUserIdFromToken methods
    - Create JwtAuthenticationFilter to extract and validate tokens from requests
    - Create UserPrincipal class for Spring Security context
    - _Requirements: 1.6, 1.7, 9.3_
  
  - [ ] 3.4 Configure Spring Security with role-based access control
    - Create SecurityConfig class with SecurityFilterChain bean
    - Configure CSRF disabled and stateless session management
    - Configure BCryptPasswordEncoder with strength 12
    - Define authorization rules: permitAll for /api/auth/**, /api/issues/nearby; CITIZEN role for /api/issues/**; OFFICER role for /api/officer/**; ADMIN role for /api/admin/**
    - Add JwtAuthenticationFilter before UsernamePasswordAuthenticationFilter
    - _Requirements: 1.5, 9.1, 9.2, 9.4, 9.5, 9.6, 9.7_
  
  - [ ] 3.5 Implement AuthService for registration and login
    - Create RegisterRequest and LoginRequest DTOs with validation annotations
    - Create AuthResponse DTO with token, userId, email, role, expiresIn fields
    - Implement register method: validate email uniqueness, hash password with BCrypt, save user, generate JWT
    - Implement login method: validate credentials, generate JWT
    - Add error handling for duplicate email and invalid credentials
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_
  
  - [ ] 3.6 Create AuthController with register and login endpoints
    - Implement POST /api/auth/register endpoint accepting RegisterRequest
    - Implement POST /api/auth/login endpoint accepting LoginRequest
    - Return 201 Created for registration, 200 OK for login
    - Add validation error handling returning 400 Bad Request
    - _Requirements: 1.1, 1.3, 13.1, 13.2_
  
  - [ ]* 3.7 Write property tests for authentication
    - **Property 1: User Registration Creates Account with Valid JWT**
    - **Validates: Requirements 1.1, 1.5, 1.6, 1.7**
    - Generate random valid registration data, call register endpoint, verify user created with BCrypt hash, verify JWT token contains correct claims and 24-hour expiration
  
  - [ ]* 3.8 Write property tests for JWT authentication
    - **Property 2: Authentication Returns Valid JWT for Correct Credentials**
    - **Validates: Requirements 1.3**
    - Generate random registered users, call login with valid credentials, verify JWT token valid and contains correct claims

- [ ] 4. Checkpoint - Verify authentication and database setup
  - Ensure all tests pass, verify database schema created correctly, test authentication endpoints manually
  - Ask the user if questions arise about authentication or database configuration

- [ ] 5. Implement core Issue and IssueReport entities
  - [ ] 5.1 Create IssueCategory, Department, Ward entities
    - Create IssueCategory entity with name, description, severityDefault, isActive
    - Create Department entity with name, contactEmail, contactPhone, headOfficerId, isActive
    - Create Ward entity with name, zone, boundary (PostGIS geometry)
    - Create repositories for each entity
    - _Requirements: 10.1, 10.4_
  
  - [ ] 5.2 Create Issue entity with PostGIS location field
    - Create Issue entity with all fields from design (category, location, latitude, longitude, address, ward, department, status, severity, reportCount, supportCount, descriptionSummary, assignedOfficer)
    - Use @Column with columnDefinition = "geography(Point, 4326)" for location field
    - Add status and severity as ENUMs
    - Configure JPA relationships to IssueCategory, Department, Ward, User (assignedOfficer)
    - _Requirements: 2.5, 2.10, 2.11, 11.2_
  
  - [ ] 5.3 Create IssueReport entity linking reports to issues
    - Create IssueReport entity with issue, reporter, description, photoUrl, isPrimary, similarityScore, status, createdAt
    - Configure ManyToOne relationships to Issue and User
    - Add validation annotations
    - _Requirements: 2.1_
  
  - [ ] 5.4 Create IssueRepository with PostGIS spatial queries
    - Create IssueRepository extending JpaRepository
    - Add native query method findNearbyIssues using ST_DWithin and ST_Distance
    - Method parameters: latitude, longitude, radiusMeters, categoryId, statuses list
    - Order results by distance ascending
    - _Requirements: 3.1, 4.1, 4.2_
  
  - [ ] 5.5 Create IssueReportRepository
    - Create IssueReportRepository extending JpaRepository
    - Add query methods: findByIssueId, existsByIssueIdAndReporterId
    - _Requirements: 2.1_

- [ ] 6. Implement file storage service
  - [ ] 6.1 Create FileStorageService for photo uploads
    - Implement file validation: check extensions (jpg, jpeg, png, heic) and size limit (5MB)
    - Implement storeFile method: generate UUID filename, create date-based directory (uploads/YYYY/MM/DD/), save file, return relative path
    - Add error handling for invalid files
    - _Requirements: 2.7, 2.8, 2.9, 12.1, 12.2, 12.3, 12.5, 12.6_
  
  - [ ] 6.2 Create FileController for serving uploaded photos
    - Implement GET endpoint to serve photos by path
    - Add authorization checks to validate user can access the photo
    - Return appropriate HTTP status codes
    - _Requirements: 12.4_
  
  - [ ]* 6.3 Write property tests for file upload validation
    - **Property 8: File Upload Validation**
    - **Validates: Requirements 2.7, 2.8, 7.2, 12.5, 12.6**
    - Generate test files with various extensions and sizes, verify only valid files accepted
  
  - [ ]* 6.4 Write property tests for photo storage
    - **Property 9: Photo Storage with Unique Filename and Date-Based Directory**
    - **Validates: Requirements 2.9, 7.3, 12.1, 12.2, 12.3**
    - Upload multiple photos, verify unique filenames, correct directory structure, and paths stored in DB

- [ ] 7. Implement duplicate detection service
  - [ ] 7.1 Create GeoUtils utility class
    - Implement calculateDistance method using Haversine formula for lat/lng pairs
    - Add helper methods for PostGIS Point creation
    - _Requirements: 3.5, 15.2_
  
  - [ ] 7.2 Create DuplicateDetectionService with similarity scoring
    - Implement detectDuplicate method taking latitude, longitude, categoryId, description
    - Step 1: Call IssueRepository.findNearbyIssues with 50m threshold, same category, statuses OPEN/ASSIGNED/IN_PROGRESS
    - Step 2: For each candidate, calculate similarity score with weighted formula
    - Implement calculateSimilarityScore: distance (50%), text similarity (30%), time proximity (20%)
    - Implement calculateTextSimilarity using Levenshtein distance
    - Return best match if score >= 0.70, otherwise return no duplicate
    - _Requirements: 2.2, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_
  
  - [ ]* 7.3 Write property tests for duplicate detection
    - **Property 3: Issue Report Triggers Duplicate Detection**
    - **Validates: Requirements 2.2, 3.1, 3.2, 3.3**
    - Generate issue reports, verify duplicate detection queries nearby issues correctly
  
  - [ ]* 7.4 Write property tests for similarity score calculation
    - **Property 6: Similarity Score Calculation Formula**
    - **Validates: Requirements 3.4, 3.5, 3.6, 3.7**
    - Generate test cases with known distances, descriptions, and timestamps, verify score calculation matches formula

- [ ] 8. Implement issue report creation service
  - [ ] 8.1 Create IssueService for issue management
    - Create CreateIssueReportRequest DTO with categoryId, description, latitude, longitude, address, photo (MultipartFile)
    - Create IssueResponse and IssueDetailResponse DTOs
    - Implement createIssueReport method:
      - Validate input data
      - Upload photo using FileStorageService
      - Call DuplicateDetectionService.detectDuplicate
      - If no duplicate: create new Issue with status OPEN, severity from category default, set location as PostGIS Point, save IssueReport as primary
      - If duplicate found: link IssueReport to existing Issue, increment reportCount
      - Return response with issueId, reportId, isDuplicate, similarityScore, message
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.9, 2.10, 2.11_
  
  - [ ] 8.2 Create IssueController with create endpoint
    - Implement POST /api/issues endpoint accepting multipart/form-data
    - Extract authentication principal for reporter user
    - Call IssueService.createIssueReport
    - Return 201 Created with IssueResponse
    - Add error handling for validation errors and duplicates
    - _Requirements: 2.1, 13.1, 13.2_
  
  - [ ]* 8.3 Write property tests for new issue creation
    - **Property 4: New Issue Created When No Duplicate Found**
    - **Validates: Requirements 2.3, 2.10, 2.11**
    - Generate reports in non-overlapping locations, verify new Issues created with correct status and severity
  
  - [ ]* 8.4 Write property tests for duplicate linking
    - **Property 5: Duplicate Report Links to Existing Issue**
    - **Validates: Requirements 2.4, 3.8, 3.9**
    - Create issue, then submit similar reports nearby, verify reports linked and report count incremented

- [ ] 9. Implement geospatial querying for nearby issues
  - [ ] 9.1 Implement nearby issues query in IssueService
    - Create getNearbyIssues method taking latitude, longitude, radius, optional categoryId filter
    - Call IssueRepository.findNearbyIssues with parameters
    - Map Issue entities to NearbyIssuesResponse DTOs with all required fields
    - Include distance in meters for each result
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [ ] 9.2 Add nearby issues endpoint to IssueController
    - Implement GET /api/issues/nearby with query parameters: lat, lng, radius, category
    - Allow unauthenticated access (permitAll in SecurityConfig)
    - Return 200 OK with list of nearby issues
    - _Requirements: 4.1, 9.1_
  
  - [ ]* 9.3 Write property tests for spatial queries
    - **Property 10: Nearby Issues Query Uses Spatial Functions**
    - **Validates: Requirements 4.1, 4.2, 4.4**
    - Create issues at various locations, query nearby, verify correct issues returned within radius and ordered by distance
  
  - [ ]* 9.4 Write property tests for nearby issues response
    - **Property 11: Nearby Issues Response Completeness**
    - **Validates: Requirements 4.3**
    - Query nearby issues, verify all required fields present in response

- [ ] 10. Implement issue detail retrieval
  - [ ] 10.1 Create getIssueById method in IssueService
    - Fetch Issue by ID with eager loading of category, department, assignedOfficer, ward
    - Fetch all IssueReports for the issue
    - Fetch all IssueStatusHistory records ordered by timestamp descending
    - Map to IssueDetailResponse DTO with all fields
    - _Requirements: 14.1, 14.2, 14.3, 14.4_
  
  - [ ] 10.2 Add issue detail endpoint to IssueController
    - Implement GET /api/issues/{id}
    - Require authentication
    - Return 200 OK with IssueDetailResponse
    - Return 404 Not Found if issue doesn't exist
    - _Requirements: 14.1, 13.5_
  
  - [ ]* 10.3 Write property tests for issue detail response
    - **Property 28: Issue Detail Response Completeness**
    - **Validates: Requirements 14.1, 14.2, 14.3, 14.4**
    - Create issues with reports and status history, verify all data returned correctly

- [ ] 11. Checkpoint - Verify core issue management
  - Ensure all tests pass, test issue creation with duplicate detection, verify spatial queries work correctly
  - Ask the user if questions arise about issue management or duplicate detection

- [ ] 12. Implement issue support feature
  - [ ] 12.1 Create IssueSupport entity and repository
    - Create IssueSupport entity with issue, citizen, createdAt
    - Create IssueSupportRepository with existsByIssueIdAndCitizenId method
    - _Requirements: 5.1, 5.2_
  
  - [ ] 12.2 Implement supportIssue method in IssueService
    - Validate citizen hasn't already supported the issue
    - Create IssueSupport record
    - Increment Issue.supportCount by 1
    - Return success response with updated support count
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [ ] 12.3 Add support issue endpoint to IssueController
    - Implement POST /api/issues/{id}/support
    - Require CITIZEN authentication
    - Return 200 OK with updated support count
    - Return 400 Bad Request if already supported
    - _Requirements: 5.2, 5.4_
  
  - [ ]* 12.4 Write property tests for issue support
    - **Property 12: Issue Support Increments Count**
    - **Validates: Requirements 5.2, 5.3**
    - Support issues, verify count increments exactly by 1, verify duplicate support rejected

- [ ] 13. Implement issue assignment and status management
  - [ ] 13.1 Create IssueStatusHistory entity and repository
    - Create IssueStatusHistory entity with issue, fromStatus, toStatus, changedBy, comment, changedAt
    - Create IssueStatusHistoryRepository
    - _Requirements: 6.3, 6.6, 6.7_
  
  - [ ] 13.2 Create AssignmentService for issue assignment
    - Create AssignIssueRequest DTO with officerId
    - Implement assignIssue method:
      - Validate officer exists and has OFFICER role
      - Update Issue.assignedOfficer and status to ASSIGNED
      - Create IssueStatusHistory record
      - Return updated issue
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [ ] 13.3 Implement status transition validation in IssueService
    - Create method validateStatusTransition checking valid transitions
    - Valid transitions: OPEN→ASSIGNED, ASSIGNED→IN_PROGRESS, IN_PROGRESS→RESOLUTION_SUBMITTED, RESOLUTION_SUBMITTED→UNDER_VERIFICATION, UNDER_VERIFICATION→RESOLVED, UNDER_VERIFICATION→REOPENED
    - Throw exception for invalid transitions
    - _Requirements: 6.4, 6.5_
  
  - [ ] 13.4 Implement updateIssueStatus method in IssueService
    - Create UpdateStatusRequest DTO with status and optional comment
    - Validate status transition
    - Update Issue.status
    - Create IssueStatusHistory record with comment if provided
    - Return updated issue
    - _Requirements: 6.4, 6.5, 6.6, 6.7_
  
  - [ ] 13.5 Create OfficerController with assignment and status endpoints
    - Implement PATCH /api/officer/issues/{id}/assign accepting AssignIssueRequest
    - Implement PATCH /api/officer/issues/{id}/status accepting UpdateStatusRequest
    - Require OFFICER role authentication
    - Return 200 OK with updated issue
    - Return 400 Bad Request for invalid transitions
    - _Requirements: 6.1, 6.4, 13.1, 13.2_
  
  - [ ]* 13.6 Write property tests for issue assignment
    - **Property 13: Issue Assignment Updates Status and Creates History**
    - **Validates: Requirements 6.1, 6.2, 6.3**
    - Assign issues to officers, verify status updated and history record created
  
  - [ ]* 13.7 Write property tests for status transitions
    - **Property 14: Valid Status Transitions Enforced**
    - **Validates: Requirements 6.4, 6.5**
    - Attempt valid and invalid status transitions, verify only valid ones succeed
  
  - [ ]* 13.8 Write property tests for status history
    - **Property 15: Status Update Creates History Record**
    - **Validates: Requirements 6.6, 6.7**
    - Update statuses with comments, verify history records created correctly

- [ ] 14. Implement resolution evidence upload
  - [ ] 14.1 Create IssueEvidence entity and repository
    - Create IssueEvidence entity with issue, uploadedBy, evidenceType, fileUrl, description, uploadedAt
    - Create enum EvidenceType with REPORT_PHOTO, RESOLUTION_PHOTO
    - Create IssueEvidenceRepository
    - _Requirements: 7.3, 7.4_
  
  - [ ] 14.2 Implement uploadResolutionEvidence method in IssueService
    - Create UploadEvidenceRequest DTO with evidenceType, description, photo
    - Validate officer is assigned to the issue
    - Validate photo using FileStorageService
    - Store photo and create IssueEvidence record with type RESOLUTION_PHOTO
    - Update Issue.status to RESOLUTION_SUBMITTED
    - Return evidence record
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [ ] 14.3 Add resolution evidence endpoint to OfficerController
    - Implement POST /api/officer/issues/{id}/evidence accepting multipart/form-data
    - Require OFFICER authentication
    - Return 201 Created with evidence details
    - Return 400 Bad Request if not assigned officer
    - _Requirements: 7.1, 13.1_
  
  - [ ]* 14.4 Write property tests for resolution evidence
    - **Property 16: Resolution Evidence Upload Updates Status**
    - **Validates: Requirements 7.1, 7.4, 7.5**
    - Upload resolution evidence, verify evidence created and status updated to RESOLUTION_SUBMITTED

- [ ] 15. Implement citizen verification of resolutions
  - [ ] 15.1 Create CitizenVerification entity and repository
    - Create CitizenVerification entity with issue, citizen, verificationResult, comment, createdAt
    - Create enum VerificationResult with APPROVED, REJECTED
    - Create CitizenVerificationRepository with existsByIssueIdAndCitizenId, findByIssueId methods
    - _Requirements: 8.4_
  
  - [ ] 15.2 Create VerificationService for verification logic
    - Create VerifyResolutionRequest DTO with verificationResult (APPROVED/REJECTED) and comment
    - Implement processVerification method:
      - Validate issue status is UNDER_VERIFICATION
      - Validate citizen reported or supported the issue
      - Validate citizen hasn't already verified
      - Create CitizenVerification record
      - Fetch all verifications for issue
      - If count >= 1: calculate approval rate
      - If approval rate >= 0.60: update status to RESOLVED, create history
      - If approval rate < 0.60: update status to REOPENED, create history
      - Return verification result
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9_
  
  - [ ] 15.3 Add verification endpoint to IssueController
    - Implement POST /api/issues/{id}/verify accepting VerifyResolutionRequest
    - Require CITIZEN authentication
    - Return 200 OK with verification result and updated issue status
    - Return 400 Bad Request if citizen not eligible or already verified
    - _Requirements: 8.1, 13.1, 13.2_
  
  - [ ]* 15.4 Write property tests for verification eligibility
    - **Property 17: Citizen Verification Eligibility Enforced**
    - **Validates: Requirements 8.1, 8.2**
    - Attempt verifications from eligible and ineligible citizens, verify enforcement
  
  - [ ]* 15.5 Write property tests for verification approval
    - **Property 18: Verification Creates Record and Calculates Approval Rate**
    - **Validates: Requirements 8.4, 8.5**
    - Submit verifications, verify records created and approval rate calculated correctly
  
  - [ ]* 15.6 Write property tests for issue resolution based on threshold
    - **Property 19: Issue Resolution Based on Approval Threshold**
    - **Validates: Requirements 8.6, 8.7**
    - Submit verifications with various approval rates, verify status updated to RESOLVED or REOPENED correctly

- [ ] 16. Checkpoint - Verify officer and citizen workflows
  - Ensure all tests pass, test assignment, status updates, evidence upload, and verification flows
  - Ask the user if questions arise about officer or citizen workflows

- [ ] 17. Implement department management
  - [ ] 17.1 Create DepartmentRepository query methods
    - Add findAll method returning all active departments
    - Add findById method
    - _Requirements: 10.3_
  
  - [ ] 17.2 Create AdminService for department management
    - Create CreateDepartmentRequest DTO with name, contactEmail, contactPhone
    - Implement createDepartment method: validate input, save department, return department
    - Implement getAllDepartments method
    - _Requirements: 10.1, 10.2, 10.3_
  
  - [ ] 17.3 Create AdminController with department endpoints
    - Implement POST /api/admin/departments accepting CreateDepartmentRequest
    - Implement GET /api/admin/departments
    - Require ADMIN role authentication
    - Return 201 Created for department creation, 200 OK for queries
    - _Requirements: 10.1, 10.3_
  
  - [ ]* 17.4 Write property tests for department management
    - **Property 22: Department Creation and Association**
    - **Validates: Requirements 10.1, 10.2, 10.4**
    - Create departments, create issues, verify department association works correctly

- [ ] 18. Implement global exception handling and API response formatting
  - [ ] 18.1 Create custom exception classes
    - Create ResourceNotFoundException, DuplicateResourceException, UnauthorizedException, InvalidOperationException
    - _Requirements: 13.2, 13.3, 13.4, 13.5_
  
  - [ ] 18.2 Create GlobalExceptionHandler with @ControllerAdvice
    - Handle ResourceNotFoundException returning 404 Not Found with error message
    - Handle DuplicateResourceException returning 400 Bad Request
    - Handle UnauthorizedException returning 401 Unauthorized
    - Handle AccessDeniedException returning 403 Forbidden
    - Handle validation errors returning 400 Bad Request
    - Handle generic exceptions returning 500 Internal Server Error
    - Format all timestamps in ISO 8601 with timezone
    - Format coordinates with 8-digit latitude precision and 11-digit longitude precision
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8_
  
  - [ ]* 18.3 Write property tests for HTTP status codes
    - **Property 25: HTTP Status Codes for Operation Results**
    - **Validates: Requirements 13.1, 13.2, 13.5**
    - Make various API calls with success and error conditions, verify correct status codes returned

- [ ] 19. Implement authorization and access control enforcement
  - [ ] 19.1 Add JWT token validation to security filter
    - Ensure JwtAuthenticationFilter validates token signature and expiration
    - Set security context with user principal
    - Reject requests with invalid/expired tokens with 401
    - _Requirements: 9.2, 9.3_
  
  - [ ] 19.2 Add method-level security annotations
    - Use @PreAuthorize on service methods to enforce role checks
    - Ensure Citizens can only access citizen operations
    - Ensure Officers can access officer operations
    - Ensure Admins can access all operations
    - _Requirements: 9.4, 9.5, 9.6, 9.7_
  
  - [ ]* 19.3 Write property tests for JWT token requirements
    - **Property 20: JWT Token Required for Protected Endpoints**
    - **Validates: Requirements 9.2, 9.3**
    - Call protected endpoints without tokens, with invalid tokens, verify 401 returned
  
  - [ ]* 19.4 Write property tests for role-based authorization
    - **Property 21: Role-Based Authorization Enforced**
    - **Validates: Requirements 9.4, 9.5, 9.6, 9.7**
    - Attempt operations with different roles, verify only authorized roles succeed, others get 403

- [ ] 20. Implement React frontend project setup
  - [ ] 20.1 Initialize React project with Vite and TypeScript
    - Use Vite to create React + TypeScript project
    - Configure tsconfig.json with strict mode
    - Set up folder structure: components, pages, services, hooks, context, types, utils
    - _Requirements: (Frontend infrastructure)_
  
  - [ ] 20.2 Install and configure frontend dependencies
    - Install React Router for navigation
    - Install TanStack Query for server state management
    - Install Axios for HTTP client
    - Install Tailwind CSS for styling
    - Install Leaflet and React-Leaflet for maps
    - Configure Tailwind CSS and create base styles
    - _Requirements: (Frontend dependencies)_
  
  - [ ] 20.3 Create API client and authentication service
    - Create api.ts with Axios instance configured with base URL
    - Create authService.ts with register, login methods
    - Configure Axios interceptors to attach JWT token to requests
    - Create AuthContext for managing auth state
    - Create useAuth hook for accessing auth context
    - _Requirements: 1.1, 1.3_

- [ ] 21. Implement frontend authentication pages
  - [ ] 21.1 Create LoginPage component
    - Create login form with email and password fields
    - Use TanStack Query mutation to call login API
    - Store JWT token in localStorage on success
    - Update AuthContext with user info
    - Navigate to home page on success
    - Display error messages for invalid credentials
    - _Requirements: 1.3, 1.4_
  
  - [ ] 21.2 Create RegisterPage component
    - Create registration form with email, password, name, phone, role fields
    - Use TanStack Query mutation to call register API
    - Store JWT token in localStorage on success
    - Navigate to home page on success
    - Display error for duplicate email
    - _Requirements: 1.1, 1.2_
  
  - [ ] 21.3 Create ProtectedRoute component
    - Check if user is authenticated via AuthContext
    - Redirect to login page if not authenticated
    - Allow access if authenticated
    - _Requirements: 9.2_

- [ ] 22. Implement issue reporting in frontend
  - [ ] 22.1 Create IssueReportForm component
    - Create form with category dropdown, description textarea, photo upload input
    - Use useGeolocation hook to capture current GPS location
    - Display map showing current location with marker
    - Validate photo file type and size before upload
    - Use TanStack Query mutation to submit multipart/form-data to POST /api/issues
    - Display success message with duplicate notification if applicable
    - Display error messages for validation failures
    - _Requirements: 2.1, 2.7, 2.8_
  
  - [ ] 22.2 Create ReportIssuePage
    - Render IssueReportForm component
    - Show loading state during submission
    - Navigate to issue detail on success
    - _Requirements: 2.1_
  
  - [ ] 22.3 Create useGeolocation hook
    - Use browser Geolocation API to get current position
    - Return latitude, longitude, and loading state
    - Handle permission denied and errors
    - _Requirements: 2.1_

- [ ] 23. Implement issue map and list views in frontend
  - [ ] 23.1 Create IssueMap component with Leaflet
    - Initialize Leaflet map with OpenStreetMap tiles
    - Accept issues array and center coordinates as props
    - Render markers for each issue at its location
    - Show popup on marker click with issue summary, status, category
    - Call onIssueClick callback when marker clicked
    - _Requirements: 4.1, 4.3_
  
  - [ ] 23.2 Create issueService with nearby query
    - Create getNearbyIssues method calling GET /api/issues/nearby
    - Accept lat, lng, radius, optional category filter
    - Return array of nearby issues
    - _Requirements: 4.1_
  
  - [ ] 23.3 Create HomePage with map view
    - Use useGeolocation to get user's current location
    - Use TanStack Query to fetch nearby issues within 2km radius
    - Render IssueMap component centered on user location
    - Display issue markers on map
    - Navigate to issue detail when marker clicked
    - Add filter controls for category
    - _Requirements: 4.1, 4.2, 4.3_

- [ ] 24. Implement issue detail view in frontend
  - [ ] 24.1 Create IssueDetails component
    - Fetch issue detail using GET /api/issues/{id}
    - Display all issue fields: category, description, address, status, severity, report count, support count
    - Display photo gallery from reports and evidence
    - Display list of all reports with reporter name, description, timestamp
    - Display status history timeline
    - Show assigned officer if assigned
    - Add "Support Issue" button for citizens
    - Add "Verify Resolution" button if status is UNDER_VERIFICATION and user reported/supported
    - _Requirements: 14.1, 14.2, 14.3, 14.4_
  
  - [ ] 24.2 Create IssueDetailPage
    - Extract issue ID from route params
    - Render IssueDetails component
    - Handle 404 if issue not found
    - _Requirements: 14.1_

- [ ] 25. Implement issue support and verification in frontend
  - [ ] 25.1 Add support issue functionality
    - Create mutation for POST /api/issues/{id}/support
    - Add support button to IssueDetails component
    - Disable button if already supported
    - Update support count optimistically
    - Display error if already supported
    - _Requirements: 5.1, 5.4_
  
  - [ ] 25.2 Create VerificationForm component
    - Create form with radio buttons for APPROVED/REJECTED
    - Add comment textarea
    - Use mutation to call POST /api/issues/{id}/verify
    - Show success message with updated issue status
    - Display error if not eligible or already verified
    - _Requirements: 8.1, 8.4_
  
  - [ ] 25.3 Integrate VerificationForm into IssueDetails
    - Show VerificationForm only if issue status is UNDER_VERIFICATION
    - Show only if user reported or supported the issue
    - Hide after successful verification
    - _Requirements: 8.1, 8.2_

- [ ] 26. Implement officer dashboard and workflows in frontend
  - [ ] 26.1 Create OfficerDashboard component
    - Fetch assigned issues using TanStack Query
    - Display issue list with filters for status
    - Show issue count by status
    - Navigate to issue detail when clicked
    - _Requirements: (Officer interface)_
  
  - [ ] 26.2 Add assignment functionality to IssueDetails for officers
    - Add assign button visible only to officers/admins
    - Create mutation for PATCH /api/officer/issues/{id}/assign
    - Show officer selection dropdown
    - Update issue on success
    - _Requirements: 6.1_
  
  - [ ] 26.3 Add status update functionality for officers
    - Add status update controls visible only to officers
    - Show dropdown with valid next statuses based on current status
    - Add comment textarea
    - Create mutation for PATCH /api/officer/issues/{id}/status
    - Update issue on success
    - Display error for invalid transitions
    - _Requirements: 6.4, 6.5_
  
  - [ ] 26.4 Add resolution evidence upload for officers
    - Add evidence upload form visible only to assigned officer
    - Accept photo and description
    - Create mutation for POST /api/officer/issues/{id}/evidence
    - Update issue status to RESOLUTION_SUBMITTED on success
    - _Requirements: 7.1, 7.5_

- [ ] 27. Implement admin dashboard in frontend
  - [ ] 27.1 Create AdminDashboard component
    - Display department management interface
    - Show form to create new department
    - List all departments with contact info
    - Use mutations for POST /api/admin/departments and query for GET /api/admin/departments
    - _Requirements: 10.1, 10.3_

- [ ] 28. Final integration and wiring
  - [ ] 28.1 Configure frontend routing
    - Set up React Router with routes for all pages
    - Configure protected routes for citizen, officer, admin pages
    - Set up route guards based on user role
    - _Requirements: (Routing)_
  
  - [ ] 28.2 Add responsive layout and styling
    - Create Header component with navigation and user menu
    - Create Footer component
    - Apply Tailwind CSS styling to all components
    - Ensure mobile responsiveness
    - _Requirements: (UI/UX)_
  
  - [ ] 28.3 Add loading states and error boundaries
    - Show loading spinners during API calls
    - Add error boundary component for React errors
    - Display user-friendly error messages
    - _Requirements: (Error handling)_
  
  - [ ] 28.4 Connect frontend to backend
    - Configure Axios base URL to point to backend
    - Test all API integrations end-to-end
    - Verify JWT token flow works correctly
    - _Requirements: (Integration)_

- [ ] 29. Final checkpoint - End-to-end testing
  - Test complete user flows: registration, login, report issue, view map, support issue, officer assigns and resolves, citizen verifies
  - Test with duplicate detection scenarios
  - Test authorization and access control
  - Verify all spatial queries work correctly with real GPS coordinates
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional test tasks and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Property-based tests validate universal correctness properties from the design document
- Checkpoints ensure incremental validation and provide opportunities for user feedback
- The implementation follows the development milestones from the design document
- Backend uses Java Spring Boot with PostgreSQL + PostGIS for geospatial features
- Frontend uses React with TypeScript, Leaflet for maps, and TanStack Query for data management
- Focus on building a working MVP incrementally with proper testing at each stage

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "20.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "20.2"] },
    { "id": 2, "tasks": ["2.1"] },
    { "id": 3, "tasks": ["2.2"] },
    { "id": 4, "tasks": ["2.3", "20.3"] },
    { "id": 5, "tasks": ["3.1", "3.2"] },
    { "id": 6, "tasks": ["3.3", "3.4"] },
    { "id": 7, "tasks": ["3.5"] },
    { "id": 8, "tasks": ["3.6", "21.1", "21.2"] },
    { "id": 9, "tasks": ["3.7", "3.8", "21.3"] },
    { "id": 10, "tasks": ["5.1"] },
    { "id": 11, "tasks": ["5.2", "5.3"] },
    { "id": 12, "tasks": ["5.4", "5.5"] },
    { "id": 13, "tasks": ["6.1"] },
    { "id": 14, "tasks": ["6.2", "22.3"] },
    { "id": 15, "tasks": ["6.3", "6.4"] },
    { "id": 16, "tasks": ["7.1"] },
    { "id": 17, "tasks": ["7.2"] },
    { "id": 18, "tasks": ["7.3", "7.4"] },
    { "id": 19, "tasks": ["8.1"] },
    { "id": 20, "tasks": ["8.2", "22.1"] },
    { "id": 21, "tasks": ["8.3", "8.4", "22.2"] },
    { "id": 22, "tasks": ["9.1", "23.2"] },
    { "id": 23, "tasks": ["9.2", "23.1"] },
    { "id": 24, "tasks": ["9.3", "9.4", "23.3"] },
    { "id": 25, "tasks": ["10.1"] },
    { "id": 26, "tasks": ["10.2", "24.1"] },
    { "id": 27, "tasks": ["10.3", "24.2"] },
    { "id": 28, "tasks": ["12.1"] },
    { "id": 29, "tasks": ["12.2"] },
    { "id": 30, "tasks": ["12.3", "25.1"] },
    { "id": 31, "tasks": ["12.4"] },
    { "id": 32, "tasks": ["13.1"] },
    { "id": 33, "tasks": ["13.2", "13.3"] },
    { "id": 34, "tasks": ["13.4"] },
    { "id": 35, "tasks": ["13.5", "26.2", "26.3"] },
    { "id": 36, "tasks": ["13.6", "13.7", "13.8"] },
    { "id": 37, "tasks": ["14.1"] },
    { "id": 38, "tasks": ["14.2"] },
    { "id": 39, "tasks": ["14.3", "26.4"] },
    { "id": 40, "tasks": ["14.4"] },
    { "id": 41, "tasks": ["15.1"] },
    { "id": 42, "tasks": ["15.2", "25.2"] },
    { "id": 43, "tasks": ["15.3", "25.3"] },
    { "id": 44, "tasks": ["15.4", "15.5", "15.6"] },
    { "id": 45, "tasks": ["17.1"] },
    { "id": 46, "tasks": ["17.2"] },
    { "id": 47, "tasks": ["17.3", "27.1"] },
    { "id": 48, "tasks": ["17.4"] },
    { "id": 49, "tasks": ["18.1", "18.2"] },
    { "id": 50, "tasks": ["18.3"] },
    { "id": 51, "tasks": ["19.1", "19.2"] },
    { "id": 52, "tasks": ["19.3", "19.4"] },
    { "id": 53, "tasks": ["26.1"] },
    { "id": 54, "tasks": ["28.1", "28.2", "28.3"] },
    { "id": 55, "tasks": ["28.4"] }
  ]
}
```
