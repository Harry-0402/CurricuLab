-- ==========================================
-- YouTube Videos for PBA101
-- Managerial Economics
-- Subject ID: c64dcb66-915f-4527-acd7-3681ddbb3b54
-- Table: youtube_library
-- ==========================================
-- STEP 1: Delete all previous PBA101 entries
-- STEP 2: Insert updated full list (Units 1-5)
-- ==========================================

-- ── Delete old entries ────────────────────────────────────────────
DELETE FROM youtube_library
WHERE subject_id = 'c64dcb66-915f-4527-acd7-3681ddbb3b54';

-- ── Insert updated entries ────────────────────────────────────────
INSERT INTO youtube_library (subject_id, unit_id, title, url, tags) VALUES

-- ── Unit 1: Fundamentals of Managerial Economics ─────────────────
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-1','Micro Economics','https://www.youtube.com/results?search_query=Micro+Economics+complete+lecture+for+MBA+students',ARRAY['unit-1','micro economics']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-1','Macro Economics','https://www.youtube.com/results?search_query=Macro+Economics+fundamentals+full+course',ARRAY['unit-1','macro economics']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-1','Managerial Economics – Introduction','https://www.youtube.com/results?search_query=Introduction+to+Managerial+Economics',ARRAY['unit-1','managerial economics']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-1','Relevance of Managerial Economics in Business Decisions','https://www.youtube.com/results?search_query=Role+of+Managerial+Economics+in+Business+Decision+Making',ARRAY['unit-1','managerial economics','business decisions']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-1','Incremental Principle','https://www.youtube.com/results?search_query=Incremental+Principle+in+Managerial+Economics+explained',ARRAY['unit-1','incremental principle']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-1','Marginal Principle','https://www.youtube.com/results?search_query=Marginal+Principle+and+Decision+Making+in+Economics',ARRAY['unit-1','marginal principle']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-1','Opportunity Cost Principle','https://www.youtube.com/results?search_query=Opportunity+Cost+concept+with+business+examples',ARRAY['unit-1','opportunity cost']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-1','Discounting Principle','https://www.youtube.com/results?search_query=Discounting+Principle+in+Managerial+Economics',ARRAY['unit-1','discounting principle']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-1','Time Perspective Concept','https://www.youtube.com/results?search_query=Time+Perspective+Principle+in+Managerial+Economics',ARRAY['unit-1','time perspective']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-1','Equi-Marginal Principle','https://www.youtube.com/results?search_query=Equi+Marginal+Principle+explained+with+examples',ARRAY['unit-1','equi marginal principle']),

-- ── Unit 2: Demand Analysis & Forecasting ────────────────────────
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-2','Theory of Demand','https://www.youtube.com/results?search_query=Theory+of+Demand+complete+lecture',ARRAY['unit-2','theory of demand']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-2','Types of Demand and Characteristics','https://www.youtube.com/results?search_query=Types+of+Demand+in+Economics+explained',ARRAY['unit-2','types of demand']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-2','Utility Analysis','https://www.youtube.com/results?search_query=Utility+Analysis+in+Economics+tutorial',ARRAY['unit-2','utility analysis']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-2','Cardinal Utility Theory','https://www.youtube.com/results?search_query=Cardinal+Utility+Theory+explained',ARRAY['unit-2','cardinal utility']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-2','Ordinal Utility Theory','https://www.youtube.com/results?search_query=Ordinal+Utility+Theory+complete+lecture',ARRAY['unit-2','ordinal utility']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-2','Elasticity of Demand','https://www.youtube.com/results?search_query=Elasticity+of+Demand+fundamentals',ARRAY['unit-2','elasticity of demand']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-2','Measurement of Elasticity of Demand','https://www.youtube.com/results?search_query=Measurement+of+Elasticity+of+Demand+solved+examples',ARRAY['unit-2','measurement of elasticity']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-2','Price Elasticity of Demand','https://www.youtube.com/results?search_query=Price+Elasticity+of+Demand+numericals+and+concepts',ARRAY['unit-2','price elasticity']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-2','Income Elasticity of Demand','https://www.youtube.com/results?search_query=Income+Elasticity+of+Demand+explained',ARRAY['unit-2','income elasticity']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-2','Arc Elasticity of Demand','https://www.youtube.com/results?search_query=Arc+Elasticity+of+Demand+with+problems',ARRAY['unit-2','arc elasticity']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-2','Cross Elasticity of Demand','https://www.youtube.com/results?search_query=Cross+Elasticity+of+Demand+tutorial',ARRAY['unit-2','cross elasticity']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-2','Advertising Elasticity of Demand','https://www.youtube.com/results?search_query=Advertising+Elasticity+of+Demand+explained',ARRAY['unit-2','advertising elasticity']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-2','Estimation of Revenue','https://www.youtube.com/results?search_query=Revenue+Estimation+in+Economics',ARRAY['unit-2','revenue estimation']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-2','Average Revenue','https://www.youtube.com/results?search_query=Average+Revenue+and+its+calculation',ARRAY['unit-2','average revenue','AR']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-2','Marginal Revenue','https://www.youtube.com/results?search_query=Marginal+Revenue+explained+with+examples',ARRAY['unit-2','marginal revenue','MR']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-2','Relationship between Marginal Revenue and Elasticity','https://www.youtube.com/results?search_query=Marginal+Revenue+and+Elasticity+of+Demand+relationship',ARRAY['unit-2','MR','elasticity','relationship']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-2','Demand Forecasting Techniques','https://www.youtube.com/results?search_query=Demand+Forecasting+methods+and+techniques',ARRAY['unit-2','demand forecasting']),

