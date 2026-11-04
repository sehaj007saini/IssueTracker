-- Create notification type enum
CREATE TYPE notification_type AS ENUM (
    'ISSUE_CREATED',
    'ISSUE_UPDATED',
    'ISSUE_ASSIGNED',
    'ISSUE_STATUS_CHANGED',
    'ISSUE_RESOLVED',
    'ISSUE_REOPENED',
    'ISSUE_COMMENT',
    'VERIFICATION_REQUESTED',
    'VERIFICATION_COMPLETED',
    'SYSTEM_ANNOUNCEMENT'
);

-- Notifications table
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    issue_id BIGINT REFERENCES issues(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_issue ON notifications(issue_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Issue comments table
CREATE TABLE issue_comments (
    id BIGSERIAL PRIMARY KEY,
    issue_id BIGINT NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id),
    comment TEXT NOT NULL,
    parent_id BIGINT REFERENCES issue_comments(id) ON DELETE CASCADE,
    is_edited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_issue_comments_issue ON issue_comments(issue_id);
CREATE INDEX idx_issue_comments_user ON issue_comments(user_id);
CREATE INDEX idx_issue_comments_parent ON issue_comments(parent_id);
CREATE INDEX idx_issue_comments_created_at ON issue_comments(created_at);
