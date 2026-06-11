-- ============================================================
-- CurricuLab — Semester 3 Subject Seed Template
-- MBA Business Analytics — Semester 3 (Jul–Nov 2025)
--
-- HOW TO USE:
-- 1. Run add_multi_semester_support.sql FIRST (if not done)
-- 2. Replace subject codes, titles, descriptions below with real Sem 3 subjects
-- 3. Run this script in Supabase SQL Editor
-- ============================================================

-- Semester 3 UUID (set by add_multi_semester_support.sql)
-- SEM3_ID = 'd4e5f6a7-0003-0000-0000-000000000003'

-- ─────────────────────────────────────────────────────────────
-- INSERT Semester 3 Subjects
-- Replace the placeholder values with real subject data
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.subjects (
    id,
    semester_id,
    code,
    title,
    icon,
    color,
    description,
    unit_count,
    progress
)
VALUES
    -- Subject 1 (replace with real data)
    (
        gen_random_uuid(),
        'd4e5f6a7-0003-0000-0000-000000000003',
        'PBA301',                                    -- ← Replace with real code
        'Subject Name Here',                          -- ← Replace with real title
        'BarChart3',                                  -- icon name from Lucide React
        '#4f46e5',                                   -- color hex
        'Brief description of what this subject covers.',
        5,                                           -- number of units
        0
    ),
    -- Subject 2
    (
        gen_random_uuid(),
        'd4e5f6a7-0003-0000-0000-000000000003',
        'PBA302',
        'Subject Name Here',
        'Database',
        '#059669',
        'Brief description of what this subject covers.',
        5,
        0
    ),
    -- Subject 3
    (
        gen_random_uuid(),
        'd4e5f6a7-0003-0000-0000-000000000003',
        'PBA303',
        'Subject Name Here',
        'Globe',
        '#f43f5e',
        'Brief description of what this subject covers.',
        5,
        0
    ),
    -- Subject 4
    (
        gen_random_uuid(),
        'd4e5f6a7-0003-0000-0000-000000000003',
        'PBA304',
        'Subject Name Here',
        'Zap',
        '#f59e0b',
        'Brief description of what this subject covers.',
        5,
        0
    ),
    -- Subject 5
    (
        gen_random_uuid(),
        'd4e5f6a7-0003-0000-0000-000000000003',
        'PBA305',
        'Subject Name Here',
        'Search',
        '#0ea5e9',
        'Brief description of what this subject covers.',
        5,
        0
    )
    -- Add more subjects by copy-pasting the block above
;

-- ─────────────────────────────────────────────────────────────
-- OPTIONAL: Add units for each new subject
-- Replace subject_id with the actual UUIDs generated above
-- (You can get them by querying: SELECT id, code FROM subjects WHERE semester_id = 'd4e5f6a7-0003-0000-0000-000000000003')
-- ─────────────────────────────────────────────────────────────

/*
INSERT INTO public.units (id, subject_id, title, description, "order", is_completed, topics)
VALUES
    (gen_random_uuid(), '<SUBJECT_UUID_HERE>', 'Unit I: Title', 'Description', 1, false, '{"Topic 1", "Topic 2"}'),
    (gen_random_uuid(), '<SUBJECT_UUID_HERE>', 'Unit II: Title', 'Description', 2, false, '{"Topic 1", "Topic 2"}'),
    (gen_random_uuid(), '<SUBJECT_UUID_HERE>', 'Unit III: Title', 'Description', 3, false, '{"Topic 1", "Topic 2"}'),
    (gen_random_uuid(), '<SUBJECT_UUID_HERE>', 'Unit IV: Title', 'Description', 4, false, '{"Topic 1", "Topic 2"}'),
    (gen_random_uuid(), '<SUBJECT_UUID_HERE>', 'Unit V: Title', 'Description', 5, false, '{"Topic 1", "Topic 2"}');
*/

-- ─────────────────────────────────────────────────────────────
-- VERIFY: Check what got inserted
-- ─────────────────────────────────────────────────────────────
SELECT 
    s.code,
    s.title,
    s.unit_count,
    sem.short_name AS semester,
    p.name AS program
FROM subjects s
JOIN semesters sem ON sem.id = s.semester_id
JOIN programs p ON p.id = sem.program_id
WHERE s.semester_id = 'd4e5f6a7-0003-0000-0000-000000000003'
ORDER BY s.code;
