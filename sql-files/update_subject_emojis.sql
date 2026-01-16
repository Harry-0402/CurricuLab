-- ================================================================
-- Set Correct Emojis for All Subjects
-- ================================================================
-- Run this in Supabase SQL Editor to update subject icons
-- ================================================================

UPDATE public.subjects SET icon = '🏭' WHERE code = 'PBA204'; -- Production and Operations Management
UPDATE public.subjects SET icon = '🚀' WHERE code = 'PBA205'; -- Digital Transformation
UPDATE public.subjects SET icon = '⚖️' WHERE code = 'PBA206'; -- Legal Aspects of Business
UPDATE public.subjects SET icon = '📊' WHERE code = 'PBA207'; -- Data Visualization and Story Telling
UPDATE public.subjects SET icon = '🔍' WHERE code = 'PBA208'; -- Business Research Methodology
UPDATE public.subjects SET icon = '🐍' WHERE code = 'PBA209'; -- Data Analysis using Python (if exists)
UPDATE public.subjects SET icon = '📈' WHERE code = 'PBA210'; -- Data Analysis using Power BI (if exists)
UPDATE public.subjects SET icon = '💬' WHERE code = 'PBA211'; -- Business Communication Skills (if exists)

-- Verify the changes
SELECT code, title, icon FROM public.subjects ORDER BY code;
