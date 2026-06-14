-- Insert Vault Resources for Sem 1 and Sem 2

-- Disable RLS temporarily or insert anyway since this might be run as postgres role
-- (Running in Supabase SQL Editor bypasses RLS)

INSERT INTO vault_resources (subject_id, unit_id, type, title, link) VALUES 
-- Sem 1: PBA101 (Managerial Economics)
('c64dcb66-915f-4527-acd7-3681ddbb3b54', 'unit-1', 'study_note', 'Unit 1: Nature and Scope of Economics', 'https://curriculab-resources.netlify.app/sem-1/pba101%20%E2%80%93%20managerial%20economics/pba101%20unit-1%20notes'),
('c64dcb66-915f-4527-acd7-3681ddbb3b54', 'unit-2', 'study_note', 'Unit 2: Demand Analysis and Demand Forecasting', 'https://curriculab-resources.netlify.app/sem-1/pba101%20%E2%80%93%20managerial%20economics/pba101%20unit-2%20notes'),
('c64dcb66-915f-4527-acd7-3681ddbb3b54', 'unit-3', 'study_note', 'Unit 3: Indifference Curve Analysis and Cost Analysis', 'https://curriculab-resources.netlify.app/sem-1/pba101%20%E2%80%93%20managerial%20economics/pba101%20unit-3%20notes'),
('c64dcb66-915f-4527-acd7-3681ddbb3b54', 'unit-4', 'study_note', 'Unit 4: Market Structure and Product Pricing', 'https://curriculab-resources.netlify.app/sem-1/pba101%20%E2%80%93%20managerial%20economics/pba101%20unit-4%20notes'),
('c64dcb66-915f-4527-acd7-3681ddbb3b54', 'unit-5', 'study_note', 'Unit 5: Profit Analysis, Profit Forecasting and National Income', 'https://curriculab-resources.netlify.app/sem-1/pba101%20%E2%80%93%20managerial%20economics/pba101%20unit-5%20notes'),

-- Sem 1: PBA102 (Accounting and Finance for Managers)
('f89b10fc-88bd-4a8d-b2fd-f1e0714cfb1a', 'unit-1', 'study_note', 'Unit 1: Introduction to Accounting and Transaction Processing', 'https://curriculab-resources.netlify.app/sem-1/pba102%20%E2%80%93%20accounting%20and%20finance%20for%20managers/pba102%20unit-1%20notes'),
('f89b10fc-88bd-4a8d-b2fd-f1e0714cfb1a', 'unit-2', 'study_note', 'Unit 2: Financial Statements', 'https://curriculab-resources.netlify.app/sem-1/pba102%20%E2%80%93%20accounting%20and%20finance%20for%20managers/pba102%20unit-2%20notes'),
('f89b10fc-88bd-4a8d-b2fd-f1e0714cfb1a', 'unit-3', 'study_note', 'Unit 3: Financial statement Analysis', 'https://curriculab-resources.netlify.app/sem-1/pba102%20%E2%80%93%20accounting%20and%20finance%20for%20managers/pba102%20unit-3%20notes'),
('f89b10fc-88bd-4a8d-b2fd-f1e0714cfb1a', 'unit-4', 'study_note', 'Unit 4: Cash Flow Statement and Inventory Valuation', 'https://curriculab-resources.netlify.app/sem-1/pba102%20%E2%80%93%20accounting%20and%20finance%20for%20managers/pba102%20unit-4%20notes'),
('f89b10fc-88bd-4a8d-b2fd-f1e0714cfb1a', 'unit-5', 'study_note', 'Unit 5: Financial Decision Making and Cost of Capital', 'https://curriculab-resources.netlify.app/sem-1/pba102%20%E2%80%93%20accounting%20and%20finance%20for%20managers/pba102%20unit-5%20notes'),

