-- ============================================
-- Migration: Add Missing Columns to Subjects
-- ============================================
-- This script adds any missing columns to the subjects table
-- Run this in your Supabase SQL Editor

DO $$
BEGIN
    -- Add progress column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subjects' AND column_name = 'progress'
    ) THEN
        ALTER TABLE public.subjects ADD COLUMN progress integer DEFAULT 0;
        RAISE NOTICE 'Added column: progress';
    END IF;

    -- Add unit_count column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subjects' AND column_name = 'unit_count'
    ) THEN
        ALTER TABLE public.subjects ADD COLUMN unit_count integer DEFAULT 0;
        RAISE NOTICE 'Added column: unit_count';
    END IF;

    -- Add last_studied column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subjects' AND column_name = 'last_studied'
    ) THEN
        ALTER TABLE public.subjects ADD COLUMN last_studied text;
        RAISE NOTICE 'Added column: last_studied';
    END IF;

    -- Add syllabus_pdf_url column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subjects' AND column_name = 'syllabus_pdf_url'
    ) THEN
        ALTER TABLE public.subjects ADD COLUMN syllabus_pdf_url text;
        RAISE NOTICE 'Added column: syllabus_pdf_url';
    END IF;

    -- Add icon column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subjects' AND column_name = 'icon'
    ) THEN
        ALTER TABLE public.subjects ADD COLUMN icon text;
        RAISE NOTICE 'Added column: icon';
    END IF;

    -- Add color column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subjects' AND column_name = 'color'
    ) THEN
        ALTER TABLE public.subjects ADD COLUMN color text;
        RAISE NOTICE 'Added column: color';
    END IF;

    -- Add description column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subjects' AND column_name = 'description'
    ) THEN
        ALTER TABLE public.subjects ADD COLUMN description text;
        RAISE NOTICE 'Added column: description';
    END IF;

    RAISE NOTICE 'Migration completed successfully!';
END $$;
