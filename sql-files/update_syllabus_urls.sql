-- ================================================================
-- Link Syllabus PDFs for PBA211, PBA212, and PBA213
-- ================================================================

DO $$
BEGIN
    UPDATE public.subjects
    SET syllabus_pdf_url = '/syllabuses/PBA211_Data_Analysis_Using_Python.pdf'
    WHERE code = 'PBA211';

    UPDATE public.subjects
    SET syllabus_pdf_url = '/syllabuses/PBA212_Data_Analysis_using_Power_BI.pdf'
    WHERE code = 'PBA212';

    UPDATE public.subjects
    SET syllabus_pdf_url = '/syllabuses/PBA213_Business_Communication_II.pdf'
    WHERE code = 'PBA213';

    RAISE NOTICE 'Syllabus URLs linked successfully for PBA211, PBA212, and PBA213.';
END $$;
