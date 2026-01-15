import { Subject, Unit, Note, Question } from "@/types";

/**
 * BRIDGE FILE: The user will populate these arrays with their own mock data.
 * The app.service.ts has been refactored to read from here instead of Supabase
 * for Subjects, Units, Notes, and Questions.
 */

export interface Resource {
    id: string;
    title: string;
    description: string;
    type: 'Video' | 'PDF' | 'Link' | 'Template';
    url: string;
    category: string;
}

export interface Prompt {
    id: string;
    title: string;
    prompt: string;
    description: string;
    category: string;
}

export const LOCAL_SUBJECTS: Subject[] = [];
export const LOCAL_UNITS: Unit[] = [];
export const LOCAL_NOTES: Note[] = [];
export const LOCAL_QUESTIONS: Question[] = [];
export const LOCAL_RESOURCES: Resource[] = [
    {
        id: '1',
        title: 'Mastering Business Analysis',
        description: 'A comprehensive guide to modern BA techniques and tools.',
        type: 'PDF',
        url: '#',
        category: 'Business Analysis'
    },
    {
        id: '2',
        title: 'SDLC Life Cycle Explained',
        description: 'Video tutorial covering all phases of the Software Development Life Cycle.',
        type: 'Video',
        url: '#',
        category: 'Development'
    }
];

