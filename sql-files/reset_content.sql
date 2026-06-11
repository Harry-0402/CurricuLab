-- Massive Data Deletion for "Refresh Start"
-- WARNING: This deletes ALL content while keeping structural data (programs, semesters, users)

-- 1. Disable RLS temporarily to allow bulk deletes if needed, or just execute as postgres/admin
-- Assuming this is run as admin/postgres, it ignores RLS.

DELETE FROM classroom_materials;
DELETE FROM markwise_questions;
DELETE FROM questions;
DELETE FROM assignments;
DELETE FROM vault_resources;
DELETE FROM units;
DELETE FROM timetable;
DELETE FROM announcements;
DELETE FROM faculty_members;
DELETE FROM subjects;

-- Do we want to delete jobs and community posts? Yes, for a full refresh.
DELETE FROM jobs;
DELETE FROM community_posts;

-- Also clear out changelog just in case
DELETE FROM changelogs;

-- Re-enable RLS is handled automatically if we didn't disable it (we didn't).

-- 2. Add semester_id to tables if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'semester_id') THEN
        ALTER TABLE announcements ADD COLUMN semester_id UUID REFERENCES semesters(id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'faculty_members' AND column_name = 'semester_id') THEN
        ALTER TABLE faculty_members ADD COLUMN semester_id UUID REFERENCES semesters(id);
    END IF;
END $$;

-- 3. Enable Realtime for all tables if not already
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'announcements') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE announcements;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'faculty_members') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE faculty_members;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'subjects') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE subjects;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'timetable') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE timetable;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Handle case where publication doesn't exist or table is already in it
        NULL;
END $$;
