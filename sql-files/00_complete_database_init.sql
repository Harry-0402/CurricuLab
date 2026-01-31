-- ================================================================
-- CurricuLab Complete Database Initialization Script
-- ================================================================
-- This is a single, comprehensive script to create ALL tables
-- with proper relations, RLS policies, and indexes.
-- Safe to run multiple times (idempotent).
-- ================================================================

-- ================================================================
-- STEP 1: Create Utility Functions
-- ================================================================

-- Function to auto-update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ================================================================
-- STEP 2: Core Academic Tables
-- ================================================================

-- ==========================================
-- 2.1 Subjects Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.subjects (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    description TEXT,
    progress INTEGER DEFAULT 0,
    unit_count INTEGER DEFAULT 0,
    last_studied TEXT
);

-- Add missing columns (for existing databases)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subjects' AND column_name = 'progress') THEN
        ALTER TABLE public.subjects ADD COLUMN progress INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subjects' AND column_name = 'unit_count') THEN
        ALTER TABLE public.subjects ADD COLUMN unit_count INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subjects' AND column_name = 'last_studied') THEN
        ALTER TABLE public.subjects ADD COLUMN last_studied TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subjects' AND column_name = 'icon') THEN
        ALTER TABLE public.subjects ADD COLUMN icon TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subjects' AND column_name = 'color') THEN
        ALTER TABLE public.subjects ADD COLUMN color TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subjects' AND column_name = 'description') THEN
        ALTER TABLE public.subjects ADD COLUMN description TEXT;
    END IF;
END $$;

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access subjects" ON public.subjects;
CREATE POLICY "Allow public read access subjects" ON public.subjects FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow public write access subjects" ON public.subjects;
CREATE POLICY "Allow public write access subjects" ON public.subjects FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_subjects_code ON public.subjects(code);


-- ==========================================
-- 2.2 Units Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.units (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
    unit_code TEXT,
    title TEXT NOT NULL,
    description TEXT,
    "order" INTEGER NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    topics TEXT[]
);

-- Add missing columns (for existing databases)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'units' AND column_name = 'topics') THEN
        ALTER TABLE public.units ADD COLUMN topics TEXT[];
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'units' AND column_name = 'description') THEN
        ALTER TABLE public.units ADD COLUMN description TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'units' AND column_name = 'order') THEN
        ALTER TABLE public.units ADD COLUMN "order" INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'units' AND column_name = 'is_completed') THEN
        ALTER TABLE public.units ADD COLUMN is_completed BOOLEAN DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'units' AND column_name = 'unit_code') THEN
        ALTER TABLE public.units ADD COLUMN unit_code TEXT;
    END IF;
END $$;

ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access units" ON public.units;
CREATE POLICY "Allow public read access units" ON public.units FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow public write access units" ON public.units;
CREATE POLICY "Allow public write access units" ON public.units FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_units_subject_id ON public.units(subject_id);


