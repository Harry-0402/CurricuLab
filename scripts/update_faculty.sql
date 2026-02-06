-- Update Dr. Shailendra Baraniya
UPDATE public.faculty_members
SET 
    status = 'Professor',
    category = 'faculty',
    subject = 'Production and Operations Management',
    gender = 'male',
    email = NULL,
    contact_no = NULL
WHERE name = 'Dr. Shailendra Baraniya';

-- Update Mr. Aniket Alvekar (Combined Subjects)
UPDATE public.faculty_members
SET 
    status = 'Assistant Professor',
    category = 'faculty',
    subject = 'Digital Transformation & Data Analysis',
    gender = 'male',
    email = NULL,
    contact_no = NULL
WHERE name = 'Mr. Aniket Alvekar';

-- Update Adv. Vishal Jadhav
UPDATE public.faculty_members
SET 
    status = 'Professor',
    category = 'faculty',
    subject = 'Legal Aspects of Business',
    gender = 'male',
    email = NULL,
    contact_no = NULL
WHERE name = 'Adv. Vishal Jadhav';

-- Update Dr. Zahir Shaikh
UPDATE public.faculty_members
SET 
    status = 'Professor',
    category = 'faculty',
    subject = 'Business Research Methods',
    gender = 'male',
    email = NULL,
    contact_no = NULL
WHERE name = 'Dr. Zahir Shaikh';

-- Update Mrs. Prachi Muskar
UPDATE public.faculty_members
SET 
    status = 'Assistant Professor',
    category = 'faculty',
    subject = 'Business Communication Skills-II',
    gender = 'female',
    email = NULL,
    contact_no = NULL
WHERE name = 'Mrs. Prachi Muskar';

-- Update Dr. Samadhan Bundhe (Combined Subjects)
UPDATE public.faculty_members
SET 
    subject = 'Data Visualization & Power BI'
WHERE name = 'Dr. Samadhan Bundhe';
