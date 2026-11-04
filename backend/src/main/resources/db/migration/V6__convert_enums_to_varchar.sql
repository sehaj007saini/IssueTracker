-- Convert user_role enum to varchar for better Hibernate compatibility
ALTER TABLE users ALTER COLUMN role TYPE varchar(20) USING role::text;

-- Convert other enums to varchar as well
ALTER TABLE issues ALTER COLUMN status TYPE varchar(50) USING status::text;
ALTER TABLE issues ALTER COLUMN severity TYPE varchar(20) USING severity::text;
ALTER TABLE issue_reports ALTER COLUMN status TYPE varchar(20) USING status::text;
ALTER TABLE citizen_verifications ALTER COLUMN verification_result TYPE varchar(20) USING verification_result::text;
ALTER TABLE issue_evidence ALTER COLUMN evidence_type TYPE varchar(30) USING evidence_type::text;

-- Drop the enum types (optional, but clean)
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS issue_status CASCADE;
DROP TYPE IF EXISTS severity CASCADE;
DROP TYPE IF EXISTS report_status CASCADE;
DROP TYPE IF EXISTS verification_result CASCADE;
DROP TYPE IF EXISTS evidence_type CASCADE;
