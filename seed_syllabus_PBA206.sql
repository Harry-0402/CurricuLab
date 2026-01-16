-- ================================================================
-- Seed Syllabus for PBA206: Legal Aspects of Business
-- ================================================================

DO $$
DECLARE
    subject_uuid text;
BEGIN
    -- 1. Get the Subject ID for PBA206
    SELECT id INTO subject_uuid FROM public.subjects WHERE code = 'PBA206';

    -- If subject doesn't exist, log warning
    IF subject_uuid IS NULL THEN
        RAISE NOTICE 'Subject PBA206 not found. Please create it first.';
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
        'Law of Contract',
        1,
        false,
        ARRAY[
            'The Indian Contract Act, 1872',
            'Nature and kinds of contracts',
            'Essential elements of a valid contract',
            'Offer and acceptance',
            'Consideration',
            'Capacity to contract',
            'Free consent',
            'Legality and object',
            'Types of Contracts',
            'Contingent contracts',
            'Performance of contract',
            'Discharge of contract',
            'Quasi contract',
            'Remedies for breach of contract',
            'Indemnity and guarantee',
            'Bailment and pledge',
            'Law of agency'
        ]
    );

    -- 4. Insert Unit II
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U2',
        'Sale of Goods and Partnership',
        2,
        false,
        ARRAY[
            'Law of Sales of Goods Act, 1930',
            'General principles',
            'Conditions and warranties',
            'Doctrine of caveat emptor',
            'Transfer of ownership',
            'Performance of contract of sale',
            'Remedial measures',
            'Law of Partnership – Indian Partnership Act, 1932',
            'Definition and general principles',
            'Formation of partnership',
            'Rights and liabilities of partners',
            'Dissolution of partnership firms'
        ]
    );

    -- 5. Insert Unit III
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U3',
        'Company Law',
        3,
        false,
        ARRAY[
            'The Indian Companies Act, 1956',
            'Company and its various forms',
            'Formation of a company',
            'Memorandum of association',
            'Articles of association',
            'Prospectus',
            'Share allotment',
            'Shares and share capital',
            'Promoters',
            'Membership of a company',
            'Meetings and proceedings',
            'Directors',
            'Managers and remuneration',
            'Secretary',
            'Prevention of oppression and mismanagement',
            'Winding up of a company'
        ]
    );

    -- 6. Insert Unit IV
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U4',
        'Insurance, Insolvency, Carriage and Arbitration',
        4,
        false,
        ARRAY[
            'Nature and principles of insurance',
            'Life insurance',
            'General insurance',
            'Fire insurance',
            'Marine insurance',
            'Insolvency law',
            'Objects and scope',
            'Procedure',
            'Property and debt of insolvent',
            'Discharge of insolvent',
            'Carriage of goods - By land, By sea and By air',
            'Arbitration',
            'General provisions',
            'Modes of arbitration'
        ]
    );

    -- 7. Insert Unit V
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U5',
        'Miscellaneous Laws',
        5,
        false,
        ARRAY[
            'Essential Commodities Act, 1955',
            'Consumer Protection Act, 1986',
            'Co-operative Societies Act, 1912',
            'Multi-State Co-operative Societies Act, 1984',
            'Foreign Exchange Management Act, 1999',
            'MRTP Act',
            'Information Technology Act, 2000'
        ]
    );

    -- Update unit count in subjects table
    UPDATE public.subjects SET unit_count = 5 WHERE id = subject_uuid;

    RAISE NOTICE 'Syllabus for PBA206 seeded successfully!';
END $$;
