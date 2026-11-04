-- Insert default departments
INSERT INTO departments (name, description, contact_email, contact_phone, is_active) VALUES
('Road Infrastructure', 'Handles road maintenance, potholes, and street repairs', 'roads@city.gov.in', '+91-80-12345001', true),
('Water Supply', 'Manages water supply and leakage issues', 'water@city.gov.in', '+91-80-12345002', true),
('Waste Management', 'Handles garbage collection and disposal', 'waste@city.gov.in', '+91-80-12345003', true),
('Street Lighting', 'Maintains street lights and electrical infrastructure', 'lights@city.gov.in', '+91-80-12345004', true),
('Drainage', 'Manages drainage systems and sewage', 'drainage@city.gov.in', '+91-80-12345005', true);

-- Insert default issue categories (MVP: Focus on Pothole only)
INSERT INTO issue_categories (name, description, severity_default, department_id, is_active) VALUES
('Pothole', 'Road surface damage causing hazardous driving conditions', 'HIGH', 1, true),
('Garbage Accumulation', 'Waste collection issues', 'MEDIUM', 3, false),
('Broken Streetlight', 'Non-functional street lighting', 'MEDIUM', 4, false),
('Drainage Blockage', 'Blocked or overflowing drains', 'HIGH', 5, false),
('Water Leakage', 'Water supply pipe leaks', 'HIGH', 2, false);

-- Note: Only 'Pothole' category is active for MVP
-- Others are disabled (is_active = false) and will be enabled in future versions

-- Insert sample wards (Bangalore example)
INSERT INTO wards (name, zone, population) VALUES
('Ward 1 - Shantinagar', 'East Zone', 45000),
('Ward 2 - Koramangala', 'South Zone', 52000),
('Ward 3 - Indiranagar', 'East Zone', 48000),
('Ward 4 - Jayanagar', 'South Zone', 61000),
('Ward 5 - Malleshwaram', 'West Zone', 43000),
('Ward 6 - Rajajinagar', 'West Zone', 47000),
('Ward 7 - Whitefield', 'East Zone', 68000),
('Ward 8 - Hebbal', 'North Zone', 39000);

-- Insert default admin user
-- Password: Admin@123 (BCrypt hashed)
INSERT INTO users (email, password_hash, name, phone, role, is_active) VALUES
('admin@localproblems.in', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY2lFfWQe1PQJme', 'System Admin', '+91-80-00000000', 'ADMIN', true);

-- Insert sample officer user
-- Password: Officer@123 (BCrypt hashed)
INSERT INTO users (email, password_hash, name, phone, role, is_active) VALUES
('officer.kumar@city.gov.in', '$2a$12$8nYqMr7L9F5R9VqD8XqVQOZ3QK5kY9fE3oP7R8vW5XqD8fE3oP7R8', 'Officer Kumar', '+91-80-11111111', 'OFFICER', true);

-- Update department head
UPDATE departments SET head_officer_id = 2 WHERE name = 'Road Infrastructure';

-- Note: Citizen users will be created through registration
