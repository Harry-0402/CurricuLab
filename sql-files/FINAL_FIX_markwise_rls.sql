-- ==================================================
-- FINAL FIX: MarkWise Resources RLS Policies
-- ==================================================
-- Run this ENTIRE script in Supabase SQL Editor
-- This will fix the "row-level security policy" error

-- Step 1: Drop ALL existing policies (clean slate)
DROP POLICY IF EXISTS "Enable all for anon users" ON public.markwise_resources;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.markwise_resources;
DROP POLICY IF EXISTS "Anyone can view markwise resources" ON public.markwise_resources;
DROP POLICY IF EXISTS "Authenticated users can insert markwise resources" ON public.markwise_resources;
DROP POLICY IF EXISTS "Authenticated users can update markwise resources" ON public.markwise_resources;
DROP POLICY IF EXISTS "Authenticated users can delete markwise resources" ON public.markwise_resources;
DROP POLICY IF EXISTS "Allow public read access markwise_resources" ON public.markwise_resources;
DROP POLICY IF EXISTS "Allow public write access markwise_resources" ON public.markwise_resources;

-- Step 2: Create correct public access policies
CREATE POLICY "Enable all for anon users"
    ON public.markwise_resources
    FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable all for authenticated users"
    ON public.markwise_resources
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Step 3: Verify the policies were created
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd
FROM pg_policies
WHERE tablename = 'markwise_resources'
ORDER BY policyname;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ RLS POLICIES FIXED!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'You should now be able to create resources.';
    RAISE NOTICE 'Go back to the MarkWise page and try again.';
    RAISE NOTICE '';
END $$;