-- ── Unit 3: Production, Cost & Indifference Curve Analysis ───────
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-3','Concept of Indifference Curve','https://www.youtube.com/results?search_query=Indifference+Curve+Analysis+complete+lecture',ARRAY['unit-3','indifference curve']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-3','Properties of Indifference Curves','https://www.youtube.com/results?search_query=Properties+of+Indifference+Curves+explained',ARRAY['unit-3','indifference curve','properties']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-3','Income Effect','https://www.youtube.com/results?search_query=Income+Effect+in+Consumer+Behaviour',ARRAY['unit-3','income effect']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-3','Substitution Effect','https://www.youtube.com/results?search_query=Substitution+Effect+explained',ARRAY['unit-3','substitution effect']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-3','Price Effect','https://www.youtube.com/results?search_query=Price+Effect+in+Economics',ARRAY['unit-3','price effect']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-3','Income Consumption Curve','https://www.youtube.com/results?search_query=Income+Consumption+Curve+tutorial',ARRAY['unit-3','income consumption curve','ICC']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-3','Price Consumption Curve','https://www.youtube.com/results?search_query=Price+Consumption+Curve+explained',ARRAY['unit-3','price consumption curve','PCC']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-3','Derivation of Demand Curve from Indifference Curve','https://www.youtube.com/results?search_query=Derivation+of+Demand+Curve+from+Indifference+Curve',ARRAY['unit-3','demand curve','indifference curve']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-3','Superiority of Indifference Curve Analysis','https://www.youtube.com/results?search_query=Indifference+Curve+Analysis+vs+Utility+Analysis',ARRAY['unit-3','indifference curve','utility analysis']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-3','Concept of Cost','https://www.youtube.com/results?search_query=Cost+Concepts+in+Economics',ARRAY['unit-3','cost concepts']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-3','Cost Classification','https://www.youtube.com/results?search_query=Cost+Classification+explained',ARRAY['unit-3','cost classification']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-3','Accounting Cost vs Economic Cost','https://www.youtube.com/results?search_query=Accounting+Cost+vs+Economic+Cost',ARRAY['unit-3','accounting cost','economic cost']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-3','Law of Variable Proportions','https://www.youtube.com/results?search_query=Law+of+Variable+Proportions+complete+lecture',ARRAY['unit-3','law of variable proportions']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-3','Increasing Returns to a Factor','https://www.youtube.com/results?search_query=Increasing+Returns+to+a+Factor+explained',ARRAY['unit-3','increasing returns']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-3','Decreasing Returns (Law of Diminishing Returns)','https://www.youtube.com/results?search_query=Law+of+Diminishing+Returns+tutorial',ARRAY['unit-3','diminishing returns','decreasing returns']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-3','Constant Returns to Scale','https://www.youtube.com/results?search_query=Constant+Returns+to+Scale+explained',ARRAY['unit-3','constant returns']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-3','Cost-Output Relationship in Short Run','https://www.youtube.com/results?search_query=Short+Run+Cost+Curves+in+Economics',ARRAY['unit-3','short run cost','SAC','SVC']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-3','Cost-Output Relationship in Long Run','https://www.youtube.com/results?search_query=Long+Run+Cost+Curves+explained',ARRAY['unit-3','long run cost','LAC']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-3','Production Functions','https://www.youtube.com/results?search_query=Production+Function+in+Economics',ARRAY['unit-3','production function']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-3','Iso-Cost Curves and Producer Equilibrium','https://www.youtube.com/results?search_query=Iso+Cost+Curve+and+Producer+Equilibrium',ARRAY['unit-3','iso cost curve','isoquant']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-3','Significance of Iso-Cost Curves','https://www.youtube.com/results?search_query=Iso+Cost+Curves+applications+in+cost+analysis',ARRAY['unit-3','iso cost curve','significance']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-3','Economies of Scale','https://www.youtube.com/results?search_query=Economies+of+Scale+complete+lecture',ARRAY['unit-3','economies of scale']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-3','Least Cost Combination of Inputs','https://www.youtube.com/results?search_query=Least+Cost+Combination+of+Inputs+explained',ARRAY['unit-3','least cost combination']),

