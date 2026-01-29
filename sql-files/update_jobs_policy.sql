-- Enable Update and Delete for authenticated users on job_listings

-- Policy for UPDATE
DROP POLICY IF EXISTS "Allow authenticated update jobs" ON public.job_listings;
CREATE POLICY "Allow authenticated update jobs" ON public.job_listings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Policy for DELETE
DROP POLICY IF EXISTS "Allow authenticated delete jobs" ON public.job_listings;
CREATE POLICY "Allow authenticated delete jobs" ON public.job_listings FOR DELETE TO authenticated USING (true);