-- Sem 1: PBA103 (Introduction to Data Science & Business Analytics)
('000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-1', 'study_note', 'Unit 1: Introduction to Data Science and Business Analytics', 'https://curriculab-resources.netlify.app/sem-1/pba103%20%E2%80%93%20introduction%20to%20data%20science%20%26%20business%20analytics/pba103%20unit-1%20notes'),
('000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-2', 'study_note', 'Unit 2: Understanding Business', 'https://curriculab-resources.netlify.app/sem-1/pba103%20%E2%80%93%20introduction%20to%20data%20science%20%26%20business%20analytics/pba103%20unit-2%20notes'),
('000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-3', 'study_note', 'Unit 3: Setting of Targets', 'https://curriculab-resources.netlify.app/sem-1/pba103%20%E2%80%93%20introduction%20to%20data%20science%20%26%20business%20analytics/pba103%20unit-3%20notes'),
('000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-4', 'study_note', 'Unit 4: Introduction to Maturity Stages in Analytics', 'https://curriculab-resources.netlify.app/sem-1/pba103%20%E2%80%93%20introduction%20to%20data%20science%20%26%20business%20analytics/pba103%20unit-4%20notes'),
('000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-5', 'study_note', 'Unit 5: Exploratory Data Analysis (EDA), Business Intelligence, and Ethics in Data Science', 'https://curriculab-resources.netlify.app/sem-1/pba103%20%E2%80%93%20introduction%20to%20data%20science%20%26%20business%20analytics/pba103%20unit-5%20notes'),

-- Sem 1: PBA104 (Data Management and Warehousing)
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-1', 'study_note', 'Unit 1: Introduction to Data Management and Data Warehousing', 'https://curriculab-resources.netlify.app/sem-1/pba104%20%E2%80%93%20data%20management%20and%20warehousing/pba104%20unit-1%20notes'),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-2', 'study_note', 'Unit 2: Introduction to ETL', 'https://curriculab-resources.netlify.app/sem-1/pba104%20%E2%80%93%20data%20management%20and%20warehousing/pba104%20unit-2%20notes'),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-3', 'study_note', 'Unit 3: Data Integration and Data Quality', 'https://curriculab-resources.netlify.app/sem-1/pba104%20%E2%80%93%20data%20management%20and%20warehousing/pba104%20unit-3%20notes'),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-4', 'study_note', 'Unit 4: Data Mining', 'https://curriculab-resources.netlify.app/sem-1/pba104%20%E2%80%93%20data%20management%20and%20warehousing/pba104%20unit-4%20notes'),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-5', 'study_note', 'Unit 5: Data Governance and Security', 'https://curriculab-resources.netlify.app/sem-1/pba104%20%E2%80%93%20data%20management%20and%20warehousing/pba104%20unit-5%20notes'),

-- Sem 1: PBA105 (Quantitative Techniques for Business Decisions)
('25f67eee-5865-48bb-9c16-fdcc95ef1645', 'unit-1', 'study_note', 'Unit 1: Linear Programming, Markov Chains and Simulation Techniques', 'https://curriculab-resources.netlify.app/sem-1/pba105%20%E2%80%93%20quantitative%20techniques%20for%20business%20decisions/pba105%20unit-1%20notes'),
('25f67eee-5865-48bb-9c16-fdcc95ef1645', 'unit-2', 'study_note', 'Unit 2: Assignment Models and Transportation Models', 'https://curriculab-resources.netlify.app/sem-1/pba105%20%E2%80%93%20quantitative%20techniques%20for%20business%20decisions/pba105%20unit-2%20notes'),
('25f67eee-5865-48bb-9c16-fdcc95ef1645', 'unit-3', 'study_note', 'Unit 3: Decision Theory and Game Theory', 'https://curriculab-resources.netlify.app/sem-1/pba105%20%E2%80%93%20quantitative%20techniques%20for%20business%20decisions/pba105%20unit-3%20notes'),
('25f67eee-5865-48bb-9c16-fdcc95ef1645', 'unit-4', 'study_note', 'Unit 4: PERT, CPM and Sequencing Problems', 'https://curriculab-resources.netlify.app/sem-1/pba105%20%E2%80%93%20quantitative%20techniques%20for%20business%20decisions/pba105%20unit-4%20notes'),
('25f67eee-5865-48bb-9c16-fdcc95ef1645', 'unit-5', 'study_note', 'Unit 5: Probability and Probability Distributions', 'https://curriculab-resources.netlify.app/sem-1/pba105%20%E2%80%93%20quantitative%20techniques%20for%20business%20decisions/pba105%20unit-5%20notes'),

