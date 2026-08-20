-- ============================================================
-- Update Subjects for MBA (BA) - Semester III
-- Academic Year: 2026-2027
-- Effective From: 01/07/2026
-- ============================================================

-- 1. Update PBA311 (Data Visualization using Tableau)
UPDATE public.subjects 
SET 
  title = 'Data Visualization using Tableau',
  icon = '📊'
WHERE code = 'PBA311' AND semester_id = 'd4e5f6a7-0003-0000-0000-000000000003';

-- 2. Ensure PBAG04 (Innovation, Business Models and Entrepreneurship) is correct
UPDATE public.subjects 
SET 
  code = 'PBAG04',
  title = 'Innovation, Business Models and Entrepreneurship',
  icon = '💡'
WHERE code IN ('PBAGE', 'PBAG04') AND semester_id = 'd4e5f6a7-0003-0000-0000-000000000003';

-- 3. Ensure PBA312 (Business Communication Skills - III) is correct
UPDATE public.subjects 
SET 
  code = 'PBA312',
  title = 'Business Communication Skills - III',
  icon = '💬'
WHERE code IN ('PBA309', 'PBA312') AND semester_id = 'd4e5f6a7-0003-0000-0000-000000000003';

-- 4. Ensure VAP (Basics of Excel) exists
INSERT INTO public.subjects (id, semester_id, code, title, icon, color, description, unit_count, progress)
VALUES (
  'sem3-vap-subject',
  'd4e5f6a7-0003-0000-0000-000000000003',
  'VAP',
  'Basics of Excel (VAP)',
  '📊',
  '#10B981',
  'Value Added Program covering basics of Excel.',
  5,
  0
)
ON CONFLICT (id) DO UPDATE 
SET 
  code = EXCLUDED.code,
  title = EXCLUDED.title,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  description = EXCLUDED.description;
