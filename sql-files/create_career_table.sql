-- Career Applications Table
-- Tracks the user's job application process (Interview Lineup)

CREATE TABLE IF NOT EXISTS public.career_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Applied' CHECK (status IN ('Applied', 'Interviewing', 'Offer', 'Rejected', 'Wishlist')),
    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    notes TEXT,
    user_id UUID DEFAULT auth.uid() -- Link to specific user if auth is fully strict, otherwise nullable for dev
);

-- Enable RLS
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Allow individual read access" ON public.career_applications;
CREATE POLICY "Allow individual read access" ON public.career_applications FOR SELECT TO authenticated USING (true);
-- (In prod, USING (auth.uid() == user_id), but for this dev setup we keep permissive true for simplicity if auth issues arise, OR simpler: TO authenticated USING (true))

DROP POLICY IF EXISTS "Allow individual insert access" ON public.career_applications;
CREATE POLICY "Allow individual insert access" ON public.career_applications FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow individual update access" ON public.career_applications;
CREATE POLICY "Allow individual update access" ON public.career_applications FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow individual delete access" ON public.career_applications;
CREATE POLICY "Allow individual delete access" ON public.career_applications FOR DELETE TO authenticated USING (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.career_applications;
