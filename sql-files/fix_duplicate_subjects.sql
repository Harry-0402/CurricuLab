-- ==========================================
-- Fix Duplicate Subjects for MBA (BA) - II
-- Use this script to merge "New" subjects into "Original" ones
-- and remove the duplicates I created.
-- ==========================================

DO $$
DECLARE
    r RECORD;
    v_original_id TEXT;
BEGIN
    -- Loop through the subjects we inserted
    FOR r IN SELECT * FROM (VALUES 
      ('pba204', 'PBA204', 'Production and Operations Management', '🏭', '#3B82F6', 'L: 3, T: 1, P: 0 - Faculty: Dr. Shailendra Baraniya'),
      ('pba205', 'PBA205', 'Digital Transformation', '💻', '#8B5CF6', 'L: 3, T: 1, P: 0 - Faculty: Mr. Aniket Alvekar'),
      ('pba206', 'PBA206', 'Legal Aspects of Business', '⚖️', '#EF4444', 'L: 4, T: 0, P: 0 - Faculty: Adv. Vishal Jadhav'),
      ('pba207', 'PBA207', 'Data Visualization and Story Telling', '📊', '#10B981', 'L: 3, T: 0, P: 1 - Faculty: Dr. Samadhan Bundhe'),
      ('pba208', 'PBA208', 'Business Research Methods', '🔬', '#F59E0B', 'L: 3, T: 1, P: 0 - Faculty: Dr. Zahir Shaikh'),
      ('pba211', 'PBA211', 'Data Analysis using Python', '🐍', '#06B6D4', 'L: 1, T: 0, P: 3 - Faculty: Mr. Aniket Alvekar'),
      ('pba212', 'PBA212', 'Data Analysis using Power BI', '📈', '#EC4899', 'L: 0, T: 0, P: 4 - Faculty: Dr. Samadhan Bundhe'),
      ('pba213', 'PBA213', 'Business Communication Skills - II', '💬', '#6366F1', 'L: 0, T: 0, P: 2 - Faculty: Mrs. Prachi Muskar')
    ) AS t(new_id, code, title, icon, color, description)
    LOOP
        -- Find if there is an existing "original" record (same code, but NOT the new ID)
        SELECT id INTO v_original_id 
        FROM public.subjects 
        WHERE code = r.code AND id != r.new_id 
        LIMIT 1;
        
        IF v_original_id IS NOT NULL THEN
            -- 1. Update the original record with the new metadata
            UPDATE public.subjects 
            SET title = r.title,
                icon = r.icon,
                color = r.color,
                description = r.description
            WHERE id = v_original_id;
            
            -- 2. Delete the specific duplicate record (the new one we created)
            DELETE FROM public.subjects WHERE id = r.new_id;
            
            RAISE NOTICE 'Fixed duplicate for %: Updated original (%) and deleted new (%)', r.code, v_original_id, r.new_id;
        ELSE
            -- No original found, so the "new" one is actually the only one. Keep it.
            RAISE NOTICE 'No duplicate found for %, keeping %', r.code, r.new_id;
        END IF;
    END LOOP;
END $$;
