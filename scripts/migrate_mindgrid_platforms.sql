-- Migrate existing MindGrid agents from 'curriculab' platform to 'other'
UPDATE public.mindgrid_agents 
SET platform = 'other' 
WHERE platform = 'curriculab';

-- Verify the change
-- SELECT * FROM public.mindgrid_agents WHERE platform = 'other';
