-- Allow everyone to view all submissions
-- This is useful for peer review or open classroom settings

DROP POLICY IF EXISTS "Students can view their own submissions" ON assignment_submissions;

CREATE POLICY "Submissions are viewable by everyone" 
    ON assignment_submissions FOR SELECT 
    USING (true);

-- Ensure indexes exist for performance (already created in base script, but good to be safe)
CREATE INDEX IF NOT EXISTS idx_submissions_material_id ON assignment_submissions(material_id);
