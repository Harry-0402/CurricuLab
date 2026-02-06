-- Create MindGrid Agents Table
CREATE TABLE IF NOT EXISTS public.mindgrid_agents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    platform TEXT NOT NULL, -- 'openai', 'google', 'curriculab', 'other'
    category TEXT NOT NULL, -- 'General', 'Research', 'Coding', 'Creative'
    is_default BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.mindgrid_agents ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own agents and default agents" 
ON public.mindgrid_agents FOR SELECT 
USING (auth.uid() = user_id OR is_default = true);

CREATE POLICY "Users can insert their own agents" 
ON public.mindgrid_agents FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agents" 
ON public.mindgrid_agents FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own agents" 
ON public.mindgrid_agents FOR DELETE 
USING (auth.uid() = user_id);

-- Seed Default Agents
INSERT INTO public.mindgrid_agents (name, description, url, platform, category, is_default)
VALUES 
('Study Scholar', 'Deep dive into academic papers and complex concepts.', 'https://chatgpt.com/g/g-your-link', 'openai', 'Research', true),
('Socratic Sage', 'Guides you through problems without giving direct answers.', 'https://gemini.google.com/gems/your-link', 'google', 'General', true),
('Lab Assistant', 'Internal CurricuLab expert for platform-specific tasks.', '#', 'other', 'General', true);
