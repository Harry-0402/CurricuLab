-- ==========================================
-- YouTube Videos for PBA211
-- Data Analysis Using Python
-- Subject ID: pba211
-- Table: youtube_library
-- ==========================================

INSERT INTO youtube_library (subject_id, unit_id, title, url, tags) VALUES

-- ── Unit 1: Introduction to Python ────────────────────────────────
('pba211', 'unit-1', 'Variables', 'https://www.youtube.com/results?search_query=Python+Variables+for+Beginners+complete+tutorial', ARRAY['unit-1', 'variables', 'python']),
('pba211', 'unit-1', 'Numeric Data Types (Int & Float)', 'https://www.youtube.com/results?search_query=Python+Integer+and+Float+Data+Types+explained', ARRAY['unit-1', 'data types', 'int', 'float']),
('pba211', 'unit-1', 'Sequential Types (String & List)', 'https://www.youtube.com/results?search_query=Python+Strings+and+Lists+complete+lecture', ARRAY['unit-1', 'strings', 'lists']),
('pba211', 'unit-1', 'Definite Loops (For Loops)', 'https://www.youtube.com/results?search_query=Python+For+Loops+tutorial+with+examples', ARRAY['unit-1', 'for loops']),
('pba211', 'unit-1', 'If-Elif-Else Statements', 'https://www.youtube.com/results?search_query=Python+Conditional+Statements+If+Elif+Else+explained', ARRAY['unit-1', 'if elif else', 'conditionals']),
('pba211', 'unit-1', 'Tuples', 'https://www.youtube.com/results?search_query=Python+Tuples+complete+tutorial', ARRAY['unit-1', 'tuples']),
('pba211', 'unit-1', 'Build Mortgage Calculator with Python', 'https://www.youtube.com/results?search_query=Python+Mortgage+Calculator+Project+step+by+step', ARRAY['unit-1', 'project', 'mortgage calculator']),

-- ── Unit 2: Advanced Python ───────────────────────────────────────
('pba211', 'unit-2', 'Creating Custom Functions', 'https://www.youtube.com/results?search_query=Python+Functions+complete+tutorial', ARRAY['unit-2', 'functions']),
('pba211', 'unit-2', 'Indefinite Loops (While Loops)', 'https://www.youtube.com/results?search_query=Python+While+Loops+explained+with+examples', ARRAY['unit-2', 'while loops']),
('pba211', 'unit-2', 'Dictionaries', 'https://www.youtube.com/results?search_query=Python+Dictionaries+complete+lecture', ARRAY['unit-2', 'dictionaries']),
('pba211', 'unit-2', 'Sets', 'https://www.youtube.com/results?search_query=Python+Sets+tutorial+for+beginners', ARRAY['unit-2', 'sets']),
('pba211', 'unit-2', 'Slicing Data Types', 'https://www.youtube.com/results?search_query=Python+String+List+Tuple+Slicing+explained', ARRAY['unit-2', 'slicing']),
('pba211', 'unit-2', 'Reading Text Files in Python', 'https://www.youtube.com/results?search_query=Python+File+Handling+Read+Text+Files', ARRAY['unit-2', 'file handling', 'text files']),
('pba211', 'unit-2', 'Reading CSV Files in Python', 'https://www.youtube.com/results?search_query=Python+Read+CSV+Files+using+Pandas', ARRAY['unit-2', 'csv files', 'pandas']),
('pba211', 'unit-2', 'Analyze Data from Text Files', 'https://www.youtube.com/results?search_query=Data+Analysis+from+Text+Files+using+Python', ARRAY['unit-2', 'data analysis', 'text files']),
('pba211', 'unit-2', 'Analyze Data from CSV Files', 'https://www.youtube.com/results?search_query=CSV+Data+Analysis+with+Python+Pandas', ARRAY['unit-2', 'data analysis', 'csv files']),

