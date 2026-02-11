-- Add face_descriptor column to profiles table to store the 128-float vector from face-api.js
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS face_descriptor JSONB;

COMMENT ON COLUMN profiles.face_descriptor IS 'Stores the 128-float face descriptor vector from face-api.js for biometric verification.';
