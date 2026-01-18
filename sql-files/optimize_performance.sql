-- Add indexes to improve query performance for attendance and changelogs

-- 1. Index for fetching attendance logs by user (used in AttendanceWidget)
CREATE INDEX IF NOT EXISTS idx_attendance_logs_user_id ON attendance_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_logs_date ON attendance_logs(date);
CREATE INDEX IF NOT EXISTS idx_attendance_logs_subject_id ON attendance_logs(subject_id);

-- 2. Index for fetching changelogs (used in Profile History)
-- We often query by timestamp desc
CREATE INDEX IF NOT EXISTS idx_change_logs_timestamp ON change_logs(timestamp DESC);

-- 3. Composite index for faster overlap checks?
-- For checking if a log exists for a specific user, subject, and date
CREATE INDEX IF NOT EXISTS idx_attendance_logs_composite ON attendance_logs(user_id, subject_id, date);

-- 4. Index for subjects (usually PK is indexed, but just in case we query by code often)
CREATE INDEX IF NOT EXISTS idx_subjects_code ON subjects(code);