-- ── Unit 3: Numerical Python & Pandas ─────────────────────────────
('pba211', 'unit-3', 'NumPy Arrays', 'https://www.youtube.com/results?search_query=NumPy+Arrays+complete+tutorial', ARRAY['unit-3', 'numpy', 'arrays']),
('pba211', 'unit-3', 'Broadcasting in NumPy', 'https://www.youtube.com/results?search_query=NumPy+Broadcasting+explained+with+examples', ARRAY['unit-3', 'numpy', 'broadcasting']),
('pba211', 'unit-3', 'Universal Functions (U-Functions)', 'https://www.youtube.com/results?search_query=NumPy+Universal+Functions+tutorial', ARRAY['unit-3', 'numpy', 'u-functions']),
('pba211', 'unit-3', 'Introduction to Pandas', 'https://www.youtube.com/results?search_query=Pandas+for+Beginners+complete+course', ARRAY['unit-3', 'pandas']),
('pba211', 'unit-3', 'Pandas Series', 'https://www.youtube.com/results?search_query=Pandas+Series+explained', ARRAY['unit-3', 'pandas series']),
('pba211', 'unit-3', 'Pandas DataFrame', 'https://www.youtube.com/results?search_query=Pandas+DataFrame+tutorial+with+examples', ARRAY['unit-3', 'pandas dataframe']),
('pba211', 'unit-3', 'Pandas Panel', 'https://www.youtube.com/results?search_query=Pandas+Panel+data+structure+explained', ARRAY['unit-3', 'pandas panel']),
('pba211', 'unit-3', 'Manipulate Live Data from Website', 'https://www.youtube.com/results?search_query=Web+Scraping+and+Data+Collection+using+Python', ARRAY['unit-3', 'web scraping', 'live data']),

-- ── Unit 4: Data Manipulation ─────────────────────────────────────
('pba211', 'unit-4', 'Creating DataFrames (5 Ways)', 'https://www.youtube.com/results?search_query=Different+Ways+to+Create+Pandas+DataFrame', ARRAY['unit-4', 'create dataframes']),
('pba211', 'unit-4', 'Slicing DataFrame', 'https://www.youtube.com/results?search_query=Pandas+DataFrame+Slicing+tutorial', ARRAY['unit-4', 'dataframe slicing']),
('pba211', 'unit-4', 'Filtering DataFrame', 'https://www.youtube.com/results?search_query=Pandas+DataFrame+Filtering+techniques', ARRAY['unit-4', 'dataframe filtering']),
('pba211', 'unit-4', 'Lambda Functions', 'https://www.youtube.com/results?search_query=Python+Lambda+Functions+explained', ARRAY['unit-4', 'lambda functions']),
('pba211', 'unit-4', 'Run If and Else Scenarios', 'https://www.youtube.com/results?search_query=Python+If+Else+Practical+Examples', ARRAY['unit-4', 'if else', 'practical examples']),
('pba211', 'unit-4', 'Gather Data with Pandas', 'https://www.youtube.com/results?search_query=Data+Collection+and+Processing+with+Pandas', ARRAY['unit-4', 'data collection', 'pandas']),
('pba211', 'unit-4', 'Manipulate Data with Pandas', 'https://www.youtube.com/results?search_query=Data+Manipulation+using+Pandas+complete+tutorial', ARRAY['unit-4', 'data manipulation', 'pandas']),
('pba211', 'unit-4', 'Analyze Business Data from CSV Files', 'https://www.youtube.com/results?search_query=Business+Data+Analysis+using+Pandas+project', ARRAY['unit-4', 'business data analysis', 'pandas project']),

-- ── Unit 5: Data Extraction & Analysis ────────────────────────────
('pba211', 'unit-5', 'Get Live Data from APIs', 'https://www.youtube.com/results?search_query=Python+API+Data+Extraction+tutorial', ARRAY['unit-5', 'API data extraction']),
('pba211', 'unit-5', 'Plot Data with Matplotlib', 'https://www.youtube.com/results?search_query=Matplotlib+Data+Visualization+complete+tutorial', ARRAY['unit-5', 'matplotlib', 'data visualization']),
('pba211', 'unit-5', 'Merge Data', 'https://www.youtube.com/results?search_query=Pandas+Merge+DataFrames+explained', ARRAY['unit-5', 'merge dataframes']),
('pba211', 'unit-5', 'Concatenate Data', 'https://www.youtube.com/results?search_query=Pandas+Concatenate+DataFrames+tutorial', ARRAY['unit-5', 'concatenate dataframes']),
('pba211', 'unit-5', 'GroupBy in Pandas', 'https://www.youtube.com/results?search_query=Pandas+GroupBy+complete+guide', ARRAY['unit-5', 'groupby pandas']),
('pba211', 'unit-5', 'Logic in Finance with Pandas', 'https://www.youtube.com/results?search_query=Financial+Data+Analysis+using+Pandas+project', ARRAY['unit-5', 'finance data analysis', 'pandas project'])

ON CONFLICT DO NOTHING;
