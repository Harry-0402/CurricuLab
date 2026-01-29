-- Seed Resources Data
-- Migrating from lib/data/course-data.ts and video-library.ts

-- Clear existing resources to avoid duplicates during dev
DELETE FROM public.resources;

INSERT INTO public.resources (id, title, description, type, url, category, topic, content) VALUES
-- From VIDEO_LIBRARY (video-library.ts)
('vid-career-1', 'How to Become a Data Analyst in 2025', 'Ken Jee', 'Video', 'https://www.youtube.com/watch?v=DsI1vG-kXR8', 'Roadmap', 'Career Strategy', NULL),
('vid-career-2', 'Business Analyst vs Data Analyst', 'Alex The Analyst', 'Video', 'https://www.youtube.com/watch?v=PSNXoAs2FtQ', 'Roadmap', 'Career Strategy', NULL),
('vid-career-3', 'The Reality of Being a Business Analyst', 'Angelo the BA', 'Video', 'https://www.youtube.com/watch?v=YzogGu_2eRQ', 'Roadmap', 'Career Strategy', NULL),
('vid-career-4', 'Data Analyst Roadmap for Beginners', 'Luke Barousse', 'Video', 'https://www.youtube.com/watch?v=SCG7qM9sUqI', 'Roadmap', 'Career Strategy', NULL),
('vid-career-5', 'Is Business Analytics Worth It?', 'Shane Hummus', 'Video', 'https://www.youtube.com/watch?v=K9teElePNkk', 'Roadmap', 'Career Strategy', NULL),
('vid-career-6', 'Day in the Life of a Business Analyst', 'The Career Force', 'Video', 'https://www.youtube.com/watch?v=FwjaHCVNBWA', 'Roadmap', 'Career Strategy', NULL),
('vid-career-7', 'Top 10 Data Analytics Tools to Learn', 'Simplilearn', 'Video', 'https://www.youtube.com/watch?v=jAAEsLTAnB0', 'Roadmap', 'Tools Overview', NULL),
('vid-career-8', 'How to Build a Data Portfolio from Scratch', 'Mo Chen', 'Video', 'https://www.youtube.com/watch?v=mut8eTdoRxU', 'Roadmap', 'Portfolio', NULL),
('vid-career-9', 'Google Data Analytics Professional Certificate Review', 'Luke Barousse', 'Video', 'https://www.youtube.com/watch?v=vV3IdT5W9Ww', 'Roadmap', 'Certifications', NULL),
('vid-career-10', 'How I Landed a Job as a Business Analyst', 'Liora', 'Video', 'https://www.youtube.com/watch?v=e6QD8lP-m6E', 'Career & Soft Skills', 'Interview Success', NULL),

('vid-excel-1', 'Excel for Data Analytics - Full 10-Hour Course', 'Luke Barousse', 'Video', 'https://www.youtube.com/watch?v=pCJ15nGFgVg', 'Technical Skills', 'Excel', NULL),
('vid-excel-2', 'Excel for Business Analysts Crash Course', 'Simon Sez IT', 'Video', 'https://www.youtube.com/watch?v=egmzpMBmH70', 'Technical Skills', 'Excel', NULL),
('vid-excel-3', 'Mastering XLOOKUP in 5 Minutes', 'Kevin Stratvert', 'Video', 'https://www.youtube.com/watch?v=T_s_L86zXNw', 'Technical Skills', 'Excel', NULL),
('vid-excel-4', 'Advanced Pivot Table Tricks', 'ExcelIsFun', 'Video', 'https://www.youtube.com/watch?v=9NuDhSpVOXY', 'Technical Skills', 'Excel', NULL),
('vid-excel-5', 'Excel Power Query: The Ultimate Guide', 'Leila Gharani', 'Video', 'https://www.youtube.com/watch?v=L4BuUzccLpo', 'Technical Skills', 'Excel', NULL),
('vid-excel-6', 'Automated Dashboards in Excel', 'Kenji Explains', 'Video', 'https://www.youtube.com/watch?v=RM8T1eYhJCE', 'Technical Skills', 'Excel', NULL),
('vid-excel-7', 'Financial Modeling in Excel', 'Corporate Finance Institute', 'Video', 'https://www.youtube.com/watch?v=r-uOLxNrNk8', 'Technical Skills', 'Excel', NULL),
('vid-excel-8', 'Excel Solver for Optimization', 'The Organic Chemistry Tutor', 'Video', 'https://www.youtube.com/watch?v=OT1RErkfLNQ', 'Technical Skills', 'Excel', NULL),
('vid-excel-9', 'Visualizing Data with Excel Charts', 'Chandoo', 'Video', 'https://www.youtube.com/watch?v=PrqDQ9bA9pw', 'Technical Skills', 'Excel', NULL),
('vid-excel-10', 'Excel VBA for Beginners', 'Programming with Mosh', 'Video', 'https://www.youtube.com/watch?v=7S_tz1z_5bA', 'Technical Skills', 'Excel VBA', NULL),
('vid-excel-11', 'Data Cleaning in Excel', 'Kenji Explains', 'Video', 'https://www.youtube.com/watch?v=O1QfG5SXRkM', 'Technical Skills', 'Excel', NULL),
('vid-excel-12', 'Index Match vs VLOOKUP', 'Leila Gharani', 'Video', 'https://www.youtube.com/watch?v=fS0wA_7h8Xk', 'Technical Skills', 'Excel', NULL),
('vid-excel-13', 'Scenario Analysis in Excel', 'Kenji Explains', 'Video', 'https://www.youtube.com/watch?v=8H142K0-yKk', 'Technical Skills', 'Excel', NULL),
('vid-excel-14', 'Excel Regression Analysis', 'The Organic Chemistry Tutor', 'Video', 'https://www.youtube.com/watch?v=Vfo5le26IhY', 'Technical Skills', 'Excel Analysis', NULL),
('vid-excel-15', 'Conditional Formatting Masterclass', 'Kevin Stratvert', 'Video', 'https://www.youtube.com/watch?v=wUSDVGivd-8', 'Technical Skills', 'Excel', NULL),

