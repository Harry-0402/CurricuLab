-- Create a table for approved users
CREATE TABLE IF NOT EXISTS public.authorized_users (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text NOT NULL UNIQUE,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.authorized_users ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read this table (needed for the login check, or we can restrict it to authorized users only, but for the check we might need wide read or use service role)
-- Actually, better to only allow authenticated read, or use service role in middleware.
-- For now, let's allow service_role FULL and authenticated READ.
CREATE POLICY "Allow read access for authenticated users" ON public.authorized_users
    FOR SELECT TO authenticated USING (true);

-- Initial Data: Whitelist the developer/user (assuming their email from context or just leave empty for them to add)
-- I will add a placeholder note.
INSERT INTO public.authorized_users (email)
VALUES 
    ('georgettawilson44@gmail.com'),
    ('akashmangalam73857@gmail.com'),
    ('ctanu608@gmail.com'),
    ('kaustubh21112002@gmail.com'),
    ('veeramallamani7@gmail.com'),
    ('kaifjshah@gmail.com'),
    ('hrchavan0402@gmail.com'),
    ('anukritisrivastava04@gmail.com'),
    ('shahidivya38@gmail.com'), -- Corrected from 'gamil.com'
    ('tejaspatil78787@gmail.com')
ON CONFLICT (email) DO NOTHING;
