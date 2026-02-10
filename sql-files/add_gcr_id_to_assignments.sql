-- Add gcr_id column to assignments table to track Google Classroom imports
ALTER TABLE public.assignments 
ADD COLUMN IF NOT EXISTS gcr_id TEXT;

-- Create an index for faster lookups when checking imported status
CREATE INDEX IF NOT EXISTS idx_assignments_gcr_id ON public.assignments(gcr_id);

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Added "gcr_id" column to assignments table!';
END $$;
