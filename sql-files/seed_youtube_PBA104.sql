-- ==========================================
-- YouTube Videos for PBA104
-- Data Management and Warehousing
-- Subject ID: 727c648f-f9d1-4f96-934c-916f1c244e1c
-- Table: youtube_library
-- ==========================================

INSERT INTO youtube_library (subject_id, unit_id, title, url, tags) VALUES

-- ── Unit 1: Introduction to Data Management and Data Warehousing ──
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-1', 'Importance of Data Management in Organizations', 'https://www.youtube.com/results?search_query=Importance+of+Data+Management+in+Modern+Organizations', ARRAY['unit-1', 'data management', 'organizations']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-1', 'Data Lifecycle', 'https://www.youtube.com/results?search_query=Data+Lifecycle+Management+complete+tutorial', ARRAY['unit-1', 'data lifecycle']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-1', 'Data Management Processes', 'https://www.youtube.com/results?search_query=Data+Management+Process+explained', ARRAY['unit-1', 'data management', 'process']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-1', 'Hierarchical Data Model', 'https://www.youtube.com/results?search_query=Hierarchical+Data+Model+in+DBMS', ARRAY['unit-1', 'hierarchical data model', 'DBMS']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-1', 'Network Data Model', 'https://www.youtube.com/results?search_query=Network+Data+Model+explained', ARRAY['unit-1', 'network data model']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-1', 'Relational Data Model', 'https://www.youtube.com/results?search_query=Relational+Data+Model+complete+lecture', ARRAY['unit-1', 'relational data model']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-1', 'Introduction to DBMS', 'https://www.youtube.com/results?search_query=Database+Management+System+DBMS+full+course', ARRAY['unit-1', 'DBMS', 'database']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-1', 'Definition and Purpose of Data Warehousing', 'https://www.youtube.com/results?search_query=Introduction+to+Data+Warehousing', ARRAY['unit-1', 'data warehousing']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-1', 'Data Warehousing Characteristics', 'https://www.youtube.com/results?search_query=Characteristics+of+Data+Warehouse+explained', ARRAY['unit-1', 'data warehouse', 'characteristics']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-1', 'Online Transaction Processing (OLTP)', 'https://www.youtube.com/results?search_query=OLTP+concepts+and+architecture', ARRAY['unit-1', 'OLTP', 'transaction processing']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-1', 'Data Warehousing Models', 'https://www.youtube.com/results?search_query=Data+Warehouse+Models+tutorial', ARRAY['unit-1', 'data warehouse models']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-1', 'Data Warehouse Architecture', 'https://www.youtube.com/results?search_query=Data+Warehouse+Architecture+complete+lecture', ARRAY['unit-1', 'architecture', 'data warehouse']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-1', 'Difference between OLTP and OLAP', 'https://www.youtube.com/results?search_query=OLTP+vs+OLAP+explained+with+examples', ARRAY['unit-1', 'OLTP', 'OLAP']),

-- ── Unit 2: Introduction to ETL ──────────────────────────────────
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-2', 'ETL Process Overview', 'https://www.youtube.com/results?search_query=ETL+Extract+Transform+Load+complete+tutorial', ARRAY['unit-2', 'ETL']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-2', 'Importance of ETL in Data Warehousing', 'https://www.youtube.com/results?search_query=Why+ETL+is+Important+in+Data+Warehousing', ARRAY['unit-2', 'ETL', 'data warehouse']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-2', 'Informatica ETL Tool', 'https://www.youtube.com/results?search_query=Informatica+ETL+beginner+tutorial', ARRAY['unit-2', 'informatica', 'ETL tool']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-2', 'Talend ETL Tool', 'https://www.youtube.com/results?search_query=Talend+ETL+full+course', ARRAY['unit-2', 'talend', 'ETL tool']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-2', 'Apache NiFi', 'https://www.youtube.com/results?search_query=Apache+NiFi+tutorial+for+beginners', ARRAY['unit-2', 'apache nifi', 'ETL tool']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-2', 'Data Extraction Methods', 'https://www.youtube.com/results?search_query=Data+Extraction+Techniques+in+ETL', ARRAY['unit-2', 'data extraction', 'ETL']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-2', 'Data Transformation Techniques', 'https://www.youtube.com/results?search_query=Data+Transformation+in+ETL+explained', ARRAY['unit-2', 'data transformation', 'ETL']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-2', 'Data Loading Strategies', 'https://www.youtube.com/results?search_query=ETL+Data+Loading+Strategies+tutorial', ARRAY['unit-2', 'data loading', 'ETL']),

