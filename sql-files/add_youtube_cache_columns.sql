-- ==========================================
-- Add Caching Columns to youtube_library
-- ==========================================

-- 1. Add video_payload column (JSONB)
ALTER TABLE youtube_library 
ADD COLUMN IF NOT EXISTS video_payload JSONB;

-- 2. Add updated_at column
ALTER TABLE youtube_library 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. Update existing RLS policies or add security rules if necessary
-- By default, if the service role is used for backend operations, it will bypass RLS.
-- This ensures the client cannot directly update video_payload.

DO $$
BEGIN
    RAISE NOTICE '✅ Added caching columns to youtube_library!';
END $$;
