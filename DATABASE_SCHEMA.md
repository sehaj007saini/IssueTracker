# Database Schema - Disaster Management System

## Database: Disaster_Management
**Type:** PostgreSQL 16.4 with PostGIS 3.4  
**Schema:** public

---

## 📊 Core Tables

### 1. **users** - User Authentication & Profiles
Stores all user accounts (citizens, officers, admins)

**Columns:**
- `id` (BIGSERIAL PRIMARY KEY) - Unique user ID
- `email` (VARCHAR, UNIQUE) - User email address
- `password_hash` (VARCHAR) - BCrypt hashed password
- `name` (VARCHAR) - Full name
- `phone` (VARCHAR) - Phone number (optional)
- `role` (VARCHAR) - User role: CITIZEN, OFFICER, ADMIN
- `is_active` (BOOLEAN) - Account status
- `created_at` (TIMESTAMP) - Account creation date
- `updated_at` (TIMESTAMP) - Last update date

**Current Data:** 4 users (1 admin, 1 officer, 2 citizens)

---

### 2. **departments** - Government Departments
Stores municipal departments responsible for different issues

**Columns:**
- `id` (BIGSERIAL PRIMARY KEY) - Department ID
- `name` (VARCHAR) - Department name
- `description` (TEXT) - Department description
- `contact_email` (VARCHAR) - Contact email
- `contact_phone` (VARCHAR) - Contact phone
- `head_officer_id` (BIGINT FK → users.id) - Department head
- `is_active` (BOOLEAN) - Department status
- `created_at` (TIMESTAMP) - Creation date
- `updated_at` (TIMESTAMP) - Last update

**Current Data:** 5 departments
- Water Supply
- Waste Management
- Street Lighting
- Drainage
- Road Infrastructure

---

### 3. **wards** - Geographic Wards/Zones
Stores administrative ward boundaries and information

**Columns:**
- `id` (BIGSERIAL PRIMARY KEY) - Ward ID
- `name` (VARCHAR) - Ward name
- `zone` (VARCHAR) - Zone name
- `boundary` (GEOGRAPHY Polygon) - PostGIS polygon boundary
- `population` (INTEGER) - Population count
- `is_active` (BOOLEAN) - Ward status
- `created_at` (TIMESTAMP) - Creation date

**Purpose:** Geographical organization of the city

---

### 4. **issue_categories** - Issue Type Classifications
Defines types of civic issues (potholes, garbage, etc.)

**Columns:**
- `id` (BIGSERIAL PRIMARY KEY) - Category ID
- `name` (VARCHAR) - Category name
- `description` (TEXT) - Category description
- `severity_default` (VARCHAR) - Default severity: LOW, MEDIUM, HIGH, CRITICAL
- `department_id` (BIGINT FK → departments.id) - Responsible department
- `is_active` (BOOLEAN) - Category status
- `created_at` (TIMESTAMP) - Creation date

**Current Data:** 5 categories
- Pothole (HIGH)
- Garbage Accumulation (MEDIUM)
- Broken Streetlight (MEDIUM)
- Drainage Blockage (HIGH)
- Water Leakage (HIGH)

---

## 🚨 Issue Management Tables

### 5. **issues** - Main Issues (Physical Problems)
Central table storing actual physical problems reported

**Columns:**
- `id` (BIGSERIAL PRIMARY KEY) - Issue ID
- `category_id` (BIGINT FK → issue_categories.id) - Issue category
- `location` (GEOGRAPHY Point) - PostGIS GPS coordinates
- `latitude` (DECIMAL) - Latitude coordinate
- `longitude` (DECIMAL) - Longitude coordinate
- `address` (VARCHAR) - Human-readable address
- `ward_id` (BIGINT FK → wards.id) - Ward location
- `department_id` (BIGINT FK → departments.id) - Assigned department
- `status` (VARCHAR) - Current status: OPEN, ASSIGNED, IN_PROGRESS, RESOLVED, etc.
- `severity` (VARCHAR) - Issue severity
- `report_count` (INTEGER) - Number of reports for this issue
- `support_count` (INTEGER) - Number of users supporting
- `description_summary` (TEXT) - Combined description from reports
- `assigned_officer_id` (BIGINT FK → users.id) - Assigned officer
- `created_at` (TIMESTAMP) - Issue creation date
- `updated_at` (TIMESTAMP) - Last update
- `resolved_at` (TIMESTAMP) - Resolution date

