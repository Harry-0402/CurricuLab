-- Ensure 'subjects' table has all required columns
DO $$
BEGIN
    -- Add 'color' if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subjects' AND column_name = 'color') THEN
        ALTER TABLE public.subjects ADD COLUMN color text;
    END IF;

    -- Add 'icon' if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subjects' AND column_name = 'icon') THEN
        ALTER TABLE public.subjects ADD COLUMN icon text;
    END IF;

    -- Add 'progress' if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subjects' AND column_name = 'progress') THEN
        ALTER TABLE public.subjects ADD COLUMN progress integer DEFAULT 0;
    END IF;

    -- Add 'unit_count' if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subjects' AND column_name = 'unit_count') THEN
        ALTER TABLE public.subjects ADD COLUMN unit_count integer DEFAULT 0;
    END IF;

    -- Add 'syllabus_pdf_url' if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subjects' AND column_name = 'syllabus_pdf_url') THEN
        ALTER TABLE public.subjects ADD COLUMN syllabus_pdf_url text;
    END IF;

    -- Add 'last_studied' if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subjects' AND column_name = 'last_studied') THEN
        ALTER TABLE public.subjects ADD COLUMN last_studied text;
    END IF;
END $$;

-- Ensure 'units' table has 'topics' column
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'units' AND column_name = 'topics') THEN
        ALTER TABLE public.units ADD COLUMN topics text[];
    END IF;
END $$;