('vid-sql-1', 'SQL for Data Analytics - 4 Hour Course', 'Luke Barousse', 'Video', 'https://www.youtube.com/watch?v=7mz73uXD9DA', 'Technical Skills', 'SQL', NULL),
('vid-sql-2', 'MySQL Tutorial for Beginners', 'Programming with Mosh', 'Video', 'https://www.youtube.com/watch?v=7S_tz1z_5bA', 'Technical Skills', 'SQL', NULL),
('vid-sql-3', 'Intermediate SQL: Joins & Unions', 'Alex The Analyst', 'Video', 'https://www.youtube.com/watch?v=323H4m4Z99M', 'Technical Skills', 'SQL', NULL),
('vid-sql-4', 'SQL Window Functions Explained', 'Seattle Data Guy', 'Video', 'https://www.youtube.com/watch?v=BNpP9qW6u94', 'Technical Skills', 'SQL', NULL),
('vid-sql-5', 'SQL CTEs (Common Table Expressions)', 'Alex The Analyst', 'Video', 'https://www.youtube.com/watch?v=zsjvFFKOm3c', 'Technical Skills', 'SQL', NULL),
('vid-sql-6', 'SQL Case Statements for Business Logic', 'Data with Baraa', 'Video', 'https://www.youtube.com/watch?v=u8ABLLK3-z0', 'Technical Skills', 'SQL', NULL),
('vid-sql-7', 'Advanced SQL Stored Procedures', 'freeCodeCamp', 'Video', 'https://www.youtube.com/watch?v=HXV3zeQKqGY', 'Technical Skills', 'SQL', NULL),
('vid-sql-8', 'PostgreSQL Full Course', 'Amigoscode', 'Video', 'https://www.youtube.com/watch?v=qw--VYLpxG4', 'Technical Skills', 'SQL', NULL),
('vid-sql-9', 'SQL Data Cleaning Project', 'Alex The Analyst', 'Video', 'https://www.youtube.com/watch?v=8H142K0-yKk', 'Technical Skills', 'SQL', NULL),
('vid-sql-10', 'Database Schema Design for Analytics', 'freeCodeCamp', 'Video', 'https://www.youtube.com/watch?v=ztHopE5Wnpc', 'Technical Skills', 'SQL DB Design', NULL),
('vid-sql-11', 'SQL Interview Questions Prep', 'StrataScratch', 'Video', 'https://www.youtube.com/watch?v=TFMB66E87sU', 'Career & Soft Skills', 'SQL Interview', NULL),
('vid-sql-12', 'SQL Group By vs Order By', 'Adam Finer', 'Video', 'https://www.youtube.com/watch?v=kbKty5ZVKMY', 'Technical Skills', 'SQL', NULL),
('vid-sql-13', 'How to Use SQL with Python', 'Corey Schafer', 'Video', 'https://www.youtube.com/watch?v=ZyhVh-qRZPA', 'Technical Skills', 'SQL & Python', NULL),
('vid-sql-14', 'Optimization in SQL Queries', 'Tech With Tim', 'Video', 'https://www.youtube.com/watch?v=0w8dyXPq8c8', 'Technical Skills', 'SQL Optimization', NULL),
('vid-sql-15', 'Temporary Tables in SQL', 'Alex The Analyst', 'Video', 'https://www.youtube.com/watch?v=qfyynHBFOsM', 'Technical Skills', 'SQL', NULL),

