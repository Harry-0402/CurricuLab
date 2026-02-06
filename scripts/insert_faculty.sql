-- Dr. Shailendra Baraniya
INSERT INTO public.faculty_members (name, status, category, email, subject, gender, contact_no)
SELECT 'Dr. Shailendra Baraniya', 'Professor', 'faculty', NULL, 'Production and Operations Management', 'male', NULL
WHERE NOT EXISTS (SELECT 1 FROM public.faculty_members WHERE name = 'Dr. Shailendra Baraniya');

-- Mr. Aniket Alvekar (Teaches 2 Subjects)
INSERT INTO public.faculty_members (name, status, category, email, subject, gender, contact_no)
SELECT 'Mr. Aniket Alvekar', 'Assistant Professor', 'faculty', NULL, 'Digital Transformation & Data Analysis', 'male', NULL
WHERE NOT EXISTS (SELECT 1 FROM public.faculty_members WHERE name = 'Mr. Aniket Alvekar');

-- Adv. Vishal Jadhav
INSERT INTO public.faculty_members (name, status, category, email, subject, gender, contact_no)
SELECT 'Adv. Vishal Jadhav', 'Professor', 'faculty', NULL, 'Legal Aspects of Business', 'male', NULL
WHERE NOT EXISTS (SELECT 1 FROM public.faculty_members WHERE name = 'Adv. Vishal Jadhav');

-- Dr. Zahir Shaikh
INSERT INTO public.faculty_members (name, status, category, email, subject, gender, contact_no)
SELECT 'Dr. Zahir Shaikh', 'Professor', 'faculty', NULL, 'Business Research Methods', 'male', NULL
WHERE NOT EXISTS (SELECT 1 FROM public.faculty_members WHERE name = 'Dr. Zahir Shaikh');

-- Mrs. Prachi Muskar
INSERT INTO public.faculty_members (name, status, category, email, subject, gender, contact_no)
SELECT 'Mrs. Prachi Muskar', 'Assistant Professor', 'faculty', NULL, 'Business Communication Skills-II', 'female', NULL
WHERE NOT EXISTS (SELECT 1 FROM public.faculty_members WHERE name = 'Mrs. Prachi Muskar');

-- Dr. Samadhan Bundhe (Update logic if he exists, or insert if not)
-- Since he might already be in the DB (per your screenshots), we might need an UPDATE statement for him to show both subjects.
UPDATE public.faculty_members
SET subject = 'Data Visualization & Power BI'
WHERE name = 'Dr. Samadhan Bundhe';
