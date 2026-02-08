-- ============================================
-- SKILLFORGE TABLES - Personal Studies Management
-- ============================================
-- Run this in Supabase SQL Editor

-- 1. Skillforge Tracks (Learning Paths/Goals)
CREATE TABLE IF NOT EXISTS skillforge_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'general',
    target_date DATE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'wishlist')),
    progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    color TEXT NOT NULL DEFAULT '#3B82F6',
    icon TEXT NOT NULL DEFAULT '🎯',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Skillforge Resources (External Course Links)
CREATE TABLE IF NOT EXISTS skillforge_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    track_id UUID REFERENCES skillforge_tracks(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    url TEXT,
    platform TEXT NOT NULL DEFAULT 'other',
    type TEXT NOT NULL DEFAULT 'course' CHECK (type IN ('course', 'video', 'article', 'book', 'podcast', 'tutorial', 'other')),
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'wishlist')),
    notes TEXT,
    priority INTEGER NOT NULL DEFAULT 3 CHECK (priority >= 1 AND priority <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Skillforge Journal (Learning Notes)
CREATE TABLE IF NOT EXISTS skillforge_journal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    track_id UUID REFERENCES skillforge_tracks(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT,
    key_learnings TEXT[] DEFAULT '{}',
    mood TEXT CHECK (mood IN ('excited', 'focused', 'confused', 'tired', 'motivated', NULL)),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Skillforge Skills (Personal Skills Tracker)
CREATE TABLE IF NOT EXISTS skillforge_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'technical',
    proficiency_level TEXT NOT NULL DEFAULT 'beginner' CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    track_ids UUID[] DEFAULT '{}',
    notes TEXT,
    last_practiced TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES for Performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_skillforge_tracks_user_id ON skillforge_tracks(user_id);
CREATE INDEX IF NOT EXISTS idx_skillforge_tracks_status ON skillforge_tracks(status);
CREATE INDEX IF NOT EXISTS idx_skillforge_resources_user_id ON skillforge_resources(user_id);
CREATE INDEX IF NOT EXISTS idx_skillforge_resources_track_id ON skillforge_resources(track_id);
CREATE INDEX IF NOT EXISTS idx_skillforge_journal_user_id ON skillforge_journal(user_id);
CREATE INDEX IF NOT EXISTS idx_skillforge_journal_track_id ON skillforge_journal(track_id);
CREATE INDEX IF NOT EXISTS idx_skillforge_skills_user_id ON skillforge_skills(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE skillforge_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE skillforge_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE skillforge_journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE skillforge_skills ENABLE ROW LEVEL SECURITY;

-- Tracks Policies
CREATE POLICY "Users can view own tracks" ON skillforge_tracks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tracks" ON skillforge_tracks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tracks" ON skillforge_tracks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tracks" ON skillforge_tracks
    FOR DELETE USING (auth.uid() = user_id);

-- Resources Policies
CREATE POLICY "Users can view own resources" ON skillforge_resources
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resources" ON skillforge_resources
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resources" ON skillforge_resources
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resources" ON skillforge_resources
    FOR DELETE USING (auth.uid() = user_id);

-- Journal Policies
CREATE POLICY "Users can view own journal entries" ON skillforge_journal
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal entries" ON skillforge_journal
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries" ON skillforge_journal
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries" ON skillforge_journal
    FOR DELETE USING (auth.uid() = user_id);

-- Skills Policies
CREATE POLICY "Users can view own skills" ON skillforge_skills
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skills" ON skillforge_skills
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skills" ON skillforge_skills
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own skills" ON skillforge_skills
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_skillforge_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER skillforge_tracks_updated_at
    BEFORE UPDATE ON skillforge_tracks
    FOR EACH ROW EXECUTE FUNCTION update_skillforge_updated_at();

CREATE TRIGGER skillforge_resources_updated_at
    BEFORE UPDATE ON skillforge_resources
    FOR EACH ROW EXECUTE FUNCTION update_skillforge_updated_at();

CREATE TRIGGER skillforge_journal_updated_at
    BEFORE UPDATE ON skillforge_journal
    FOR EACH ROW EXECUTE FUNCTION update_skillforge_updated_at();

CREATE TRIGGER skillforge_skills_updated_at
    BEFORE UPDATE ON skillforge_skills
    FOR EACH ROW EXECUTE FUNCTION update_skillforge_updated_at();
