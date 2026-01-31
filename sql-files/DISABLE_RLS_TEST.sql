-- ==================================================
-- TEMPORARY FIX: Disable RLS to test if it works
-- ==================================================
-- This will allow you to create resources without RLS blocking
-- Run this NOW, then try to create a resource

ALTER TABLE public.markwise_resources DISABLE ROW LEVEL SECURITY;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ RLS DISABLED FOR TESTING';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Try creating a resource now.';
    RAISE NOTICE 'If it works, we know the issue is RLS.';
    RAISE NOTICE '';
END $$;

-- TO RE-ENABLE RLS LATER (don't run yet):
-- ALTER TABLE public.markwise_resources ENABLE ROW LEVEL SECURITY;
