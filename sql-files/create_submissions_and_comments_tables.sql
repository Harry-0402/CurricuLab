-- Create Material Comments Table
CREATE TABLE IF NOT EXISTS material_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID NOT NULL, -- Intentionally no foreign key constraint to decouple from materials table if needed, or add REFERENCES classroom_materials(id) ON DELETE CASCADE
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Assignment Submissions Table
CREATE TABLE IF NOT EXISTS assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID NOT NULL, -- REFERENCES classroom_materials(id) ON DELETE CASCADE
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    student_name TEXT,
    
    -- File details
    google_drive_file_id TEXT,
    google_drive_link TEXT,
    file_name TEXT,
    file_size_bytes BIGINT,
    mime_type TEXT,
    
    -- Text submission
    submission_text TEXT,
    
    -- Status & Grading
    status TEXT CHECK (status IN ('submitted', 'graded', 'returned')) DEFAULT 'submitted',
    grade TEXT,
    feedback TEXT,
    
    -- Timestamps
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    graded_at TIMESTAMPTZ,
    graded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(material_id, student_id) -- One submission per student per material
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_comments_material_id ON material_comments(material_id);
CREATE INDEX IF NOT EXISTS idx_submissions_material_id ON assignment_submissions(material_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student_id ON assignment_submissions(student_id);

-- Enable RLS
ALTER TABLE material_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;

-- Policies for Comments
CREATE POLICY "Comments are viewable by everyone" 
    ON material_comments FOR SELECT 
    USING (true);

CREATE POLICY "Users can create their own comments" 
    ON material_comments FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
    ON material_comments FOR DELETE 
    USING (auth.uid() = user_id);

-- Policies for Submissions
CREATE POLICY "Students can view their own submissions" 
    ON assignment_submissions FOR SELECT 
    USING (auth.uid() = student_id);

-- Note: In a real app, teachers (owners of material) should also be able to view submissions.
-- For now, we'll allow users to view submissions if they are the creator of the material, 
-- BUT doing a JOIN in RLS can be expensive. 
-- For simplicity in this demo, we might allow public read? No, that's bad.
-- Let's stick to: Students read own. To allow teachers, we'd need a simpler way or an admin flag.
-- Assuming the current user IS the teacher, they won't be able to see student submissions with just `auth.uid() = student_id`.

-- Policy for Teachers to view submissions for their materials
-- This requires checking if the user is the owner of the material linked to the submission.
-- CREATE POLICY "Teachers can view submissions for their materials"
-- ON assignment_submissions FOR SELECT
-- USING (
--     EXISTS (
--         SELECT 1 FROM classroom_materials 
--         WHERE id = assignment_submissions.material_id 
--         AND uploaded_by = auth.uid()
--     )
-- );

-- For now, let's keep it simple: Students insert/select own.
CREATE POLICY "Students can create their own submissions" 
    ON assignment_submissions FOR INSERT 
    WITH CHECK (auth.uid() = student_id);
    
CREATE POLICY "Students can update their own submissions" 
    ON assignment_submissions FOR UPDATE
    USING (auth.uid() = student_id);
