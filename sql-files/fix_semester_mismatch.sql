-- Add semester_id to announcements
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS semester_id UUID REFERENCES semesters(id);

-- Add semester_id to faculty_members
ALTER TABLE faculty_members ADD COLUMN IF NOT EXISTS semester_id UUID REFERENCES semesters(id);

-- Enable RLS and Realtime (If not already)
ALTER PUBLICATION supabase_realtime ADD TABLE announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE faculty_members;
ALTER PUBLICATION supabase_realtime ADD TABLE programs;
ALTER PUBLICATION supabase_realtime ADD TABLE semesters;
ALTER PUBLICATION supabase_realtime ADD TABLE timetable;
ALTER PUBLICATION supabase_realtime ADD TABLE subjects;
