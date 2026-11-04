-- V5: Add SMS/WhatsApp support and additional notification features

-- Add phone verification and SMS/WhatsApp enablement fields to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS sms_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS whatsapp_enabled BOOLEAN DEFAULT FALSE;

-- Add phone number index (if phone column exists but doesn't have index yet)
CREATE INDEX IF NOT EXISTS idx_users_phone 
    ON users(phone) WHERE phone IS NOT NULL;

-- Add channel column to notifications to track how it was sent
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS channel VARCHAR(20) DEFAULT 'push';
-- Possible values: 'push', 'sms', 'whatsapp', 'email'

-- Create OTP verification logs table (for auditing)
CREATE TABLE IF NOT EXISTS otp_logs (
    id BIGSERIAL PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL,
    otp_sent BOOLEAN DEFAULT TRUE,
    otp_verified BOOLEAN DEFAULT FALSE,
    channel VARCHAR(20) DEFAULT 'sms',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP,
    ip_address VARCHAR(45)
);

CREATE INDEX IF NOT EXISTS idx_otp_logs_phone 
    ON otp_logs(phone_number);
CREATE INDEX IF NOT EXISTS idx_otp_logs_created 
    ON otp_logs(created_at);

COMMENT ON TABLE otp_logs IS 'Audit log for OTP requests and verifications';
COMMENT ON COLUMN users.phone_verified IS 'Whether the phone number has been verified via OTP';
COMMENT ON COLUMN users.sms_enabled IS 'Whether user wants to receive SMS notifications';
COMMENT ON COLUMN users.whatsapp_enabled IS 'Whether user wants to receive WhatsApp notifications';
