-- Fix all missing columns after enum to varchar conversion
-- This migration ensures all entity columns exist in the database

-- Fix issue_status_history table (columns might have been dropped during enum conversion)
ALTER TABLE issue_status_history 
ADD COLUMN IF NOT EXISTS from_status VARCHAR(50);

ALTER TABLE issue_status_history 
ALTER COLUMN to_status TYPE VARCHAR(50) USING to_status::text;

-- Ensure all other tables have correct varchar columns after enum conversion
-- (Most were handled by V6, but we're being defensive here)

-- Verify users.role is varchar
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'role'
    ) THEN
        ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'CITIZEN';
    END IF;
END $$;

-- Verify issues.status is varchar  
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'issues' AND column_name = 'status'
    ) THEN
        ALTER TABLE issues ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'OPEN';
    END IF;
END $$;

-- Verify issues.severity is varchar
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'issues' AND column_name = 'severity'
    ) THEN
        ALTER TABLE issues ADD COLUMN severity VARCHAR(20) NOT NULL DEFAULT 'MEDIUM';
    END IF;
END $$;

-- Verify issue_reports.status is varchar
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'issue_reports' AND column_name = 'status'
    ) THEN
        ALTER TABLE issue_reports ADD COLUMN status VARCHAR(20) DEFAULT 'ACTIVE';
    END IF;
END $$;

-- Verify citizen_verifications.verification_result is varchar
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'citizen_verifications' AND column_name = 'verification_result'
    ) THEN
        ALTER TABLE citizen_verifications ADD COLUMN verification_result VARCHAR(20) NOT NULL;
    END IF;
END $$;

-- Verify issue_evidence.evidence_type is varchar
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'issue_evidence' AND column_name = 'evidence_type'
    ) THEN
        ALTER TABLE issue_evidence ADD COLUMN evidence_type VARCHAR(30) NOT NULL;
    END IF;
END $$;

-- Add comments for documentation
COMMENT ON COLUMN issue_status_history.from_status IS 'Previous status of the issue';
COMMENT ON COLUMN issue_status_history.to_status IS 'New status of the issue after change';