('vid-py-1', 'Python for Data Analysis - Full Course', 'freeCodeCamp', 'Video', 'https://www.youtube.com/watch?v=r-uOLxNrNk8', 'Technical Skills', 'Python', NULL),
('vid-py-2', 'Pandas Library Full Tutorial', 'Corey Schafer', 'Video', 'https://www.youtube.com/watch?v=ZyhVh-qRZPA', 'Technical Skills', 'Python', NULL),
('vid-py-3', 'Matplotlib & Seaborn Visualization', 'Keith Galli', 'Video', 'https://www.youtube.com/watch?v=GjKQ6V_ViQE', 'Technical Skills', 'Python Viz', NULL),
('vid-py-4', 'Jupyter Notebook for Beginners', 'Data School', 'Video', 'https://www.youtube.com/watch?v=HW29067qVWk', 'Technical Skills', 'Python', NULL),
('vid-py-5', 'Numpy in 1 Hour', 'Programming with Mosh', 'Video', 'https://www.youtube.com/watch?v=7S_tz1z_5bA', 'Technical Skills', 'Python', NULL),
('vid-py-6', 'Python Web Scraping with Beautiful Soup', 'Corey Schafer', 'Video', 'https://www.youtube.com/watch?v=ng2o98k983k', 'Technical Skills', 'Python', NULL),
('vid-py-7', 'Exploratory Data Analysis (EDA) in Python', 'Keith Galli', 'Video', 'https://www.youtube.com/watch?v=1b5f8Yn6g9k', 'Technical Skills', 'Python EDA', NULL),
('vid-py-8', 'Scikit-Learn Machine Learning Intro', 'Data School', 'Video', 'https://www.youtube.com/watch?v=0w8dyXPq8c8', 'Technical Skills', 'Data Science', NULL),
('vid-py-9', 'Python for Finance', 'freeCodeCamp', 'Video', 'https://www.youtube.com/watch?v=NK6a_qWbQO0', 'Technical Skills', 'Python Finance', NULL),
('vid-py-10', 'Automating Excel with Python', 'Tech With Tim', 'Video', 'https://www.youtube.com/watch?v=mut8eTdoRxU', 'Technical Skills', 'Python Automation', NULL),
('vid-py-11', 'Clean Data with Python Pandas', 'Alex The Analyst', 'Video', 'https://www.youtube.com/watch?v=PH1sPgNjIDQ', 'Technical Skills', 'Python', NULL),
('vid-py-12', 'Plotly Express Interactive Charts', 'Charming Data', 'Video', 'https://www.youtube.com/watch?v=iNEwkaYmPqY', 'Technical Skills', 'Python Viz', NULL),
('vid-py-13', 'Time Series Analysis in Python', 'Simplilearn', 'Video', 'https://www.youtube.com/watch?v=N8TCYAucViA', 'Technical Skills', 'Python', NULL),
('vid-py-14', 'Python APIs for Data Extraction', 'Keith Galli', 'Video', 'https://www.youtube.com/watch?v=5RzGOqZe-Gk', 'Technical Skills', 'Python', NULL),
('vid-py-15', 'Building a Python Portfolio Project', 'Ken Jee', 'Video', 'https://www.youtube.com/watch?v=M9ItmCnVZkM', 'Technical Skills', 'Python Project', NULL),

('vid-stat-1', 'Statistics for Data Science Full Course', 'Great Learning', 'Video', 'https://www.youtube.com/watch?v=Vfo5le26IhY', 'Technical Skills', 'Statistics', NULL),
('vid-stat-2', 'Linear Regression Explained Clearly', 'StatQuest', 'Video', 'https://www.youtube.com/watch?v=nk2CQITm_eo', 'Technical Skills', 'Statistics', NULL),
('vid-stat-3', 'Hypothesis Testing & P-Values', 'StatQuest', 'Video', 'https://www.youtube.com/watch?v=0oc49DyA3hU', 'Technical Skills', 'Statistics', NULL),
('vid-stat-4', 'Probability Distributions Overview', '3Blue1Brown', 'Video', 'https://www.youtube.com/watch?v=HZGCoVF3YvM', 'Technical Skills', 'Statistics', NULL),
('vid-stat-5', 'Central Limit Theorem Visualized', 'Khan Academy', 'Video', 'https://www.youtube.com/watch?v=ROpbdO-gRUo', 'Technical Skills', 'Statistics', NULL),
('vid-stat-6', 'Correlation vs Causation', 'Simplilearn', 'Video', 'https://www.youtube.com/watch?v=Lv0xcdeXaGU', 'Technical Skills', 'Statistics', NULL),
('vid-stat-7', 'Standard Deviation & Variance', 'StatQuest', 'Video', 'https://www.youtube.com/watch?v=HMOI_lkzW08', 'Technical Skills', 'Statistics', NULL),
('vid-stat-8', 'Z-Scores & Normal Distribution', 'The Organic Chemistry Tutor', 'Video', 'https://www.youtube.com/watch?v=tcusIOfI_GM', 'Technical Skills', 'Statistics', NULL),
('vid-stat-9', 'Bayes Theorem Intuition', '3Blue1Brown', 'Video', 'https://www.youtube.com/watch?v=HZGCoVF3YvM', 'Technical Skills', 'Statistics', NULL),
('vid-stat-10', 'Chi-Square Test Explained', 'StatQuest', 'Video', 'https://www.youtube.com/watch?v=0oc49DyA3hU', 'Technical Skills', 'Statistics', NULL),

('vid-bi-1', 'Power BI Full Course for Beginners', 'Luke Barousse', 'Video', 'https://www.youtube.com/watch?v=FwjaHCVNBWA', 'Technical Skills', 'Power BI', NULL),
('vid-bi-2', 'Tableau Full Course - 6 Hours', 'Edureka', 'Video', 'https://www.youtube.com/watch?v=aHaOIvR00So', 'Technical Skills', 'Tableau', NULL),
('vid-bi-3', 'Power BI DAX Tutorial', 'Guy in a Cube', 'Video', 'https://www.youtube.com/watch?v=9VqHq4m21w8', 'Technical Skills', 'Power BI', NULL),
('vid-bi-4', 'Tableau Calculated Fields', 'Abhishek Agarwal', 'Video', 'https://www.youtube.com/watch?v=OuD8Q9jOqO0', 'Technical Skills', 'Tableau', NULL),
('vid-bi-5', 'Power BI vs Tableau: 2025 Guide', 'codebasics', 'Video', 'https://www.youtube.com/watch?v=48S4Cea7c1A', 'Technical Skills', 'BI Tools', NULL),
('vid-bi-6', 'Building a Tableau Dashboard Project', 'Alex The Analyst', 'Video', 'https://www.youtube.com/watch?v=j8FSP8XuFyk', 'Technical Skills', 'Tableau', NULL),
('vid-bi-7', 'Power BI Desktop Complete Tutorial', 'Accounts Expert', 'Video', 'https://www.youtube.com/watch?v=qOTdpjLUELg', 'Technical Skills', 'Power BI', NULL),
('vid-bi-8', 'Tableau Level of Detail (LOD)', 'Tableau Software', 'Video', 'https://www.youtube.com/watch?v=uD4gEa7_jKo', 'Technical Skills', 'Tableau', NULL),
('vid-bi-9', 'Data Modeling in Power BI', 'Guy in a Cube', 'Video', 'https://www.youtube.com/watch?v=9VqHq4m21w8', 'Technical Skills', 'Power BI', NULL),
('vid-bi-10', 'Tableau Map Visualizations', 'Simplilearn', 'Video', 'https://www.youtube.com/watch?v=K0-wCS2ujeA', 'Technical Skills', 'Tableau', NULL),
('vid-bi-11', 'Power BI Filters & Slicers', 'Kevin Stratvert', 'Video', 'https://www.youtube.com/watch?v=wUSDVGivd-8', 'Technical Skills', 'Power BI', NULL),
('vid-bi-12', 'Storytelling with Data in Tableau', 'Edureka', 'Video', 'https://www.youtube.com/watch?v=UpWlVWCS1vU', 'Technical Skills', 'Tableau', NULL),
('vid-bi-13', 'Power BI Paginated Reports', 'Guy in a Cube', 'Video', 'https://www.youtube.com/watch?v=9VqHq4m21w8', 'Technical Skills', 'Power BI', NULL),
('vid-bi-14', 'Tableau Relationships vs Joins', 'Alex The Analyst', 'Video', 'https://www.youtube.com/watch?v=j8FSP8XuFyk', 'Technical Skills', 'Tableau', NULL),
('vid-bi-15', 'Publishing to Power BI Service', 'Guy in a Cube', 'Video', 'https://www.youtube.com/watch?v=9VqHq4m21w8', 'Technical Skills', 'Power BI', NULL),