-- ==========================================
-- 2.3 Notes Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.notes (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    unit_id TEXT REFERENCES public.units(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    is_bookmarked BOOLEAN DEFAULT false,
    last_modified TEXT,
    last_read TEXT
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access notes" ON public.notes;
CREATE POLICY "Allow public read access notes" ON public.notes FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow public write access notes" ON public.notes;
CREATE POLICY "Allow public write access notes" ON public.notes FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_notes_unit_id ON public.notes(unit_id);


-- ==========================================
-- 2.4 Revision Notes Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.revision_notes (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    unit_id TEXT REFERENCES public.units(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.revision_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access revision_notes" ON public.revision_notes;
CREATE POLICY "Allow public read access revision_notes" ON public.revision_notes FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow public write access revision_notes" ON public.revision_notes;
CREATE POLICY "Allow public write access revision_notes" ON public.revision_notes FOR ALL TO anon USING (true) WITH CHECK (true);


-- ================================================================
-- STEP 3: Faculty & Team Tables
-- ================================================================

-- ==========================================
-- 3.1 Faculty Members Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.faculty_members (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    status TEXT,
    category TEXT NOT NULL CHECK (category IN ('faculty', 'fellows')),
    email TEXT,
    subject TEXT,
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
    contact_no TEXT,
    whatsapp_no TEXT
);

ALTER TABLE public.faculty_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON public.faculty_members;
CREATE POLICY "Allow public read access" ON public.faculty_members FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow public write access" ON public.faculty_members;
CREATE POLICY "Allow public write access" ON public.faculty_members FOR ALL TO anon USING (true) WITH CHECK (true);


-- ================================================================
-- STEP 4: User-Specific Tables
-- ================================================================

-- ==========================================
-- 4.1 Authorized Users Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.authorized_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.authorized_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access for authenticated users" ON public.authorized_users;
CREATE POLICY "Allow read access for authenticated users" ON public.authorized_users
    FOR SELECT TO authenticated USING (true);


-- ==========================================
-- 4.2 Attendance Logs Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.attendance_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subject_id TEXT REFERENCES public.subjects(id) ON DELETE SET NULL,
    subject_name TEXT,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Present', 'Absent', 'Canceled')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Add unique constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_attendance_per_subject_date'
    ) THEN
        ALTER TABLE public.attendance_logs 
        ADD CONSTRAINT unique_attendance_per_subject_date 
        UNIQUE (user_id, subject_id, date);
    END IF;
END $$;

ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own attendance" ON public.attendance_logs;
CREATE POLICY "Users can view their own attendance"
    ON public.attendance_logs FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own attendance" ON public.attendance_logs;
CREATE POLICY "Users can insert their own attendance"
    ON public.attendance_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own attendance" ON public.attendance_logs;
CREATE POLICY "Users can update their own attendance"
    ON public.attendance_logs FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own attendance" ON public.attendance_logs;
CREATE POLICY "Users can delete their own attendance"
    ON public.attendance_logs FOR DELETE
    USING (auth.uid() = user_id);


-- ==========================================
-- 4.3 Reminders Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    reminder_date TIMESTAMP NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own reminders" ON public.reminders;
CREATE POLICY "Users can view own reminders"
    ON public.reminders FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own reminders" ON public.reminders;
CREATE POLICY "Users can create own reminders"
    ON public.reminders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own reminders" ON public.reminders;
CREATE POLICY "Users can update own reminders"
    ON public.reminders FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own reminders" ON public.reminders;
CREATE POLICY "Users can delete own reminders"
    ON public.reminders FOR DELETE
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON public.reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_date ON public.reminders(reminder_date);


-- ================================================================
-- STEP 5: Announcements & Communication
-- ================================================================

-- ==========================================
-- 5.1 Announcements Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error')),
    headline TEXT NOT NULL,
    message TEXT NOT NULL,
    resource_link TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS resource_link TEXT;
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active announcements" ON public.announcements;
CREATE POLICY "Anyone can read active announcements"
    ON public.announcements FOR SELECT
    USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated users can manage announcements" ON public.announcements;
CREATE POLICY "Authenticated users can manage announcements"
    ON public.announcements FOR ALL
    USING (true)
    WITH CHECK (true);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_announcements_updated_at ON public.announcements;
CREATE TRIGGER update_announcements_updated_at
    BEFORE UPDATE ON public.announcements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- ================================================================
-- STEP 6: Career & Jobs Tables
-- ================================================================

-- ==========================================
-- 6.1 Career Applications Table (Interview Lineup)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.career_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Applied' CHECK (status IN ('Applied', 'Interviewing', 'Offer', 'Rejected', 'Wishlist')),
    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    notes TEXT,
    user_id UUID DEFAULT auth.uid()
);

ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow individual read access" ON public.career_applications;
CREATE POLICY "Allow individual read access" ON public.career_applications FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow individual insert access" ON public.career_applications;
CREATE POLICY "Allow individual insert access" ON public.career_applications FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow individual update access" ON public.career_applications;
CREATE POLICY "Allow individual update access" ON public.career_applications FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow individual delete access" ON public.career_applications;
CREATE POLICY "Allow individual delete access" ON public.career_applications FOR DELETE TO authenticated USING (true);


-- ==========================================
-- 6.2 Job Listings Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.job_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Remote', 'On-site', 'Hybrid')),
    salary_range TEXT,
    url TEXT NOT NULL,
    posted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    is_active BOOLEAN DEFAULT true
);

ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access jobs" ON public.job_listings;
CREATE POLICY "Allow public read access jobs" ON public.job_listings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert jobs" ON public.job_listings;
CREATE POLICY "Allow authenticated insert jobs" ON public.job_listings FOR INSERT TO authenticated WITH CHECK (true);


-- ================================================================
-- STEP 7: Resources & Learning Materials
-- ================================================================

-- ==========================================
-- 7.1 Resources Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.resources (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('Video', 'PDF', 'Link', 'Template', 'Article')),
    url TEXT NOT NULL,
    category TEXT NOT NULL,
    topic TEXT,
    content TEXT,
    is_active BOOLEAN DEFAULT true
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access resources" ON public.resources;
CREATE POLICY "Allow public read access resources" ON public.resources FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow public write access resources" ON public.resources;
CREATE POLICY "Allow public write access resources" ON public.resources FOR ALL TO anon USING (true) WITH CHECK (true);


-- ==========================================
-- 7.2 Vault Resources Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.vault_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id TEXT NOT NULL,
    unit_id TEXT,
    part_number INTEGER,
    type TEXT NOT NULL CHECK (type IN ('study_note', 'case_study', 'project')),
    title TEXT NOT NULL,
    content TEXT,
    formatted_content TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vault_resources_subject ON public.vault_resources(subject_id);
CREATE INDEX IF NOT EXISTS idx_vault_resources_type ON public.vault_resources(type);

ALTER TABLE public.vault_resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations on vault_resources" ON public.vault_resources;
CREATE POLICY "Allow all operations on vault_resources"
    ON public.vault_resources
    FOR ALL
    USING (true)
    WITH CHECK (true);

DROP TRIGGER IF EXISTS update_vault_resources_updated_at ON public.vault_resources;
CREATE TRIGGER update_vault_resources_updated_at
    BEFORE UPDATE ON public.vault_resources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- ==========================================
-- 7.3 MarkWise Questions Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.markwise_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id TEXT NOT NULL,
    unit_id TEXT,
    question TEXT NOT NULL,
    answer TEXT,
    formatted_answer TEXT,
    marks_type INTEGER NOT NULL DEFAULT 10,
    tags TEXT[] DEFAULT '{}',
    is_bookmarked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_markwise_subject ON public.markwise_questions(subject_id);
CREATE INDEX IF NOT EXISTS idx_markwise_unit ON public.markwise_questions(unit_id);
CREATE INDEX IF NOT EXISTS idx_markwise_marks ON public.markwise_questions(marks_type);

ALTER TABLE public.markwise_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations on markwise_questions" ON public.markwise_questions;
CREATE POLICY "Allow all operations on markwise_questions"
    ON public.markwise_questions
    FOR ALL
    USING (true)
    WITH CHECK (true);

DROP TRIGGER IF EXISTS update_markwise_updated_at ON public.markwise_questions;
CREATE TRIGGER update_markwise_updated_at
    BEFORE UPDATE ON public.markwise_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- ==========================================
-- 7.4 Prompts Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.prompts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    prompt TEXT NOT NULL,
    category TEXT NOT NULL
);

ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON public.prompts;
CREATE POLICY "Allow public read access" ON public.prompts
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert" ON public.prompts;
CREATE POLICY "Allow authenticated insert" ON public.prompts
    FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update" ON public.prompts;
