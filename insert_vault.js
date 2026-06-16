const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const dataToInsert = [
  // Sem 1
  // PBA101
  { subject_id: 'c64dcb66-915f-4527-acd7-3681ddbb3b54', unit_id: 'unit-1', type: 'study_note', title: 'Unit 1: Nature and Scope of Economics', link: 'https://curriculab-resources.netlify.app/sem-1/pba101%20%E2%80%93%20managerial%20economics/pba101%20unit-1%20notes' },
  { subject_id: 'c64dcb66-915f-4527-acd7-3681ddbb3b54', unit_id: 'unit-2', type: 'study_note', title: 'Unit 2: Demand Analysis and Demand Forecasting', link: 'https://curriculab-resources.netlify.app/sem-1/pba101%20%E2%80%93%20managerial%20economics/pba101%20unit-2%20notes' },
  { subject_id: 'c64dcb66-915f-4527-acd7-3681ddbb3b54', unit_id: 'unit-3', type: 'study_note', title: 'Unit 3: Indifference Curve Analysis and Cost Analysis', link: 'https://curriculab-resources.netlify.app/sem-1/pba101%20%E2%80%93%20managerial%20economics/pba101%20unit-3%20notes' },
  { subject_id: 'c64dcb66-915f-4527-acd7-3681ddbb3b54', unit_id: 'unit-4', type: 'study_note', title: 'Unit 4: Market Structure and Product Pricing', link: 'https://curriculab-resources.netlify.app/sem-1/pba101%20%E2%80%93%20managerial%20economics/pba101%20unit-4%20notes' },
  { subject_id: 'c64dcb66-915f-4527-acd7-3681ddbb3b54', unit_id: 'unit-5', type: 'study_note', title: 'Unit 5: Profit Analysis, Profit Forecasting and National Income', link: 'https://curriculab-resources.netlify.app/sem-1/pba101%20%E2%80%93%20managerial%20economics/pba101%20unit-5%20notes' },
  // PBA102
  { subject_id: 'f89b10fc-88bd-4a8d-b2fd-f1e0714cfb1a', unit_id: 'unit-1', type: 'study_note', title: 'Unit 1: Introduction to Accounting and Transaction Processing', link: 'https://curriculab-resources.netlify.app/sem-1/pba102%20%E2%80%93%20accounting%20and%20finance%20for%20managers/pba102%20unit-1%20notes' },
  { subject_id: 'f89b10fc-88bd-4a8d-b2fd-f1e0714cfb1a', unit_id: 'unit-2', type: 'study_note', title: 'Unit 2: Financial Statements', link: 'https://curriculab-resources.netlify.app/sem-1/pba102%20%E2%80%93%20accounting%20and%20finance%20for%20managers/pba102%20unit-2%20notes' },
  { subject_id: 'f89b10fc-88bd-4a8d-b2fd-f1e0714cfb1a', unit_id: 'unit-3', type: 'study_note', title: 'Unit 3: Financial statement Analysis', link: 'https://curriculab-resources.netlify.app/sem-1/pba102%20%E2%80%93%20accounting%20and%20finance%20for%20managers/pba102%20unit-3%20notes' },
  { subject_id: 'f89b10fc-88bd-4a8d-b2fd-f1e0714cfb1a', unit_id: 'unit-4', type: 'study_note', title: 'Unit 4: Cash Flow Statement and Inventory Valuation', link: 'https://curriculab-resources.netlify.app/sem-1/pba102%20%E2%80%93%20accounting%20and%20finance%20for%20managers/pba102%20unit-4%20notes' },
  { subject_id: 'f89b10fc-88bd-4a8d-b2fd-f1e0714cfb1a', unit_id: 'unit-5', type: 'study_note', title: 'Unit 5: Financial Decision Making and Cost of Capital', link: 'https://curriculab-resources.netlify.app/sem-1/pba102%20%E2%80%93%20accounting%20and%20finance%20for%20managers/pba102%20unit-5%20notes' },
  // PBA103
  { subject_id: '000a2caa-4b79-4103-8ffe-8ae839331159', unit_id: 'unit-1', type: 'study_note', title: 'Unit 1: Introduction to Data Science and Business Analytics', link: 'https://curriculab-resources.netlify.app/sem-1/pba103%20%E2%80%93%20introduction%20to%20data%20science%20%26%20business%20analytics/pba103%20unit-1%20notes' },
  { subject_id: '000a2caa-4b79-4103-8ffe-8ae839331159', unit_id: 'unit-2', type: 'study_note', title: 'Unit 2: Understanding Business', link: 'https://curriculab-resources.netlify.app/sem-1/pba103%20%E2%80%93%20introduction%20to%20data%20science%20%26%20business%20analytics/pba103%20unit-2%20notes' },
  { subject_id: '000a2caa-4b79-4103-8ffe-8ae839331159', unit_id: 'unit-3', type: 'study_note', title: 'Unit 3: Setting of Targets', link: 'https://curriculab-resources.netlify.app/sem-1/pba103%20%E2%80%93%20introduction%20to%20data%20science%20%26%20business%20analytics/pba103%20unit-3%20notes' },
  { subject_id: '000a2caa-4b79-4103-8ffe-8ae839331159', unit_id: 'unit-4', type: 'study_note', title: 'Unit 4: Introduction to Maturity Stages in Analytics', link: 'https://curriculab-resources.netlify.app/sem-1/pba103%20%E2%80%93%20introduction%20to%20data%20science%20%26%20business%20analytics/pba103%20unit-4%20notes' },
  { subject_id: '000a2caa-4b79-4103-8ffe-8ae839331159', unit_id: 'unit-5', type: 'study_note', title: 'Unit 5: Exploratory Data Analysis (EDA), Business Intelligence, and Ethics in Data Science', link: 'https://curriculab-resources.netlify.app/sem-1/pba103%20%E2%80%93%20introduction%20to%20data%20science%20%26%20business%20analytics/pba103%20unit-5%20notes' },
  // PBA104
  { subject_id: '727c648f-f9d1-4f96-934c-916f1c244e1c', unit_id: 'unit-1', type: 'study_note', title: 'Unit 1: Introduction to Data Management and Data Warehousing', link: 'https://curriculab-resources.netlify.app/sem-1/pba104%20%E2%80%93%20data%20management%20and%20warehousing/pba104%20unit-1%20notes' },
  { subject_id: '727c648f-f9d1-4f96-934c-916f1c244e1c', unit_id: 'unit-2', type: 'study_note', title: 'Unit 2: Introduction to ETL', link: 'https://curriculab-resources.netlify.app/sem-1/pba104%20%E2%80%93%20data%20management%20and%20warehousing/pba104%20unit-2%20notes' },
  { subject_id: '727c648f-f9d1-4f96-934c-916f1c244e1c', unit_id: 'unit-3', type: 'study_note', title: 'Unit 3: Data Integration and Data Quality', link: 'https://curriculab-resources.netlify.app/sem-1/pba104%20%E2%80%93%20data%20management%20and%20warehousing/pba104%20unit-3%20notes' },
  { subject_id: '727c648f-f9d1-4f96-934c-916f1c244e1c', unit_id: 'unit-4', type: 'study_note', title: 'Unit 4: Data Mining', link: 'https://curriculab-resources.netlify.app/sem-1/pba104%20%E2%80%93%20data%20management%20and%20warehousing/pba104%20unit-4%20notes' },
  { subject_id: '727c648f-f9d1-4f96-934c-916f1c244e1c', unit_id: 'unit-5', type: 'study_note', title: 'Unit 5: Data Governance and Security', link: 'https://curriculab-resources.netlify.app/sem-1/pba104%20%E2%80%93%20data%20management%20and%20warehousing/pba104%20unit-5%20notes' },
  // PBA105
  { subject_id: '25f67eee-5865-48bb-9c16-fdcc95ef1645', unit_id: 'unit-1', type: 'study_note', title: 'Unit 1: Linear Programming, Markov Chains and Simulation Techniques', link: 'https://curriculab-resources.netlify.app/sem-1/pba105%20%E2%80%93%20quantitative%20techniques%20for%20business%20decisions/pba105%20unit-1%20notes' },
  { subject_id: '25f67eee-5865-48bb-9c16-fdcc95ef1645', unit_id: 'unit-2', type: 'study_note', title: 'Unit 2: Assignment Models and Transportation Models', link: 'https://curriculab-resources.netlify.app/sem-1/pba105%20%E2%80%93%20quantitative%20techniques%20for%20business%20decisions/pba105%20unit-2%20notes' },
  { subject_id: '25f67eee-5865-48bb-9c16-fdcc95ef1645', unit_id: 'unit-3', type: 'study_note', title: 'Unit 3: Decision Theory and Game Theory', link: 'https://curriculab-resources.netlify.app/sem-1/pba105%20%E2%80%93%20quantitative%20techniques%20for%20business%20decisions/pba105%20unit-3%20notes' },
  { subject_id: '25f67eee-5865-48bb-9c16-fdcc95ef1645', unit_id: 'unit-4', type: 'study_note', title: 'Unit 4: PERT, CPM and Sequencing Problems', link: 'https://curriculab-resources.netlify.app/sem-1/pba105%20%E2%80%93%20quantitative%20techniques%20for%20business%20decisions/pba105%20unit-4%20notes' },
  { subject_id: '25f67eee-5865-48bb-9c16-fdcc95ef1645', unit_id: 'unit-5', type: 'study_note', title: 'Unit 5: Probability and Probability Distributions', link: 'https://curriculab-resources.netlify.app/sem-1/pba105%20%E2%80%93%20quantitative%20techniques%20for%20business%20decisions/pba105%20unit-5%20notes' },
  // PBA106
  { subject_id: 'a7e30eb0-2591-4ed7-8af4-f3983f3e3c28', unit_id: 'unit-1', type: 'study_note', title: 'Unit 1: Evolution of Management & Planning', link: 'https://curriculab-resources.netlify.app/sem-1/pba106%20%E2%80%93%20organizational%20behavior%20and%20principles%20of%20management/pba106%20unit-1%20notes' },
  { subject_id: 'a7e30eb0-2591-4ed7-8af4-f3983f3e3c28', unit_id: 'unit-2', type: 'study_note', title: 'Unit 2: Organizational Behaviour, Perception & Motivation', link: 'https://curriculab-resources.netlify.app/sem-1/pba106%20%E2%80%93%20organizational%20behavior%20and%20principles%20of%20management/pba106%20unit-2%20notes' },
  { subject_id: 'a7e30eb0-2591-4ed7-8af4-f3983f3e3c28', unit_id: 'unit-3', type: 'study_note', title: 'Unit 3: Organization, Staffing, Directing & Leadership', link: 'https://curriculab-resources.netlify.app/sem-1/pba106%20%E2%80%93%20organizational%20behavior%20and%20principles%20of%20management/pba106%20unit-3%20notes' },
  { subject_id: 'a7e30eb0-2591-4ed7-8af4-f3983f3e3c28', unit_id: 'unit-4', type: 'study_note', title: 'Unit 4: Motivation, Communication & Control', link: 'https://curriculab-resources.netlify.app/sem-1/pba106%20%E2%80%93%20organizational%20behavior%20and%20principles%20of%20management/pba106%20unit-4%20notes' },
  { subject_id: 'a7e30eb0-2591-4ed7-8af4-f3983f3e3c28', unit_id: 'unit-5', type: 'study_note', title: 'Unit 5: Job Satisfaction & Employee Behaviour', link: 'https://curriculab-resources.netlify.app/sem-1/pba106%20%E2%80%93%20organizational%20behavior%20and%20principles%20of%20management/pba106%20unit-5%20notes' },
  // PBA107
  { subject_id: 'adbf67bd-44ab-4767-9c57-37aa2095447b', unit_id: 'unit-1', type: 'study_note', title: 'Unit 1: Nature and Scope of Economics', link: 'https://curriculab-resources.netlify.app/sem-1/pba107%20%E2%80%93%20strategic%20management/pba107%20unit-1%20notes' },
  { subject_id: 'adbf67bd-44ab-4767-9c57-37aa2095447b', unit_id: 'unit-2', type: 'study_note', title: 'Unit 2: Strategic Intent and External Environment Analysis', link: 'https://curriculab-resources.netlify.app/sem-1/pba107%20%E2%80%93%20strategic%20management/pba107%20unit-2%20notes' },
  { subject_id: 'adbf67bd-44ab-4767-9c57-37aa2095447b', unit_id: 'unit-3', type: 'study_note', title: 'Unit 3: Strategic Capability and Internal Assessment', link: 'https://curriculab-resources.netlify.app/sem-1/pba107%20%E2%80%93%20strategic%20management/pba107%20unit-3%20notes' },
  { subject_id: 'adbf67bd-44ab-4767-9c57-37aa2095447b', unit_id: 'unit-4', type: 'study_note', title: 'Unit 4: Business-Level and Corporate-Level Strategies', link: 'https://curriculab-resources.netlify.app/sem-1/pba107%20%E2%80%93%20strategic%20management/pba107%20unit-4%20notes' },
  { subject_id: 'adbf67bd-44ab-4767-9c57-37aa2095447b', unit_id: 'unit-5', type: 'study_note', title: 'Unit 5: Portfolio and Analytical Models, Strategy Evaluation and Implementation', link: 'https://curriculab-resources.netlify.app/sem-1/pba107%20%E2%80%93%20strategic%20management/pba107%20unit-5%20notes' },
  // PBA108 -> PBA111 ID
  { subject_id: 'f66a5b3f-ebf0-411b-94fb-b43cb4ff631d', unit_id: 'unit-1', type: 'study_note', title: 'Unit 1: Business Correspondence', link: 'https://curriculab-resources.netlify.app/sem-1/pba108%20%E2%80%93%20business%20communication%20skills%20-%20i/pba108%20unit-1%20notes' },
  { subject_id: 'f66a5b3f-ebf0-411b-94fb-b43cb4ff631d', unit_id: 'unit-2', type: 'study_note', title: 'Unit 2: Report Writing and Presentation Skills', link: 'https://curriculab-resources.netlify.app/sem-1/pba108%20%E2%80%93%20business%20communication%20skills%20-%20i/pba108%20unit-2%20notes' },
  { subject_id: 'f66a5b3f-ebf0-411b-94fb-b43cb4ff631d', unit_id: 'unit-3', type: 'study_note', title: 'Unit 3: Telephone and E-mail Etiquette', link: 'https://curriculab-resources.netlify.app/sem-1/pba108%20%E2%80%93%20business%20communication%20skills%20-%20i/pba108%20unit-3%20notes' },
  { subject_id: 'f66a5b3f-ebf0-411b-94fb-b43cb4ff631d', unit_id: 'unit-4', type: 'study_note', title: 'Unit 4: Cross-Cultural Communication', link: 'https://curriculab-resources.netlify.app/sem-1/pba108%20%E2%80%93%20business%20communication%20skills%20-%20i/pba108%20unit-4%20notes' },
  { subject_id: 'f66a5b3f-ebf0-411b-94fb-b43cb4ff631d', unit_id: 'unit-5', type: 'study_note', title: 'Unit 5: Counselor\'s Interaction', link: 'https://curriculab-resources.netlify.app/sem-1/pba108%20%E2%80%93%20business%20communication%20skills%20-%20i/pba108%20unit-5%20notes' },
  
  // Sem 2
  // PBA204
  { subject_id: 'pba204', unit_id: 'unit-1', type: 'revision_note', title: 'Unit 1 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA204%20Production%20and%20Operations%20Management/PBA204%20Unit-1%20Revision%20Notes.html' },
  { subject_id: 'pba204', unit_id: 'unit-2', type: 'revision_note', title: 'Unit 2 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA204%20Production%20and%20Operations%20Management/PBA204%20Unit-2%20Revision%20Notes.html' },
  { subject_id: 'pba204', unit_id: 'unit-3', type: 'revision_note', title: 'Unit 3 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA204%20Production%20and%20Operations%20Management/PBA204%20Unit-3%20Revision%20Notes.html' },
  { subject_id: 'pba204', unit_id: 'unit-4', type: 'revision_note', title: 'Unit 4 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA204%20Production%20and%20Operations%20Management/PBA204%20Unit-4%20Revision%20Notes.html' },
  { subject_id: 'pba204', unit_id: 'unit-5', type: 'revision_note', title: 'Unit 5 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA204%20Production%20and%20Operations%20Management/PBA204%20Unit-5%20Revision%20Notes.html' },
  // PBA205
  { subject_id: 'pba205', unit_id: 'unit-1', type: 'revision_note', title: 'Unit 1 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA205%20Digital%20Transformation/PBA205%20Unit-1%20Revision%20Notes.html' },
  { subject_id: 'pba205', unit_id: 'unit-2', type: 'revision_note', title: 'Unit 2 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA205%20Digital%20Transformation/PBA205%20Unit-2%20Revision%20Notes.html' },
  { subject_id: 'pba205', unit_id: 'unit-3', type: 'revision_note', title: 'Unit 3 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA205%20Digital%20Transformation/PBA205%20Unit-3%20Revision%20Notes.html' },
  { subject_id: 'pba205', unit_id: 'unit-4', type: 'revision_note', title: 'Unit 4 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA205%20Digital%20Transformation/PBA205%20Unit-4%20Revision%20Notes.html' },
  { subject_id: 'pba205', unit_id: 'unit-5', type: 'revision_note', title: 'Unit 5 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA205%20Digital%20Transformation/PBA205%20Unit-5%20Revision%20Notes.html' },
  // PBA206
  { subject_id: 'pba206', unit_id: 'unit-1', type: 'revision_note', title: 'Unit 1 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA206%20Legal%20Aspects%20of%20Business/PBA206%20Unit-1%20Revision%20Notes.html' },
  { subject_id: 'pba206', unit_id: 'unit-2', type: 'revision_note', title: 'Unit 2 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA206%20Legal%20Aspects%20of%20Business/PBA206%20Unit-2%20Revision%20Notes.html' },
  { subject_id: 'pba206', unit_id: 'unit-3', type: 'revision_note', title: 'Unit 3 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA206%20Legal%20Aspects%20of%20Business/PBA206%20Unit-3%20Revision%20Notes.html' },
  { subject_id: 'pba206', unit_id: 'unit-4', type: 'revision_note', title: 'Unit 4 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA206%20Legal%20Aspects%20of%20Business/PBA206%20Unit-4%20Revision%20Notes.html' },
  { subject_id: 'pba206', unit_id: 'unit-5', type: 'revision_note', title: 'Unit 5 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA206%20Legal%20Aspects%20of%20Business/PBA206%20Unit-5%20Revision%20Notes.html' },
  // PBA207
  { subject_id: 'pba207', unit_id: 'unit-1', type: 'revision_note', title: 'Unit 1 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA207%20Visualization%20and%20Storytelling/PBA207%20Unit-1%20Revision%20Notes.html' },
  { subject_id: 'pba207', unit_id: 'unit-2', type: 'revision_note', title: 'Unit 2 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA207%20Visualization%20and%20Storytelling/PBA207%20Unit-2%20Revision%20Notes.html' },
  { subject_id: 'pba207', unit_id: 'unit-3', type: 'revision_note', title: 'Unit 3 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA207%20Visualization%20and%20Storytelling/PBA207%20Unit-3%20Revision%20Notes.html' },
  { subject_id: 'pba207', unit_id: 'unit-4', type: 'revision_note', title: 'Unit 4 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA207%20Visualization%20and%20Storytelling/PBA207%20Unit-4%20Revision%20Notes.html' },
  { subject_id: 'pba207', unit_id: 'unit-5', type: 'revision_note', title: 'Unit 5 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA207%20Visualization%20and%20Storytelling/PBA207%20Unit-5%20Revision%20Notes.html' },
  // PBA208
  { subject_id: 'pba208', unit_id: 'unit-1', type: 'revision_note', title: 'Unit 1 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA208%20Business%20Research%20Methods/PBA208%20Unit-1%20Revision%20Notes.html' },
  { subject_id: 'pba208', unit_id: 'unit-2', type: 'revision_note', title: 'Unit 2 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA208%20Business%20Research%20Methods/PBA208%20Unit-2%20Revision%20Notes.html' },
  { subject_id: 'pba208', unit_id: 'unit-3', type: 'revision_note', title: 'Unit 3 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA208%20Business%20Research%20Methods/PBA208%20Unit-3%20Revision%20Notes.html' },
  { subject_id: 'pba208', unit_id: 'unit-4', type: 'revision_note', title: 'Unit 4 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA208%20Business%20Research%20Methods/PBA208%20Unit-4%20Revision%20Notes.html' },
  { subject_id: 'pba208', unit_id: 'unit-5', type: 'revision_note', title: 'Unit 5 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA208%20Business%20Research%20Methods/PBA208%20Unit-5%20Revision%20Notes.html' },
  // PBA211
  { subject_id: 'pba211', unit_id: 'unit-1', type: 'revision_note', title: 'Unit 1 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA211%20Data%20Analysis%20Using%20Python/PBA211%20Unit-1%20Revision%20Notes.html' },
  { subject_id: 'pba211', unit_id: 'unit-2', type: 'revision_note', title: 'Unit 2 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA211%20Data%20Analysis%20Using%20Python/PBA211%20Unit-2%20Revision%20Notes.html' },
  { subject_id: 'pba211', unit_id: 'unit-3', type: 'revision_note', title: 'Unit 3 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA211%20Data%20Analysis%20Using%20Python/PBA211%20Unit-3%20Revision%20Notes.html' },
  { subject_id: 'pba211', unit_id: 'unit-4', type: 'revision_note', title: 'Unit 4 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA211%20Data%20Analysis%20Using%20Python/PBA211%20Unit-4%20Revision%20Notes.html' },
  { subject_id: 'pba211', unit_id: 'unit-5', type: 'revision_note', title: 'Unit 5 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA211%20Data%20Analysis%20Using%20Python/PBA211%20Unit-5%20Revision%20Notes.html' },
  // PBA212
  { subject_id: 'pba212', unit_id: 'unit-1', type: 'revision_note', title: 'Unit 1 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA212%20Data%20Analysis%20Using%20Powerbi/PBA212%20Unit-1%20Revision%20Notes.html' },
  { subject_id: 'pba212', unit_id: 'unit-2', type: 'revision_note', title: 'Unit 2 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA212%20Data%20Analysis%20Using%20Powerbi/PBA212%20Unit-2%20Revision%20Notes.html' },
  { subject_id: 'pba212', unit_id: 'unit-3', type: 'revision_note', title: 'Unit 3 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA212%20Data%20Analysis%20Using%20Powerbi/PBA212%20Unit-3%20Revision%20Notes.html' },
  { subject_id: 'pba212', unit_id: 'unit-4', type: 'revision_note', title: 'Unit 4 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA212%20Data%20Analysis%20Using%20Powerbi/PBA212%20Unit-4%20Revision%20Notes.html' },
  { subject_id: 'pba212', unit_id: 'unit-5', type: 'revision_note', title: 'Unit 5 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA212%20Data%20Analysis%20Using%20Powerbi/PBA212%20Unit-5%20Revision%20Notes.html' },
  // PBA213
  { subject_id: 'pba213', unit_id: 'unit-1', type: 'revision_note', title: 'Unit 1 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA213%20Business%20Communication%20-%20II/PBA213%20Unit-1%20Revision%20Notes.html' },
  { subject_id: 'pba213', unit_id: 'unit-2', type: 'revision_note', title: 'Unit 2 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA213%20Business%20Communication%20-%20II/PBA213%20Unit-2%20Revision%20Notes.html' },
  { subject_id: 'pba213', unit_id: 'unit-3', type: 'revision_note', title: 'Unit 3 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA213%20Business%20Communication%20-%20II/PBA213%20Unit-3%20Revision%20Notes.html' },
  { subject_id: 'pba213', unit_id: 'unit-4', type: 'revision_note', title: 'Unit 4 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA213%20Business%20Communication%20-%20II/PBA213%20Unit-4%20Revision%20Notes.html' },
  { subject_id: 'pba213', unit_id: 'unit-5', type: 'revision_note', title: 'Unit 5 Revision Notes', link: 'https://curriculab-resources.netlify.app/Sem-2/PBA213%20Business%20Communication%20-%20II/PBA213%20Unit-5%20Revision%20Notes.html' }
];

async function main() {
    for (const item of dataToInsert) {
        // First check if it already exists to avoid duplicates
        const { data: existing, error: fetchErr } = await supabase
            .from('vault_resources')
            .select('id')
            .eq('subject_id', item.subject_id)
            .eq('unit_id', item.unit_id)
            .eq('type', item.type);
            
        if (fetchErr) {
            console.error('Error fetching existing resource:', fetchErr);
            continue;
        }
        
        if (existing && existing.length > 0) {
            console.log(`Updating existing resource for ${item.subject_id} ${item.unit_id}`);
            const { error: updateErr } = await supabase
                .from('vault_resources')
                .update({ title: item.title, link: item.link })
                .eq('id', existing[0].id);
                
            if (updateErr) console.error('Error updating:', updateErr);
        } else {
            console.log(`Inserting new resource for ${item.subject_id} ${item.unit_id}`);
            const { error: insertErr } = await supabase
                .from('vault_resources')
                .insert([item]);
                
            if (insertErr) console.error('Error inserting:', insertErr);
        }
    }
    console.log('Finished inserting data into vault_resources');
}
main();
