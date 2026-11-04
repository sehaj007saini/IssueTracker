# Requirements Document

## Introduction

The India Local Problems OS MVP is a civic pothole reporting platform that enables citizens to report infrastructure issues, municipal officers to manage and resolve them, and administrators to oversee the entire system. The MVP focuses exclusively on pothole reporting with intelligent duplicate detection, spatial querying, and resolution verification with abuse prevention mechanisms.

## Glossary

- **System**: The India Local Problems OS platform (backend + frontend + database)
- **Citizen**: A registered user with the CITIZEN role who can report and verify issues
- **Officer**: A registered user with the OFFICER role who can manage and resolve issues
- **Admin**: A registered user with the ADMIN role who can manage system configuration
- **Issue**: A real-world problem (pothole) that has been reported
- **IssueReport**: An individual citizen's report that either creates a new Issue or links to an existing Issue
- **Duplicate_Detection_Service**: The component that identifies if a new report matches an existing Issue
- **Resolution_Evidence**: Photos and documentation uploaded by Officers to demonstrate issue resolution
- **Verification**: Citizen feedback on whether an Officer's resolution is satisfactory
- **PostGIS**: PostgreSQL extension for geospatial queries
- **JWT_Token**: JSON Web Token used for stateless authentication

## Requirements

### Requirement 1: User Registration and Authentication

**User Story:** As a user, I want to register and authenticate with the system, so that I can access role-specific features securely.

#### Acceptance Criteria

1. WHEN a user submits valid registration data with email, password, name, phone, and role, THE System SHALL create a new user account and return a JWT_Token
2. WHEN a user submits registration data with an email that already exists, THE System SHALL reject the registration and return an error message
3. WHEN a registered user submits valid login credentials, THE System SHALL authenticate the user and return a JWT_Token with an expiration time
4. WHEN a user submits invalid login credentials, THE System SHALL reject the authentication and return an error message
5. THE System SHALL hash all passwords using BCrypt with strength 12 before storing them
6. THE JWT_Token SHALL include user ID, email, and role claims
7. THE JWT_Token SHALL expire after 24 hours

### Requirement 2: Issue Report Creation

**User Story:** As a Citizen, I want to report a pothole with location and photo, so that it can be addressed by municipal authorities.

#### Acceptance Criteria

1. WHEN a Citizen submits a new issue report with category, description, latitude, longitude, address, and photo, THE System SHALL validate the input data
2. WHEN a Citizen submits a valid issue report, THE Duplicate_Detection_Service SHALL search for existing Issues within 50 meters with the same category
3. IF no duplicate Issue is found, THEN THE System SHALL create a new Issue and associate the report as the primary report
4. IF a duplicate Issue is found with similarity score greater than or equal to 0.70, THEN THE System SHALL link the report to the existing Issue and increment the report count
5. WHEN an Issue is created, THE System SHALL store the location as a PostGIS GEOGRAPHY Point with SRID 4326
6. WHEN an Issue is created, THE System SHALL create a spatial index on the location field
7. WHEN a photo is uploaded, THE System SHALL validate that the file type is jpg, jpeg, png, or heic
8. WHEN a photo is uploaded, THE System SHALL validate that the file size does not exceed 5 MB
9. WHEN a valid photo is uploaded, THE System SHALL store the file on the filesystem and save the relative path in the database
10. WHEN an Issue is created, THE System SHALL set the initial status to OPEN
11. WHEN an Issue is created, THE System SHALL set the severity based on the category default value

### Requirement 3: Duplicate Detection

**User Story:** As a Citizen, I want the system to detect if my report matches an existing issue, so that duplicate issues are not created.

#### Acceptance Criteria

1. WHEN detecting duplicates, THE Duplicate_Detection_Service SHALL query for Issues within 50 meters using PostGIS ST_DWithin function
2. WHEN detecting duplicates, THE Duplicate_Detection_Service SHALL filter Issues by the same category
3. WHEN detecting duplicates, THE Duplicate_Detection_Service SHALL only consider Issues with status OPEN, ASSIGNED, or IN_PROGRESS
4. FOR ALL candidate Issues within the distance threshold, THE Duplicate_Detection_Service SHALL calculate a similarity score combining distance proximity (50% weight), text similarity (30% weight), and time proximity (20% weight)
5. WHEN calculating distance score, THE System SHALL use the formula: max(0, 1.0 - (distance / 50.0))
6. WHEN calculating text similarity, THE System SHALL use Levenshtein distance between descriptions
7. WHEN calculating time proximity score, THE System SHALL assign 1.0 for Issues created within 24 hours, 0.7 for 24-72 hours, 0.4 for 72-168 hours, and 0.2 for older Issues
8. WHEN the highest similarity score is greater than or equal to 0.70, THE System SHALL classify the report as a duplicate
9. WHEN a report is classified as a duplicate, THE System SHALL return the existing Issue ID and similarity score

### Requirement 4: Spatial Querying

**User Story:** As a Citizen, I want to view nearby issues on a map, so that I can see what problems have already been reported in my area.

#### Acceptance Criteria