('vid-case-1', 'Sales Insights Data Analysis (Power BI + SQL)', 'codebasics', 'Video', 'https://www.youtube.com/watch?v=hhZ62IlCyYs', 'Business Strategy', 'Case Study', NULL),
('vid-case-2', 'Google Capstone Case Study: Cyclistic', 'Google Careers', 'Video', 'https://www.youtube.com/watch?v=1b5f8Yn6g9k', 'Business Strategy', 'Case Study', NULL),
('vid-case-3', 'Netflix Data Analysis with Python', 'Data Science Harshit', 'Video', 'https://www.youtube.com/watch?v=Kz6M8M9dY6c', 'Business Strategy', 'Case Study', NULL),
('vid-case-4', 'Customer Churn Prediction Case Study', 'Ken Jee', 'Video', 'https://www.youtube.com/watch?v=M9ItmCnVZkM', 'Business Strategy', 'Case Study', NULL),
('vid-case-5', 'Marketing Analytics Case Study', '365 Data Science', 'Video', 'https://www.youtube.com/watch?v=fw8Wd8r4gS0', 'Business Strategy', 'Case Study', NULL),
('vid-case-6', 'Supply Chain Optimization Case Study', 'Haystack', 'Video', 'https://www.youtube.com/watch?v=5c2n6H6k6_M', 'Business Strategy', 'Case Study', NULL),
('vid-case-7', 'HR Analytics Dashboard Case Study', 'Data Tutorials', 'Video', 'https://www.youtube.com/watch?v=6m3K5Z8k7_M', 'Business Strategy', 'Case Study', NULL),
('vid-case-8', 'Retail Sales Forecasting Project', 'Krish Naik', 'Video', 'https://www.youtube.com/watch?v=wvP5KR964_0', 'Business Strategy', 'Case Study', NULL),
('vid-case-9', 'Analyzing Uber Trips in Python', 'Keith Galli', 'Video', 'https://www.youtube.com/watch?v=5RzGOqZe-Gk', 'Business Strategy', 'Case Study', NULL),
('vid-case-10', 'Financial Statement Analysis Project', 'Chandoo', 'Video', 'https://www.youtube.com/watch?v=PrqDQ9bA9pw', 'Business Strategy', 'Case Study', NULL),
('vid-case-11', 'E-commerce Customer Segmentation', 'Simplilearn', 'Video', 'https://www.youtube.com/watch?v=N8TCYAucViA', 'Business Strategy', 'Case Study', NULL),
('vid-case-12', 'Healthcare Data Analytics Case Study', 'Alex The Analyst', 'Video', 'https://www.youtube.com/watch?v=qfyynHBFOsM', 'Business Strategy', 'Case Study', NULL),
('vid-case-13', 'Sports Analytics: Predicting Win Rates', 'Ken Jee', 'Video', 'https://www.youtube.com/watch?v=M9ItmCnVZkM', 'Business Strategy', 'Case Study', NULL),
('vid-case-14', 'Real Estate Market Trends Project', 'Krish Naik', 'Video', 'https://www.youtube.com/watch?v=wvP5KR964_0', 'Business Strategy', 'Case Study', NULL),
('vid-case-15', 'Fraud Detection in Banking Case Study', 'Great Learning', 'Video', 'https://www.youtube.com/watch?v=Vfo5le26IhY', 'Business Strategy', 'Case Study', NULL),

