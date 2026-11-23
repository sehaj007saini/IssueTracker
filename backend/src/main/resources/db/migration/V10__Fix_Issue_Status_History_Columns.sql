-- Fix issue_status_history table - add missing columns that were dropped during enum conversion

ALTER TABLE issue_status_history 
ADD COLUMN IF NOT EXISTS from_status VARCHAR(50);

ALTER TABLE issue_status_history 
ADD COLUMN IF NOT EXISTS to_status VARCHAR(50) NOT NULL DEFAULT 'OPEN';

-- Remove the default after adding (only needed for existing rows)
ALTER TABLE issue_status_history 
ALTER COLUMN to_status DROP DEFAULT;

-- Add comments
COMMENT ON COLUMN issue_status_history.from_status IS 'Previous status of the issue';
COMMENT ON COLUMN issue_status_history.to_status IS 'New status of the issue after change';