1. WHEN a user requests nearby Issues with latitude, longitude, radius, and optional category filter, THE System SHALL query Issues using PostGIS ST_DWithin function
2. WHEN querying nearby Issues, THE System SHALL order results by distance using PostGIS ST_Distance function
3. WHEN querying nearby Issues, THE System SHALL return Issue ID, category, description, latitude, longitude, status, severity, report count, support count, distance, created timestamp, and photo URL
4. WHEN querying nearby Issues, THE System SHALL calculate the distance in meters between the query point and each Issue location

### Requirement 5: Issue Support

**User Story:** As a Citizen, I want to support an existing issue, so that I can indicate the problem affects me too and increase its priority.

#### Acceptance Criteria

1. WHEN a Citizen submits support for an Issue, THE System SHALL verify that the Citizen has not already supported that Issue
2. WHEN a Citizen submits valid support for an Issue, THE System SHALL create a support record linking the Citizen to the Issue
3. WHEN a support record is created, THE System SHALL increment the Issue support count by 1
4. IF a Citizen attempts to support an Issue they have already supported, THEN THE System SHALL reject the request and return an error message

### Requirement 6: Issue Assignment and Status Management

**User Story:** As an Officer or Admin, I want to assign issues to officers and track status changes, so that work can be organized and progress monitored.

#### Acceptance Criteria

1. WHEN an Admin or Officer assigns an Issue to an Officer, THE System SHALL create an assignment record with Issue ID, Officer ID, assigned by user ID, and assignment timestamp
2. WHEN an Issue is assigned, THE System SHALL update the Issue status to ASSIGNED
3. WHEN an Issue is assigned, THE System SHALL create a status history record with from status, to status, changed by user ID, and timestamp
4. WHEN an Officer updates Issue status, THE System SHALL validate that the status transition is valid
5. THE System SHALL allow status transitions from OPEN to ASSIGNED, ASSIGNED to IN_PROGRESS, IN_PROGRESS to RESOLUTION_SUBMITTED, RESOLUTION_SUBMITTED to UNDER_VERIFICATION, UNDER_VERIFICATION to RESOLVED, and UNDER_VERIFICATION to REOPENED
6. WHEN an Officer updates Issue status, THE System SHALL create a status history record
7. WHEN an Officer updates Issue status with a comment, THE System SHALL store the comment in the status history record

### Requirement 7: Resolution Evidence Upload

**User Story:** As an Officer, I want to upload photos demonstrating that I have fixed the issue, so that citizens can verify the resolution.

#### Acceptance Criteria

1. WHEN an Officer uploads resolution evidence with Issue ID, evidence type, description, and photo, THE System SHALL validate that the Officer is assigned to the Issue
2. WHEN an Officer uploads valid resolution evidence, THE System SHALL validate the photo file type and size using the same rules as issue report photos
3. WHEN valid resolution evidence is uploaded, THE System SHALL store the photo on the filesystem and save the relative path in the database
4. WHEN valid resolution evidence is uploaded, THE System SHALL create an evidence record with Issue ID, uploaded by user ID, evidence type RESOLUTION_PHOTO, file URL, description, and upload timestamp
5. WHEN resolution evidence is uploaded, THE System SHALL update the Issue status to RESOLUTION_SUBMITTED

### Requirement 8: Citizen Verification of Resolution

**User Story:** As a Citizen, I want to verify whether an Officer has properly resolved an issue, so that the system can detect poor quality work and prevent abuse.

#### Acceptance Criteria

1. WHEN a Citizen submits verification for an Issue, THE System SHALL validate that the Issue status is UNDER_VERIFICATION
2. WHEN a Citizen submits verification, THE System SHALL validate that the Citizen has either reported or supported the Issue
3. WHEN a Citizen submits verification, THE System SHALL validate that the Citizen has not already verified that Issue
4. WHEN a Citizen submits valid verification, THE System SHALL create a verification record with Issue ID, Citizen ID, verification result (APPROVED or REJECTED), comment, and timestamp
5. WHEN a verification record is created and the total verification count is greater than or equal to 1, THE System SHALL calculate the approval rate as the ratio of APPROVED verifications to total verifications
6. WHEN the approval rate is greater than or equal to 0.60, THE System SHALL update the Issue status to RESOLVED and create a status history record
7. WHEN the approval rate is less than 0.60 and minimum verifications are met, THE System SHALL update the Issue status to REOPENED and create a status history record
8. IF a Citizen who did not report or support an Issue attempts to verify it, THEN THE System SHALL reject the verification and return an error message
9. IF a Citizen attempts to verify an Issue twice, THEN THE System SHALL reject the verification and return an error message

### Requirement 9: Authorization and Access Control

**User Story:** As a system administrator, I want role-based access control enforced, so that users can only access features appropriate to their role.

#### Acceptance Criteria

