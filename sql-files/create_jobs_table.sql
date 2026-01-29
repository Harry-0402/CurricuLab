-- Job Listings Table
-- Publicly visible job board

CREATE TABLE IF NOT EXISTS public.job_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Remote', 'On-site', 'Hybrid')),
    salary_range TEXT,
    url TEXT NOT NULL,
    posted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    is_active BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;

-- Policies
-- Public Read (Everyone can see jobs)
DROP POLICY IF EXISTS "Allow public read access jobs" ON public.job_listings;
CREATE POLICY "Allow public read access jobs" ON public.job_listings FOR SELECT USING (true);

-- Authenticated Write (Only logged in users/admins can post - simplistic for now)
DROP POLICY IF EXISTS "Allow authenticated insert jobs" ON public.job_listings;
CREATE POLICY "Allow authenticated insert jobs" ON public.job_listings FOR INSERT TO authenticated WITH CHECK (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.job_listings;

-- SEED DATA
INSERT INTO public.job_listings (title, company, location, type, salary_range, url) VALUES
('Junior Data Analyst', 'TechCorp Solutions', 'Bangalore, India', 'Hybrid', '₹6L - ₹10L', 'https://linkedin.com'),
('Business Operations Associate', 'FinServ Global', 'Mumbai, India', 'On-site', '₹5L - ₹8L', 'https://naukri.com'),
('Frontend Developer (React)', 'StartUp Inc', 'Remote', 'Remote', '₹8L - ₹15L', 'https://wellfound.com'),
('Marketing Intern', 'Creative Agency', 'Delhi, India', 'On-site', 'Stipend: ₹15k/mo', 'https://internshala.com'),
('Associate Product Manager', 'E-Com Giant', 'Bangalore, India', 'Hybrid', '₹12L - ₹18L', 'https://instahyre.com');
