-- ==========================================
-- Update Vault Resources
-- Insert fresh study note entries for PBA211
-- ==========================================

INSERT INTO vault_resources (subject_id, unit_id, type, title, link) VALUES 
-- PBA211 – Data Analysis Using Python
('pba211', 'unit-1', 'study_note', 'Unit 1: Introduction to Python', 'https://curriculab-resources.netlify.app/Sem-2/PBA211%20Data%20Analysis%20Using%20Python/PBA211%20Unit-1%20Notes.html'),
('pba211', 'unit-2', 'study_note', 'Unit 2: Advanced Python', 'https://curriculab-resources.netlify.app/Sem-2/PBA211%20Data%20Analysis%20Using%20Python/PBA211%20Unit-2%20Notes.html'),
('pba211', 'unit-3', 'study_note', 'Unit 3: Numerical Python & Pandas', 'https://curriculab-resources.netlify.app/Sem-2/PBA211%20Data%20Analysis%20Using%20Python/PBA211%20Unit-3%20Notes.html'),
('pba211', 'unit-4', 'study_note', 'Unit 4: Data Manipulation', 'https://curriculab-resources.netlify.app/Sem-2/PBA211%20Data%20Analysis%20Using%20Python/PBA211%20Unit-4%20Notes.html'),
('pba211', 'unit-5', 'study_note', 'Unit 5: Data Extraction & Analysis', 'https://curriculab-resources.netlify.app/Sem-2/PBA211%20Data%20Analysis%20Using%20Python/PBA211%20Unit-5%20Notes.html')

ON CONFLICT DO NOTHING;
