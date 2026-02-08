-- Migration script to update community tables to use profiles instead of auth.users

-- Step 1: Drop existing foreign key constraints
ALTER TABLE IF EXISTS doubts 
DROP CONSTRAINT IF EXISTS doubts_user_id_fkey;

ALTER TABLE IF EXISTS doubt_comments 
DROP CONSTRAINT IF EXISTS doubt_comments_user_id_fkey;

-- Step 2: Add new foreign key constraints pointing to profiles
ALTER TABLE doubts 
ADD CONSTRAINT doubts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE doubt_comments 
ADD CONSTRAINT doubt_comments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
