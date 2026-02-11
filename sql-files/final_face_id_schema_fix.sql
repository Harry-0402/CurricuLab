-- Final Database Schema Fixes for Face ID and Daily Attendance

-- 1. Ensure profiles have Face ID status
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS has_face_id BOOLEAN DEFAULT FALSE;

-- 2. Add verification proof support to attendance logs
ALTER TABLE attendance_logs 
ADD COLUMN IF NOT EXISTS verification_image_url TEXT;

-- 3. Add unique constraint for efficient bulk upserts used by "Daily Check-in"
-- This prevents duplicate logs for the same user, subject, and date.
ALTER TABLE attendance_logs
DROP CONSTRAINT IF EXISTS unique_user_subject_date;

ALTER TABLE attendance_logs
ADD CONSTRAINT unique_user_subject_date UNIQUE (user_id, subject_id, date);

-- 4. Add comments for clarity
COMMENT ON COLUMN profiles.has_face_id IS 'Indicates if the user has enrolled their face for biometric verification.';
COMMENT ON COLUMN attendance_logs.verification_image_url IS 'Public URL of the photo captured during attendance verification (Face ID).';
