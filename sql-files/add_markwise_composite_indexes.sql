-- Add composite indexes for faster filtered queries on markwise_resources
-- This optimizes queries that filter by subject_id + unit_id or subject_id + resource_type

-- Composite index for subject + unit (common filter combination)
CREATE INDEX IF NOT EXISTS idx_markwise_resources_subject_unit 
ON markwise_resources(subject_id, unit_id);

-- Composite index for subject + resource_type (filter by type)
CREATE INDEX IF NOT EXISTS idx_markwise_resources_subject_type 
ON markwise_resources(subject_id, resource_type);

-- Composite index for subject + is_active (common filter for active resources)
CREATE INDEX IF NOT EXISTS idx_markwise_resources_subject_active 
ON markwise_resources(subject_id, is_active);

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ MarkWise resources composite indexes created!';
    RAISE NOTICE '   - subject_id + unit_id index for unit-specific queries';
    RAISE NOTICE '   - subject_id + resource_type index for filtered queries';
    RAISE NOTICE '   - subject_id + is_active index for active resource queries';
END $$;
