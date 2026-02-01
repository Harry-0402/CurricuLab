-- Migration: Add link column to vault_resources for URL-based resources
-- Date: 2026-02-01
-- Description: Adds link column, removes content columns, and migrates any 'html' type resources to 'study_note'

-- Step 1: Add link column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vault_resources' 
        AND column_name = 'link'
    ) THEN
        ALTER TABLE vault_resources ADD COLUMN link TEXT;
        RAISE NOTICE 'Added link column to vault_resources';
    ELSE
        RAISE NOTICE 'Link column already exists';
    END IF;
END $$;

-- Step 2: Drop the old type constraint if it exists
ALTER TABLE vault_resources DROP CONSTRAINT IF EXISTS vault_resources_type_check;

-- Step 3: Migrate any existing 'html' type resources to 'study_note'
-- (This won't affect resources if you don't have any 'html' type)
UPDATE vault_resources 
SET type = 'study_note' 
WHERE type = 'html';

-- Step 4: Add the new type constraint (only 3 valid types)
ALTER TABLE vault_resources 
ADD CONSTRAINT vault_resources_type_check 
CHECK (type IN ('study_note', 'case_study', 'project'));

-- Step 5: Drop unused columns (content, formatted_content, and part_number)
-- Since all resources are now URL-based and part numbers are no longer needed
ALTER TABLE vault_resources DROP COLUMN IF EXISTS content;
ALTER TABLE vault_resources DROP COLUMN IF EXISTS formatted_content;
ALTER TABLE vault_resources DROP COLUMN IF EXISTS part_number;

-- Step 6: Create index on link column for faster queries
CREATE INDEX IF NOT EXISTS idx_vault_resources_link ON vault_resources(link);

-- Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'vault_resources'
ORDER BY ordinal_position;