**Purpose:** Represents the actual physical problem (e.g., one pothole at specific location)

---

### 6. **issue_reports** - Individual User Reports
Each citizen's report about an issue (many reports → one issue)

**Columns:**
- `id` (BIGSERIAL PRIMARY KEY) - Report ID
- `issue_id` (BIGINT FK → issues.id) - Related issue
- `reporter_id` (BIGINT FK → users.id) - User who reported
- `description` (TEXT) - Report description
- `status` (VARCHAR) - Report status: ACTIVE, MERGED, SPAM
- `created_at` (TIMESTAMP) - Report date

**Purpose:** Multiple citizens can report the same issue independently

---

### 7. **issue_evidence** - Photos/Evidence
Photos and evidence attached to issues

**Columns:**
- `id` (BIGSERIAL PRIMARY KEY) - Evidence ID
- `issue_id` (BIGINT FK → issues.id) - Related issue
- `user_id` (BIGINT FK → users.id) - User who uploaded
- `file_path` (VARCHAR) - File storage path
- `file_type` (VARCHAR) - File MIME type
- `evidence_type` (VARCHAR) - REPORT_PHOTO, RESOLUTION_PHOTO, PROGRESS_PHOTO
- `uploaded_at` (TIMESTAMP) - Upload date

**Purpose:** Store photos of problems and their resolution

---

### 8. **issue_comments** - Discussion Comments
Comments and discussions on issues

**Columns:**
- `id` (BIGSERIAL PRIMARY KEY) - Comment ID
- `issue_id` (BIGINT FK → issues.id) - Related issue
- `user_id` (BIGINT FK → users.id) - Comment author
- `comment_text` (TEXT) - Comment content
- `created_at` (TIMESTAMP) - Comment date

**Purpose:** Communication between citizens and officers

---

### 9. **issue_supports** - User Support/Votes
Citizens can support/upvote issues

**Columns:**
- `id` (BIGSERIAL PRIMARY KEY) - Support ID
- `issue_id` (BIGINT FK → issues.id) - Related issue
- `user_id` (BIGINT FK → users.id) - Supporting user
- `created_at` (TIMESTAMP) - Support date

**Purpose:** Show community concern about specific issues

---

### 10. **issue_status_history** - Status Change Tracking
Audit trail of all status changes

**Columns:**
- `id` (BIGSERIAL PRIMARY KEY) - History ID
- `issue_id` (BIGINT FK → issues.id) - Related issue
- `changed_by_id` (BIGINT FK → users.id) - User who changed status
- `old_status` (VARCHAR) - Previous status
- `new_status` (VARCHAR) - New status
- `notes` (TEXT) - Change notes/reason
- `changed_at` (TIMESTAMP) - Change date

**Purpose:** Track complete history of issue resolution

---

### 11. **issue_assignments** - Officer Assignments
Track which officer is assigned to which issue

**Columns:**
- `id` (BIGSERIAL PRIMARY KEY) - Assignment ID
- `issue_id` (BIGINT FK → issues.id) - Related issue
- `officer_id` (BIGINT FK → users.id) - Assigned officer
- `assigned_by_id` (BIGINT FK → users.id) - Who assigned
- `assigned_at` (TIMESTAMP) - Assignment date
- `completed_at` (TIMESTAMP) - Completion date
- `is_active` (BOOLEAN) - Assignment status

**Purpose:** Manage officer workload and accountability

---

## 🔔 Notification Tables

### 12. **notifications** - User Notifications
All notifications sent to users

**Columns:**
- `id` (BIGSERIAL PRIMARY KEY) - Notification ID
- `user_id` (BIGINT FK → users.id) - Recipient user
- `notification_type` (VARCHAR) - Type: ISSUE_UPDATE, COMMENT_ADDED, etc.
- `title` (VARCHAR) - Notification title
- `message` (TEXT) - Notification message
- `related_issue_id` (BIGINT FK → issues.id) - Related issue
- `is_read` (BOOLEAN) - Read status
- `created_at` (TIMESTAMP) - Notification date

**Purpose:** Real-time notifications via WebSocket

---

### 13. **notification_preferences** - User Notification Settings
User preferences for receiving notifications

