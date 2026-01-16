-- ================================================================
-- Seed Syllabus for PBA204: Production and Operations Management
-- ================================================================

DO $$
DECLARE
    subject_uuid text;
BEGIN
    -- 1. Get the Subject ID for PBA204
    SELECT id INTO subject_uuid FROM public.subjects WHERE code = 'PBA204';

    -- If subject doesn't exist, log warning
    IF subject_uuid IS NULL THEN
        RAISE NOTICE 'Subject PBA204 not found. Please create it first.';
        RETURN;
    END IF;

    -- 2. Clear existing units for this subject to avoid duplicates (Optional - be careful!)
    -- DELETE FROM public.units WHERE subject_id = subject_uuid;

    -- 3. Insert Unit I
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text, topic_uuid,
        subject_uuid,
        'U1',
        'Introduction to Operations Management',
        1,
        false,
        ARRAY[
            'Nature, Scope, Importance and Functions',
            'Evolution from manufacturing to operations management',
            'Evolution of the factory system',
            'Manufacturing systems',
            'Quality',
            'Mass customization',
            'Contribution of Henry Ford, Deming, Crossby, Taguchi'
        ]
    );

    -- 4. Insert Unit II
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U2',
        'Productivity and Work Study',
        2,
        false,
        ARRAY[
            'Productivity',
            'Work Study – Objectives, Scope and Uses',
            'Methods Study',
            'Flow process chart',
            'Flow diagram',
            'Process mapping',
            'Work Measurement',
            'Elements',
            'Performance Rating',
            'Allowances',
            'Standard Time',
            'Synthetic Time Standards',
            'Work Sampling',
            'Numericals expected for Standard Time'
        ]
    );

    -- 5. Insert Unit III
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U3',
        'Facilities Location and Layout',
        3,
        false,
        ARRAY[
            'Strategic importance',
            'Factors affecting location and layout',
            'Installation of facilities',
            'Single location decisions',
            'Multi-location decisions',
            'Principles of Facilities Layout',
            'Types of Facilities Layout'
        ]
    );

    -- 6. Insert Unit IV
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U4',
        'Types of Industries and Manufacturing Methods',
        4,
        false,
        ARRAY[
            'Variety of Businesses',
            'Integration of Manufacturing and Services',
            'Scale of Operations',
            'Methods of Manufacturing',
            'Project / Jobbing',
            'Batch Production',
            'Flow / Continuous Production',
            'Process Production',
            'Characteristics of each method'
        ]
    );

    -- 7. Insert Unit V
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U5',
        'Inspection, Quality Control and Lean Systems',
        5,
        false,
        ARRAY[
            'Inspection',
            'Cent percent Inspection',
            'Sample Inspection',
            'Operation Characteristics Curves',
            'Statistical Quality Control',
            'Construction and Interpretation of Control Charts',
            'X-R, n, p, c, np charts',
            'Introduction to Six Sigma',
            'Numericals expected for Control Charts',
            'Lean Production Systems',
            'TOYOTA system',
            'JIT',
            'KANBAN',
            'Theory of Constraints'
        ]
    );

    -- Update unit count in subjects table
    UPDATE public.subjects SET unit_count = 5 WHERE id = subject_uuid;

    RAISE NOTICE 'Syllabus for PBA204 seeded successfully!';
END $$;
