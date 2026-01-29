-- Resources Table
-- Stores external resources like Videos, Links, Articles, etc. previously hardcoded in code

CREATE TABLE IF NOT EXISTS public.resources (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('Video', 'PDF', 'Link', 'Template', 'Article')),
    url TEXT NOT NULL,
    category TEXT NOT NULL, -- e.g., 'Technical Skills', 'Business Strategy'
    topic TEXT, -- Optional sub-topic e.g., 'Excel', 'SQL'
    content TEXT, -- For full article content if needed
    is_active BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Allow public read access resources" ON public.resources;
CREATE POLICY "Allow public read access resources" ON public.resources FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow public write access resources" ON public.resources;
CREATE POLICY "Allow public write access resources" ON public.resources FOR ALL TO anon USING (true) WITH CHECK (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.resources;