**Columns:**
- `id` (BIGSERIAL PRIMARY KEY) - Preference ID
- `user_id` (BIGINT FK → users.id) - User
- `notification_type` (VARCHAR) - Type of notification
- `email_enabled` (BOOLEAN) - Send via email
- `push_enabled` (BOOLEAN) - Send push notification
- `sms_enabled` (BOOLEAN) - Send via SMS
- `whatsapp_enabled` (BOOLEAN) - Send via WhatsApp

**Purpose:** User control over notification channels

---

## ✅ Verification Tables

### 14. **citizen_verifications** - Issue Verification
Citizens can verify if an issue still exists

**Columns:**
- `id` (BIGSERIAL PRIMARY KEY) - Verification ID
- `issue_id` (BIGINT FK → issues.id) - Verified issue
- `citizen_id` (BIGINT FK → users.id) - Verifying citizen
- `verification_result` (VARCHAR) - APPROVED, REJECTED
- `notes` (TEXT) - Verification notes
- `verified_at` (TIMESTAMP) - Verification date

**Purpose:** Community-driven issue validation

---

### 15. **citizen_profiles** - Extended Citizen Information
Additional information about citizens

**Columns:**
- `id` (BIGSERIAL PRIMARY KEY) - Profile ID
- `user_id` (BIGINT FK → users.id) - Related user
- `address` (TEXT) - Home address
- `ward_id` (BIGINT FK → wards.id) - Home ward
- `verification_level` (INTEGER) - Trust level: 0-5
- `reports_submitted` (INTEGER) - Total reports count
- `reports_verified` (INTEGER) - Verified reports count
- `is_verified` (BOOLEAN) - Profile verification status

**Purpose:** Build citizen reputation and trust

---

## 📱 OTP/SMS Tables

### 16. **otp_logs** - OTP Verification Logs
Track OTP generation and verification

**Columns:**
- `id` (BIGSERIAL PRIMARY KEY) - Log ID
- `phone_number` (VARCHAR) - Phone number
- `otp_code` (VARCHAR) - OTP code (hashed)
- `purpose` (VARCHAR) - LOGIN, VERIFICATION
- `is_verified` (BOOLEAN) - Verification status
- `attempts` (INTEGER) - Verification attempts
- `expires_at` (TIMESTAMP) - Expiration time
- `created_at` (TIMESTAMP) - Creation time

**Purpose:** SMS/WhatsApp OTP authentication

---

## 🗄️ System Tables

### 17. **flyway_schema_history** - Database Migrations
Tracks database schema version history

**Purpose:** Manage database migrations and versioning

### 18. **spatial_ref_sys** - PostGIS Spatial Reference Systems
PostGIS system table for coordinate systems

**Purpose:** Geographic coordinate system definitions

---

## 📊 Data Flow Example

**When a citizen reports an issue:**

1. **users** table - Verify user is authenticated
2. **issue_categories** - Determine issue category
3. **departments** - Auto-assign responsible department
4. **wards** - Determine ward from GPS coordinates
5. **issues** - Create new issue OR find existing nearby issue
6. **issue_reports** - Create user's individual report
7. **issue_evidence** - Store any uploaded photos
8. **notifications** - Notify nearby citizens and officers
9. **issue_status_history** - Record initial OPEN status

**When an officer updates:**

1. **users** - Verify officer credentials
2. **issues** - Update issue status
3. **issue_assignments** - Record assignment
4. **issue_status_history** - Log status change
5. **notifications** - Notify reporter and supporters
6. **issue_comments** - Add officer comment

---

## 🔍 Key Relationships

```
users (1) ─────── (many) issue_reports
users (1) ─────── (many) issues (as assigned_officer)
users (1) ─────── (many) notifications
users (1) ─────── (many) citizen_profiles

issues (1) ────── (many) issue_reports
issues (1) ────── (many) issue_evidence
issues (1) ────── (many) issue_comments
issues (1) ────── (many) issue_supports
issues (1) ────── (many) issue_status_history

departments (1) ── (many) issues
departments (1) ── (many) issue_categories

wards (1) ──────── (many) issues
wards (1) ──────── (many) citizen_profiles
```

---

## 📈 Current Database Statistics

- **Total Tables:** 18 (in public schema)
- **Users:** 4
- **Departments:** 5
- **Issue Categories:** 5
- **Issues:** 0 (ready for reporting)
- **Reports:** 0 (ready for reporting)
- **Database Size:** ~100 MB (fresh installation)

All data persists in Docker volume: `disaster-mgmt-postgres-data` on E:\Docker\wsl
