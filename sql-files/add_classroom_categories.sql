-- ================================================================
-- Update Classroom Materials Table - Add Category Field
-- ================================================================
-- This script adds a material_category field to categorize uploads

-- Add category column to existing table
ALTER TABLE public.classroom_materials 
ADD COLUMN IF NOT EXISTS material_category text DEFAULT 'other' 
CHECK (material_category IN ('study_notes', 'assignments', 'announcements', 'cia', 'other'));

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_classroom_materials_category 
ON public.classroom_materials(material_category);

-- Add comment for documentation
COMMENT ON COLUMN public.classroom_materials.material_category IS 'Category: study_notes, assignments, announcements, cia, or other';

-- Success message
DO $$ 
BEGIN
    RAISE NOTICE 'Material category field added successfully!';
END $$;
