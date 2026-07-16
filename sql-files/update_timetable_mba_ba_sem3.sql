-- ============================================================
-- Update Timetable for MBA (BA) - Semester III
-- Academic Year: 2026-2027
-- Effective From: 01/07/2026
-- Institution: Sandip University
-- School: School of Commerce & Management Studies
-- ============================================================

-- Clear existing timetable entries for Semester 3
DELETE FROM public.timetable WHERE semester_id = 'd4e5f6a7-0003-0000-0000-000000000003';

-- MONDAY
INSERT INTO public.timetable (id, day, subject_title, subject_code, location, start_time, end_time, teacher, progress, semester_id)
VALUES
  ('sem3-mon-1015', 'Monday', 'Data Visualization using Tableau', 'PBA311', 'TBD', '10:15 AM', '11:00 AM', 'Dr. Samadhan Bundhe', 0, 'd4e5f6a7-0003-0000-0000-000000000003'),
  ('sem3-mon-1100', 'Monday', 'Innovation, Business Models and Entrepreneurship', 'PBAGE', 'TBD', '11:00 AM', '12:00 PM', 'Mr. Aniket Alvekar', 0, 'd4e5f6a7-0003-0000-0000-000000000003'),
  ('sem3-mon-1200', 'Monday', 'Big Data Analytics', 'PBA301', 'TBD', '12:00 PM', '01:00 PM', 'Mr. Aniket Alvekar', 0, 'd4e5f6a7-0003-0000-0000-000000000003'),
  ('sem3-mon-1400', 'Monday', 'Financial Analytics', 'PBAE03', 'TBD', '02:00 PM', '03:00 PM', 'Dr. Anand Kumar', 0, 'd4e5f6a7-0003-0000-0000-000000000003'),
  ('sem3-mon-1500', 'Monday', 'AI for Managers', 'PBA303', 'TBD', '03:00 PM', '04:00 PM', 'Mr. Aniket Alvekar', 0, 'd4e5f6a7-0003-0000-0000-000000000003'),
  ('sem3-mon-1600', 'Monday', 'Financial Analytics', 'PBAE03', 'TBD', '04:00 PM', '05:00 PM', 'Dr. Anand Kumar', 0, 'd4e5f6a7-0003-0000-0000-000000000003');

-- TUESDAY
INSERT INTO public.timetable (id, day, subject_title, subject_code, location, start_time, end_time, teacher, progress, semester_id)
VALUES
  ('sem3-tue-1015', 'Tuesday', 'Financial Analytics', 'PBAE03', 'TBD', '10:15 AM', '11:00 AM', 'Dr. Anand Kumar', 0, 'd4e5f6a7-0003-0000-0000-000000000003'),
  ('sem3-tue-1100', 'Tuesday', 'Design Thinking', 'PBA304', 'TBD', '11:00 AM', '12:00 PM', 'Dr. Tanaya Patil', 0, 'd4e5f6a7-0003-0000-0000-000000000003'),
  ('sem3-tue-1200', 'Tuesday', 'Machine Learning with Business Application', 'PBA302', 'TBD', '12:00 PM', '01:00 PM', 'Mr. Aniket Alvekar', 0, 'd4e5f6a7-0003-0000-0000-000000000003'),
  ('sem3-tue-1400', 'Tuesday', 'AI for Managers', 'PBA303', 'TBD', '02:00 PM', '03:00 PM', 'Mr. Aniket Alvekar', 0, 'd4e5f6a7-0003-0000-0000-000000000003'),
  ('sem3-tue-1500', 'Tuesday', 'Data Visualization using Tableau', 'PBA311', 'TBD', '03:00 PM', '04:00 PM', 'Dr. Samadhan Bundhe', 0, 'd4e5f6a7-0003-0000-0000-000000000003'),
  ('sem3-tue-1600', 'Tuesday', 'Innovation, Business Models and Entrepreneurship', 'PBAGE', 'TBD', '04:00 PM', '05:00 PM', 'Mr. Aniket Alvekar', 0, 'd4e5f6a7-0003-0000-0000-000000000003');

-- WEDNESDAY
INSERT INTO public.timetable (id, day, subject_title, subject_code, location, start_time, end_time, teacher, progress, semester_id)
VALUES
  ('sem3-wed-1015', 'Wednesday', 'Data Visualization using Tableau', 'PBA311', 'TBD', '10:15 AM', '11:00 AM', 'Dr. Samadhan Bundhe', 0, 'd4e5f6a7-0003-0000-0000-000000000003'),
  ('sem3-wed-1100', 'Wednesday', 'Design Thinking', 'PBA304', 'TBD', '11:00 AM', '12:00 PM', 'Dr. Tanaya Patil', 0, 'd4e5f6a7-0003-0000-0000-000000000003'),
  ('sem3-wed-1200', 'Wednesday', 'Big Data Analytics', 'PBA301', 'TBD', '12:00 PM', '01:00 PM', 'Mr. Aniket Alvekar', 0, 'd4e5f6a7-0003-0000-0000-000000000003'),
  ('sem3-wed-1400', 'Wednesday', 'Machine Learning with Business Application', 'PBA302', 'TBD', '02:00 PM', '03:00 PM', 'Mr. Aniket Alvekar', 0, 'd4e5f6a7-0003-0000-0000-000000000003'),
  ('sem3-wed-1500', 'Wednesday', 'AI for Managers', 'PBA303', 'TBD', '03:00 PM', '04:00 PM', 'Mr. Aniket Alvekar', 0, 'd4e5f6a7-0003-0000-0000-000000000003'),
  ('sem3-wed-1600', 'Wednesday', 'Financial Analytics', 'PBAE03', 'TBD', '04:00 PM', '05:00 PM', 'Dr. Anand Kumar', 0, 'd4e5f6a7-0003-0000-0000-000000000003');

