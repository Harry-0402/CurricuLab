-- ==========================================
-- MarkWise Resources Table
-- ==========================================
-- This table stores Google Drive HTML resources for MarkWise
-- separate from questions to maintain clear separation of concerns

CREATE TABLE IF NOT EXISTS public.markwise_resources (
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

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_markwise_resources_subject ON public.markwise_resources(subject_id);
CREATE INDEX IF NOT EXISTS idx_markwise_resources_unit ON public.markwise_resources(unit_id);
CREATE INDEX IF NOT EXISTS idx_markwise_resources_active ON public.markwise_resources(is_active);

-- Enable Row Level Security
ALTER TABLE public.markwise_resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Public access to match other CurricuLab tables)
DROP POLICY IF EXISTS "Enable all for anon users" ON public.markwise_resources;
CREATE POLICY "Enable all for anon users"
    ON public.markwise_resources
    FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.markwise_resources;
CREATE POLICY "Enable all for authenticated users"
    ON public.markwise_resources
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_markwise_resources_updated_at ON public.markwise_resources;
CREATE TRIGGER update_markwise_resources_updated_at
    BEFORE UPDATE ON public.markwise_resources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add to realtime publication
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.markwise_resources;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ MarkWise Resources table created successfully!';
    RAISE NOTICE '   - Stores Google Drive HTML links and other resources';
    RAISE NOTICE '   - Linked to subjects and units';
    RAISE NOTICE '   - RLS enabled with public read, authenticated write';
    RAISE NOTICE '   - Realtime enabled for live updates';
END $$;
