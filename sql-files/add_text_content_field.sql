-- Add text_content field to classroom_materials table
-- This field is for storing rich text content for announcements and text-based materials
-- Run this after add_classroom_categories.sql

ALTER TABLE classroom_materials
ADD COLUMN IF NOT EXISTS text_content TEXT;

-- Add comment for documentation
COMMENT ON COLUMN classroom_materials.text_content IS 'Rich text content for announcements and text-based materials';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Text content field added successfully!';
END $$;
