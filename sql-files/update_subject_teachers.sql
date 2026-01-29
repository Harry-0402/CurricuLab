-- ==========================================
-- Update Subject Teachers Only
-- ==========================================

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT * FROM (VALUES 
      ('PBA204', 'Dr. Shailendra Baraniya'),
      ('PBA205', 'Mr. Aniket Alvekar'),
      ('PBA206', 'Adv. Vishal Jadhav'),
      ('PBA207', 'Dr. Samadhan Bundhe'),
      ('PBA208', 'Dr. Zahir Shaikh'),
      ('PBA211', 'Mr. Aniket Alvekar'),
      ('PBA212', 'Dr. Samadhan Bundhe'),
      ('PBA213', 'Mrs. Prachi Muskar')
    ) AS t(code, teacher_name)
    LOOP
        -- Update the teacher column for the specific subject code
        UPDATE public.subjects 
        SET teacher = r.teacher_name
        WHERE code = r.code;
        
        RAISE NOTICE 'Updated teacher for % to %', r.code, r.teacher_name;
    END LOOP;
END $$;
