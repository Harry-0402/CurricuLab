-- ================================================================
-- Seed Syllabus for PBA207: Data Visualization and Story Telling
-- ================================================================

DO $$
DECLARE
    subject_uuid text;
BEGIN
    -- 1. Get the Subject ID for PBA207
    SELECT id INTO subject_uuid FROM public.subjects WHERE code = 'PBA207';

    -- If subject doesn't exist, log warning
    IF subject_uuid IS NULL THEN
        RAISE NOTICE 'Subject PBA207 not found. Please create it first.';
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
        'Visualization Basics',
        1,
        false,
        ARRAY[
            'Introduction to visualization',
            'Why to visualize',
            'How to visualize',
            'Stages of data visualizing',
            'Usages of visualization',
            'Types of charts'
        ]
    );

    -- 4. Insert Unit II
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U2',
        'Visualization of Structured Data',
        2,
        false,
        ARRAY[
            'Introduction',
            'Exploratory analysis',
            'Univariate analysis',
            'Multivariate analysis',
            'Charts to visualize multiple measures',
            'Modeling',
            'Visualization during deployment'
        ]
    );

    -- 5. Insert Unit III
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U3',
        'Visualization of Unstructured Data',
        3,
        false,
        ARRAY[
            'Introduction',
            'Importance and challenges of text data visualization',
            'Forms of text data',
            'Pre-processing pipeline',
            'Visualizing text data',
            'Visualizing conversations'
        ]
    );

    -- 6. Insert Unit IV
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U4',
        'Visual Story Telling',
        4,
        false,
        ARRAY[
            'Introduction',
            'Why storytelling matters',
            'Science behind storytelling'
        ]
    );

    -- 7. Insert Unit V
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U5',
        'Storytelling Framework',
        5,
        false,
        ARRAY[
            'Introduction',
            'Importance of business storytelling',
            'Data storytelling',
            'Narrative types',
            'Dimensions of narrative storytelling',
            'Data story types',
            'Analytics dashboard'
        ]
    );

    -- Update unit count in subjects table
    UPDATE public.subjects SET unit_count = 5 WHERE id = subject_uuid;

    RAISE NOTICE 'Syllabus for PBA207 seeded successfully!';
END $$;
