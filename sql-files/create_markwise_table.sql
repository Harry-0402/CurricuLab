-- MarkWise Questions Table
-- Separate question bank with answer storage and cached AI formatting

CREATE TABLE IF NOT EXISTS markwise_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id TEXT NOT NULL,
    unit_id TEXT,
    question TEXT NOT NULL,
    answer TEXT,
    formatted_answer TEXT, -- Cached AI-formatted version of the answer
    marks_type INTEGER NOT NULL DEFAULT 10,
    tags TEXT[] DEFAULT '{}',
    is_bookmarked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_markwise_subject ON markwise_questions(subject_id);
CREATE INDEX IF NOT EXISTS idx_markwise_unit ON markwise_questions(unit_id);
CREATE INDEX IF NOT EXISTS idx_markwise_marks ON markwise_questions(marks_type);

-- Enable Row Level Security
ALTER TABLE markwise_questions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (for idempotent execution)
DROP POLICY IF EXISTS "Allow all operations on markwise_questions" ON markwise_questions;

-- Create policy to allow all operations (adjust for your auth needs)
CREATE POLICY "Allow all operations on markwise_questions"
    ON markwise_questions
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Add to realtime publication
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE markwise_questions;
EXCEPTION
    WHEN duplicate_object THEN
        NULL; -- Already added, ignore
END $$;

-- Create function for updated_at trigger if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if exists (for idempotent execution)
DROP TRIGGER IF EXISTS update_markwise_updated_at ON markwise_questions;

-- Create trigger for updated_at
CREATE TRIGGER update_markwise_updated_at
    BEFORE UPDATE ON markwise_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
