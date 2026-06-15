-- ==========================================
-- YouTube Videos for PBA101 – Managerial Economics
-- Table: youtube_library  (NOT vault_resources)
-- Subject ID: c64dcb66-915f-4527-acd7-3681ddbb3b54
-- ==========================================
-- Run create_youtube_library_table.sql first.
-- ==========================================

INSERT INTO youtube_library (subject_id, unit_id, title, url, tags) VALUES

-- ── Unit 1: Nature & Scope / Principles ──────────────────────────
(
  'c64dcb66-915f-4527-acd7-3681ddbb3b54',
  'unit-1',
  'Fundamental Principles of Managerial Economics – Incremental & Opportunity Cost',
  'https://www.youtube.com/results?search_query=Fundamental+principles+of+managerial+economics+incremental+opportunity+cost',
  ARRAY['unit-1', 'incremental principle', 'opportunity cost', 'managerial economics']
),
(
  'c64dcb66-915f-4527-acd7-3681ddbb3b54',
  'unit-1',
  'Equi Marginal Principle and Discounting Principle – Managerial Economics',
  'https://www.youtube.com/results?search_query=Equi+marginal+principle+and+discounting+principle+managerial+economics',
  ARRAY['unit-1', 'equi marginal principle', 'discounting principle', 'managerial economics']
),

-- ── Unit 2: Demand Analysis & Demand Forecasting ─────────────────
(
  'c64dcb66-915f-4527-acd7-3681ddbb3b54',
  'unit-2',
  'Indifference Curve Analysis – Properties, Income, Substitution & Price Effect',
  'https://www.youtube.com/results?search_query=Indifference+curve+analysis+properties+income+substitution+price+effect',
  ARRAY['unit-2', 'indifference curve', 'income effect', 'substitution effect', 'price effect']
),
(
  'c64dcb66-915f-4527-acd7-3681ddbb3b54',
  'unit-2',
  'Elasticity of Demand – Measurement Methods, Arc, Cross & Income Elasticity',
  'https://www.youtube.com/results?search_query=Elasticity+of+demand+measurement+methods+arc+cross+income+elasticity',
  ARRAY['unit-2', 'elasticity of demand', 'arc elasticity', 'cross elasticity', 'income elasticity']
),
(
  'c64dcb66-915f-4527-acd7-3681ddbb3b54',
  'unit-2',
  'Demand Forecasting Techniques in Managerial Economics',
  'https://www.youtube.com/results?search_query=Demand+forecasting+techniques+in+managerial+economics',
  ARRAY['unit-2', 'demand forecasting', 'forecasting techniques', 'managerial economics']
),

-- ── Unit 3: Production & Cost Analysis ───────────────────────────
(
  'c64dcb66-915f-4527-acd7-3681ddbb3b54',
  'unit-3',
  'Law of Variable Proportions – Three Stages Explanation',
  'https://www.youtube.com/results?search_query=Law+of+variable+proportions+three+stages+explanation',
  ARRAY['unit-3', 'law of variable proportions', 'production function', 'returns to factor']
),
(
  'c64dcb66-915f-4527-acd7-3681ddbb3b54',
  'unit-3',
  'Iso-Cost Curves and Least Cost Combination – Production Function',
  'https://www.youtube.com/results?search_query=Iso+cost+curves+and+least+cost+combination+production+function',
  ARRAY['unit-3', 'iso cost curve', 'least cost combination', 'isoquant']
),
(
  'c64dcb66-915f-4527-acd7-3681ddbb3b54',
  'unit-3',
  'Short Run and Long Run Cost-Output Relationship',
  'https://www.youtube.com/results?search_query=Short+run+and+long+run+cost+output+relationship',
  ARRAY['unit-3', 'short run cost', 'long run cost', 'LAC', 'SAC', 'cost output']
),

-- ── Unit 4: Market Structure & Product Pricing ───────────────────
(
  'c64dcb66-915f-4527-acd7-3681ddbb3b54',
  'unit-4',
  'Kinked Demand Curve – Oligopoly Model Explanation',
  'https://www.youtube.com/results?search_query=Kinked+demand+curve+oligopoly+model+explanation',
  ARRAY['unit-4', 'kinked demand curve', 'oligopoly', 'market structure']
),
(
  'c64dcb66-915f-4527-acd7-3681ddbb3b54',
  'unit-4',
  'Price Discrimination – Degrees and Pricing Under Monopoly',
  'https://www.youtube.com/results?search_query=Price+discrimination+degrees+and+pricing+under+monopoly',
  ARRAY['unit-4', 'price discrimination', 'monopoly pricing', 'degrees of price discrimination']
),

-- ── Unit 5: Factor Pricing, Profit Analysis & National Income ────
(
  'c64dcb66-915f-4527-acd7-3681ddbb3b54',
  'unit-5',
  'Marginal Productivity Theory of Factor Pricing',
  'https://www.youtube.com/results?search_query=Marginal+productivity+theory+of+factor+pricing',
  ARRAY['unit-5', 'marginal productivity', 'factor pricing', 'distribution theory']
),
(
  'c64dcb66-915f-4527-acd7-3681ddbb3b54',
  'unit-5',
  'Theories of Profit – Dynamic, Innovation, Risk & Uncertainty Bearing',
  'https://www.youtube.com/results?search_query=Theories+of+profit+dynamic+innovation+risk+uncertainty+bearing',
  ARRAY['unit-5', 'theories of profit', 'dynamic theory', 'innovation theory', 'risk bearing']
),
(
  'c64dcb66-915f-4527-acd7-3681ddbb3b54',
  'unit-5',
  'National Income Calculation – Product, Income & Expenditure Method',
  'https://www.youtube.com/results?search_query=National+income+calculation+product+income+expenditure+method',
  ARRAY['unit-5', 'national income', 'GDP', 'product method', 'expenditure method', 'income method']
)

ON CONFLICT DO NOTHING;

-- ── Verify ────────────────────────────────────────────────────────
-- SELECT unit_id, title FROM youtube_library
-- WHERE subject_id = 'c64dcb66-915f-4527-acd7-3681ddbb3b54'
-- ORDER BY unit_id;
