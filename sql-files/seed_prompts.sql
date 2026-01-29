-- Seed Default Prompts
INSERT INTO public.prompts (title, description, category, prompt) VALUES
(
    'Socratic Tutor',
    'Acts as a Socratic tutor to help students learn through questioning.',
    'Academic',
    'You are a Socratic tutor. Instead of giving direct answers, guide the student to the solution by asking probing questions. Adjust your complexity based on the student''s responses. Subject: [Subject]'
),
(
    'Code Reviewer',
    'Reviews code for best practices, security, and performance.',
    'Coding',
    'Review the following code for: 1. Security vulnerabilities 2. Performance issues 3. Clean code principles. Provide specific refactoring suggestions with code snippets. Code: [Paste Code Here]'
),
(
    'Summarizer (Key Points)',
    'Summarizes complex text into bulleted key points.',
    'Learning & Trends',
    'Summarize the following text into a concise list of key takeaways. Focus on the main arguments and ignore fluff. Text: [Paste Text]'
),
(
    'Interview Simulator',
    'Simulates a job interview for a specific role.',
    'Interview Prep',
    'Act as a hiring manager for a [Job Role] position. Conduct a technical interview with me. Ask one question at a time and wait for my response. Evaluate my answers and provide feedback at the end.'
),
(
    'Business Strategy Analyst',
    'Analyzes business scenarios using standard frameworks like SWOT.',
    'Business Strategy',
    'Analyze the following business scenario using the SWOT framework (Strengths, Weaknesses, Opportunities, Threats). Provide strategic recommendations based on the analysis. Scenario: [Scenario Description]'
),
(
    'YouTube Script Writer',
    'Generates engaging scripts for educational YouTube videos.',
    'YouTube',
    'Write a script for a 5-minute educational YouTube video about [Topic]. Include a hook, introduction, 3 main learning points, and a call to action. Tone: Engaging and informative.'
),
(
    'SQL Query Generator',
    'Generates complex SQL queries from natural language requirements.',
    'Technical Skills',
    'Write a SQL query to [Requirement]. Assume table schema: [Schema details]. Explain the query logic step-by-step.'
);
