-- Add verification_image_url to attendance_logs
ALTER TABLE attendance_logs 
ADD COLUMN IF NOT EXISTS verification_image_url TEXT;

-- Create attendance_proofs bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('attendance_proofs', 'attendance_proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for attendance_proofs

-- Drop existing to avoid conflicts
DROP POLICY IF EXISTS "Public Access Proofs" ON storage.objects;
DROP POLICY IF EXISTS "User Upload Proofs" ON storage.objects;

-- Allow public read (for initial simplicity, or restrict to auth users)
CREATE POLICY "Public Access Proofs" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'attendance_proofs');

-- Allow authenticated users to upload
CREATE POLICY "User Upload Proofs" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'attendance_proofs' AND auth.uid() = owner);