-- ── Unit 4: Market Structures & Product Pricing ──────────────────
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-4','Perfect and Imperfect Market Structures','https://www.youtube.com/results?search_query=Market+Structures+in+Economics+complete+lecture',ARRAY['unit-4','market structures']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-4','Conditions of Perfect Competition','https://www.youtube.com/results?search_query=Perfect+Competition+characteristics+explained',ARRAY['unit-4','perfect competition']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-4','Demand and Supply Forces','https://www.youtube.com/results?search_query=Demand+and+Supply+equilibrium+tutorial',ARRAY['unit-4','demand','supply','equilibrium']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-4','Equilibrium Price Determination','https://www.youtube.com/results?search_query=Equilibrium+Price+determination+explained',ARRAY['unit-4','equilibrium price']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-4','Price Behaviour and Time Element','https://www.youtube.com/results?search_query=Price+Behaviour+and+Time+Element+in+Economics',ARRAY['unit-4','price behaviour','time element']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-4','Market Price vs Normal Price','https://www.youtube.com/results?search_query=Market+Price+vs+Normal+Price',ARRAY['unit-4','market price','normal price']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-4','Pricing under Perfect Competition','https://www.youtube.com/results?search_query=Price+Determination+under+Perfect+Competition',ARRAY['unit-4','perfect competition','pricing']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-4','Short Run Pricing under Perfect Competition','https://www.youtube.com/results?search_query=Short+Run+Equilibrium+under+Perfect+Competition',ARRAY['unit-4','short run pricing','perfect competition']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-4','Long Run Pricing under Perfect Competition','https://www.youtube.com/results?search_query=Long+Run+Equilibrium+under+Perfect+Competition',ARRAY['unit-4','long run pricing','perfect competition']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-4','Pricing under Monopoly','https://www.youtube.com/results?search_query=Monopoly+Pricing+complete+lecture',ARRAY['unit-4','monopoly','pricing']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-4','Pricing under Monopolistic Competition','https://www.youtube.com/results?search_query=Monopolistic+Competition+pricing+explained',ARRAY['unit-4','monopolistic competition','pricing']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-4','Pricing under Oligopoly','https://www.youtube.com/results?search_query=Oligopoly+pricing+models+tutorial',ARRAY['unit-4','oligopoly','pricing']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-4','Kinked Demand Curve Theory','https://www.youtube.com/results?search_query=Kinked+Demand+Curve+theory+explained',ARRAY['unit-4','kinked demand curve','oligopoly']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-4','Price Discrimination under Monopoly','https://www.youtube.com/results?search_query=Price+Discrimination+in+Monopoly',ARRAY['unit-4','price discrimination','monopoly']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-4','Pricing of Labour – Wage Determination','https://www.youtube.com/results?search_query=Wage+Determination+and+Labour+Pricing',ARRAY['unit-4','wage determination','labour pricing']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-4','Marginal Productivity Theory of Factor Pricing','https://www.youtube.com/results?search_query=Marginal+Productivity+Theory+of+Factor+Pricing',ARRAY['unit-4','marginal productivity theory','factor pricing']),

