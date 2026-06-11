-- ============================================================
-- CurricuLab — Multi-Semester & Multi-Program Support
-- Migration: add_multi_semester_support.sql
-- Run this ONCE in your Supabase SQL Editor.
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- STEP 1: Create the `programs` table
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.programs (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT        NOT NULL,           -- "MBA Business Analytics"
    code        TEXT        UNIQUE NOT NULL,    -- "MBA-BA"
    description TEXT,
    created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

-- Anyone can read programs
CREATE POLICY "programs_public_read" ON public.programs
    FOR SELECT USING (true);

-- Only admins can write
CREATE POLICY "programs_admin_write" ON public.programs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ─────────────────────────────────────────────────────────────
-- STEP 2: Create the `semesters` table
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.semesters (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id    UUID        NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
    name          TEXT        NOT NULL,       -- "Semester 2 (Jan–May 2025)"
    short_name    TEXT        NOT NULL,       -- "Sem 2"
    number        INTEGER     NOT NULL,       -- 1, 2, 3 ...
    academic_year TEXT,                       -- "2024-25"
    is_active     BOOLEAN     DEFAULT true,
    created_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "semesters_public_read" ON public.semesters
    FOR SELECT USING (true);

CREATE POLICY "semesters_admin_write" ON public.semesters
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ─────────────────────────────────────────────────────────────
-- STEP 3: Add `semester_id` foreign key to existing tables
-- ─────────────────────────────────────────────────────────────

-- subjects
ALTER TABLE public.subjects
    ADD COLUMN IF NOT EXISTS semester_id UUID REFERENCES public.semesters(id) ON DELETE SET NULL;

-- timetable
ALTER TABLE public.timetable
    ADD COLUMN IF NOT EXISTS semester_id UUID REFERENCES public.semesters(id) ON DELETE SET NULL;

-- announcements
ALTER TABLE public.announcements
    ADD COLUMN IF NOT EXISTS semester_id UUID REFERENCES public.semesters(id) ON DELETE SET NULL;

-- ─────────────────────────────────────────────────────────────
-- STEP 4: Add enrollment column to profiles
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS class_id UUID REFERENCES public.semesters(id) ON DELETE SET NULL;

-- ─────────────────────────────────────────────────────────────
-- STEP 5: Seed the existing program & semester (MBA-BA Sem 2)
-- ─────────────────────────────────────────────────────────────

-- Insert program
INSERT INTO public.programs (id, name, code, description)
VALUES (
    'a1b2c3d4-0001-0000-0000-000000000001',
    'MBA Business Analytics',
    'MBA-BA',
    'Postgraduate program in Business Analytics at Sandip University'
)
ON CONFLICT (code) DO NOTHING;

-- Insert Semester 1
INSERT INTO public.semesters (id, program_id, name, short_name, number, academic_year, is_active)
VALUES (
    'b2c3d4e5-0001-0000-0000-000000000001',
    'a1b2c3d4-0001-0000-0000-000000000001',
    'Semester 1 (Jul–Nov 2024)',
    'Sem 1',
    1,
    '2024-25',
    false
)
ON CONFLICT DO NOTHING;

-- Insert Semester 2 (CURRENT — the existing class)
INSERT INTO public.semesters (id, program_id, name, short_name, number, academic_year, is_active)
VALUES (
    'c3d4e5f6-0002-0000-0000-000000000002',
    'a1b2c3d4-0001-0000-0000-000000000001',
    'Semester 2 (Jan–May 2025)',
    'Sem 2',
    2,
    '2024-25',
    true
)
ON CONFLICT DO NOTHING;

-- Insert Semester 3 (UPCOMING)
INSERT INTO public.semesters (id, program_id, name, short_name, number, academic_year, is_active)
VALUES (
    'd4e5f6a7-0003-0000-0000-000000000003',
    'a1b2c3d4-0001-0000-0000-000000000001',
    'Semester 3 (Jul–Nov 2025)',
    'Sem 3',
    3,
    '2025-26',
    true
)
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- STEP 6: Backfill existing subjects → assign to Sem 2
-- ─────────────────────────────────────────────────────────────
UPDATE public.subjects
SET semester_id = 'c3d4e5f6-0002-0000-0000-000000000002'
WHERE semester_id IS NULL;

-- ─────────────────────────────────────────────────────────────
-- STEP 7: Backfill existing timetable → assign to Sem 2
-- ─────────────────────────────────────────────────────────────
UPDATE public.timetable
SET semester_id = 'c3d4e5f6-0002-0000-0000-000000000002'
WHERE semester_id IS NULL;

-- ─────────────────────────────────────────────────────────────
-- STEP 8: Backfill existing announcements → assign to Sem 2
-- ─────────────────────────────────────────────────────────────
UPDATE public.announcements
SET semester_id = 'c3d4e5f6-0002-0000-0000-000000000002'
WHERE semester_id IS NULL;

-- ─────────────────────────────────────────────────────────────
-- STEP 9: Backfill existing authorized users → enroll in Sem 2
-- ─────────────────────────────────────────────────────────────
UPDATE public.profiles
SET class_id = 'c3d4e5f6-0002-0000-0000-000000000002'
WHERE class_id IS NULL;

-- ─────────────────────────────────────────────────────────────
-- STEP 10: Indexes for performance
-- ─────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_subjects_semester_id    ON public.subjects(semester_id);
CREATE INDEX IF NOT EXISTS idx_timetable_semester_id   ON public.timetable(semester_id);
CREATE INDEX IF NOT EXISTS idx_announcements_semester   ON public.announcements(semester_id);
CREATE INDEX IF NOT EXISTS idx_profiles_class_id        ON public.profiles(class_id);
CREATE INDEX IF NOT EXISTS idx_semesters_program_id     ON public.semesters(program_id);

-- ─────────────────────────────────────────────────────────────
-- Done! 
-- Sem 2 ID: c3d4e5f6-0002-0000-0000-000000000002
-- Sem 3 ID: d4e5f6a7-0003-0000-0000-000000000003
-- ─────────────────────────────────────────────────────────────
