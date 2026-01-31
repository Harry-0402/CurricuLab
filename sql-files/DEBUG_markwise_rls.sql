-- ==================================================
-- DEBUG: MarkWise Resources RLS Issues
-- ==================================================
-- Run this to diagnose the RLS problem

-- 1. Check current RLS policies
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'markwise_resources'
ORDER BY policyname;

-- 2. Check if RLS is enabled on the table
SELECT 
    tablename, 
    rowsecurity
FROM pg_tables
WHERE tablename = 'markwise_resources';

-- 3. Try a simple insert to see exact error
INSERT INTO public.markwise_resources (
    subject_id,
    unit_id,
    google_drive_link,
    resource_type
) VALUES (
    'PBA204',
    '2de0da8b-7e7b-4d2a-a80a-df708a2b40db',
    'https://drive.google.com/file/d/1sampleid/view',
    'html'
);

-- 4. If insert fails, try disabling RLS temporarily to test
-- UNCOMMENT ONLY IF NEEDED FOR TESTING:
-- ALTER TABLE public.markwise_resources DISABLE ROW LEVEL SECURITY;

-- 5. Check what role your Supabase client is using
SELECT current_user, current_role;
