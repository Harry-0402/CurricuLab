-- Create doubts table
CREATE TABLE IF NOT EXISTS doubts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tags TEXT[],
    likes INTEGER DEFAULT 0,
    is_anonymous BOOLEAN DEFAULT FALSE,
    category TEXT DEFAULT 'General',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create doubt_comments table
CREATE TABLE IF NOT EXISTS doubt_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    doubt_id UUID REFERENCES doubts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    is_faculty_reply BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create whatsapp_groups table
CREATE TABLE IF NOT EXISTS whatsapp_groups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    link TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'General',
    icon_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE doubts ENABLE ROW LEVEL SECURITY;
ALTER TABLE doubt_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_groups ENABLE ROW LEVEL SECURITY;

-- Policies for doubts
CREATE POLICY "Doubts are visible to everyone" ON doubts
    FOR SELECT USING (true);

CREATE POLICY "Users can create doubts" ON doubts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own doubts" ON doubts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own doubts" ON doubts
    FOR DELETE USING (auth.uid() = user_id);

-- Policies for doubt_comments
CREATE POLICY "Comments are visible to everyone" ON doubt_comments
    FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON doubt_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON doubt_comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON doubt_comments
    FOR DELETE USING (auth.uid() = user_id);

-- Policies for whatsapp_groups
CREATE POLICY "WhatsApp groups are visible to everyone" ON whatsapp_groups
    FOR SELECT USING (true);

-- Functions to update likes count (Optional, implemented via RPC or Client)
