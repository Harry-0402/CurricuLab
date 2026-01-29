-- Update Database Links with Supabase Storage URLs

-- Syllabus: PBA204_Syllabus.docx
UPDATE public.subjects SET syllabus_pdf_url = 'https://rzocrfxoktmzebtwmkqn.supabase.co/storage/v1/object/public/library-assets/PBA204_Syllabus.docx' WHERE code = 'PBA204';

-- Syllabus: PBA205_Syllabus.doc
UPDATE public.subjects SET syllabus_pdf_url = 'https://rzocrfxoktmzebtwmkqn.supabase.co/storage/v1/object/public/library-assets/PBA205_Syllabus.doc' WHERE code = 'PBA205';

-- Syllabus: PBA206_Syllabus.docx
UPDATE public.subjects SET syllabus_pdf_url = 'https://rzocrfxoktmzebtwmkqn.supabase.co/storage/v1/object/public/library-assets/PBA206_Syllabus.docx' WHERE code = 'PBA206';

-- Syllabus: PBA207_Syllabus.docx
UPDATE public.subjects SET syllabus_pdf_url = 'https://rzocrfxoktmzebtwmkqn.supabase.co/storage/v1/object/public/library-assets/PBA207_Syllabus.docx' WHERE code = 'PBA207';

-- Syllabus: PBA208_Syllabus.pdf
UPDATE public.subjects SET syllabus_pdf_url = 'https://rzocrfxoktmzebtwmkqn.supabase.co/storage/v1/object/public/library-assets/PBA208_Syllabus.pdf' WHERE code = 'PBA208';

-- Resource: Case_Studies_Cheatsheet.pdf
UPDATE public.resources SET url = 'https://rzocrfxoktmzebtwmkqn.supabase.co/storage/v1/object/public/library-assets/Case_Studies_Cheatsheet.pdf', type = 'PDF' WHERE title ILIKE '%Case Studies Cheatsheet%';

-- Resource: Data_Analysis_Python.pdf
UPDATE public.resources SET url = 'https://rzocrfxoktmzebtwmkqn.supabase.co/storage/v1/object/public/library-assets/Data_Analysis_Python.pdf', type = 'PDF' WHERE title ILIKE '%Data Analysis Python%';

-- Resource: Digital_Transformation_Rice.pdf
UPDATE public.resources SET url = 'https://rzocrfxoktmzebtwmkqn.supabase.co/storage/v1/object/public/library-assets/Digital_Transformation_Rice.pdf', type = 'PDF' WHERE title ILIKE '%Digital Transformation%' AND description ILIKE '%Rice%';

-- Resource: Divisibility_Cheatsheet.pdf
UPDATE public.resources SET url = 'https://rzocrfxoktmzebtwmkqn.supabase.co/storage/v1/object/public/library-assets/Divisibility_Cheatsheet.pdf', type = 'PDF' WHERE title ILIKE '%Divisibility Cheatsheet%';

-- Resource: Excel_Formatting_Cheatsheet.pdf
UPDATE public.resources SET url = 'https://rzocrfxoktmzebtwmkqn.supabase.co/storage/v1/object/public/library-assets/Excel_Formatting_Cheatsheet.pdf', type = 'PDF' WHERE title ILIKE '%Excel Formatting Cheatsheet%';

-- Resource: Labour_Laws_Padhi.pdf
UPDATE public.resources SET url = 'https://rzocrfxoktmzebtwmkqn.supabase.co/storage/v1/object/public/library-assets/Labour_Laws_Padhi.pdf', type = 'PDF' WHERE title ILIKE '%Labour and Industrial Laws%';

-- Resource: Problem_Solving_Cheatsheet.pdf
UPDATE public.resources SET url = 'https://rzocrfxoktmzebtwmkqn.supabase.co/storage/v1/object/public/library-assets/Problem_Solving_Cheatsheet.pdf', type = 'PDF' WHERE title ILIKE '%Problem Solving Cheatsheet%';

-- Resource: Research_Methodology_Kothari.pdf
UPDATE public.resources SET url = 'https://rzocrfxoktmzebtwmkqn.supabase.co/storage/v1/object/public/library-assets/Research_Methodology_Kothari.pdf', type = 'PDF' WHERE title ILIKE '%Research Methodology%' AND description ILIKE '%Kothari%';

-- Resource: Sports_Analytics_Article.pdf
UPDATE public.resources SET url = 'https://rzocrfxoktmzebtwmkqn.supabase.co/storage/v1/object/public/library-assets/Sports_Analytics_Article.pdf', type = 'PDF' WHERE title ILIKE '%Sports Analytics Article%';

-- Resource: SQL_Cheatsheet.pdf
UPDATE public.resources SET url = 'https://rzocrfxoktmzebtwmkqn.supabase.co/storage/v1/object/public/library-assets/SQL_Cheatsheet.pdf', type = 'PDF' WHERE title ILIKE '%SQL Cheatsheet%';

-- Resource: Storytelling_with_Data.pdf
UPDATE public.resources SET url = 'https://rzocrfxoktmzebtwmkqn.supabase.co/storage/v1/object/public/library-assets/Storytelling_with_Data.pdf', type = 'PDF' WHERE title ILIKE '%Storytelling with Data%';