-- Sem 1: PBA106 (Organizational Behavior and Principles of Management)
('a7e30eb0-2591-4ed7-8af4-f3983f3e3c28', 'unit-1', 'study_note', 'Unit 1: Evolution of Management & Planning', 'https://curriculab-resources.netlify.app/sem-1/pba106%20%E2%80%93%20organizational%20behavior%20and%20principles%20of%20management/pba106%20unit-1%20notes'),
('a7e30eb0-2591-4ed7-8af4-f3983f3e3c28', 'unit-2', 'study_note', 'Unit 2: Organizational Behaviour, Perception & Motivation', 'https://curriculab-resources.netlify.app/sem-1/pba106%20%E2%80%93%20organizational%20behavior%20and%20principles%20of%20management/pba106%20unit-2%20notes'),
('a7e30eb0-2591-4ed7-8af4-f3983f3e3c28', 'unit-3', 'study_note', 'Unit 3: Organization, Staffing, Directing & Leadership', 'https://curriculab-resources.netlify.app/sem-1/pba106%20%E2%80%93%20organizational%20behavior%20and%20principles%20of%20management/pba106%20unit-3%20notes'),
('a7e30eb0-2591-4ed7-8af4-f3983f3e3c28', 'unit-4', 'study_note', 'Unit 4: Motivation, Communication & Control', 'https://curriculab-resources.netlify.app/sem-1/pba106%20%E2%80%93%20organizational%20behavior%20and%20principles%20of%20management/pba106%20unit-4%20notes'),
('a7e30eb0-2591-4ed7-8af4-f3983f3e3c28', 'unit-5', 'study_note', 'Unit 5: Job Satisfaction & Employee Behaviour', 'https://curriculab-resources.netlify.app/sem-1/pba106%20%E2%80%93%20organizational%20behavior%20and%20principles%20of%20management/pba106%20unit-5%20notes'),

-- Sem 1: PBA107 (Strategic Management)
('adbf67bd-44ab-4767-9c57-37aa2095447b', 'unit-1', 'study_note', 'Unit 1: Nature and Scope of Economics', 'https://curriculab-resources.netlify.app/sem-1/pba107%20%E2%80%93%20strategic%20management/pba107%20unit-1%20notes'),
('adbf67bd-44ab-4767-9c57-37aa2095447b', 'unit-2', 'study_note', 'Unit 2: Strategic Intent and External Environment Analysis', 'https://curriculab-resources.netlify.app/sem-1/pba107%20%E2%80%93%20strategic%20management/pba107%20unit-2%20notes'),
('adbf67bd-44ab-4767-9c57-37aa2095447b', 'unit-3', 'study_note', 'Unit 3: Strategic Capability and Internal Assessment', 'https://curriculab-resources.netlify.app/sem-1/pba107%20%E2%80%93%20strategic%20management/pba107%20unit-3%20notes'),
('adbf67bd-44ab-4767-9c57-37aa2095447b', 'unit-4', 'study_note', 'Unit 4: Business-Level and Corporate-Level Strategies', 'https://curriculab-resources.netlify.app/sem-1/pba107%20%E2%80%93%20strategic%20management/pba107%20unit-4%20notes'),
('adbf67bd-44ab-4767-9c57-37aa2095447b', 'unit-5', 'study_note', 'Unit 5: Portfolio and Analytical Models, Strategy Evaluation and Implementation', 'https://curriculab-resources.netlify.app/sem-1/pba107%20%E2%80%93%20strategic%20management/pba107%20unit-5%20notes'),

