-- Create table for student submissions on assignments and CIAs
-- This allows students to submit their work and receive feedback

CREATE TABLE IF NOT EXISTS assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID NOT NULL REFERENCES classroom_materials(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    student_name TEXT,
    google_drive_file_id TEXT,
    google_drive_link TEXT,
    submission_text TEXT,
    file_name TEXT,
    file_size_bytes BIGINT,
    mime_type TEXT,
    status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'returned')),
    grade TEXT,
    feedback TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    graded_at TIMESTAMPTZ,
    graded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(material_id, student_id)
);

-- Create table for comments on materials
CREATE TABLE IF NOT EXISTS material_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID NOT NULL REFERENCES classroom_materials(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_submissions_material ON assignment_submissions(material_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON assignment_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_comments_material ON material_comments(material_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON material_comments(user_id);

-- Enable RLS
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for submissions
CREATE POLICY "Users can view all submissions"
    ON assignment_submissions FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Students can create their own submissions"
    ON assignment_submissions FOR INSERT
    WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own submissions"
    ON assignment_submissions FOR UPDATE
    USING (auth.uid() = student_id);

-- RLS Policies for comments
CREATE POLICY "Users can view all comments"
    ON material_comments FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create comments"
    ON material_comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
    ON material_comments FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
    ON material_comments FOR DELETE
    USING (auth.uid() = user_id);

-- Add comments
COMMENT ON TABLE assignment_submissions IS 'Student submissions for assignments and CIAs';
COMMENT ON TABLE material_comments IS 'Comments on classroom materials';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Submission and comment tables created successfully!';
END $$;
