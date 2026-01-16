-- ================================================================
-- Add PRN Column to Faculty Members Table
-- ================================================================
-- Run this in Supabase SQL Editor to add the missing column
-- ================================================================

-- Add prn column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'faculty_members' AND column_name = 'prn'
    ) THEN
        ALTER TABLE public.faculty_members ADD COLUMN prn text;
        RAISE NOTICE 'Added column: prn';
    END IF;
END $$;

-- Verify the change
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'faculty_members' 
ORDER BY ordinal_position;
