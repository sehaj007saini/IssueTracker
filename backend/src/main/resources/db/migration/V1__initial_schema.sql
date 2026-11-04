-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create enum types
CREATE TYPE user_role AS ENUM ('CITIZEN', 'OFFICER', 'ADMIN');
CREATE TYPE issue_status AS ENUM ('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLUTION_SUBMITTED', 'UNDER_VERIFICATION', 'RESOLVED', 'REOPENED');
CREATE TYPE severity AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE report_status AS ENUM ('ACTIVE', 'MERGED', 'SPAM');
CREATE TYPE verification_result AS ENUM ('APPROVED', 'REJECTED');
CREATE TYPE evidence_type AS ENUM ('REPORT_PHOTO', 'RESOLUTION_PHOTO', 'PROGRESS_PHOTO');

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role user_role NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Departments table
CREATE TABLE departments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    head_officer_id BIGINT REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wards table
CREATE TABLE wards (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    zone VARCHAR(100),
    boundary GEOGRAPHY(Polygon, 4326),
    population INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_wards_boundary ON wards USING GIST(boundary);

-- Issue categories table
CREATE TABLE issue_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    severity_default severity DEFAULT 'MEDIUM',
    department_id BIGINT REFERENCES departments(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Issues table (the actual physical problem)
CREATE TABLE issues (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES issue_categories(id),
    location GEOGRAPHY(Point, 4326) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address VARCHAR(500),
    ward_id BIGINT REFERENCES wards(id),
    department_id BIGINT REFERENCES departments(id),
    status issue_status NOT NULL DEFAULT 'OPEN',
    severity severity NOT NULL DEFAULT 'MEDIUM',
    report_count INTEGER DEFAULT 0,
    support_count INTEGER DEFAULT 0,
    description_summary TEXT,
    assigned_officer_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Spatial index for efficient nearby queries
CREATE INDEX idx_issues_location ON issues USING GIST(location);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_category ON issues(category_id);
CREATE INDEX idx_issues_department ON issues(department_id);
CREATE INDEX idx_issues_ward ON issues(ward_id);
CREATE INDEX idx_issues_created_at ON issues(created_at);

-- Issue reports table (individual citizen reports)
CREATE TABLE issue_reports (
    id BIGSERIAL PRIMARY KEY,
    issue_id BIGINT NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    reporter_id BIGINT NOT NULL REFERENCES users(id),
    description TEXT NOT NULL,
    photo_url VARCHAR(500),
    is_primary BOOLEAN DEFAULT FALSE,
    similarity_score DECIMAL(5, 4),
    status report_status DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_issue_reports_issue ON issue_reports(issue_id);
CREATE INDEX idx_issue_reports_reporter ON issue_reports(reporter_id);
CREATE INDEX idx_issue_reports_created_at ON issue_reports(created_at);

-- Issue support (citizens supporting existing issues)
CREATE TABLE issue_supports (
    id BIGSERIAL PRIMARY KEY,
    issue_id BIGINT NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    citizen_id BIGINT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(issue_id, citizen_id)
);

CREATE INDEX idx_issue_supports_issue ON issue_supports(issue_id);
CREATE INDEX idx_issue_supports_citizen ON issue_supports(citizen_id);

-- Issue assignments table
CREATE TABLE issue_assignments (
    id BIGSERIAL PRIMARY KEY,
    issue_id BIGINT NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    officer_id BIGINT NOT NULL REFERENCES users(id),
    assigned_by BIGINT NOT NULL REFERENCES users(id),
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'PENDING',
    notes TEXT
);

CREATE INDEX idx_issue_assignments_issue ON issue_assignments(issue_id);
CREATE INDEX idx_issue_assignments_officer ON issue_assignments(officer_id);

-- Issue status history
CREATE TABLE issue_status_history (
    id BIGSERIAL PRIMARY KEY,
    issue_id BIGINT NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    from_status issue_status,
    to_status issue_status NOT NULL,
    changed_by BIGINT NOT NULL REFERENCES users(id),
    comment TEXT,
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_issue_status_history_issue ON issue_status_history(issue_id);
CREATE INDEX idx_issue_status_history_changed_at ON issue_status_history(changed_at);

-- Issue evidence (photos, documents)
CREATE TABLE issue_evidence (
    id BIGSERIAL PRIMARY KEY,
    issue_id BIGINT NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    uploaded_by BIGINT NOT NULL REFERENCES users(id),
    evidence_type evidence_type NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    description TEXT,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_issue_evidence_issue ON issue_evidence(issue_id);
CREATE INDEX idx_issue_evidence_type ON issue_evidence(evidence_type);

-- Citizen verification
CREATE TABLE citizen_verifications (
    id BIGSERIAL PRIMARY KEY,
    issue_id BIGINT NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    citizen_id BIGINT NOT NULL REFERENCES users(id),
    verification_result verification_result NOT NULL,
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(issue_id, citizen_id)
);

CREATE INDEX idx_citizen_verifications_issue ON citizen_verifications(issue_id);
CREATE INDEX idx_citizen_verifications_citizen ON citizen_verifications(citizen_id);

-- Citizen profiles (additional info)
CREATE TABLE citizen_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address TEXT,
    ward_id BIGINT REFERENCES wards(id),
    verified BOOLEAN DEFAULT FALSE,
    verification_document_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_citizen_profiles_user ON citizen_profiles(user_id);
CREATE INDEX idx_citizen_profiles_ward ON citizen_profiles(ward_id);
