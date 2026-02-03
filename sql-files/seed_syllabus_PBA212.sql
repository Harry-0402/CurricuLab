-- ================================================================
-- Seed Syllabus for PBA212: Data Analysis Power BI
-- ================================================================

DO $$
DECLARE
    subject_uuid text;
BEGIN
    -- 1. Get the Subject ID for PBA212
    SELECT id INTO subject_uuid FROM public.subjects WHERE code = 'PBA212';

    -- If subject doesn't exist, log warning
    IF subject_uuid IS NULL THEN
        RAISE NOTICE 'Subject PBA212 not found. Please create it first.';
        RETURN;
    END IF;

    -- 2. Clear existing units for this subject to avoid duplicates
    -- First delete dependent records from unit_details
    DELETE FROM public.unit_details WHERE unit_id IN (SELECT id FROM public.units WHERE subject_id = subject_uuid);
    -- Then delete the units
    DELETE FROM public.units WHERE subject_id = subject_uuid;

    -- 3. Insert Unit I: Power BI Introduction (Module I)
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U1',
        'Power BI Introduction (Module I)',
        1,
        false,
        ARRAY[
            'Data Visualization',
            'Reporting',
            'Business Intelligence (BI)',
            'Traditional BI',
            'Self-Serviced BI',
            'Cloud Based BI',
            'On Premise BI',
            'Power BI Products',
            'Power BI Desktop (Power Query, Power Pivot, Power View)',
            'Flow of Work in Power BI Desktop',
            'Power BI Report Server',
            'Power BI Service',
            'Power BI Mobile',
            'Flow of Work in Power BI / Power BI Architecture',
            'A Brief History of Power BI'
        ]
    );

    -- 4. Insert Unit II: Power Query (Module II)
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U2',
        'Power Query (Module II)',
        2,
        false,
        ARRAY[
            'Data Transformation',
            'Benefits of Data Transformation',
            'Shape or Transform Data using Power Query',
            'Overview of Power Query / Query Editor',
            'Query Editor, User Interface',
            'The Ribbon (Home, Transform, Add Column, View Tabs)',
            'The Queries Pane',
            'The Data View / Results Pane',
            'The Query Settings Pane',
            'Formula Bar',
            'Saving the Work',
            'Data types',
            'Changing the Data type of a Column',
            'Filter in Power Query',
            'Auto Filter / Basic Filtering',
            'Filter a Column using Text Filters',
            'Filter a Column using Number Filters',
            'Filter a Column using Date Filters',
            'Filter Multiple Columns',
            'Remove Columns',
            'Remove Other Columns',
            'Name / Rename a Column',
            'Reorder Columns or Sort Columns',
            'Add Column / Custom Column',
            'Split Columns',
            'Merge Columns',
            'PIVOT',
            'UNPIVOT Columns & Transpose Columns'
        ]
    );

    -- 5. Insert Unit III: Data Modeling (Module III)
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U3',
        'Data Modeling (Module III)',
        3,
        false,
        ARRAY[
            'Data Modeling Introduction',
            'Relationship',
            'Need of Relationship',
            'Relationship Types / Cardinality in General',
            'One-to-One',
            'One-to-Many (or Many-to-One)',
            'Many-to-Many',
            'AutoDetect the relationship',
            'Create a new relationship',
            'Edit existing relationships',
            'Make Relationship Active or Inactive',
            'Delete a relationship'
        ]
    );

    -- 6. Insert Unit IV: DAX (Module IV)
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U4',
        'DAX (Module IV)',
        4,
        false,
        ARRAY[
            'What is DAX',
            'Calculated Column',
            'Measures',
            'DAX Table and Column Name Syntax',
            'Creating Calculated Columns',
            'Creating Measures',
            'Calculated Columns Vs Measures',
            'DAX Syntax & Operators',
            'DAX Operators',
            'Types of Operators',
            'Arithmetic Operators',
            'Comparison Operators',
            'Text Concatenation Operator',
            'Logical Operators',
            'DAX Functions',
            'Types',
            'Date and Time Functions',
            'Text Functions',
            'Logical Functions',
            'Math & Statistical Functions',
            'Filter Functions'
        ]
    );

    -- 7. Insert Unit V: Visualizations & Creating Dashboards (Module V)
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U5',
        'Visualizations & Creating Dashboards (Module V)',
        5,
        false,
        ARRAY[
            'Visualizing Data',
            'Why Visualizations & Visualization types',
            'Create and Format',
            'Bar and Column Charts',
            'Stacked Bar Chart',
            'Stacked Column Chart',
            'Clustered Bar Chart',
            'Clustered Column Chart',
            '100% Stacked Bar Chart',
            '100% Stacked Column Chart',
            'Pie and Donut Charts',
            'Scatter Charts',
            'Table Visual',
            'Matrix Visualization',
            'Line and Area Charts',
            'Line Chart',
            'Area Chart',
            'Stacked Area Chart',
            'Combo Charts',
            'Line and Stacked Column Chart',
            'Line and Clustered Column Chart',
            'Ribbon Chart',
            'Waterfall Chart',
            'Funnel Chart',
            'Advantages of Dashboards',
            'Interacting with Dashboards',
            'Formatting Dashboard',
            'Sharing Dashboard'
        ]
    );

    -- Update unit count in subjects table
    UPDATE public.subjects SET unit_count = 5 WHERE id = subject_uuid;

    RAISE NOTICE 'Syllabus for PBA212 seeded successfully!';
END $$;
