-- ================================================================
-- Seed MBA(BA) Students as Semester 3 Fellows & Scholars
-- ================================================================
-- Run this in your Supabase SQL Editor to seed the database table.
-- ================================================================

-- Clear existing fellows (Semester 3)
DELETE FROM public.faculty_members
WHERE category = 'fellows'
  AND semester_id = 'd4e5f6a7-0003-0000-0000-000000000003';

-- Insert all 10 MBA(BA) Semester 3 students
INSERT INTO public.faculty_members (
    prn,
    name,
    contact_no,
    email,
    category,
    status,
    subject,
    gender,
    whatsapp_no,
    semester_id
)
VALUES
    ('250102041001', 'Georgetta Diodae Wilson', '7775066089', 'georgettawilson44@gmail.com', 'fellows', 'MBA Student', 'Business Administration', 'female', '7775066089', 'd4e5f6a7-0003-0000-0000-000000000003'),
    ('250102041002', 'Akash Jayaprakash Mangalamthodi', '9420475026', 'akashmangalam73857@gmail.com', 'fellows', 'MBA Student', 'Business Administration', 'male', '9420475026', 'd4e5f6a7-0003-0000-0000-000000000003'),
    ('250102041003', 'Tanu Chaudhary', '8931075330', 'ctanu608@gmail.com', 'fellows', 'MBA Student', 'Business Administration', 'female', '8931075330', 'd4e5f6a7-0003-0000-0000-000000000003'),
    ('250102041004', 'Kaustubh Khushal Nandurkar', '8080001550', 'kaustubh2112002@gmail.com', 'fellows', 'MBA Student', 'Business Administration', 'male', '8080001550', 'd4e5f6a7-0003-0000-0000-000000000003'),
    ('250102041005', 'Veeramalla Mani Shankar', '8688426036', 'veeramallamani7@gmail.com', 'fellows', 'MBA Student', 'Business Administration', 'male', '8688426036', 'd4e5f6a7-0003-0000-0000-000000000003'),
    ('250102041006', 'Shah Kaif Javed', '7666150737', 'kaifjshah1313@gmail.com', 'fellows', 'MBA Student', 'Business Administration', 'male', '7666150737', 'd4e5f6a7-0003-0000-0000-000000000003'),
    ('250102041007', 'Chavan Harish Ravindra', '7030430756', 'hrchavan0402@gmail.com', 'fellows', 'MBA Student', 'Business Administration', 'male', '7030430756', 'd4e5f6a7-0003-0000-0000-000000000003'),
    ('250102041008', 'Anukriti Srivastava', '7007334139', 'anukritisrivastava04@gmail.com', 'fellows', 'MBA Student', 'Business Administration', 'female', '7007334139', 'd4e5f6a7-0003-0000-0000-000000000003'),
    ('250102041009', 'Divya Shahi', '9214867985', 'shahidivya38@gamil.com', 'fellows', 'MBA Student', 'Business Administration', 'female', '9214867985', 'd4e5f6a7-0003-0000-0000-000000000003'),
    ('250102041010', 'Tejas Sanjay Patil', '9673662750', 'tejaspatil78787@gmail.com', 'fellows', 'MBA Student', 'Business Administration', 'male', '9673662750', 'd4e5f6a7-0003-0000-0000-000000000003');

