-- ==========================================
-- YouTube Videos for PBA103
-- Introduction to Data Science & Business Analytics
-- Subject ID: 000a2caa-4b79-4103-8ffe-8ae839331159
-- Table: youtube_library
-- ==========================================

INSERT INTO youtube_library (subject_id, unit_id, title, url, tags) VALUES

-- ── Unit 1: Introduction to Business Analytics ───────────────────
(
  '000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-1',
  'Introduction to Business Analytics',
  'https://www.youtube.com/results?search_query=Business+Analytics+full+course',
  ARRAY['unit-1', 'business analytics', 'introduction']
),
(
  '000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-1',
  'Overview of Business Analytics',
  'https://www.youtube.com/results?search_query=What+is+Business+Analytics%3F',
  ARRAY['unit-1', 'business analytics', 'overview']
),
(
  '000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-1',
  'Role of Data in Decision Making',
  'https://www.youtube.com/results?search_query=Data+driven+decision+making',
  ARRAY['unit-1', 'data driven', 'decision making']
),
(
  '000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-1',
  'Descriptive Analytics',
  'https://www.youtube.com/results?search_query=Descriptive+Analytics+tutorial',
  ARRAY['unit-1', 'descriptive analytics']
),
(
  '000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-1',
  'Predictive Analytics',
  'https://www.youtube.com/results?search_query=Predictive+Analytics+explained',
  ARRAY['unit-1', 'predictive analytics']
),
(
  '000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-1',
  'Prescriptive Analytics',
  'https://www.youtube.com/results?search_query=Prescriptive+Analytics+basics',
  ARRAY['unit-1', 'prescriptive analytics']
),
(
  '000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-1',
  'Tools Used in Business Analytics',
  'https://www.youtube.com/results?search_query=Top+Business+Analytics+tools',
  ARRAY['unit-1', 'analytics tools', 'business analytics']
),

-- ── Unit 2: Pandas Library ───────────────────────────────────────
(
  '000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-2',
  'Pandas Library – Full Tutorial',
  'https://www.youtube.com/results?search_query=Pandas+Python+tutorial',
  ARRAY['unit-2', 'pandas', 'python']
),
(
  '000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-2',
  'Introduction to Pandas Series',
  'https://www.youtube.com/results?search_query=Pandas+Series+explained',
  ARRAY['unit-2', 'pandas', 'series']
),
(
  '000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-2',
  'DataFrames in Pandas',
  'https://www.youtube.com/results?search_query=Pandas+DataFrame+tutorial',
  ARRAY['unit-2', 'pandas', 'dataframe']
),
(
  '000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-2',
  'Reading Data – CSV and Excel with Pandas',
  'https://www.youtube.com/results?search_query=Read+CSV+Excel+in+Pandas',
  ARRAY['unit-2', 'pandas', 'csv', 'excel', 'read data']
),
(
  '000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-2',
  'Selecting and Filtering Data in Pandas',
  'https://www.youtube.com/results?search_query=Pandas+filter+data',
  ARRAY['unit-2', 'pandas', 'filter', 'select']
),
(
  '000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-2',
  'Handling Missing Data in Pandas',
  'https://www.youtube.com/results?search_query=Pandas+handle+missing+values',
  ARRAY['unit-2', 'pandas', 'missing values', 'null']
),
(
  '000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-2',
  'Data Sorting in Pandas',
  'https://www.youtube.com/results?search_query=Pandas+sort+values',
  ARRAY['unit-2', 'pandas', 'sort', 'sort_values']
),
(
  '000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-2',
  'Basic Plotting with Pandas',
  'https://www.youtube.com/results?search_query=Pandas+plotting+tutorial',
  ARRAY['unit-2', 'pandas', 'plotting', 'visualization']
),

