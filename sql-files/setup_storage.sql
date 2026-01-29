-- Storage Setup: Create Bucket and Policies

-- 1. Create a public bucket named 'library-assets'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('library-assets', 'library-assets', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;

-- 3. Create Policy: Allow public read access (Download)
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'library-assets');

-- 4. Create Policy: Allow public write access (Upload)
-- IMPORTANT: This is temporary for the migration script. We should disable it or secure it later.
CREATE POLICY "Public Upload" 
ON storage.objects FOR INSERT 
TO public 
WITH CHECK (bucket_id = 'library-assets');
