-- ================================================================
-- Seed Syllabus for PBA213: Business Communication Skills - II
-- ================================================================

DO $$
DECLARE
    subject_uuid text;
BEGIN
    -- 1. Get the Subject ID for PBA213
    SELECT id INTO subject_uuid FROM public.subjects WHERE code = 'PBA213';

    -- If subject doesn't exist, log warning
    IF subject_uuid IS NULL THEN
        RAISE NOTICE 'Subject PBA213 not found. Please create it first.';
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
        'Non-Verbal Communication',
        1,
        false,
        ARRAY[
            'Types of Non-verbal Communication',
            'Kinesics: Body movement, posture, gestures, facial expressions',
            'Oculesics: Eye contact and gaze behavior',
            'Haptics: The role of touch in professional communication',
            'Proxemics: Space and physical distance',
            'Chronemics: Time as a communication tool',
            'Paralanguage: Tone, pitch, pace, volume, pauses, silence',
            'Appearance and Artifacts: Dress code, and personal style'
        ]
    );

    -- 4. Insert Unit II
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U2',
        'Group Communication',
        2,
        false,
        ARRAY[
            'Interviews: Group Discussion, Preparing for an Interview, Types',
            'Meetings: Need and importance, conduct of meetings',
            'Conference: Meaning, organizing, modern methods',
            'Public Relations: Meaning, functions, internal and external measures'
        ]
    );

    -- 5. Insert Unit III
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U3',
        'Business Correspondence',
        3,
        false,
        ARRAY[
            'Trade Letters: Inquiry, Order, Complaints, Claims, Adjustments',
            'Specific Letters: Sales, promotional fliers, Grievance Letters',
            'Reports: Parts of a report, types (Feasibility, Investigative)',
            'Summarisation: Identification of main points; cohesive presentation'
        ]
    );

    -- 6. Insert Unit IV
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U4',
        'Negotiation & Conflict Communication',
        4,
        false,
        ARRAY[
            'Win-win negotiation strategies',
            'Communicating under pressure',
            'Cultural influences on negotiation style',
            'Active listening and empathy in conflict resolution',
            'Use of Modal auxiliaries while communicating'
        ]
    );

    -- 7. Insert Unit V
    INSERT INTO public.units (id, subject_id, unit_code, title, "order", is_completed, topics)
    VALUES (
        gen_random_uuid()::text,
        subject_uuid,
        'U5',
        'Digital Presence and Thought Leadership',
        5,
        false,
        ARRAY[
            'Personal branding on LinkedIn and other platforms',
            'Content strategy for professional influence',
            'Managing online reputation (verbal and non-verbal)',
            'Authenticity and vulnerability in leadership communication'
        ]
    );

    -- Update unit count in subjects table
    UPDATE public.subjects SET unit_count = 5 WHERE id = subject_uuid;

    RAISE NOTICE 'Syllabus for PBA213 seeded successfully!';
END $$;
