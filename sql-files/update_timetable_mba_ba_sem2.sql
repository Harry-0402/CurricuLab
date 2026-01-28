-- ==========================================
-- Update Timetable for MBA (BA) - II, Semester II
-- Academic Year: 2025-2026
-- Effective From: 12/01/2026
-- Institution: Sandip University
-- School: School of Commerce & Management Studies
-- ==========================================

-- Clear existing timetable entries
DELETE FROM public.timetable;

-- ==========================================
-- MONDAY SCHEDULE
-- ==========================================
INSERT INTO public.timetable (id, day, subject_title, subject_code, location, start_time, end_time, teacher, progress)
VALUES
  ('mon-1015', 'Monday', 'Legal Aspects of Business', 'PBA206', 'TBD', '10:15 AM', '11:00 AM', 'Adv. Vishal Jadhav', 0),
  ('mon-1100', 'Monday', 'Digital Transformation', 'PBA205', 'TBD', '11:00 AM', '12:00 PM', 'Mr. Aniket Alvekar', 0),
  ('mon-1200', 'Monday', 'Production and Operations Management', 'PBA204', 'TBD', '12:00 PM', '01:00 PM', 'Dr. Shailendra Baraniya', 0),
  ('mon-1400', 'Monday', 'Data Visualization and Story Telling', 'PBA207', 'TBD', '02:00 PM', '03:00 PM', 'Dr. Samadhan Bundhe', 0),
  ('mon-1500', 'Monday', 'Business Research Methods', 'PBA208', 'TBD', '03:00 PM', '04:00 PM', 'Dr. Zahir Shaikh', 0),
  ('mon-1600', 'Monday', 'Data Analysis using Power BI (P)', 'PBA212', 'TBD', '04:00 PM', '05:00 PM', 'Dr. Samadhan Bundhe', 0);

-- ==========================================
-- TUESDAY SCHEDULE
-- ==========================================
INSERT INTO public.timetable (id, day, subject_title, subject_code, location, start_time, end_time, teacher, progress)
VALUES
  ('tue-1015', 'Tuesday', 'Legal Aspects of Business', 'PBA206', 'TBD', '10:15 AM', '11:00 AM', 'Adv. Vishal Jadhav', 0),
  ('tue-1100', 'Tuesday', 'Business Research Methods', 'PBA208', 'TBD', '11:00 AM', '12:00 PM', 'Dr. Zahir Shaikh', 0),
  ('tue-1200', 'Tuesday', 'Production and Operations Management (T)', 'PBA204', 'TBD', '12:00 PM', '01:00 PM', 'Dr. Shailendra Baraniya', 0),
  ('tue-1400', 'Tuesday', 'Data Analysis using Python (P)', 'PBA211', 'TBD', '02:00 PM', '03:00 PM', 'Mr. Aniket Alvekar', 0),
  ('tue-1500', 'Tuesday', 'Data Analysis using Power BI (P)', 'PBA212', 'TBD', '03:00 PM', '04:00 PM', 'Dr. Samadhan Bundhe', 0),
  ('tue-1600', 'Tuesday', 'Digital Transformation', 'PBA205', 'TBD', '04:00 PM', '05:00 PM', 'Mr. Aniket Alvekar', 0);

-- ==========================================
-- WEDNESDAY SCHEDULE
-- ==========================================
INSERT INTO public.timetable (id, day, subject_title, subject_code, location, start_time, end_time, teacher, progress)
VALUES
  ('wed-1015', 'Wednesday', 'Legal Aspects of Business', 'PBA206', 'TBD', '10:15 AM', '11:00 AM', 'Adv. Vishal Jadhav', 0),
  ('wed-1100', 'Wednesday', 'Business Research Methods', 'PBA208', 'TBD', '11:00 AM', '12:00 PM', 'Dr. Zahir Shaikh', 0),
  ('wed-1200', 'Wednesday', 'Data Visualization and Story Telling', 'PBA207', 'TBD', '12:00 PM', '01:00 PM', 'Dr. Samadhan Bundhe', 0),
  ('wed-1400', 'Wednesday', 'Data Analysis using Python (P)', 'PBA211', 'TBD', '02:00 PM', '03:00 PM', 'Mr. Aniket Alvekar', 0),
  ('wed-1500', 'Wednesday', 'Data Analysis using Power BI (P)', 'PBA212', 'TBD', '03:00 PM', '04:00 PM', 'Dr. Samadhan Bundhe', 0),
  ('wed-1600', 'Wednesday', 'Digital Transformation (T)', 'PBA205', 'TBD', '04:00 PM', '05:00 PM', 'Mr. Aniket Alvekar', 0);

