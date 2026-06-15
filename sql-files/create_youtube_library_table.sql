-- ============================================================
-- YouTube Library – Separate Table Migration
-- ============================================================
-- Step 1: Create the youtube_library table
-- Step 2: Migrate existing youtube_video rows from vault_resources
-- Step 3: Delete migrated rows from vault_resources
-- Step 4: RLS + indexes
-- ============================================================

-- ── 1. Create table ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS youtube_library (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id  TEXT NOT NULL,
    unit_id     TEXT,
    title       TEXT NOT NULL,
    url         TEXT NOT NULL,           -- YouTube link (watch, search, etc.)
    tags        TEXT[] DEFAULT '{}',
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── 2. Indexes ───────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_youtube_library_subject  ON youtube_library(subject_id);
CREATE INDEX IF NOT EXISTS idx_youtube_library_unit     ON youtube_library(unit_id);
CREATE INDEX IF NOT EXISTS idx_youtube_library_created  ON youtube_library(created_at DESC);

-- ── 3. updated_at trigger ────────────────────────────────────

DROP TRIGGER IF EXISTS update_youtube_library_updated_at ON youtube_library;
CREATE TRIGGER update_youtube_library_updated_at
    BEFORE UPDATE ON youtube_library
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 4. RLS ───────────────────────────────────────────────────

ALTER TABLE youtube_library ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "youtube_library_public_read"   ON youtube_library;
DROP POLICY IF EXISTS "youtube_library_admin_write"   ON youtube_library;

-- Everyone (authenticated) can read
CREATE POLICY "youtube_library_public_read"
    ON youtube_library FOR SELECT
    USING (true);

-- Anyone authenticated can insert / update / delete
-- (tighten to role-based check if you add admin roles later)
CREATE POLICY "youtube_library_admin_write"
    ON youtube_library FOR ALL
    USING (true)
    WITH CHECK (true);

-- ── 5. Migrate existing youtube_video rows from vault_resources ──

INSERT INTO youtube_library (id, subject_id, unit_id, title, url, tags, created_at, updated_at)
SELECT
    id,
    subject_id,
    unit_id,
    title,
    COALESCE(link, ''),
    COALESCE(tags, '{}'),
    COALESCE(created_at, NOW()),
    COALESCE(updated_at, NOW())
FROM vault_resources
WHERE type = 'youtube_video'
ON CONFLICT (id) DO NOTHING;

-- ── 6. Delete migrated rows from vault_resources ─────────────

DELETE FROM vault_resources
WHERE type = 'youtube_video';

-- ── 7. (Optional) Remove youtube_video from the type constraint ──
-- Uncomment once you are sure no more youtube_video rows will be inserted.
--
-- ALTER TABLE vault_resources DROP CONSTRAINT IF EXISTS vault_resources_type_check;
-- ALTER TABLE vault_resources ADD CONSTRAINT vault_resources_type_check
--     CHECK (type IN ('study_note', 'question_bank', 'case_study', 'project',
--                     'revision_note', 'flashcard', 'other_resources'));

-- ── 8. Realtime (optional) ───────────────────────────────────

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE youtube_library;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- ── Verification ─────────────────────────────────────────────

DO $$
DECLARE
    v_count INT;
BEGIN
    SELECT COUNT(*) INTO v_count FROM youtube_library;
    RAISE NOTICE '✅ youtube_library has % rows after migration.', v_count;

    SELECT COUNT(*) INTO v_count FROM vault_resources WHERE type = 'youtube_video';
    RAISE NOTICE '✅ vault_resources youtube_video rows remaining: % (should be 0).', v_count;
END $$;
