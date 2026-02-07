-- 1. Drop the existing restricted policy (if it still exists)
DROP POLICY IF EXISTS "Users can view their own agents and default agents" ON public.mindgrid_agents;

-- 2. Drop the new policy if it already exists (to avoid conflicts on re-run)
DROP POLICY IF EXISTS "Everyone can view agents" ON public.mindgrid_agents;

-- 3. Create the completely public visibility policy
CREATE POLICY "Everyone can view agents" 
ON public.mindgrid_agents FOR SELECT 
USING (true);

-- 4. Migrate existing agents from 'curriculab' to 'other'
UPDATE public.mindgrid_agents 
SET platform = 'other' 
WHERE platform = 'curriculab';
