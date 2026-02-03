-- Add due_date field to classroom_materials table
-- This field is for storing deadlines for assignments and CIAs
-- Run this after add_text_content_field.sql

ALTER TABLE classroom_materials
ADD COLUMN IF NOT EXISTS due_date DATE;

-- Add comment for documentation
COMMENT ON COLUMN classroom_materials.due_date IS 'Due date for assignments and CIAs';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Due date field added successfully!';
END $$;