('vid-soft-1', 'Data Analyst Interview Questions & Answers', 'Agatha', 'Video', 'https://www.youtube.com/watch?v=5RzGOqZe-Gk', 'Career & Soft Skills', 'Interview Prep', NULL),
('vid-soft-2', 'Top 5 Insider Interview Tips', 'Jay Feng', 'Video', 'https://www.youtube.com/watch?v=BwFJRVxZjDs', 'Career & Soft Skills', 'Interview Prep', NULL),
('vid-soft-3', 'Common Behavioral Questions for Analysts', 'Sona Bhatt', 'Video', 'https://www.youtube.com/watch?v=oPjVPAuuzaA', 'Career & Soft Skills', 'Interview Prep', NULL),
('vid-soft-4', 'How to Explain Your Project in an Interview', 'Luke Barousse', 'Video', 'https://www.youtube.com/watch?v=SCG7qM9sUqI', 'Career & Soft Skills', 'Interview Prep', NULL),
('vid-soft-5', 'Data Storytelling Masterclass', 'Storytelling with Data', 'Video', 'https://www.youtube.com/watch?v=uD4gEa7_jKo', 'Career & Soft Skills', 'Communication', NULL),
('vid-soft-6', 'Python Live Coding Interview Prep', 'Ken Jee', 'Video', 'https://www.youtube.com/watch?v=M9ItmCnVZkM', 'Career & Soft Skills', 'Technical Interview', NULL),
('vid-soft-7', 'SQL Live Coding Interview Prep', 'Alex The Analyst', 'Video', 'https://www.youtube.com/watch?v=TFMB66E87sU', 'Career & Soft Skills', 'Technical Interview', NULL),
('vid-soft-8', 'Case Study Interview: Crack the Business Logic', 'CareerVidz', 'Video', 'https://www.youtube.com/watch?v=LWPEH5rUAoE', 'Career & Soft Skills', 'Case Interview', NULL),
('vid-soft-9', 'Negotiating Your Salary as an Analyst', 'Luke Barousse', 'Video', 'https://www.youtube.com/watch?v=SCG7qM9sUqI', 'Career & Soft Skills', 'Career Growth', NULL),
('vid-soft-10', 'Presenting Data Insights to Stakeholders', 'Google Careers', 'Video', 'https://www.youtube.com/watch?v=1b5f8Yn6g9k', 'Career & Soft Skills', 'Communication', NULL),

-- From LOCAL_RESOURCES (course-data.ts)
('tech-1', 'Kaggle Learn', 'Free micro-courses on Pandas, SQL, and Visualization.', 'Link', 'https://www.kaggle.com/learn', 'Technical Skills', NULL, NULL),
('tech-2', 'Google Analytics Academy', 'Web data analysis courses.', 'Link', 'https://analytics.google.com/analytics/academy/', 'Technical Skills', NULL, NULL),
('tech-3', 'LeetCode Database', 'Practice SQL queries with real interview questions.', 'Link', 'https://leetcode.com/problemset/database/', 'Technical Skills', NULL, NULL),
('tech-4', 'Stratascratch', 'Real interview questions from companies like DoorDash and Uber.', 'Link', 'https://www.stratascratch.com/', 'Technical Skills', NULL, NULL),
('tech-5', 'W3Schools SQL', 'Best syntax reference for SQL.', 'Link', 'https://www.w3schools.com/sql/', 'Technical Skills', NULL, NULL),
('tech-6', 'Tableau Public', 'Download the free tool and host your portfolio.', 'Link', 'https://public.tableau.com/s/', 'Technical Skills', NULL, NULL),
('tech-7', 'Workout Wednesday', 'Weekly challenges for Power BI & Tableau.', 'Link', 'http://www.workout-wednesday.com/', 'Technical Skills', NULL, NULL),
('tech-8', 'MakeoverMonday', 'Community project to improve existing charts.', 'Link', 'https://www.makeovermonday.co.uk/', 'Technical Skills', NULL, NULL),
('tech-9', 'Fast.ai', 'Practical Deep Learning for Coders.', 'Link', 'https://www.fast.ai/', 'Technical Skills', NULL, NULL),
('tech-10', 'Google ML Crash Course', 'Google''s fast-paced introduction to machine learning.', 'Link', 'https://developers.google.com/machine-learning/crash-course', 'Technical Skills', NULL, NULL),
('tech-11', 'AWS Educate', 'Cloud career pathways for students.', 'Link', 'https://aws.amazon.com/education/awseducate/', 'Technical Skills', NULL, NULL),
('tech-12', 'Microsoft Learn Azure Data', 'Azure Data Fundamentals training path.', 'Link', 'https://learn.microsoft.com/en-us/training/paths/azure-data-fundamentals-explore-core-data-concepts/', 'Technical Skills', NULL, NULL),

('biz-1', 'Investopedia', 'Search for terms like "EBITDA", "ROI", "Churn Rate".', 'Link', 'https://www.investopedia.com/', 'Business Strategy', NULL, NULL),
('biz-2', 'Strategy+Business', 'Insights on global business strategy and management.', 'Link', 'https://www.strategy-business.com/', 'Business Strategy', NULL, NULL),
('biz-3', 'CaseInterview.com', 'Victor Cheng''s free frameworks and case interview prep.', 'Link', 'https://caseinterview.com/', 'Business Strategy', NULL, NULL),
('biz-4', 'Management Consulted', 'Case library and math drills for consulting prep.', 'Link', 'https://managementconsulted.com/', 'Business Strategy', NULL, NULL),
('biz-5', 'McKinsey Featured Insights', 'Research and insights from McKinsey & Company.', 'Link', 'https://www.mckinsey.com/featured-insights', 'Business Strategy', NULL, NULL),
('biz-6', 'CB Insights', 'Tech market intelligence.', 'Link', 'https://www.cbinsights.com/research/', 'Business Strategy', NULL, NULL),
('biz-7', 'Data & Society', 'Research on the social implications of data-centric technologies.', 'Link', 'https://datasociety.net/', 'Business Strategy', NULL, NULL),
('biz-8', 'EU Ethics Guidelines', 'Ethics Guidelines for Trustworthy AI.', 'Link', 'https://digital-strategy.ec.europa.eu/en/library/ethics-guidelines-trustworthy-ai', 'Business Strategy', NULL, NULL),

