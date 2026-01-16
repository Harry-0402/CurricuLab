-- ================================================================
-- Seed Syllabus for PBA205: Digital Transformation
-- ================================================================

DO $$
DECLARE
    subject_uuid text;
BEGIN
    -- 1. Get the Subject ID for PBA205
    SELECT id INTO subject_uuid FROM public.subjects WHERE code = 'PBA205';

    -- If subject doesn't exist, log warning
    IF subject_uuid IS NULL THEN
        RAISE NOTICE 'Subject PBA205 not found. Please create it first.';
        RETURN;
    END IF;

    -- 2. Clear existing units for this subject to avoid duplicates
    -- First delete dependent records from unit_details
    DELETE FROM public.unit_details WHERE unit_id IN (SELECT id FROM public.units WHERE subject_id = subject_uuid);
    -- Then delete the units
    DELETE FROM public.units WHERE subject_id = subject_uuid;

    -- 3. Insert Unit I
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U1',
        'Understanding Digital Transformation',
        1,
        false,
        ARRAY[
            'Definition',
            'Scope of digital transformation',
            'Importance',
            'Benefits of digital transformation',
            'Key drivers',
            'Trends in digital transformation',
            'Overview of digital transformation frameworks'
        ]
    );

    -- 4. Insert Unit II
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U2',
        'Leading Digital Transformation',
        2,
        false,
        ARRAY[
            'Role of leadership in driving digital transformation',
            'Key competencies for digital leaders',
            'Building a digital culture within organizations',
            'Introduction to Agile and Lean methodologies',
            'Applying Agile and Lean principles to digital transformation'
        ]
    );

    -- 5. Insert Unit III
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U3',
        'Digital Transformation in Various Industries',
        3,
        false,
        ARRAY[
            'Trends and technologies in retail',
            'Omnichannel strategies and customer experience',
            'Fintech innovations and trends',
            'Impact of digital transformation on banking and financial services',
            'Technologies transforming healthcare',
            'Telemedicine',
            'Health informatics',
            'Challenges and opportunities in healthcare digital transformation'
        ]
    );

    -- 6. Insert Unit IV
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U4',
        'Innovation in the Digital Age',
        4,
        false,
        ARRAY[
            'Types of innovation',
            'Incremental',
            'Disruptive',
            'Radical',
            'Creating an innovation-friendly environment',
            'Encouraging creativity and experimentation',
            'Tools and Techniques for Digital Innovation',
            'Design thinking',
            'Open innovation',
            'Innovation labs and incubators',
            'Crowdsourcing'
        ]
    );

    -- 7. Insert Unit V
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U5',
        'Digital Technologies and Trends',
        5,
        false,
        ARRAY[
            'Emerging Technologies',
            'Overview of key digital technologies',
            'Artificial Intelligence',
            'Internet of Things',
            'Blockchain',
            'Cloud computing',
            'Big data',
            'Machine learning',
            'Impact of technologies on businesses and industries'
        ]
    );

    -- Update unit count in subjects table
    UPDATE public.subjects SET unit_count = 5 WHERE id = subject_uuid;

    RAISE NOTICE 'Syllabus for PBA205 seeded successfully!';
END $$;
