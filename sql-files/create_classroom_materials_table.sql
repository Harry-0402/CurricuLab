-- ================================================================
-- Create Classroom Materials Table
-- ================================================================
-- This table stores teacher-uploaded study materials with Google Drive integration

-- First, drop the table if it exists (for clean recreation)
DROP TABLE IF EXISTS public.classroom_materials CASCADE;

-- Create the classroom_materials table
CREATE TABLE public.classroom_materials (
    id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
    subject_id text NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    unit_id text REFERENCES public.units(id) ON DELETE SET NULL,
    title text NOT NULL,
    description text,
    google_drive_file_id text NOT NULL, -- Google Drive file ID
    google_drive_link text NOT NULL, -- Shareable link to the file
    file_name text, -- Original filename
    file_type text DEFAULT 'other' CHECK (file_type IN ('pdf', 'doc', 'ppt', 'video', 'image', 'other')),
    file_size_bytes bigint, -- File size in bytes
    mime_type text, -- MIME type from Google Drive
    uploaded_by text, -- User ID who uploaded it
    uploader_name text, -- Name of uploader for display
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_classroom_materials_subject ON public.classroom_materials(subject_id);
CREATE INDEX idx_classroom_materials_unit ON public.classroom_materials(unit_id);
CREATE INDEX idx_classroom_materials_file_type ON public.classroom_materials(file_type);
CREATE INDEX idx_classroom_materials_active ON public.classroom_materials(is_active);
CREATE INDEX idx_classroom_materials_created ON public.classroom_materials(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.classroom_materials ENABLE ROW LEVEL SECURITY;

-- Policy: Allow everyone to read active materials
CREATE POLICY "Allow public read access to active materials"
    ON public.classroom_materials
    FOR SELECT
    USING (is_active = true);

-- Policy: Allow authenticated users to insert (can be restricted later)
CREATE POLICY "Allow authenticated users to insert materials"
    ON public.classroom_materials
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Policy: Allow users to update their own materials
CREATE POLICY "Allow users to update own materials"
    ON public.classroom_materials
    FOR UPDATE
    USING (auth.uid()::text = uploaded_by)
    WITH CHECK (auth.uid()::text = uploaded_by);

-- Policy: Allow users to delete their own materials (soft delete via is_active)
CREATE POLICY "Allow users to delete own materials"
    ON public.classroom_materials
    FOR DELETE
    USING (auth.uid()::text = uploaded_by);

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_classroom_materials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER classroom_materials_updated_at
    BEFORE UPDATE ON public.classroom_materials
    FOR EACH ROW
    EXECUTE FUNCTION update_classroom_materials_updated_at();

-- Add comments for documentation
COMMENT ON TABLE public.classroom_materials IS 'Stores teacher-uploaded study materials with Google Drive integration';
COMMENT ON COLUMN public.classroom_materials.google_drive_file_id IS 'Google Drive file ID for API operations';
COMMENT ON COLUMN public.classroom_materials.google_drive_link IS 'Public shareable link to view/download the file';
COMMENT ON COLUMN public.classroom_materials.is_active IS 'Soft delete flag - false means deleted';

-- Success message
DO $$ 
BEGIN
    RAISE NOTICE 'Classroom materials table created successfully!';
END $$;
