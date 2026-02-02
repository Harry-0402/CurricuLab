-- Add 'other_resources' type to vault_resources table
-- This migration adds a new resource type option to the Knowledge Vault

-- Update the type constraint to include 'other_resources'
ALTER TABLE vault_resources 
DROP CONSTRAINT IF EXISTS vault_resources_type_check;

ALTER TABLE vault_resources 
ADD CONSTRAINT vault_resources_type_check 
CHECK (type IN ('study_note', 'case_study', 'project', 'other_resources'));

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Added "other_resources" type to vault_resources!';
    RAISE NOTICE '   - New type available: Other Resources';
    RAISE NOTICE '   - Use this for miscellaneous educational links';
END $$;