1. THE System SHALL allow unauthenticated access to authentication endpoints and nearby issue queries
2. THE System SHALL require a valid JWT_Token for all other API endpoints
3. WHEN a request includes a JWT_Token, THE System SHALL validate the token signature and expiration
4. THE System SHALL allow Citizens to create issue reports, view issues, support issues, and verify resolutions
5. THE System SHALL allow Officers to view issues, update issue status, upload resolution evidence, and assign issues
6. THE System SHALL allow Admins to perform all Officer actions plus manage departments and view analytics
7. IF an authenticated user attempts to access an endpoint not authorized for their role, THEN THE System SHALL reject the request with a 403 Forbidden status

### Requirement 10: Department Management

**User Story:** As an Admin, I want to manage departments, so that issues can be routed to the appropriate municipal department.

#### Acceptance Criteria

1. WHEN an Admin creates a department with name, contact email, and contact phone, THE System SHALL validate the input data
2. WHEN an Admin creates a valid department, THE System SHALL store the department record and return the department ID
3. WHEN an Admin queries all departments, THE System SHALL return department ID, name, contact email, contact phone, head officer ID, and active status
4. WHEN an Issue is created, THE System SHALL associate it with a department based on the category-to-department mapping

### Requirement 11: Data Persistence and Schema

**User Story:** As a developer, I want the database schema to support geospatial queries and maintain referential integrity, so that the system is reliable and performant.

#### Acceptance Criteria

1. THE System SHALL use PostgreSQL version 15 or higher with the PostGIS extension enabled
2. THE System SHALL store Issue locations as GEOGRAPHY(Point, 4326) type
3. THE System SHALL create a GIST spatial index on the Issue location field
4. THE System SHALL create indexes on Issue status, category ID, and department ID fields
5. THE System SHALL enforce foreign key constraints between IssueReport and Issue, IssueReport and User, Issue and IssueCategory, Issue and Department, Issue and Ward, and Issue and assigned Officer
6. THE System SHALL use database-level ENUM types for Issue status and severity fields
7. THE System SHALL use Flyway for database schema versioning and migrations

### Requirement 12: File Storage

**User Story:** As a system operator, I want uploaded photos stored securely, so that evidence is preserved and accessible.

#### Acceptance Criteria

1. WHEN storing an uploaded photo, THE System SHALL generate a unique filename using UUID concatenated with the original file extension
2. WHEN storing an uploaded photo, THE System SHALL organize files in a date-based directory structure: uploads/YYYY/MM/DD/
3. WHEN storing an uploaded photo, THE System SHALL store the relative file path in the database
4. WHEN serving uploaded photos, THE System SHALL validate that the requesting user has appropriate authorization
5. THE System SHALL reject file uploads with extensions other than jpg, jpeg, png, or heic
6. THE System SHALL reject file uploads larger than 5 MB

### Requirement 13: API Response Format

**User Story:** As a frontend developer, I want consistent API response formats, so that I can reliably integrate with the backend.

#### Acceptance Criteria

1. WHEN an API operation succeeds, THE System SHALL return HTTP status 200 OK for queries and updates, or 201 Created for resource creation
2. WHEN an API operation fails due to invalid input, THE System SHALL return HTTP status 400 Bad Request with an error message
3. WHEN an API operation fails due to unauthorized access, THE System SHALL return HTTP status 401 Unauthorized
4. WHEN an API operation fails due to insufficient permissions, THE System SHALL return HTTP status 403 Forbidden
5. WHEN an API operation fails due to a missing resource, THE System SHALL return HTTP status 404 Not Found with an error message
6. WHEN an API operation fails due to a server error, THE System SHALL return HTTP status 500 Internal Server Error
7. THE System SHALL return all timestamps in ISO 8601 format with timezone
8. THE System SHALL return coordinates as decimal latitude and longitude with precision of 8 and 11 digits respectively

### Requirement 14: Issue Detail Retrieval

**User Story:** As a user, I want to view complete details of an issue including all reports and status history, so that I can understand the full context.

#### Acceptance Criteria

1. WHEN a user requests issue details by Issue ID, THE System SHALL return the Issue record with category, description, location, address, ward, status, severity, report count, support count, assigned officer, created timestamp, and updated timestamp
2. WHEN a user requests issue details, THE System SHALL include all associated IssueReport records with report ID, reported by user name, description, photo URL, is primary flag, and created timestamp
3. WHEN a user requests issue details, THE System SHALL include all status history records with from status, to status, changed by user name, comment, and timestamp ordered by timestamp descending
4. WHEN a user requests issue details, THE System SHALL include department information with department ID and name

### Requirement 15: Parser and Serializer for Geospatial Data

**User Story:** As a developer, I want to parse and serialize geospatial data correctly, so that location information is accurately stored and retrieved.

#### Acceptance Criteria

1. WHEN the System receives latitude and longitude in a request, THE System SHALL parse the values as decimal numbers
2. WHEN the System stores a location in the database, THE System SHALL create a PostGIS Point geometry using ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
3. WHEN the System retrieves a location from the database, THE System SHALL extract latitude and longitude values from the PostGIS Point geometry
4. FOR ALL valid Issue objects with location data, storing then retrieving the location SHALL produce latitude and longitude values equal to the original values within floating-point precision tolerance
5. WHEN parsing location data fails due to invalid coordinates, THE System SHALL return a descriptive error message indicating the validation failure
