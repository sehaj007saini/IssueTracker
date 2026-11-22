-- Add reputation and fraud prevention fields to users table

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS reputation_score INTEGER DEFAULT 50,
ADD COLUMN IF NOT EXISTS total_reports INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS verified_reports INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rejected_reports INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS spam_flags INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_report_time TIMESTAMP;

-- Update existing users with default values
UPDATE users 
SET 
    reputation_score = 50,
    total_reports = 0,
    verified_reports = 0,
    rejected_reports = 0,
    spam_flags = 0
WHERE reputation_score IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN users.reputation_score IS 'User reputation score (0-100), affects validation thresholds';
COMMENT ON COLUMN users.total_reports IS 'Total number of issue reports submitted by user';
COMMENT ON COLUMN users.verified_reports IS 'Number of reports that were verified/resolved';
COMMENT ON COLUMN users.rejected_reports IS 'Number of reports that were rejected';
COMMENT ON COLUMN users.spam_flags IS 'Number of spam flags received by user';
COMMENT ON COLUMN users.last_report_time IS 'Timestamp of last report submission for rate limiting';
