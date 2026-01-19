-- =====================================================
-- Prevent Duplicate Attendance Entries
-- =====================================================
-- This ensures only ONE attendance entry per user/subject/date
-- Automatically replaces old entries when logging new attendance
-- =====================================================

-- Step 1: Add a unique constraint (prevents duplicates)
-- Note: We use date::date to ignore the time component
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_attendance 
ON attendance_logs (user_id, subject_name, (date::date));

-- Step 2: Create a function to delete old entries before insert
CREATE OR REPLACE FUNCTION delete_duplicate_attendance()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete any existing attendance for same user, subject, and date
  DELETE FROM attendance_logs
  WHERE user_id = NEW.user_id
    AND subject_name = NEW.subject_name
    AND date::date = NEW.date::date
    AND id != NEW.id;  -- Don't delete the current record if updating
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Create trigger to run before insert/update
DROP TRIGGER IF EXISTS trig_delete_duplicate_attendance ON attendance_logs;

CREATE TRIGGER trig_delete_duplicate_attendance
BEFORE INSERT OR UPDATE ON attendance_logs
FOR EACH ROW
EXECUTE FUNCTION delete_duplicate_attendance();

-- =====================================================
-- How it works:
-- =====================================================
-- 1. When you log attendance for "Production Mgmt" on "2026-01-19"
-- 2. The trigger automatically deletes any existing entry for that same date/subject
-- 3. Then inserts the new entry
-- 4. No more duplicate entries!
-- =====================================================
