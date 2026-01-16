-- ================================================================
-- Faculty & Fellows SQL Queries Reference
-- ================================================================
-- These queries can be run directly in Supabase SQL Editor
-- The application uses similar queries through the Supabase client
-- ================================================================

-- ================================================================
-- 1. FETCH ALL FACULTY & FELLOWS
-- ================================================================
-- Used when loading the Faculty & Fellows page

SELECT *
FROM public.faculty_members
ORDER BY id ASC;


-- ================================================================
-- 2. FETCH ONLY FACULTY MEMBERS
-- ================================================================

SELECT *
FROM public.faculty_members
WHERE category = 'faculty'
ORDER BY id ASC;


-- ================================================================
-- 3. FETCH ONLY FELLOWS/SCHOLARS
-- ================================================================

SELECT *
FROM public.faculty_members
WHERE category = 'fellows'
ORDER BY id ASC;


-- ================================================================
-- 4. ADD NEW FACULTY MEMBER (Example)
-- ================================================================
-- Run this to add a new faculty member

INSERT INTO public.faculty_members (
    name,
    status,
    category,
    email,
    subject,
    gender,
    contact_no,
    whatsapp_no,
    prn
)
VALUES (
    'Dr. Albus Dumbledore',     -- Name
    'Dean of Faculty',          -- Status
    'faculty',                  -- Category
    'dumbledore@hogwarts.edu',  -- Email
    'Leadership Studies',       -- Subject
    'male',                     -- Gender
    '+1 (555) 001-0001',       -- Contact
    '+1 (555) 001-0001',       -- WhatsApp
    NULL                        -- PRN (NULL for faculty)
)
RETURNING *;


-- ================================================================
-- 5. ADD NEW FELLOW/SCHOLAR (Example)
-- ================================================================
-- Run this to add a new scholar

INSERT INTO public.faculty_members (
    name,
    status,
    category,
    email,
    subject,
    gender,
    contact_no,
    whatsapp_no,
    prn
)
VALUES (
    'Harry Potter',            -- Name
    'Research Fellow',         -- Status
    'fellows',                 -- Category
    'harry@hogwarts.edu',     -- Email
    'Computer Science',       -- Subject
    'male',                   -- Gender
    '+1 (555) 123-4567',     -- Contact
    '+1 (555) 123-4567',     -- WhatsApp
    '20010'                   -- PRN/Student ID
)
RETURNING *;


-- ================================================================
-- 6. UPDATE EXISTING MEMBER (Example)
-- ================================================================
-- Update a member's details (change the id in WHERE clause)

UPDATE public.faculty_members
SET
    name = 'Prof. Minerva McGonagall',
    status = 'Head of Department',
    email = 'mcgonagall@hogwarts.edu',
    subject = 'Business Operations',
    gender = 'female',
    contact_no = '+1 (555) 001-0002',
    whatsapp_no = '+1 (555) 001-0002'
WHERE id = 1  -- Change this to the actual ID
RETURNING *;


-- ================================================================
-- 7. DELETE A MEMBER (Example)
-- ================================================================
-- WARNING: This permanently deletes a member

DELETE FROM public.faculty_members
WHERE id = 999;  -- Change to actual ID (use with caution!)


-- ================================================================
-- 8. BULK INSERT - Add Multiple Members at Once
-- ================================================================

INSERT INTO public.faculty_members (
    name, status, category, email, subject, gender, contact_no, whatsapp_no, prn
)
VALUES
    ('Dr. Albus Dumbledore', 'Dean of Faculty', 'faculty', 'dumbledore@hogwarts.edu', 'Leadership Studies', 'male', '+1 (555) 001-0001', '+1 (555) 001-0001', NULL),
    ('Prof. Minerva McGonagall', 'Head of Department', 'faculty', 'mcgonagall@hogwarts.edu', 'Business Operations', 'female', '+1 (555) 001-0002', '+1 (555) 001-0002', NULL),
    ('Hermione Granger', 'Research Fellow', 'fellows', 'hermione@hogwarts.edu', 'Data Science', 'female', '+1 (555) 100-0001', '+1 (555) 100-0001', '20001'),
    ('Harry Potter', 'Student', 'fellows', 'harry@hogwarts.edu', 'Computer Science', 'male', '+1 (555) 100-0002', '+1 (555) 100-0002', '20010')
RETURNING *;


-- ================================================================
-- 9. SEARCH BY NAME
-- ================================================================

SELECT *
FROM public.faculty_members
WHERE name ILIKE '%Harry%'  -- Case-insensitive search
ORDER BY id ASC;


-- ================================================================
-- 10. COUNT MEMBERS BY CATEGORY
-- ================================================================

SELECT 
    category,
    COUNT(*) as total
FROM public.faculty_members
GROUP BY category;


-- ================================================================
-- NOTES
-- ================================================================
-- 1. RETURNING * shows the inserted/updated row after the operation
-- 2. Use actual IDs when updating/deleting (check with SELECT first)
-- 3. The 'prn' column is optional (use NULL for faculty members)
-- 4. All queries respect Row Level Security policies if enabled

