-- Add missing severity_default column to issue_categories table
-- This column was defined in the entity but not created in the database

ALTER TABLE issue_categories 
ADD COLUMN IF NOT EXISTS severity_default VARCHAR(20) DEFAULT 'MEDIUM';

-- Update existing rows with default value
UPDATE issue_categories 
SET severity_default = 'MEDIUM' 
WHERE severity_default IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN issue_categories.severity_default IS 'Default severity level for issues in this category';
