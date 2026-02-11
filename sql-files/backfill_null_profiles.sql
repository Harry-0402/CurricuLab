-- Backfill missing profile data from auth.users metadata
UPDATE public.profiles p
SET
  full_name = u.raw_user_meta_data->>'full_name',
  avatar_url = u.raw_user_meta_data->>'avatar_url',
  email = u.email,
  updated_at = NOW()
FROM auth.users u
WHERE p.id = u.id
AND (
  p.full_name IS NULL OR 
  p.avatar_url IS NULL OR 
  p.email IS NULL
)
AND (
  u.raw_user_meta_data->>'full_name' IS NOT NULL OR 
  u.raw_user_meta_data->>'avatar_url' IS NOT NULL OR
  u.email != p.email
);
