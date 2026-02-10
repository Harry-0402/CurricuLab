-- Add external_link column to assignments table to store direct links to platforms like Google Classroom
ALTER TABLE public.assignments 
ADD COLUMN IF NOT EXISTS external_link TEXT;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Added "external_link" column to assignments table!';
END $$;