-- Sem 1: PBA108 (Business Communication Skills - I mapped to PBA111)
('f66a5b3f-ebf0-411b-94fb-b43cb4ff631d', 'unit-1', 'study_note', 'Unit 1: Business Correspondence', 'https://curriculab-resources.netlify.app/sem-1/pba108%20%E2%80%93%20business%20communication%20skills%20-%20i/pba108%20unit-1%20notes'),
('f66a5b3f-ebf0-411b-94fb-b43cb4ff631d', 'unit-2', 'study_note', 'Unit 2: Report Writing and Presentation Skills', 'https://curriculab-resources.netlify.app/sem-1/pba108%20%E2%80%93%20business%20communication%20skills%20-%20i/pba108%20unit-2%20notes'),
('f66a5b3f-ebf0-411b-94fb-b43cb4ff631d', 'unit-3', 'study_note', 'Unit 3: Telephone and E-mail Etiquette', 'https://curriculab-resources.netlify.app/sem-1/pba108%20%E2%80%93%20business%20communication%20skills%20-%20i/pba108%20unit-3%20notes'),
('f66a5b3f-ebf0-411b-94fb-b43cb4ff631d', 'unit-4', 'study_note', 'Unit 4: Cross-Cultural Communication', 'https://curriculab-resources.netlify.app/sem-1/pba108%20%E2%80%93%20business%20communication%20skills%20-%20i/pba108%20unit-4%20notes'),
('f66a5b3f-ebf0-411b-94fb-b43cb4ff631d', 'unit-5', 'study_note', 'Unit 5: Counselor''s Interaction', 'https://curriculab-resources.netlify.app/sem-1/pba108%20%E2%80%93%20business%20communication%20skills%20-%20i/pba108%20unit-5%20notes'),

-- Sem 2: PBA204 (Production and Operations Management)
('pba204', 'unit-1', 'study_note', 'Unit 1: Introduction to Operations Management', 'https://curriculab-resources.netlify.app/sem-2/pba204%20%E2%80%93%20production%20and%20operations%20management/pba204%20unit-1%20notes'),
('pba204', 'unit-2', 'study_note', 'Unit 2', 'https://curriculab-resources.netlify.app/sem-2/pba204%20%E2%80%93%20production%20and%20operations%20management/pba204%20unit-2%20notes'),
('pba204', 'unit-3', 'study_note', 'Unit 3', 'https://curriculab-resources.netlify.app/sem-2/pba204%20%E2%80%93%20production%20and%20operations%20management/pba204%20unit-3%20notes'),
('pba204', 'unit-4', 'study_note', 'Unit 4', 'https://curriculab-resources.netlify.app/sem-2/pba204%20%E2%80%93%20production%20and%20operations%20management/pba204%20unit-4%20notes'),
('pba204', 'unit-5', 'study_note', 'Unit 5', 'https://curriculab-resources.netlify.app/sem-2/pba204%20%E2%80%93%20production%20and%20operations%20management/pba204%20unit-5%20notes'),

-- Sem 2: PBA205 (Digital Transformation)
('pba205', 'unit-1', 'study_note', 'Unit 1: Understanding Digital Transformation', 'https://curriculab-resources.netlify.app/sem-2/pba205%20%E2%80%93%20digital%20transformation/pba205%20unit%201%20notes'),
('pba205', 'unit-2', 'study_note', 'Unit 2: Leading Digital Transformation', 'https://curriculab-resources.netlify.app/sem-2/pba205%20%E2%80%93%20digital%20transformation/pba205%20unit%202%20notes'),
('pba205', 'unit-3', 'study_note', 'Unit 3: Digital Transformation in Various Industries', 'https://curriculab-resources.netlify.app/sem-2/pba205%20%E2%80%93%20digital%20transformation/pba205%20unit%203%20notes'),
('pba205', 'unit-4', 'study_note', 'Unit 4: Innovation in the Digital Age', 'https://curriculab-resources.netlify.app/sem-2/pba205%20%E2%80%93%20digital%20transformation/pba205%20unit%204%20notes'),
('pba205', 'unit-5', 'study_note', 'Unit 5: Digital Technologies and Trends', 'https://curriculab-resources.netlify.app/sem-2/pba205%20%E2%80%93%20digital%20transformation/pba205%20unit%205%20notes'),