-- THURSDAY
INSERT INTO public.timetable (id, day, subject_title, subject_code, location, start_time, end_time, teacher, progress, semester_id)
VALUES
  ('sem3-thu-1015', 'Thursday', 'Data Visualization using Tableau', 'PBA311', 'TBD', '10:15 AM', '11:00 AM', 'Dr. Samadhan Bundhe', 0, 'd4e5f6a7-0003-0000-0000-000000000003'),
  ('sem3-thu-1100', 'Thursday', 'Design Thinking', 'PBA304', 'TBD', '11:00 AM', '12:00 PM', 'Dr. Tanaya Patil', 0, 'd4e5f6a7-0003-0000-0000-000000000003'),
  ('sem3-thu-1200', 'Thursday', 'Big Data Analytics', 'PBA301', 'TBD', '12:00 PM', '01:00 PM', 'Mr. Aniket Alvekar', 0, 'd4e5f6a7-0003-0000-0000-000000000003'),
  ('sem3-thu-1400', 'Thursday', 'Machine Learning with Business Application', 'PBA302', 'TBD', '02:00 PM', '03:00 PM', 'Mr. Aniket Alvekar', 0, 'd4e5f6a7-0003-0000-0000-000000000003'),
  ('sem3-thu-1500', 'Thursday', 'AI for Managers', 'PBA303', 'TBD', '03:00 PM', '04:00 PM', 'Mr. Aniket Alvekar', 0, 'd4e5f6a7-0003-0000-0000-000000000003');

-- FRIDAY
INSERT INTO public.timetable (id, day, subject_title, subject_code, location, start_time, end_time, teacher, progress, semester_id)
VALUES
  ('sem3-fri-1015', 'Friday', 'Innovation, Business Models and Entrepreneurship', 'PBAGE', 'TBD', '10:15 AM', '11:00 AM', 'Mr. Aniket Alvekar', 0, 'd4e5f6a7-0003-0000-0000-000000000003'),
  ('sem3-fri-1100', 'Friday', 'Design Thinking', 'PBA304', 'TBD', '11:00 AM', '12:00 PM', 'Dr. Tanaya Patil', 0, 'd4e5f6a7-0003-0000-0000-000000000003'),
  ('sem3-fri-1200', 'Friday', 'Big Data Analytics', 'PBA301', 'TBD', '12:00 PM', '01:00 PM', 'Mr. Aniket Alvekar', 0, 'd4e5f6a7-0003-0000-0000-000000000003'),
  ('sem3-fri-1400', 'Friday', 'Machine Learning with Business Application', 'PBA302', 'TBD', '02:00 PM', '03:00 PM', 'Mr. Aniket Alvekar', 0, 'd4e5f6a7-0003-0000-0000-000000000003'),
  ('sem3-fri-1500', 'Friday', 'Innovation, Business Models and Entrepreneurship', 'PBAGE', 'TBD', '03:00 PM', '04:00 PM', 'Mr. Aniket Alvekar', 0, 'd4e5f6a7-0003-0000-0000-000000000003');

-- SATURDAY
INSERT INTO public.timetable (id, day, subject_title, subject_code, location, start_time, end_time, teacher, progress, semester_id)
VALUES
  ('sem3-sat-1015', 'Saturday', 'Business Communication Skills - III', 'PBA309', 'TBD', '10:15 AM', '11:00 AM', '', 0, 'd4e5f6a7-0003-0000-0000-000000000003'),
  ('sem3-sat-1100', 'Saturday', 'Business Communication Skills - III', 'PBA309', 'TBD', '11:00 AM', '12:00 PM', '', 0, 'd4e5f6a7-0003-0000-0000-000000000003'),
  ('sem3-sat-1200', 'Saturday', 'Basics of Excel (VAP)', 'VAP', 'TBD', '12:00 PM', '01:00 PM', 'Dr. Sreekanth', 0, 'd4e5f6a7-0003-0000-0000-000000000003'),
  ('sem3-sat-1400', 'Saturday', 'Basics of Excel (VAP)', 'VAP', 'TBD', '02:00 PM', '03:00 PM', 'Dr. Sreekanth', 0, 'd4e5f6a7-0003-0000-0000-000000000003');
