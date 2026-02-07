-- Add Telegram session and phone columns to authorized_users table
ALTER TABLE public.authorized_users 
ADD COLUMN IF NOT EXISTS telegram_session text,
ADD COLUMN IF NOT EXISTS telegram_phone text;

-- Add comment explaining the columns
COMMENT ON COLUMN public.authorized_users.telegram_session IS 'Encrypted Telegram session string for MTProto authentication';
COMMENT ON COLUMN public.authorized_users.telegram_phone IS 'Phone number associated with the Telegram account';