-- Sem 2: PBA206 (Legal Aspects of Business)
('pba206', 'unit-1', 'study_note', 'Unit 1: Law of Contract – Indian Contract Act, 1872', 'https://curriculab-resources.netlify.app/sem-2/pba206%20%E2%80%93%20legal%20aspects%20of%20business/pba206%20unit-1'),
('pba206', 'unit-2', 'study_note', 'Unit 2', 'https://curriculab-resources.netlify.app/sem-2/pba206%20%E2%80%93%20legal%20aspects%20of%20business/pba206%20unit-2'),
('pba206', 'unit-3', 'study_note', 'Unit 3', 'https://curriculab-resources.netlify.app/sem-2/pba206%20%E2%80%93%20legal%20aspects%20of%20business/pba206%20unit-3'),
('pba206', 'unit-4', 'study_note', 'Unit 4', 'https://curriculab-resources.netlify.app/sem-2/pba206%20%E2%80%93%20legal%20aspects%20of%20business/pba206%20unit-4'),
('pba206', 'unit-5', 'study_note', 'Unit 5', 'https://curriculab-resources.netlify.app/sem-2/pba206%20%E2%80%93%20legal%20aspects%20of%20business/pba206%20unit-5'),

-- Sem 2: PBA207 (Visualization and Storytelling)
('pba207', 'unit-1', 'study_note', 'Unit 1: Introduction to Visualization', 'https://curriculab-resources.netlify.app/sem-2/pba207%20%E2%80%93%20visualization%20and%20storytelling/pba207%20unit%201%20notes'),
('pba207', 'unit-2', 'study_note', 'Unit 2: Visualization Techniques', 'https://curriculab-resources.netlify.app/sem-2/pba207%20%E2%80%93%20visualization%20and%20storytelling/pba207%20unit%202%20notes'),
('pba207', 'unit-3', 'study_note', 'Unit 3: Advanced Visualization', 'https://curriculab-resources.netlify.app/sem-2/pba207%20%E2%80%93%20visualization%20and%20storytelling/pba207%20unit%203%20notes'),
('pba207', 'unit-4', 'study_note', 'Unit 4: Visual Storytelling', 'https://curriculab-resources.netlify.app/sem-2/pba207%20%E2%80%93%20visualization%20and%20storytelling/pba207%20unit%204%20notes'),
('pba207', 'unit-5', 'study_note', 'Unit 5: Business Storytelling & Dashboards', 'https://curriculab-resources.netlify.app/sem-2/pba207%20%E2%80%93%20visualization%20and%20storytelling/pba207%20unit%205%20notes'),

-- Sem 2: PBA208 (Business Research Methods)
('pba208', 'unit-1', 'study_note', 'Unit 1: Introduction to Business Research', 'https://curriculab-resources.netlify.app/sem-2/pba208%20%E2%80%93%20business%20research%20methods/pba208%20unit-1%20notes'),
('pba208', 'unit-2', 'study_note', 'Unit 2', 'https://curriculab-resources.netlify.app/sem-2/pba208%20%E2%80%93%20business%20research%20methods/pba208%20unit-2%20notes'),
('pba208', 'unit-3', 'study_note', 'Unit 3', 'https://curriculab-resources.netlify.app/sem-2/pba208%20%E2%80%93%20business%20research%20methods/pba208%20unit-3%20notes'),
('pba208', 'unit-4', 'study_note', 'Unit 4', 'https://curriculab-resources.netlify.app/sem-2/pba208%20%E2%80%93%20business%20research%20methods/pba208%20unit-4%20notes'),
('pba208', 'unit-5', 'study_note', 'Unit 5', 'https://curriculab-resources.netlify.app/sem-2/pba208%20%E2%80%93%20business%20research%20methods/pba208%20unit-5%20notes')
ON CONFLICT DO NOTHING;
