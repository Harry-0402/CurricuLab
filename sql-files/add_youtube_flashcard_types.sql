-- Add 'youtube_video' and 'flashcard' types to vault_resources table
-- This migration adds new resource type options to the Knowledge Vault

-- Update the type constraint to include 'youtube_video' and 'flashcard'
ALTER TABLE vault_resources 
DROP CONSTRAINT IF EXISTS vault_resources_type_check;

ALTER TABLE vault_resources 
ADD CONSTRAINT vault_resources_type_check 
CHECK (type IN ('study_note', 'question_bank', 'case_study', 'project', 'revision_note', 'other_resources', 'youtube_video', 'flashcard'));

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Added "youtube_video" and "flashcard" types to vault_resources!';
END $$;
