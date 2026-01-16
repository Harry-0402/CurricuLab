-- ================================================================
-- Seed MBA(BA) Students as Fellows
-- ================================================================
-- Run this in Supabase SQL Editor to add the students
-- ================================================================

INSERT INTO public.faculty_members (
    prn,
    name,
    contact_no,
    email,
    category,
    status,
    subject,
    gender,
    whatsapp_no
)
VALUES
    ('250102041001', 'GEORGETTA DIODAE WILSON', '7775066089', 'georgettawilson44@gmail.com', 'fellows', 'MBA Student', 'MBA(BA)', 'female', '7775066089'),
    ('250102041002', 'AKASH JAYAPRAKASH MANGALAMTHODI', '9420475026', 'akashmangalam73857@gmail.com', 'fellows', 'MBA Student', 'MBA(BA)', 'male', '9420475026'),
    ('250102041003', 'TANU CHAUDHARY', '8931075330', 'ctanu608@gmail.com', 'fellows', 'MBA Student', 'MBA(BA)', 'female', '8931075330'),
    ('250102041004', 'KAUSTUBH KHUSHAL NANDURKAR', '8080001550', 'kaustubh21112002@gmail.com', 'fellows', 'MBA Student', 'MBA(BA)', 'male', '8080001550'),
    ('250102041005', 'VEERAMALLA MANI SHANKAR', '86888426036', 'veeramallamani7@gmail.com', 'fellows', 'MBA Student', 'MBA(BA)', 'male', '86888426036'),
    ('250102041006', 'SHAH KAIF JAVED', '7666150737', 'kaifjshah@gmail.com', 'fellows', 'MBA Student', 'MBA(BA)', 'male', '7666150737'),
    ('250102041007', 'CHAVAN HARISH RAVINDRA', '7030430756', 'hrchavan0402@gmail.com', 'fellows', 'MBA Student', 'MBA(BA)', 'male', '7030430756'),
    ('250102041008', 'ANUKRITI SRIVASTAVA', '7007334139', 'anukritisrivastava04@gmail.com', 'fellows', 'MBA Student', 'MBA(BA)', 'female', '7007334139'),
    ('25SUN0446', 'DIVYA SHAHI', '9214867985', 'shahidivya38@gamil.com', 'fellows', 'MBA Student', 'MBA(BA)', 'female', '9214867985'),
    ('25SUN0970', 'TEJAS SANJAY PATIL', '9673662750', 'tejaspatil78787@gmail.com', 'fellows', 'MBA Student', 'MBA(BA)', 'male', '9673662750');

-- Verify insertion
SELECT * FROM public.faculty_members WHERE category = 'fellows' ORDER BY id DESC LIMIT 10;