('car-1', 'Toastmasters International', 'Find a club near you to improve communication skills.', 'Link', 'https://www.toastmasters.org/find-a-club', 'Career & Soft Skills', NULL, NULL),
('car-2', 'TED Talks', 'Ideas worth spreading - great for presentation inspiration.', 'Link', 'https://www.ted.com/', 'Career & Soft Skills', NULL, NULL),
('car-3', 'Novoresume', 'ATS-friendly resume templates.', 'Link', 'https://novoresume.com/', 'Career & Soft Skills', NULL, NULL),
('car-4', 'Pramp (Exponent)', 'Free peer-to-peer mock interviews.', 'Link', 'https://www.pramp.com/', 'Career & Soft Skills', NULL, NULL),
('car-5', 'Meetup', 'Find Data Science meetups in your city.', 'Link', 'https://www.meetup.com/', 'Career & Soft Skills', NULL, NULL),
('car-6', 'Notion', 'Organize your study plan.', 'Link', 'https://www.notion.so/', 'Career & Soft Skills', NULL, NULL),
('car-7', 'Pomodoro Tracker', 'Simple timer for deep work sessions.', 'Link', 'https://pomofocus.io/', 'Career & Soft Skills', NULL, NULL),
('car-8', '80,000 Hours', 'High-impact career guide.', 'Link', 'https://80000hours.org/', 'Career & Soft Skills', NULL, NULL),

('learn-1', 'Google Data Analytics Cert', 'Professional certificate on Coursera.', 'Link', 'https://www.coursera.org/professional-certificates/google-data-analytics', 'Learning & Trends', NULL, NULL),
('learn-2', 'edX MicroMasters', 'Graduate-level courses from top universities.', 'Link', 'https://www.edx.org/micromasters', 'Learning & Trends', NULL, NULL),
('learn-3', 'Storytelling with Data', 'Book recommendation for data visualization.', 'PDF', 'https://drive.google.com/file/d/1hZDE3mvz3zVLLuKcjGGtyBba2agPXNOR/preview', 'Learning & Trends', NULL, NULL),
('learn-4', 'Naked Statistics', 'Book recommendation on statistical concepts.', 'Link', 'https://wwnorton.com/books/naked-statistics/', 'Learning & Trends', NULL, NULL),
('learn-5', 'Towards Data Science', 'Medium publication for data science articles.', 'Link', 'https://towardsdatascience.com/', 'Learning & Trends', NULL, NULL),
('learn-6', 'Data Skeptic Podcast', 'Podcast on data science, statistics, machine learning, and AI.', 'Link', 'https://dataskeptic.com/', 'Learning & Trends', NULL, NULL),
('learn-7', 'INFORMS', 'Institute for Operations Research and the Management Sciences.', 'Link', 'https://www.informs.org/', 'Learning & Trends', NULL, NULL),
('learn-8', 'IEEE Computer Society', 'Professional association for computer science.', 'Link', 'https://www.computer.org/', 'Learning & Trends', NULL, NULL),
('learn-9', 'Glassdoor', 'Company reviews and salaries.', 'Link', 'https://www.glassdoor.com/', 'Learning & Trends', NULL, NULL),
('learn-10', 'LinkedIn Jobs', 'Job search engine.', 'Link', 'https://www.linkedin.com/jobs/', 'Learning & Trends', NULL, NULL),
('learn-11', 'GitHub', 'Host and review code, manage projects, and build software.', 'Link', 'https://github.com/', 'Learning & Trends', NULL, NULL),
('learn-12', 'Papers with Code', 'ML papers with code implementations.', 'Link', 'https://paperswithcode.com/', 'Learning & Trends', NULL, NULL),
('learn-13', 'Morning Brew', 'Daily business news newsletter.', 'Link', 'https://www.morningbrew.com/', 'Learning & Trends', NULL, NULL),
('learn-14', 'TLDR Newsletter', 'Daily tech news newsletter.', 'Link', 'https://tldr.tech/', 'Learning & Trends', NULL, NULL),

('hero-yt-1', 'Alex The Analyst', 'Guided portfolio projects (SQL -> Excel -> Tableau).', 'Video', 'https://www.youtube.com/c/AlexTheAnalyst', 'Technical Skills', 'Data Analysis', NULL),
('hero-yt-2', 'Guy in a Cube', 'Advanced Power BI & DAX. Real-world complex problems.', 'Video', 'https://www.youtube.com/c/GuyinaCube', 'Technical Skills', 'Power BI', NULL),
('hero-yt-3', 'Seattle Data Guy', 'Data Engineering & ETL pipelines.', 'Video', 'https://www.youtube.com/c/SeattleDataGuy', 'Technical Skills', 'Data Engineering', NULL),
('hero-yt-4', 'Sundas Khalid', 'FAANG Interview Prep & Behavioral questions.', 'Video', 'https://www.youtube.com/c/SundasKhalid', 'Career & Soft Skills', 'Interview Prep', NULL),
('hero-yt-5', 'Thu Vu data analytics', 'Python automation & unique datasets.', 'Video', 'https://www.youtube.com/c/ThuVudataanalytics', 'Technical Skills', 'Python', NULL),
('hero-yt-6', 'StatQuest (Josh Starmer)', 'Statistics intuition and Machine Learning concepts.', 'Video', 'https://www.youtube.com/user/joshstarmer', 'Technical Skills', 'Statistics', NULL),
('hero-yt-7', 'Dr. Nancy Li', 'Product Sense & Business Analytics.', 'Video', 'https://www.youtube.com/c/DrNancyLi', 'Business Strategy', 'Product Management', NULL),
('hero-yt-8', 'Krish Naik', 'End-to-End Data Science & Deployment.', 'Video', 'https://www.youtube.com/user/krishnaik06', 'Technical Skills', 'Data Science', NULL),

