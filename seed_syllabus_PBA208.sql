-- ================================================================
-- Seed Syllabus for PBA208: Business Research Methodology
-- ================================================================

DO $$
DECLARE
    subject_uuid text;
BEGIN
    -- 1. Get the Subject ID for PBA208
    SELECT id INTO subject_uuid FROM public.subjects WHERE code = 'PBA208';

    -- If subject doesn't exist, log warning
    IF subject_uuid IS NULL THEN
        RAISE NOTICE 'Subject PBA208 not found. Please create it first.';
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
        'Introduction to Business Research',
        1,
        false,
        ARRAY[
            'Types of research',
            'Process of research',
            'Formulation of research problem',
            'Development of research hypothesis'
        ]
    );

    -- 4. Insert Unit II
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U2',
        'Research Design',
        2,
        false,
        ARRAY[
            'Definitions and functions',
            'Exploratory, descriptive and experimental research',
            'Experimental designs',
            'Pre-experimental',
            'Quasi-experimental',
            'True-experimental',
            'Statistical',
            'Validity of research instruments',
            'Face validity',
            'Content validity',
            'Construct validity',
            'Methods of data collection',
            'Attitudinal scales',
            'Likert scale',
            'Questionnaire designing'
        ]
    );

    -- 5. Insert Unit III
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U3',
        'Sampling',
        3,
        false,
        ARRAY[
            'Concept of sampling',
            'Sampling design',
            'Types of sampling designs',
            'Probability',
            'Non-probability',
            'Mixed sampling design',
            'Sampling frame',
            'Sample size determination',
            'Data processing',
            'Editing',
            'Coding',
            'Tabulating'
        ]
    );

    -- 6. Insert Unit IV
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U4',
        'Data Analysis',
        4,
        false,
        ARRAY[
            'Univariate analysis',
            'Bivariate analysis',
            'Multivariate analysis',
            'Hypothesis testing',
            'Concept',
            'Types of errors',
            'Steps in hypothesis testing'
        ]
    );

    -- 7. Insert Unit V
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U5',
        'Analytical Techniques',
        5,
        false,
        ARRAY[
            'Parametric vs non-parametric tests',
            'ANOVA',
            'Correlation and regression',
            'Chi-square test',
            'Non-parametric tests for normality',
            'Run test',
            'Advanced data analysis techniques',
            'Factor analysis',
            'Discriminant analysis',
            'Conjoint analysis'
        ]
    );

    -- Update unit count in subjects table
    UPDATE public.subjects SET unit_count = 5 WHERE id = subject_uuid;

    RAISE NOTICE 'Syllabus for PBA208 seeded successfully!';
END $$;