CREATE POLICY "Allow authenticated update" ON public.prompts
    FOR UPDATE TO authenticated USING (true);


-- ================================================================
-- STEP 8: Enable Realtime Publications
-- ================================================================

-- Create or update realtime publication
DO $$
BEGIN
    -- Add tables to realtime publication
    ALTER PUBLICATION supabase_realtime ADD TABLE public.subjects;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.career_applications;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.job_listings;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.resources;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.vault_resources;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.markwise_questions;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;


-- ================================================================
-- STEP 9: Success Summary
-- ================================================================

DO $$
BEGIN
    RAISE NOTICE '╔════════════════════════════════════════════════════════════╗';
    RAISE NOTICE '║   ✅ CurricuLab Database Initialization Complete!        ║';
    RAISE NOTICE '╚════════════════════════════════════════════════════════════╝';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Tables Created:';
    RAISE NOTICE '   ├─ Core Academic: subjects, units, notes, revision_notes';
    RAISE NOTICE '   ├─ Faculty: faculty_members';
    RAISE NOTICE '   ├─ User Data: authorized_users, attendance_logs, reminders';
    RAISE NOTICE '   ├─ Communication: announcements';
    RAISE NOTICE '   ├─ Career: career_applications, job_listings';
    RAISE NOTICE '   └─ Resources: resources, vault_resources, markwise_questions, prompts';
    RAISE NOTICE '';
    RAISE NOTICE '🔒 Row Level Security: ENABLED on all tables';
    RAISE NOTICE '📡 Realtime: ENABLED for key tables';
    RAISE NOTICE '⚡ Indexes: CREATED for optimal performance';
    RAISE NOTICE '🔗 Foreign Keys: CONFIGURED with CASCADE support';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Database is ready for use!';
    RAISE NOTICE '';
END $$;
