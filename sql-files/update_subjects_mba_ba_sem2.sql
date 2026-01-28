-- ==========================================
-- Update Subjects for MBA (BA) - II, Semester II
-- Academic Year: 2025-2026
-- Institution: Sandip University
-- School: School of Commerce & Management Studies
-- ==========================================

-- Ensure all subjects for MBA (BA) - II Semester II exist in the subjects table
-- This script will insert new subjects if they don't exist

-- Clear existing MBA (BA) II subjects (if you want a fresh start)
-- DELETE FROM public.subjects WHERE code LIKE 'PBA2%';

-- Insert or Update subjects using UPSERT (ON CONFLICT)
INSERT INTO public.subjects (id, code, title, icon, color, description, progress, unit_count, last_studied, syllabus_pdf_url)
VALUES
  ('pba204', 'PBA204', 'Production and Operations Management', '🏭', '#3B82F6', 'L: 3, T: 1, P: 0 - Faculty: Dr. Shailendra Baraniya', 0, 0, NULL, NULL),
  ('pba205', 'PBA205', 'Digital Transformation', '💻', '#8B5CF6', 'L: 3, T: 1, P: 0 - Faculty: Mr. Aniket Alvekar', 0, 0, NULL, NULL),
  ('pba206', 'PBA206', 'Legal Aspects of Business', '⚖️', '#EF4444', 'L: 4, T: 0, P: 0 - Faculty: Adv. Vishal Jadhav', 0, 0, NULL, NULL),
  ('pba207', 'PBA207', 'Data Visualization and Story Telling', '📊', '#10B981', 'L: 3, T: 0, P: 1 - Faculty: Dr. Samadhan Bundhe', 0, 0, NULL, NULL),
  ('pba208', 'PBA208', 'Business Research Methods', '🔬', '#F59E0B', 'L: 3, T: 1, P: 0 - Faculty: Dr. Zahir Shaikh', 0, 0, NULL, NULL),
  ('pba211', 'PBA211', 'Data Analysis using Python', '🐍', '#06B6D4', 'L: 1, T: 0, P: 3 - Faculty: Mr. Aniket Alvekar', 0, 0, NULL, NULL),
  ('pba212', 'PBA212', 'Data Analysis using Power BI', '📈', '#EC4899', 'L: 0, T: 0, P: 4 - Faculty: Dr. Samadhan Bundhe', 0, 0, NULL, NULL),
  ('pba213', 'PBA213', 'Business Communication Skills - II', '💬', '#6366F1', 'L: 0, T: 0, P: 2 - Faculty: Mrs. Prachi Muskar', 0, 0, NULL, NULL)
ON CONFLICT (id) 
DO UPDATE SET
  code = EXCLUDED.code,
  title = EXCLUDED.title,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  description = EXCLUDED.description;

-- ==========================================
-- VERIFICATION QUERY
-- ==========================================
-- Run this to verify the subjects were inserted/updated correctly
-- SELECT code, title, icon, color, description FROM public.subjects WHERE code LIKE 'PBA2%' ORDER BY code;