-- ==========================================
-- THURSDAY SCHEDULE
-- ==========================================
INSERT INTO public.timetable (id, day, subject_title, subject_code, location, start_time, end_time, teacher, progress)
VALUES
  ('thu-1015', 'Thursday', 'Legal Aspects of Business', 'PBA206', 'TBD', '10:15 AM', '11:00 AM', 'Adv. Vishal Jadhav', 0),
  ('thu-1100', 'Thursday', 'Data Analysis using Python (P)', 'PBA211', 'TBD', '11:00 AM', '12:00 PM', 'Mr. Aniket Alvekar', 0),
  ('thu-1200', 'Thursday', 'Data Visualization and Story Telling', 'PBA207', 'TBD', '12:00 PM', '01:00 PM', 'Dr. Samadhan Bundhe', 0),
  ('thu-1400', 'Thursday', 'Production and Operations Management', 'PBA204', 'TBD', '02:00 PM', '03:00 PM', 'Dr. Shailendra Baraniya', 0),
  ('thu-1500', 'Thursday', 'Business Research Methods', 'PBA208', 'TBD', '03:00 PM', '04:00 PM', 'Dr. Zahir Shaikh', 0),
  ('thu-1600', 'Thursday', 'Data Analysis using Power BI (P)', 'PBA212', 'TBD', '04:00 PM', '05:00 PM', 'Dr. Samadhan Bundhe', 0);

-- ==========================================
-- FRIDAY SCHEDULE
-- ==========================================
INSERT INTO public.timetable (id, day, subject_title, subject_code, location, start_time, end_time, teacher, progress)
VALUES
  ('fri-1015', 'Friday', 'Production and Operations Management', 'PBA204', 'TBD', '10:15 AM', '11:00 AM', 'Dr. Shailendra Baraniya', 0),
  ('fri-1100', 'Friday', 'Digital Transformation', 'PBA205', 'TBD', '11:00 AM', '12:00 PM', 'Mr. Aniket Alvekar', 0),
  ('fri-1200', 'Friday', 'Data Visualization and Story Telling (P)', 'PBA207', 'TBD', '12:00 PM', '01:00 PM', 'Dr. Samadhan Bundhe', 0),
  ('fri-1400', 'Friday', 'Data Analysis using Python (P)', 'PBA211', 'TBD', '02:00 PM', '03:00 PM', 'Mr. Aniket Alvekar', 0),
  ('fri-1500', 'Friday', 'Business Communication Skills-II (P)', 'PBA213', 'TBD', '03:00 PM', '04:00 PM', 'Mrs. Prachi Muskar', 0),
  ('fri-1600', 'Friday', 'Business Communication Skills-II (P)', 'PBA213', 'TBD', '04:00 PM', '05:00 PM', 'Mrs. Prachi Muskar', 0);

-- ==========================================
-- SATURDAY SCHEDULE
-- ==========================================
INSERT INTO public.timetable (id, day, subject_title, subject_code, location, start_time, end_time, teacher, progress)
VALUES
  ('sat-1015', 'Saturday', 'VAP', 'VAP', 'TBD', '10:15 AM', '11:00 AM', 'TBD', 0),
  ('sat-1100', 'Saturday', 'VAP', 'VAP', 'TBD', '11:00 AM', '12:00 PM', 'TBD', 0);

-- ==========================================
-- VERIFICATION QUERY
-- ==========================================
-- Run this to verify the data was inserted correctly
-- SELECT day, subject_title, subject_code, teacher, start_time, end_time FROM public.timetable ORDER BY 
--   CASE day
--     WHEN 'Monday' THEN 1
--     WHEN 'Tuesday' THEN 2
--     WHEN 'Wednesday' THEN 3
--     WHEN 'Thursday' THEN 4
--     WHEN 'Friday' THEN 5
--     WHEN 'Saturday' THEN 6
--   END,
--   start_time;