-- ── Unit 3: Data Wrangling ───────────────────────────────────────
(
  '000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-3',
  'Data Wrangling – Full Tutorial',
  'https://www.youtube.com/results?search_query=Data+Wrangling+tutorial',
  ARRAY['unit-3', 'data wrangling']
),
(
  '000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-3',
  'Data Cleaning Techniques in Python',
  'https://www.youtube.com/results?search_query=Data+cleaning+in+Python',
  ARRAY['unit-3', 'data cleaning', 'python']
),
(
  '000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-3',
  'Data Transformation in Python',
  'https://www.youtube.com/results?search_query=Data+transformation+Python',
  ARRAY['unit-3', 'data transformation', 'python']
),
(
  '000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-3',
  'Merging and Joining Data with Pandas',
  'https://www.youtube.com/results?search_query=Pandas+merge+and+join',
  ARRAY['unit-3', 'pandas', 'merge', 'join']
),
(
  '000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-3',
  'Reshaping DataFrames in Pandas',
  'https://www.youtube.com/results?search_query=Pandas+reshape+dataframe',
  ARRAY['unit-3', 'pandas', 'reshape', 'melt', 'pivot']
),
(
  '000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-3',
  'String Manipulation in Pandas',
  'https://www.youtube.com/results?search_query=Pandas+string+manipulation',
  ARRAY['unit-3', 'pandas', 'string', 'str methods']
),

-- ── Unit 4: Data Aggregation & Grouping ─────────────────────────
(
  '000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-4',
  'Data Aggregation and Grouping in Pandas',
  'https://www.youtube.com/results?search_query=Pandas+groupby+tutorial',
  ARRAY['unit-4', 'pandas', 'groupby', 'aggregation']
),
(
  '000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-4',
  'GroupBy Mechanics – How It Works',
  'https://www.youtube.com/results?search_query=Pandas+groupby+mechanics',
  ARRAY['unit-4', 'pandas', 'groupby', 'mechanics']
),
(
  '000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-4',
  'Data Aggregation Functions in Pandas',
  'https://www.youtube.com/results?search_query=Pandas+aggregation+functions',
  ARRAY['unit-4', 'pandas', 'aggregation', 'agg']
),
(
  '000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-4',
  'Pivot Tables in Pandas',
  'https://www.youtube.com/results?search_query=Pandas+pivot+table',
  ARRAY['unit-4', 'pandas', 'pivot table']
),
(
  '000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-4',
  'Cross Tabulations (Crosstab) in Pandas',
  'https://www.youtube.com/results?search_query=Pandas+crosstab+tutorial',
  ARRAY['unit-4', 'pandas', 'crosstab', 'cross tabulation']
),

-- ── Unit 5: Time Series Data Analysis ───────────────────────────
(
  '000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-5',
  'Time Series Data Analysis with Python',
  'https://www.youtube.com/results?search_query=Time+series+analysis+Python',
  ARRAY['unit-5', 'time series', 'python']
),
(
  '000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-5',
  'Date and Time Data Types in Python',
  'https://www.youtube.com/results?search_query=Python+datetime+tutorial',
  ARRAY['unit-5', 'datetime', 'python', 'date types']
),
(
  '000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-5',
  'Time Series Basics with Pandas',
  'https://www.youtube.com/results?search_query=Time+series+basics+Pandas',
  ARRAY['unit-5', 'pandas', 'time series', 'basics']
),
(
  '000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-5',
  'Date Ranges and Frequencies in Pandas',
  'https://www.youtube.com/results?search_query=Pandas+date_range+frequency',
  ARRAY['unit-5', 'pandas', 'date_range', 'frequency']
),
(
  '000a2caa-4b79-4103-8ffe-8ae839331159', 'unit-5',
  'Resampling and Frequency Conversion in Pandas',
  'https://www.youtube.com/results?search_query=Pandas+resample+time+series',
  ARRAY['unit-5', 'pandas', 'resample', 'frequency conversion']
)

ON CONFLICT DO NOTHING;

-- ── Verify ────────────────────────────────────────────────────────
-- SELECT unit_id, title FROM youtube_library
-- WHERE subject_id = '000a2caa-4b79-4103-8ffe-8ae839331159'
-- ORDER BY unit_id, created_at;