-- ── Unit 3: Data Integration and Data Quality ────────────────────
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-3', 'Importance of Data Integration', 'https://www.youtube.com/results?search_query=Data+Integration+concepts+and+importance', ARRAY['unit-3', 'data integration']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-3', 'Data Integration Techniques', 'https://www.youtube.com/results?search_query=Data+Integration+Techniques+and+Methods', ARRAY['unit-3', 'data integration techniques']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-3', 'Data Integration Tools', 'https://www.youtube.com/results?search_query=Popular+Data+Integration+Tools+explained', ARRAY['unit-3', 'data integration tools']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-3', 'Data Quality Dimensions', 'https://www.youtube.com/results?search_query=Data+Quality+Dimensions+accuracy+completeness+consistency', ARRAY['unit-3', 'data quality', 'dimensions']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-3', 'Accuracy in Data Quality', 'https://www.youtube.com/results?search_query=Data+Quality+Accuracy+explained', ARRAY['unit-3', 'accuracy', 'data quality']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-3', 'Completeness in Data Quality', 'https://www.youtube.com/results?search_query=Data+Completeness+in+Data+Quality+Management', ARRAY['unit-3', 'completeness', 'data quality']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-3', 'Consistency in Data Quality', 'https://www.youtube.com/results?search_query=Data+Consistency+concepts+and+examples', ARRAY['unit-3', 'consistency', 'data quality']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-3', 'Timeliness in Data Quality', 'https://www.youtube.com/results?search_query=Timeliness+dimension+of+Data+Quality', ARRAY['unit-3', 'timeliness', 'data quality']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-3', 'Data Cleansing Techniques', 'https://www.youtube.com/results?search_query=Data+Cleansing+and+Data+Cleaning+tutorial', ARRAY['unit-3', 'data cleansing', 'data cleaning']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-3', 'Data Quality Assessment', 'https://www.youtube.com/results?search_query=Data+Quality+Assessment+methods', ARRAY['unit-3', 'data quality assessment']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-3', 'Data Quality Improvement', 'https://www.youtube.com/results?search_query=Data+Quality+Improvement+strategies', ARRAY['unit-3', 'data quality improvement']),

-- ── Unit 4: Data Mining ──────────────────────────────────────────
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-4', 'Introduction to Data Mining', 'https://www.youtube.com/results?search_query=Data+Mining+complete+course+for+beginners', ARRAY['unit-4', 'data mining']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-4', 'Definition and Description of Data Mining', 'https://www.youtube.com/results?search_query=What+is+Data+Mining+explained', ARRAY['unit-4', 'data mining definition']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-4', 'Relationship and Patterns in Data Mining', 'https://www.youtube.com/results?search_query=Pattern+Discovery+in+Data+Mining', ARRAY['unit-4', 'data mining', 'pattern discovery']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-4', 'Knowledge Discovery in Databases (KDD)', 'https://www.youtube.com/results?search_query=KDD+Process+in+Data+Mining', ARRAY['unit-4', 'KDD', 'data mining']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-4', 'Elements of Data Mining', 'https://www.youtube.com/results?search_query=Core+Elements+of+Data+Mining', ARRAY['unit-4', 'data mining elements']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-4', 'Uses of Data Mining', 'https://www.youtube.com/results?search_query=Applications+and+Uses+of+Data+Mining', ARRAY['unit-4', 'data mining uses']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-4', 'Measuring Data Mining Effectiveness', 'https://www.youtube.com/results?search_query=Data+Mining+Performance+Evaluation', ARRAY['unit-4', 'data mining effectiveness', 'performance evaluation']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-4', 'Accuracy in Data Mining', 'https://www.youtube.com/results?search_query=Accuracy+Metrics+in+Data+Mining', ARRAY['unit-4', 'data mining accuracy']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-4', 'Speed and Cost in Data Mining', 'https://www.youtube.com/results?search_query=Data+Mining+Efficiency+and+Cost+Analysis', ARRAY['unit-4', 'data mining speed', 'data mining cost']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-4', 'Data Information and Knowledge', 'https://www.youtube.com/results?search_query=Data+Information+Knowledge+hierarchy+explained', ARRAY['unit-4', 'data information knowledge', 'DIKW']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-4', 'Data Mining vs Machine Learning', 'https://www.youtube.com/results?search_query=Data+Mining+vs+Machine+Learning+comparison', ARRAY['unit-4', 'data mining', 'machine learning']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-4', 'Data Mining Models', 'https://www.youtube.com/results?search_query=Data+Mining+Models+and+Techniques', ARRAY['unit-4', 'data mining models']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-4', 'Issues and Challenges in Data Mining', 'https://www.youtube.com/results?search_query=Challenges+in+Data+Mining+explained', ARRAY['unit-4', 'data mining challenges']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-4', 'Applications of Data Mining', 'https://www.youtube.com/results?search_query=Real+World+Applications+of+Data+Mining', ARRAY['unit-4', 'data mining applications']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-4', 'Techniques of Data Mining', 'https://www.youtube.com/results?search_query=Data+Mining+Techniques+complete+lecture', ARRAY['unit-4', 'data mining techniques']),

-- ── Unit 5: Data Governance and Security ─────────────────────────
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-5', 'Principles of Data Governance', 'https://www.youtube.com/results?search_query=Data+Governance+Principles+explained', ARRAY['unit-5', 'data governance']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-5', 'Data Governance Frameworks', 'https://www.youtube.com/results?search_query=Data+Governance+Frameworks+and+Models', ARRAY['unit-5', 'data governance frameworks']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-5', 'Data Governance Best Practices', 'https://www.youtube.com/results?search_query=Data+Governance+Best+Practices', ARRAY['unit-5', 'data governance best practices']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-5', 'Data Security Challenges', 'https://www.youtube.com/results?search_query=Common+Data+Security+Challenges', ARRAY['unit-5', 'data security']),
('727c648f-f9d1-4f96-934c-916f1c244e1c', 'unit-5', 'Data Security Solutions', 'https://www.youtube.com/results?search_query=Data+Security+Solutions+and+andStrategies+Solutions+Security+and+Strategies', ARRAY['unit-5', 'data security solutions'])

ON CONFLICT DO NOTHING;
