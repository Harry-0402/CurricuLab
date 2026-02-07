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
CREATE POLICY "Everyone can view agents" 
ON public.mindgrid_agents FOR SELECT 
USING (true);

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
