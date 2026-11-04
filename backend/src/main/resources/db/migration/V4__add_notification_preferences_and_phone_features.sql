-- V4: Add notification preferences and SMS/WhatsApp features

-- Create notification_preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    phone_verified BOOLEAN DEFAULT FALSE,
    sms_enabled BOOLEAN DEFAULT FALSE,
    whatsapp_enabled BOOLEAN DEFAULT FALSE,
    email_enabled BOOLEAN DEFAULT TRUE,
    web_push_enabled BOOLEAN DEFAULT TRUE,
    notify_issue_created BOOLEAN DEFAULT TRUE,
    notify_issue_updated BOOLEAN DEFAULT TRUE,
    notify_issue_resolved BOOLEAN DEFAULT TRUE,
    notify_issue_assigned BOOLEAN DEFAULT TRUE,
    notify_comment_added BOOLEAN DEFAULT TRUE,
    notify_critical_alerts BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_pref_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index on user_id for faster lookups
CREATE INDEX idx_notification_pref_user_id ON notification_preferences(user_id);

-- Create index on phone_number for phone-based operations
CREATE INDEX idx_notification_pref_phone ON notification_preferences(phone_number);

-- Add phone_number column to users table if not exists (for OTP login)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'phone_number') THEN
        ALTER TABLE users ADD COLUMN phone_number VARCHAR(20) UNIQUE;
        CREATE INDEX idx_users_phone_number ON users(phone_number);
    END IF;
END $$;

-- Insert default preferences for existing users
INSERT INTO notification_preferences (user_id, email_enabled, web_push_enabled)
SELECT id, TRUE, TRUE
FROM users
WHERE id NOT IN (SELECT user_id FROM notification_preferences);

-- Add ISSUE_URGENT notification type if using enum (for critical alerts)
-- Note: Since we're using TEXT type, no need to alter enum
COMMENT ON COLUMN notifications.type IS 'Notification types: ISSUE_CREATED, ISSUE_UPDATED, ISSUE_ASSIGNED, ISSUE_RESOLVED, ISSUE_REOPENED, COMMENT_ADDED, VERIFICATION_REQUEST, VERIFICATION_APPROVED, VERIFICATION_REJECTED, ANNOUNCEMENT, ISSUE_URGENT';
