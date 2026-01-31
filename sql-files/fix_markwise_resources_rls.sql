-- Complete RLS policy reset for markwise_resources
-- This will remove ALL policies and recreate them from scratch

-- First, check current policies (informational)
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'markwise_resources';

-- Drop ALL existing policies (ensuring clean slate)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'markwise_resources') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.markwise_resources', r.policyname);
    END LOOP;
END $$;

-- Verify RLS is enabled
ALTER TABLE public.markwise_resources ENABLE ROW LEVEL SECURITY;

-- Create simple, permissive policies for anon user (matching your other tables)
CREATE POLICY "Enable all for anon users"
    ON public.markwise_resources
    FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Also add policy for authenticated users (belt and suspenders)
CREATE POLICY "Enable all for authenticated users"
    ON public.markwise_resources
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'markwise_resources';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ MarkWise Resources RLS FULLY RESET!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'All old policies dropped and new ones created.';
    RAISE NOTICE 'Policies now allow ALL operations for:';
    RAISE NOTICE '  - anon (public) users';
    RAISE NOTICE '  - authenticated users';
    RAISE NOTICE '';
    RAISE NOTICE '🔄 Please try creating a resource again.';
END $$;