('guide-roadmap', 'Zero to Hero Roadmap', 'A 6-month comprehensive roadmap to becoming a "Hero" Analyst.', 'Article', '#', 'Roadmap', NULL, '# The "Zero to Hero" Roadmap

To truly bridge the gap from "Competent" to "Hero," you need to go beyond standard syllabi.

### The 3 Core Pillars
1. **End-to-End Projects**: Building something from scratch.
2. **Advanced "Dirty" Work**: Cleaning messy data, not just using clean Kaggle datasets.
3. **Domain Dominance**: Understanding the business logic, not just the code.

### 6-Month Action Plan

#### Month 1-2: The Foundation
*Use the Syllabus Resources (Part I list) to pass your exams and understand the vocabulary.*

#### Month 3-4: The Application
*Use **Alex The Analyst** and **Thu Vu** (from the YouTube list) to build 3 solid projects.*
* **Project 1**: SQL Data Cleaning.
* **Project 2**: Power BI Dashboard for Sales.
* **Project 3**: Python Exploratory Analysis of a unique dataset (e.g., Cricket scores, Stock market).
* **Action**: Post them on GitHub/LinkedIn.

#### Month 5-6: The Polish
*Use **Sundas Khalid** and **Stratascratch** to prep for the actual interview environment.*

### Professor''s Verdict
If you consume the syllabus content + the 7 "Hero" channels, and **actually do the work** (not just watch), you will be in the top 1% of freshers. Stop searching for more links now; **start building**.'),

('guide-interview', 'Interview Cheat Sheet', 'Top 21 high-probability questions for Google, Amazon, Deloitte, TCS/Accenture.', 'Article', '#', 'Interview Prep', NULL, '# Comprehensive Interview "Cheat Sheet"

I have curated a list of 21 high-probability questions per company, focusing on the "Zero to Hero" transition.

## 1. Google (Role: Business Analyst / Data Analyst)
**Focus**: Product Sense and Analytical Thinking.

### Top Questions
1. **Metric Definition**: How would you measure the success of Google Maps'' "Save Route" feature?
2. **Product Insight**: YouTube watch time is up 10%, but user retention is down 5%. Why?
3. **Spam Detection**: How would you design a system to detect fake reviews on the Play Store?
4. **A/B Testing**: We want to test a new search bar design. What metrics would you track?
...
*(See full list in your study notes)*

### Solution Spotlight: YouTube Metrics
* **Hypothesis 1**: Clickbait titles increasing views but causing high bounce rate.
* **Hypothesis 2**: Technical bugs (buffering).
* **Hypothesis 3**: New feature cannibalization (e.g., Shorts).
* **Action**: Segment data by device, region, and video type.

---

## 2. Amazon (Role: BIE / Business Analyst)
**Focus**: Leadership Principles and SQL efficiency.

### Top Questions
1. **Leadership**: Tell me about a time you disagreed with your manager. (Have Backbone)
2. **SQL**: Find the top 3 selling products in each category.
3. **SQL**: Calculate the month-over-month growth rate of Prime subscriptions.
4. **Data Modeling**: Design a Star Schema for Amazon''s Order Management System.
...

### Solution Spotlight: Churn SQL
```sql
SELECT A.customer_id
FROM Orders A
LEFT JOIN Orders B ON A.customer_id = B.customer_id 
AND B.order_date BETWEEN ''2025-02-01'' AND ''2025-02-28''
WHERE A.order_date BETWEEN ''2025-01-01'' AND ''2025-01-31''
AND B.customer_id IS NULL;
```

---

## 3. Deloitte (Role: Strategy & Operations Analyst)
**Focus**: Consulting Fit, Communication, and Case Studies.

### Top Questions
1. **Guesstimate**: Estimate the number of traffic lights in Mumbai.
2. **Market Sizing**: What is the market size of nappies in India?
3. **Profitability Case**: A cement manufacturer''s profits are down 15%. Diagnose the problem.
...

### Solution Spotlight: Profitability Case
* **Framework**: Profits = Revenue - Cost.
* **Branch 1 (Revenue)**: Prices down? Volume down?
* **Branch 2 (Cost)**: Fixed costs (Rent)? Variable costs (Raw materials)?

---

## 4. TCS / Accenture (Role: Business Analyst / Data Analyst)
**Focus**: Core Basics, SQL, and Process Knowledge (Agile/SDLC).

### Top Questions
1. **Basics**: Who is a Business Analyst?
2. **Process**: Explain the SDLC (Software Development Life Cycle).
3. **SQL**: Difference between DELETE, DROP, and TRUNCATE?
4. **SQL**: Find the 2nd highest salary from the Employee table.
...

### Solution Spotlight: 2nd Highest Salary
```sql
SELECT MAX(Salary)
FROM Employee
WHERE Salary < (SELECT MAX(Salary) FROM Employee);
```

### Professor''s "Hero" Advice for 2026
* **Google/Amazon**: Practice Medium-level SQL on LeetCode.
* **Deloitte**: Polish communication (Point 1, Point 2, Conclusion).
* **TCS/Accenture**: Know definitions (Agile vs Waterfall).
'),

('coding-platforms', 'Top Coding Platforms', 'Curated list of platforms for "Zero to Hero" coding skills.', 'Article', '#', 'Coding', NULL, '# Top Websites to Enhance Coding Skills

### 1. The "Gold Standard" for Interviews
* **LeetCode**: #1 for technical interviews. "SQL 50" Study Plan is essential.
* **Stratascratch**: Real interview questions from data science companies.
* **HackerRank**: Used by many MNCs for screening. Good for basic certifications.

### 2. The "Real-World Project" Builders
* **DataCamp**: Interactive, applied skills (e.g., "Marketing Analytics in Python").
* **Codecademy**: Good for syntax and first end-to-end projects.
* **Kaggle**: The home of Data Science. Competitions are highly valued.

### 3. The "Cloud & Big Data" Giants
* **AWS Educate**: Cloud data basics (AWS Certified Cloud Practitioner).
* **Microsoft Learn**: Power BI mastery (PL-300).
* **Google Cloud Skills Boost**: BigQuery and Google Data Analytics Cert.

### Recommendation
1. **For Resume**: HackerRank SQL (Intermediate) badge.
2. **For Job Skills**: DataCamp Data Analyst track.
3. **For Interview Prep**: 1 SQL question on LeetCode every day.
'),

('coding-leetcode', 'LeetCode', 'Gold standard for interview prep.', 'Link', 'https://leetcode.com', 'Coding', NULL, NULL),
('coding-stratascratch', 'Stratascratch', 'Real data science interview questions.', 'Link', 'https://www.stratascratch.com', 'Coding', NULL, NULL),
('coding-hackerrank', 'HackerRank', 'Skill assessments and certifications.', 'Link', 'https://www.hackerrank.com', 'Coding', NULL, NULL),
('coding-datacamp', 'DataCamp', 'Interactive learning for data skills.', 'Link', 'https://www.datacamp.com', 'Coding', NULL, NULL),

('pba207-1', 'The Data Warehouse Lifecycle Toolkit', 'Textbook by Kimball et al.', 'Link', 'https://www.google.com/search?q=The+Data+Warehouse+Lifecycle+Toolkit+Kimball', 'Academic', 'Data Visualization', NULL),
('pba207-2', 'Hadoop in Practice', 'Textbook by Alex Holmes', 'Link', 'https://www.google.com/search?q=Hadoop+in+Practice+Alex+Holmes', 'Academic', 'Data Visualization', NULL),
('pba207-3', 'Tableau Public', 'Platform for data visualization.', 'Link', 'https://public.tableau.com/s/', 'Academic', 'Data Visualization', NULL),
('pba207-4', 'Kaggle: Data Visualization', 'Course on Kaggle.', 'Link', 'https://www.kaggle.com/learn/data-visualization', 'Academic', 'Data Visualization', NULL),
('pba207-5', 'MakeoverMonday', 'Community project.', 'Link', 'https://www.makeovermonday.co.uk/', 'Academic', 'Data Visualization', NULL),

('pba208-1', 'Business Research Methods', 'Textbook by Donald R. Cooper.', 'Link', 'https://www.google.com/search?q=Business+Research+Methods+Donald+Cooper', 'Academic', 'Business Research', NULL),
('pba208-2', 'Research Methodology', 'Textbook by C.R. Kothari.', 'PDF', 'https://drive.google.com/file/d/14RZZwFqaw9l-9YiRtO7oJXjZxGexGFuU/preview', 'Academic', 'Business Research', NULL),
('pba208-3', 'Coursera: BRM', 'Business Research Methods courses.', 'Link', 'https://www.coursera.org/search?query=business%20research%20methods', 'Academic', 'Business Research', NULL),
('pba208-4', 'Google Scholar', 'Academic search engine.', 'Link', 'https://scholar.google.com/', 'Academic', 'Business Research', NULL),

('pba204-1', 'Operations Management (Krajewski)', 'Textbook resource.', 'PDF', 'https://drive.google.com/file/d/1pZiZqo64-WB5fqYoLMrZ4ijaigCPsG9M/preview', 'Academic', 'Operations Mgmt', NULL),
('pba205-new-1', 'Digital Transformation (Rice)', 'Comprehensive guide to Digital Transformation.', 'PDF', 'https://drive.google.com/file/d/1wBasm93LWLw8BtgxdTocVVDjBL6otwmV/preview', 'Academic', 'Digital Transformation', NULL),
('pba204-2', 'The Goal - Eliyahoo Goldratt', 'Reference book.', 'Link', 'https://www.google.com/search?q=The+Goal+Eliyahoo+Goldratt', 'Academic', 'Operations Mgmt', NULL),
('pba204-3', 'MIT OpenCourseWare', 'Supply Chain resources.', 'Link', 'https://ocw.mit.edu/search/?q=supply+chain', 'Academic', 'Operations Mgmt', NULL),
('pba204-4', 'Six Sigma Council', 'Certification and resources.', 'Link', 'https://www.sixsigmacouncil.org/', 'Academic', 'Operations Mgmt', NULL),

('pba206-1', 'Labour and Industrial Laws', 'Textbook by P.K. Padhi.', 'PDF', 'https://drive.google.com/file/d/1Cjtby1ADpgdP4oPvz6d3hW-5VazCCtID/preview', 'Academic', 'Business Law', NULL),
('pba206-2', 'India Code', 'Digital Repository of Acts.', 'Link', 'https://www.indiacode.nic.in/', 'Academic', 'Business Law', NULL);
