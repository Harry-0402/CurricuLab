-- =====================================================
-- CurricuLab Face ID & Profile Fixes
-- =====================================================
-- 1. Backfill missing profiles for existing users
-- 2. Fix RLS policies for profiles (Update/Upsert support)
-- 3. Fix Storage policies for attendance_proofs
-- =====================================================

-- ----------------------------
-- 1. PROFILE BACKFILL
-- ----------------------------
-- Ensure every user in auth.users has a matching row in public.profiles
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
    id, 
    email, 
    raw_user_meta_data->>'full_name',
    COALESCE(raw_user_meta_data->>'role', 'student')
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- ----------------------------
-- 2. PROFILE RLS POLICIES
-- ----------------------------
-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing to re-apply correctly
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON public.profiles;

-- Allow anyone to view profiles (needed for community/doubts)
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

-- Allow users to fully manage (Insert/Update/Upsert) their own profile
CREATE POLICY "Users can manage own profile" ON public.profiles
    FOR ALL
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ----------------------------
-- 3. ATTENDANCE PROOFS STORAGE
-- ----------------------------
-- Ensure the bucket exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('attendance_proofs', 'attendance_proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies
DROP POLICY IF EXISTS "Public Access Proofs" ON storage.objects;
DROP POLICY IF EXISTS "User Upload Proofs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload proofs" ON storage.objects;

-- Allow public read access to proofs
CREATE POLICY "Public Access Proofs" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'attendance_proofs');

-- Allow authenticated users to upload to their own folder (userId/filename)
-- We use a more permissive 'TO authenticated' without strict owner check if owner is null
CREATE POLICY "Authenticated users can upload proofs" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (
    bucket_id = 'attendance_proofs' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- DONE! Run this in Supabase SQL Editor.
-- =====================================================