-- ── Unit 5: Profit Analysis & National Income ────────────────────
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-5','Concept of Profit in Economics','https://www.youtube.com/results?search_query=Concept+of+Profit+in+Economics',ARRAY['unit-5','profit concept']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-5','Accounting Profit vs Economic Profit','https://www.youtube.com/results?search_query=Accounting+Profit+vs+Economic+Profit',ARRAY['unit-5','accounting profit','economic profit']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-5','Theories of Profit','https://www.youtube.com/results?search_query=Theories+of+Profit+complete+lecture',ARRAY['unit-5','theories of profit']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-5','Dynamic Theory of Profit','https://www.youtube.com/results?search_query=Dynamic+Theory+of+Profit+explained',ARRAY['unit-5','dynamic theory','profit']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-5','Risk and Uncertainty Bearing Theory of Profit','https://www.youtube.com/results?search_query=Risk+and+Uncertainty+Bearing+Theory+of+Profit',ARRAY['unit-5','risk','uncertainty bearing','profit']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-5','Innovation Theory of Profit (Schumpeter)','https://www.youtube.com/results?search_query=Innovation+Theory+of+Profit+by+Schumpeter',ARRAY['unit-5','innovation theory','schumpeter','profit']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-5','Profit Forecasting Techniques','https://www.youtube.com/results?search_query=Profit+Forecasting+techniques',ARRAY['unit-5','profit forecasting']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-5','Management of Profit','https://www.youtube.com/results?search_query=Profit+Management+in+Business',ARRAY['unit-5','profit management']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-5','Profit Standards','https://www.youtube.com/results?search_query=Profit+Standards+in+Managerial+Economics',ARRAY['unit-5','profit standards']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-5','Problems of Profit Maximization','https://www.youtube.com/results?search_query=Limitations+and+Problems+of+Profit+Maximization',ARRAY['unit-5','profit maximization','limitations']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-5','National Income – Definition and Concepts','https://www.youtube.com/results?search_query=National+Income+concepts+and+definitions',ARRAY['unit-5','national income']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-5','Product and Money Flows – Circular Flow of Income','https://www.youtube.com/results?search_query=Circular+Flow+of+Income+explained',ARRAY['unit-5','circular flow','national income']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-5','Net Output / Value Added Method of National Income','https://www.youtube.com/results?search_query=National+Income+by+Value+Added+Method',ARRAY['unit-5','value added method','national income']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-5','Factor Income Method of National Income','https://www.youtube.com/results?search_query=National+Income+by+Income+Method',ARRAY['unit-5','income method','national income']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-5','Expenditure Method of National Income','https://www.youtube.com/results?search_query=National+Income+by+Expenditure+Method',ARRAY['unit-5','expenditure method','national income']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-5','Choice of National Income Calculation Methods','https://www.youtube.com/results?search_query=Comparison+of+National+Income+Methods',ARRAY['unit-5','national income methods','comparison']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-5','Growth of India''s National Income','https://www.youtube.com/results?search_query=Growth+Trends+in+India%27s+National+Income',ARRAY['unit-5','India','national income','growth']),
('c64dcb66-915f-4527-acd7-3681ddbb3b54','unit-5','Composition of India''s National Income','https://www.youtube.com/results?search_query=Structure+and+Composition+of+India%27s+National+Income',ARRAY['unit-5','India','national income','composition'])

ON CONFLICT DO NOTHING;

-- ── Verify ────────────────────────────────────────────────────────
-- SELECT unit_id, COUNT(*) FROM youtube_library
-- WHERE subject_id = 'c64dcb66-915f-4527-acd7-3681ddbb3b54'
-- GROUP BY unit_id ORDER BY unit_id;
