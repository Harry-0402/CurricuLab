-- Vault Resources Table
-- Stores Study Notes, Case Studies, and Projects for the Knowledge Vault

CREATE TABLE IF NOT EXISTS vault_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id TEXT NOT NULL,
    unit_id TEXT,
    type TEXT NOT NULL CHECK (type IN ('study_note', 'case_study', 'project')),
    title TEXT NOT NULL,
    content TEXT,
    formatted_content TEXT, -- Cached AI-formatted version
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_vault_resources_subject ON vault_resources(subject_id);
CREATE INDEX IF NOT EXISTS idx_vault_resources_type ON vault_resources(type);

-- Enable Row Level Security
ALTER TABLE vault_resources ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (for idempotent execution)
DROP POLICY IF EXISTS "Allow all operations on vault_resources" ON vault_resources;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations on vault_resources"
    ON vault_resources
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Add to realtime publication
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE vault_resources;
EXCEPTION
    WHEN duplicate_object THEN
        NULL; -- Already added, ignore
END $$;

-- Drop trigger if exists (for idempotent execution)
DROP TRIGGER IF EXISTS update_vault_resources_updated_at ON vault_resources;

-- Create trigger for updated_at
CREATE TRIGGER update_vault_resources_updated_at
    BEFORE UPDATE ON vault_resources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
