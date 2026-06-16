-- ==========================================
-- Update Vault Resources
-- Insert fresh study note entries for PBA212 and PBA213
-- ==========================================

INSERT INTO vault_resources (subject_id, unit_id, type, title, link) VALUES 
-- PBA212 – Data Analysis Using Power BI
('pba212', 'unit-1', 'study_note', 'Unit 1: Power BI Introduction', 'https://curriculab-resources.netlify.app/Sem-2/PBA212%20Data%20Analysis%20Using%20Powerbi/PBA212%20Unit-1%20Notes.html'),
('pba212', 'unit-2', 'study_note', 'Unit 2: Power Query and Data Transformation', 'https://curriculab-resources.netlify.app/Sem-2/PBA212%20Data%20Analysis%20Using%20Powerbi/PBA212%20Unit-2%20Notes.html'),
('pba212', 'unit-3', 'study_note', 'Unit 3: Data Modeling', 'https://curriculab-resources.netlify.app/Sem-2/PBA212%20Data%20Analysis%20Using%20Powerbi/PBA212%20Unit-3%20Notes.html'),
('pba212', 'unit-4', 'study_note', 'Unit 4: DAX (Data Analysis Expressions)', 'https://curriculab-resources.netlify.app/Sem-2/PBA212%20Data%20Analysis%20Using%20Powerbi/PBA212%20Unit-4%20Notes.html'),
('pba212', 'unit-5', 'study_note', 'Unit 5: Visualizations and Dashboards', 'https://curriculab-resources.netlify.app/Sem-2/PBA212%20Data%20Analysis%20Using%20Powerbi/PBA212%20Unit-5%20Notes.html'),

-- PBA213 – Business Communication Skills - II
('pba213', 'unit-1', 'study_note', 'Unit 1: Non-Verbal Communication', 'https://curriculab-resources.netlify.app/Sem-2/PBA213%20Business%20Communication%20-%20II/PBA213%20Unit-1%20Notes.html'),
('pba213', 'unit-2', 'study_note', 'Unit 2: Group Communication', 'https://curriculab-resources.netlify.app/Sem-2/PBA213%20Business%20Communication%20-%20II/PBA213%20Unit-2%20Notes.html'),
('pba213', 'unit-3', 'study_note', 'Unit 3: Business Correspondence', 'https://curriculab-resources.netlify.app/Sem-2/PBA213%20Business%20Communication%20-%20II/PBA213%20Unit-3%20Notes.html'),
('pba213', 'unit-4', 'study_note', 'Unit 4: Negotiation & Conflict Communication', 'https://curriculab-resources.netlify.app/Sem-2/PBA213%20Business%20Communication%20-%20II/PBA213%20Unit-4%20Notes.html'),
('pba213', 'unit-5', 'study_note', 'Unit 5: Digital Presence and Thought Leadership', 'https://curriculab-resources.netlify.app/Sem-2/PBA213%20Business%20Communication%20-%20II/PBA213%20Unit-5%20Notes.html')

ON CONFLICT DO NOTHING;
