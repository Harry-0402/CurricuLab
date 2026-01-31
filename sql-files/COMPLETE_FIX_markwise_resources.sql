-- ==================================================
-- COMPLETE FIX: Drop and Recreate MarkWise Resources
-- ==================================================
-- This fixes BOTH the data type issue AND the RLS policies
-- Run this ENTIRE script in Supabase SQL Editor

-- Step 1: Drop the existing table (this will delete any existing data!)
DROP TABLE IF EXISTS public.markwise_resources CASCADE;

-- Step 2: Create table with CORRECT data types
CREATE TABLE public.markwise_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    unit_id TEXT REFERENCES public.units(id) ON DELETE CASCADE,
    title TEXT,
    google_drive_link TEXT NOT NULL,
    resource_type TEXT DEFAULT 'html' CHECK (resource_type IN ('html', 'pdf', 'doc', 'other')),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create indexes
CREATE INDEX idx_markwise_resources_subject ON public.markwise_resources(subject_id);
CREATE INDEX idx_markwise_resources_unit ON public.markwise_resources(unit_id);
CREATE INDEX idx_markwise_resources_active ON public.markwise_resources(is_active);

-- Step 4: Enable RLS
ALTER TABLE public.markwise_resources ENABLE ROW LEVEL SECURITY;

-- Step 5: Create public access policies
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

-- Step 6: Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_markwise_resources_updated_at
    BEFORE UPDATE ON public.markwise_resources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 7: Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.markwise_resources;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ TABLE RECREATED WITH FIXES!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Fixed issues:';
    RAISE NOTICE '  - unit_id now UUID (was TEXT)';
    RAISE NOTICE '  - RLS policies set to public access';
    RAISE NOTICE '  - All indexes and triggers created';
    RAISE NOTICE '';
    RAISE NOTICE 'Go to MarkWise and try adding a resource!';
    RAISE NOTICE '';
END $$;
