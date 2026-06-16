-- ==========================================
-- Update Vault Resources
-- 1. Delete existing study notes for PBA207, PBA208, PBA211, PBA212, PBA213
-- 2. Insert fresh entries for PBA207 and PBA208
-- ==========================================

-- 1. Delete existing study notes
DELETE FROM vault_resources 
WHERE subject_id IN ('pba207', 'pba208', 'pba211', 'pba212', 'pba213') 
AND type = 'study_note';

-- 2. Insert fresh study note entries for PBA207 and PBA208
INSERT INTO vault_resources (subject_id, unit_id, type, title, link) VALUES 
-- PBA207 – Visualization and Storytelling
('pba207', 'unit-1', 'study_note', 'Unit 1: Visualization', 'https://curriculab-resources.netlify.app/Sem-2/PBA207%20Visualization%20and%20Storytelling/PBA207%20Unit%201%20Notes.html'),
('pba207', 'unit-2', 'study_note', 'Unit 2: Visualization of Structured Data', 'https://curriculab-resources.netlify.app/Sem-2/PBA207%20Visualization%20and%20Storytelling/PBA207%20Unit%202%20Notes.html'),
('pba207', 'unit-3', 'study_note', 'Unit 3: Visualization of Unstructured Data', 'https://curriculab-resources.netlify.app/Sem-2/PBA207%20Visualization%20and%20Storytelling/PBA207%20Unit%203%20Notes.html'),
('pba207', 'unit-4', 'study_note', 'Unit 4: Visual Storytelling', 'https://curriculab-resources.netlify.app/Sem-2/PBA207%20Visualization%20and%20Storytelling/PBA207%20Unit%204%20Notes.html'),
('pba207', 'unit-5', 'study_note', 'Unit 5: Storytelling Framework', 'https://curriculab-resources.netlify.app/Sem-2/PBA207%20Visualization%20and%20Storytelling/PBA207%20Unit%205%20Notes.html'),

-- PBA208 – Business Research Methods
('pba208', 'unit-1', 'study_note', 'Unit 1: Introduction to Business Research', 'https://curriculab-resources.netlify.app/Sem-2/PBA208%20Business%20Research%20Methods/PBA208%20Unit-1%20Notes.html'),
('pba208', 'unit-2', 'study_note', 'Unit 2: Research Design', 'https://curriculab-resources.netlify.app/Sem-2/PBA208%20Business%20Research%20Methods/PBA208%20Unit-2%20Notes.html'),
('pba208', 'unit-3', 'study_note', 'Unit 3: Sampling', 'https://curriculab-resources.netlify.app/Sem-2/PBA208%20Business%20Research%20Methods/PBA208%20Unit-3%20Notes.html'),
('pba208', 'unit-4', 'study_note', 'Unit 4: Data Analysis', 'https://curriculab-resources.netlify.app/Sem-2/PBA208%20Business%20Research%20Methods/PBA208%20Unit-4%20Notes.html'),
('pba208', 'unit-5', 'study_note', 'Unit 5: Analytical Techniques', 'https://curriculab-resources.netlify.app/Sem-2/PBA208%20Business%20Research%20Methods/PBA208%20Unit-5%20Notes.html')

ON CONFLICT DO NOTHING;
