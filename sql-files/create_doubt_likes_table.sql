-- Create table to track individual likes
CREATE TABLE IF NOT EXISTS doubt_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    doubt_id UUID REFERENCES doubts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(doubt_id, user_id) -- Prevents duplicate likes from same user
);

-- Enable RLS
ALTER TABLE doubt_likes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Likes are visible to everyone" ON doubt_likes
    FOR SELECT USING (true);

CREATE POLICY "Users can like doubts" ON doubt_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes" ON doubt_likes
    FOR DELETE USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_doubt_likes_doubt_id ON doubt_likes(doubt_id);
CREATE INDEX IF NOT EXISTS idx_doubt_likes_user_id ON doubt_likes(user_id);
