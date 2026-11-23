-- V11: Ensure issue_status_history has all required columns
-- This migration is idempotent and safe to run multiple times

-- First, check if columns exist and add them if they don't
DO $$ 
BEGIN
    -- Add from_status if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'issue_status_history' 
        AND column_name = 'from_status'
    ) THEN
        ALTER TABLE issue_status_history 
        ADD COLUMN from_status VARCHAR(50);
        
        RAISE NOTICE 'Added from_status column';
    END IF;
    
    -- Add to_status if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'issue_status_history' 
        AND column_name = 'to_status'
    ) THEN
        ALTER TABLE issue_status_history 
        ADD COLUMN to_status VARCHAR(50);
        
        -- Set default value for existing rows
        UPDATE issue_status_history 
        SET to_status = 'OPEN' 
        WHERE to_status IS NULL;
        
        -- Now make it NOT NULL
        ALTER TABLE issue_status_history 
        ALTER COLUMN to_status SET NOT NULL;
        
        RAISE NOTICE 'Added to_status column';
    END IF;
END $$;

-- Add comments for documentation
COMMENT ON COLUMN issue_status_history.from_status IS 'Previous status of the issue (can be NULL for initial status)';
COMMENT ON COLUMN issue_status_history.to_status IS 'New status of the issue after change';
