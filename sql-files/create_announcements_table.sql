-- =============================================
-- Announcements Table for Real-time Updates
-- =============================================

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error')),
    headline TEXT NOT NULL,
    message TEXT NOT NULL,
    resource_link TEXT,  -- Optional link to a resource
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns if table already exists
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS resource_link TEXT;
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Enable Row Level Security
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read active announcements" ON announcements;
DROP POLICY IF EXISTS "Authenticated users can manage announcements" ON announcements;

-- Policy: All authenticated users can read active announcements
CREATE POLICY "Anyone can read active announcements"
ON announcements FOR SELECT
USING (is_active = true);

-- Policy: Only admins can insert/update/delete (adjust based on your auth setup)
-- For now, allowing all authenticated users for development
CREATE POLICY "Authenticated users can manage announcements"
ON announcements FOR ALL
USING (true)
WITH CHECK (true);

-- Enable real-time for this table (skip if already added)
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE announcements;
EXCEPTION
    WHEN duplicate_object THEN
        NULL; -- Already added, ignore
END $$;

-- Trigger to auto-update 'updated_at' on modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_announcements_updated_at
    BEFORE UPDATE ON announcements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Example Insert/Update Queries
-- =============================================

-- Insert a new announcement
-- INSERT INTO announcements (type, headline, message)
-- VALUES ('info', 'Mid-semester Results', 'The mid-semester results have been published. Check your dashboard for details.');

-- Update an existing announcement
-- UPDATE announcements
-- SET headline = 'Updated Headline', message = 'Updated message content', type = 'warning'
-- WHERE id = 'your-announcement-id';

-- Deactivate an announcement (soft delete)
-- UPDATE announcements SET is_active = false WHERE id = 'your-announcement-id';

-- Get all active announcements
-- SELECT * FROM announcements WHERE is_active = true ORDER BY created_at DESC;
