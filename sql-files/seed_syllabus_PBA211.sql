-- ================================================================
-- Seed Syllabus for PBA211: Data Analysis using Python
-- ================================================================

DO $$
DECLARE
    subject_uuid text;
BEGIN
    -- 1. Get the Subject ID for PBA211
    SELECT id INTO subject_uuid FROM public.subjects WHERE code = 'PBA211';

    -- If subject doesn't exist, log warning
    IF subject_uuid IS NULL THEN
        RAISE NOTICE 'Subject PBA211 not found. Please create it first.';
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
        'Introduction to Python',
        1,
        false,
        ARRAY[
            'Variables',
            'Numeric Data Types: Int & Float',
            'Sequential Types: Str & List',
            'Definite Loops: For loops',
            'Conditional Statements: If-Elif-Else',
            'Data Types: Tuples',
            'Practical Project: Build Mortgage Calculator with Python'
        ]
    );

    -- 4. Insert Unit II
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U2',
        'Advanced Python',
        2,
        false,
        ARRAY[
            'Creating Custom Functions',
            'Indefinite Loops: While loops',
            'Data Types: Dictionary and Set',
            'Slicing Data Types',
            'File Handling: Reading .txt files with Python',
            'Data Analysis: Analyze data from text and CSV files'
        ]
    );

    -- 5. Insert Unit III
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U3',
        'Numerical Python & Pandas',
        3,
        false,
        ARRAY[
            'NumPy Array',
            'Broadcasting and U-Functions',
            'Introduction to Pandas',
            'Pandas Objects: Series, DataFrame, Panel',
            'Web Scraping: Manipulate live data from website'
        ]
    );

    -- 6. Insert Unit IV
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U4',
        'Data Manipulation',
        4,
        false,
        ARRAY[
            '5 ways to create a DataFrame',
            'Slicing and Filtering DataFrames',
            'Lambda Functions',
            'Run If and Else scenarios',
            'Data Gathering: Gather and Manipulate Data with Pandas',
            'Business Analysis: Analyze business data from CSV files'
        ]
    );

    -- 7. Insert Unit V
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U5',
        'Data Extraction & Analysis',
        5,
        false,
        ARRAY[
            'API Integration: Get live data from APIs',
            'Data Visualization: Plot data with Matplotlib',
            'Data Transformation: Merge and Concat Data',
            'Aggregation: Groupby in Pandas',
            'Financial Logic: What-if logic in Finance with Pandas'
        ]
    );

    -- Update unit count in subjects table
    UPDATE public.subjects SET unit_count = 5 WHERE id = subject_uuid;

    RAISE NOTICE 'Syllabus for PBA211 seeded successfully!';
END $$;