export const LOCAL_PROMPTS: Prompt[] = [
    {
        id: '1',
        title: 'Socratic Tutor',
        prompt: 'You are a Socratic tutor. Instead of giving me the answer, ask me a question that helps me think through the problem myself. The topic is: [TOPIC]',
        description: 'Ideal for deep learning and critical thinking.',
        category: 'Learning'
    },
    {
        id: '2',
        title: 'Expert Summarizer',
        prompt: 'Summarize the following notes into 5 key takeaways and 3 actionable insights. Use bullet points and bold text for emphasis. Notes: [NOTES]',
        description: 'Perfect for quick revision sheets.',
        category: 'Revision'
    },
    {
        id: '3',
        title: 'Teach Me Like I’m 5',
        prompt: 'Explain [TOPIC] to me as if I’m 5 years old, using super simple language and fun examples.',
        description: 'Breaks down complex topics into simple concepts.',
        category: 'Learning'
    },
    {
        id: '4',
        title: 'Quiz Master',
        prompt: 'Ask me 10 questions on [TOPIC]. After each, tell me if I’m right or wrong, then explain the correct answer.',
        description: 'Tests your knowledge with interactive feedback.',
        category: 'Assessment'
    },
    {
        id: '5',
        title: 'Analogy Builder',
        prompt: 'Create easy-to-remember analogies to explain [TOPIC]. Use funny or visual comparisons if possible.',
        description: 'Makes abstract concepts more relatable.',
        category: 'Learning'
    },
    {
        id: '6',
        title: 'Mind Map Generator',
        prompt: 'Make a mind map for [TOPIC], breaking it into sub-topics and key points for fast review.',
        description: 'Visualizes the hierarchy of a subject.',
        category: 'Revision'
    },
    {
        id: '7',
        title: 'Explain Like a Teacher',
        prompt: 'I just learned [TOPIC]. Ask me to explain it like I’m teaching a class, then point out any mistakes.',
        description: 'Uses the Feynman technique for mastery.',
        category: 'Revision'
    },
    {
        id: '8',
        title: 'Memory Booster',
        prompt: 'Turn [TOPIC] into a memory palace, acronym, or visual story to help me remember faster.',
        description: 'Techniques for long-term retention.',
        category: 'Memory'
    },
    {
        id: '9',
        title: 'Spaced Repetition Planner',
        prompt: 'Build a 30-day revision plan for [TOPIC], using spaced repetition to maximize long-term memory.',
        description: 'Strategic scheduling for exam prep.',
        category: 'Planning'
    },
    {
        id: '10',
        title: 'Compare & Contrast',
        prompt: 'Compare Concept A vs Concept B — highlight similarities, differences, and use cases side by side in table form.',
        description: 'Side-by-side analysis of related ideas.',
        category: 'Analysis'
    },
    {
        id: '11',
        title: 'Study Mode Switcher',
        prompt: 'I feel stuck studying [TOPIC]. Suggest 3 new study methods I haven’t tried yet.',
        description: 'Fresh strategies for when you hit a wall.',
        category: 'Strategy'
    },
    {
        id: '12',
        title: 'Learning Tracker',
        prompt: 'Create a weekly learning log with sections for what I studied, what I struggled with, and what to revise.',
        description: 'Structured reflection for continuous improvement.',
        category: 'Planning'
    },
    {
        id: '13',
        title: 'Dataset Explainer (Auto-EDA Lite)',
        prompt: 'You are a data analyst. Given this dataset schema and sample rows, explain: What this data is about, Possible business questions it can answer, Common pitfalls, and Key KPIs to track.',
        description: 'Explains dataset schema and business relevance.',
        category: 'Data Analysis'
    },
    {
        id: '14',
        title: 'Business Question Generator',
        prompt: 'Based on this dataset, generate: 10 beginner business questions, 5 intermediate analytical questions, and 3 advanced strategic questions.',
        description: 'Generates tiered business questions from data.',
        category: 'Data Analysis'
    },
    {
        id: '15',
        title: 'SQL Query Builder (Guided)',
        prompt: 'I want to answer this business question: [TOPIC]. Guide me step by step to write the SQL query. Do not give the final query at once. Ask me what comes next.',
        description: 'Interactive step-by-step SQL guidance.',
        category: 'SQL'
    },
    {
        id: '16',
        title: 'SQL Error Debugger',
        prompt: 'Here is my SQL query and error message. Explain: Why the error happened, How to fix it, and How to avoid this mistake in future.',
        description: 'Troubleshoots and explains SQL errors.',
        category: 'SQL'
    },
    {
        id: '17',
        title: 'Python for Analytics Tutor',
        prompt: 'Explain this Python code line by line as if I’m a beginner analyst. Also explain: Why this approach is used, When it fails, and One alternative method.',
        description: 'Line-by-line Python code explanation.',
        category: 'Python'
    },
    {
        id: '18',
        title: 'Visualization Recommendation',
        prompt: 'Given this dataset and business goal, suggest: Best chart types, What insight each chart reveals, and Common mistakes to avoid in visualization.',
        description: 'Suggests optimal charts for specific goals.',
        category: 'Data Visualization'
    },
    {
        id: '19',
        title: 'KPI Designer',
        prompt: 'I am analyzing [TOPIC]. Design: Key KPIs, KPI formula, Business meaning, and Decision impact if KPI goes up or down.',
        description: 'Designs business KPIs and formulas.',
        category: 'Business'
    },
    {
        id: '20',
        title: 'Case Study Generator',
        prompt: 'Create a real-world case study for a Data Analyst role using: Problem statement, Dataset description, Key metrics, Expected analysis approach, and Final business recommendation.',
        description: 'Generates interview-style case studies.',
        category: 'Assessment'
    },
    {
        id: '21',
        title: 'Resume-Linked Learning',
        prompt: 'Based on my current skills and resume, suggest: What analytics skills I should learn next, One mini project per skill, Tools required, and How to showcase it on my resume.',
        description: 'Personalized skill and project suggestions.',
        category: 'Career'
    },
    {
        id: '22',
        title: 'Project Idea Generator',
        prompt: 'Suggest 5 data analytics portfolio projects using: Realistic business problems, Public datasets, Clear KPIs, and Tools like Excel, SQL, Python, Power BI.',
        description: 'Generates portfolio project ideas.',
        category: 'Career'
    },
    {
        id: '23',
        title: 'Learning Path Generator',
        prompt: 'Create a personalized learning path for: Skill level: [TOPIC], Goal: Job/Internship/Exam, Time available per day.',
        description: 'Generates custom learning schedules.',
        category: 'Strategy'
    },
    {
        id: '24',
        title: 'Analytics Mentor Mode',
        prompt: 'Act as my senior data analyst mentor. Review my analysis approach and tell me: What I did right, What I missed, and How a real company would think.',
        description: 'Constructive feedback from a mentor persona.',
        category: 'Mentorship'
    },
    {
        id: '25',
        title: 'Business Insight Translator',
        prompt: 'Convert this technical analysis into: Simple business language, One executive summary, and One actionable recommendation.',
        description: 'Translates technical data into business value.',
        category: 'Analysis'
    },
    {
        id: '26',
        title: 'Decision Impact Simulator',
        prompt: 'If this metric changes by X%, explain: Impact on revenue, Impact on cost, Risk involved, and What decision a manager should take.',
        description: 'Simulates business outcomes of metric changes.',
        category: 'Strategy'
    },
    {
        id: '27',
        title: 'Exam Answer Optimizer',
        prompt: 'Rewrite this answer to score maximum marks in exams. Ensure: Proper structure, Keywords, Diagrams suggestion, and Professional language.',
        description: 'Optimizes academic answers for high marks.',
        category: 'Exam Prep'
    },
    {
        id: '28',
        title: 'Assumption Detector',
        prompt: 'List all hidden assumptions in this dataset or analysis. Mark each as safe, risky, or dangerous and explain why.',
        description: 'Identifies hidden risks and biases in logic.',
        category: 'Critical Thinking'
    },
    {
        id: '29',
        title: 'Data Bias Scanner',
        prompt: 'Check this data for selection bias, survivorship bias, and reporting bias. Explain how each bias could distort conclusions.',
        description: 'Scans for systematic errors in data collection.',
        category: 'Data Analysis'
    },
    {
        id: '30',
        title: 'Concept Compression Engine',
        prompt: 'Compress this topic into: 1 sentence, 3 bullets, 1 formula or rule, and 1 real-world example.',
        description: 'Distills complex topics into core essentials.',
        category: 'Learning'
    },
    {
        id: '31',
        title: 'Counterfactual Thinking',
        prompt: 'If the opposite result were true, what conditions would need to change in the data?',
        description: 'Tests the robustness of conclusions.',
        category: 'Critical Thinking'
    },
    {
        id: '32',
        title: 'Variables That Matter Most',
        prompt: 'Rank variables by influence on outcomes. Explain why each variable matters more than others.',
        description: 'Identifies primary drivers of an outcome.',
        category: 'Analysis'
    },
    {
        id: '33',
        title: 'Noise vs Signal Separator',
        prompt: 'Identify which patterns are real signals and which are likely noise. Justify your reasoning without using advanced math.',
        description: 'Distinguishes meaningful patterns from random fluctuation.',
        category: 'Analysis'
    },
    {
        id: '34',
        title: 'Academic Concept to Data Bridge',
        prompt: 'Map this academic concept to: Real data variables, Metrics, and Measurable outcomes.',
        description: 'Connects theory to practical measurement.',
        category: 'Business'
    },
    {
        id: '35',
        title: 'First-Principles Decomposition',
        prompt: 'Break this problem down to first principles. Rebuild the analysis from scratch using only basics.',
        description: 'Fundamental problem solving from the ground up.',
        category: 'Critical Thinking'
    },
    {
        id: '36',
        title: 'Missing Data Thought Experiment',
        prompt: 'What important data is missing here? How would its absence mislead conclusions?',
        description: 'Identifies blind spots in available data.',
        category: 'Data Analysis'
    },
    {
        id: '37',
        title: 'Explain Without Jargon Test',
        prompt: 'Explain this analysis without using technical terms. If jargon is unavoidable, define it simply.',
        description: 'Tests clarity of communication.',
        category: 'Communication'
    },
    {
        id: '38',
        title: 'Decision Boundary Identifier',
        prompt: 'At what point does this data change the decision? Identify thresholds and tipping points.',
        description: 'Locates critical points for decision making.',
        category: 'Strategy'
    },
    {
        id: '39',
        title: 'Model-Free Insight Generator',
        prompt: 'Extract insights from this data without using any statistical or ML models.',
        description: 'Focuses on intuitive and logical data reading.',
        category: 'Data Analysis'
    },
    {
        id: '40',
        title: 'Academic Examiner Lens',
        prompt: 'If this appeared in an exam, what keywords, diagrams, and structure would earn full marks?',
        description: 'Strategic prep for academic grading.',
        category: 'Exam Prep'
    },
    {
        id: '41',
        title: 'Real-World Failure Mode Analysis',
        prompt: 'How could this analysis fail in the real world despite being correct on paper?',
        description: 'Anticipates practical implementation risks.',
        category: 'Strategy'
    },
    {
        id: '42',
        title: 'Time Travel Analysis',
        prompt: 'How would conclusions differ if this data were collected: 5 years earlier, Today, or 5 years later?',
        description: 'Evaluates temporal context and trends.',
        category: 'Analysis'
    },
    {
        id: '43',
        title: 'Insight vs Action Split',
        prompt: 'Separate insights that are interesting from insights that lead to action. Explain the difference.',
        description: 'Filters for actionable business intelligence.',
        category: 'Analysis'
    },
    {
        id: '44',
        title: 'Causal Chain Builder',
        prompt: 'Build a cause-effect chain from raw data to final outcome. Mark weak and strong links.',
        description: 'Visualizes the logic of causation.',
        category: 'Analysis'
    },
    {
        id: '45',
        title: 'Overfitting Detector (Conceptual)',
        prompt: 'Without code, explain how this analysis might be overfitting reality.',
        description: 'Spots logic that is too specific to a single case.',
        category: 'Critical Thinking'
    },
    {
        id: '46',
        title: 'What Would Change My Mind',
        prompt: 'What new data or evidence would force me to change this conclusion?',
        description: 'Ensures falsifiability and objectivity.',
        category: 'Critical Thinking'
    },
    {
        id: '47',
        title: 'Multi-Stakeholder View',
        prompt: 'Interpret this data from the perspective of: Student, Manager, Investor, and Policy maker.',
        description: 'Analyzes impact across different personas.',
        category: 'Business'
    },
    {
        id: '48',
        title: 'Pattern Transfer Prompt',
        prompt: 'Apply the same analytical pattern from this dataset to a completely different domain.',
        description: 'Encourages cross-industry thinking.',
        category: 'Strategy'
    },
    {
        id: '49',
        title: 'Insight Hierarchy Builder',
        prompt: 'Organize insights into: Tactical, Operational, and Strategic.',
        description: 'Prioritizes information by organizational level.',
        category: 'Business'
    },
    {
        id: '50',
        title: 'Academic to Interview Translation',
        prompt: 'Convert this academic explanation into an interview-ready answer with examples.',
        description: 'Preps for professional communication.',
        category: 'Career'
    },
    {
        id: '51',
        title: 'Extreme Case Analysis',
        prompt: 'Analyze what happens in best-case, worst-case, and absurd-case scenarios.',
        description: 'Tests the edges of possibility.',
        category: 'Strategy'
    },
    {
        id: '52',
        title: 'One-Page Mental Model',
        prompt: 'Create a one-page mental model of this topic showing: Inputs, Process, Outputs, and Feedback loops.',
        description: 'Visualizes systems thinking.',
        category: 'Learning'
    },
    {
        id: '53',
        title: 'Business-Focused EDA Framework',
        prompt: `Role: Senior Business Analyst and Data Scientist.\n\nObjective: Conduct a complete, structured, and business-focused Exploratory Data Analysis (EDA) on the provided dataset using Python (snake_case for code).\n\nThe analysis must be:\n- Statistically sound\n- Visually informative\n- Risk-aware\n- Insight-driven\n- Decision-oriented\n\nFocus on why findings matter, not just what they are. Avoid unnecessary jargon. Use clear, practical explanations.\n\nStep 0: Problem Definition & Clarification (Mandatory Gate)\nBefore starting EDA, explicitly confirm or state assumptions for:\n- Business objective\n- Dataset domain and context\n- Unit of analysis\n- Target variable\n- Success criteria\n\n1. Data Understanding & Context\n- Report rows, columns, data types, and target variable.\n- Identify 3 realistic business use cases.\n\n2. Data Quality Audit\n- Analyze missing values, duplicates, and invalid values.\n- Classify issues by severity (Critical, Moderate, Low).\n\n3. Data Cleaning & Preprocessing\n- Apply missing value treatment, duplicate removal, and type corrections.\n- Justify every step.\n\n4. Descriptive Statistics\n- Analyze mean, median, skewness, and frequency tables.\n- Interpret data behavior.\n\n5. Univariate Analysis\n- Histograms, Boxplots, Count plots.\n- Explain distribution shape and outliers.\n\n6. Bivariate Analysis\n- Numerical vs Numerical (Scatter, Correlation)\n- Numerical vs Categorical (Boxplots)\n- Explain business implications.\n\n7. Multivariate Analysis\n- Pairplots and Heatmaps.\n- Identify multicollinearity risks.\n\n8. Outlier Detection\n- IQR and Z-score methods.\n- Classify as errors or signals.\n\n9. Feature Engineering\n- Log transformations, binning, encoding.\n- Explain interpretability improvements.\n\n10. Visualization\n- Create clear plots with titles and key takeaways.\n\n11. Insight Generation\n- Extract 5 strong, data-driven insights linked to business impact.\n\n12. Risk Detection\n- Identify data quality, business, and modeling risks.\n\n13. Actionable Recommendations\n- Provide 3 realistic recommendations based on findings.\n\n14. Exploratory Regression (Optional)\n- Validate linearity and assumptions if target exists.\n\n15. Final Deliverables\n- Quality Report, Cleaned Data Summary, Insight Report, Next Steps.`,
        description: 'Comprehensive 15-step guide for professional EDA.',
        category: 'Data Analysis'
    }
];
