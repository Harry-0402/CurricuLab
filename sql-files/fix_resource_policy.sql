-- Fix RLS Policy for Resources
-- Issue: Previous policy was 'TO anon', blocking logged-in users.
-- Fix: Remove 'TO anon' to allow ALL roles (anon + authenticated).

DROP POLICY IF EXISTS "Allow public read access resources" ON public.resources;

CREATE POLICY "Allow public read access resources" 
ON public.resources 
FOR SELECT 
USING (true);

-- Ensure write access is still correct (if needed)
-- (Existing write policy was for anon? Let's fix that too just in case)
DROP POLICY IF EXISTS "Allow public write access resources" ON public.resources;

-- Only authenticated users should upload/edit ideally, but for now matching previous permissive logic
-- Or better: Allow Authenticated to insert.
CREATE POLICY "Allow authenticated insert resources"
ON public.resources
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated update resources"
ON public.resources
FOR UPDATE
TO authenticated
USING (true);
