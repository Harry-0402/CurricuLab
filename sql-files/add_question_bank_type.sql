-- Add 'question_bank' type to vault_resources table
-- This migration adds question bank as a new resource type to Knowledge Vault

-- Update the type constraint to include 'question_bank'
ALTER TABLE vault_resources 
DROP CONSTRAINT IF EXISTS vault_resources_type_check;

ALTER TABLE vault_resources 
ADD CONSTRAINT vault_resources_type_check 
CHECK (type IN ('study_note', 'question_bank', 'case_study', 'project', 'other_resources'));

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Added "question_bank" type to vault_resources!';
    RAISE NOTICE '   - New type available: Question Bank';
    RAISE NOTICE '   - Use this for question bank resources with Google Drive links';
END $$;
