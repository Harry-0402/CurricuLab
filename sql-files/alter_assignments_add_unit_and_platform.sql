-- Add unit_id and platform columns to assignments table

ALTER TABLE assignments 
ADD COLUMN IF NOT EXISTS unit_id TEXT REFERENCES units(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS platform TEXT CHECK (platform IN ('ERP', 'GCR', 'Other'));

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_assignments_unit ON assignments(unit_id);
CREATE INDEX IF NOT EXISTS idx_assignments_platform ON assignments(platform);
