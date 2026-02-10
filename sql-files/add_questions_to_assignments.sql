-- Add questions column to assignments table
-- This column will store an array of questions, each with an optional AI-generated answer

ALTER TABLE public.assignments 
ADD COLUMN IF NOT EXISTS questions JSONB DEFAULT '[]'::jsonb;

-- Optional: Update description to be nullable if it isn't already
ALTER TABLE public.assignments 
ALTER COLUMN description DROP NOT NULL;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Added "questions" JSONB column to assignments table!';
    RAISE NOTICE '   - New column available for storing multiple questions and answers';
END $$;
