-- Add composite indexes for faster filtered queries on vault_resources
-- This optimizes queries that filter by subject_id + type or subject_id + unit_id

-- Composite index for subject + type (common filter combination)
CREATE INDEX IF NOT EXISTS idx_vault_resources_subject_type 
ON vault_resources(subject_id, type);

-- Composite index for subject + unit (common filter combination)
CREATE INDEX IF NOT EXISTS idx_vault_resources_subject_unit 
ON vault_resources(subject_id, unit_id);

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Vault resources composite indexes created!';
    RAISE NOTICE '   - subject_id + type index for faster filtered queries';
    RAISE NOTICE '   - subject_id + unit_id index for unit-specific queries';
END $$;
