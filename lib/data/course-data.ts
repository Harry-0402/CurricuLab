import { Subject, Unit, Note, Question } from "@/types";

/**
 * BRIDGE FILE: The user will populate these arrays with their own mock data.
 * The app.service.ts has been refactored to read from here instead of Supabase
 * for Subjects, Units, Notes, and Questions.
 */

import { VIDEO_LIBRARY } from './video-library';
import { SYLLABUS_RESOURCES } from './syllabus-links';

export interface Resource {
    id: string;
    title: string;
    description: string;
    type: 'Video' | 'PDF' | 'Link' | 'Template' | 'Article';
    url: string;
    category: 'Learning' | 'Technical Skills' | 'Business Strategy' | 'Career & Soft Skills' | 'Roadmap' | 'Cheat Sheet' | 'YouTube' | 'Coding' | 'Academic' | string;
    topic?: string;
    content?: string;
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
    ...VIDEO_LIBRARY,
    ...SYLLABUS_RESOURCES,
    // --- Part I: Core Technical Competencies ---
    {
        id: 'tech-1',
        title: 'Kaggle Learn',
        description: 'Free micro-courses on Pandas, SQL, and Visualization.',
        type: 'Link',
        url: 'https://www.kaggle.com/learn',
        category: 'Technical Skills'
    },
    {
        id: 'tech-2',
        title: 'Google Analytics Academy',
        description: 'Web data analysis courses.',
        type: 'Link',
        url: 'https://analytics.google.com/analytics/academy/',
        category: 'Technical Skills'
    },
    {
        id: 'tech-3',
        title: 'LeetCode Database',
        description: 'Practice SQL queries with real interview questions.',
        type: 'Link',
        url: 'https://leetcode.com/problemset/database/',
        category: 'Technical Skills'
    },
    {
        id: 'tech-4',
        title: 'Stratascratch',
        description: 'Real interview questions from companies like DoorDash and Uber.',
        type: 'Link',
        url: 'https://www.stratascratch.com/',
        category: 'Technical Skills'
    },
    {
        id: 'tech-5',
        title: 'W3Schools SQL',
        description: 'Best syntax reference for SQL.',
        type: 'Link',
        url: 'https://www.w3schools.com/sql/',
        category: 'Technical Skills'
    },
    {
        id: 'tech-6',
        title: 'Tableau Public',
        description: 'Download the free tool and host your portfolio.',
        type: 'Link',
        url: 'https://public.tableau.com/s/',
        category: 'Technical Skills'
    },
    {
        id: 'tech-7',
        title: 'Workout Wednesday',
        description: 'Weekly challenges for Power BI & Tableau.',
        type: 'Link',
        url: 'http://www.workout-wednesday.com/',
        category: 'Technical Skills'
    },
    {
        id: 'tech-8',
        title: 'MakeoverMonday',
        description: 'Community project to improve existing charts.',
        type: 'Link',
        url: 'https://www.makeovermonday.co.uk/',
        category: 'Technical Skills'
    },
    {
        id: 'tech-9',
        title: 'Fast.ai',
        description: 'Practical Deep Learning for Coders.',
        type: 'Link',
        url: 'https://www.fast.ai/',
        category: 'Technical Skills'
    },
    {
        id: 'tech-10',
        title: 'Google ML Crash Course',
        description: 'Google\'s fast-paced introduction to machine learning.',
        type: 'Link',
        url: 'https://developers.google.com/machine-learning/crash-course',
        category: 'Technical Skills'
    },
    {
        id: 'tech-11',
        title: 'AWS Educate',
        description: 'Cloud career pathways for students.',
        type: 'Link',
        url: 'https://aws.amazon.com/education/awseducate/',
        category: 'Technical Skills'
    },
    {
        id: 'tech-12',
        title: 'Microsoft Learn Azure Data',
        description: 'Azure Data Fundamentals training path.',
        type: 'Link',
        url: 'https://learn.microsoft.com/en-us/training/paths/azure-data-fundamentals-explore-core-data-concepts/',
        category: 'Technical Skills'
    },

    // --- Part II: Business Intelligence & Strategy ---
    {
        id: 'biz-1',
        title: 'Investopedia',
        description: 'Search for terms like "EBITDA", "ROI", "Churn Rate".',
        type: 'Link',
        url: 'https://www.investopedia.com/',
        category: 'Business Strategy'
    },
    {
        id: 'biz-2',
        title: 'Strategy+Business',
        description: 'Insights on global business strategy and management.',
        type: 'Link',
        url: 'https://www.strategy-business.com/',
        category: 'Business Strategy'
    },
    {
        id: 'biz-3',
        title: 'CaseInterview.com',
        description: 'Victor Cheng\'s free frameworks and case interview prep.',
        type: 'Link',
        url: 'https://caseinterview.com/',
        category: 'Business Strategy'
    },
    {
        id: 'biz-4',
        title: 'Management Consulted',
        description: 'Case library and math drills for consulting prep.',
        type: 'Link',
        url: 'https://managementconsulted.com/',
        category: 'Business Strategy'
    },
    {
        id: 'biz-5',
        title: 'McKinsey Featured Insights',
        description: 'Research and insights from McKinsey & Company.',
        type: 'Link',
        url: 'https://www.mckinsey.com/featured-insights',
        category: 'Business Strategy'
    },
    {
        id: 'biz-6',
        title: 'CB Insights',
        description: 'Tech market intelligence.',
        type: 'Link',
        url: 'https://www.cbinsights.com/research/',
        category: 'Business Strategy'
    },
    {
        id: 'biz-7',
        title: 'Data & Society',
        description: 'Research on the social implications of data-centric technologies.',
        type: 'Link',
        url: 'https://datasociety.net/',
        category: 'Business Strategy'
    },
    {
        id: 'biz-8',
        title: 'EU Ethics Guidelines',
        description: 'Ethics Guidelines for Trustworthy AI.',
        type: 'Link',
        url: 'https://digital-strategy.ec.europa.eu/en/library/ethics-guidelines-trustworthy-ai',
        category: 'Business Strategy'
    },

    // --- Part III: Soft Skills & Career Velocity ---
    {
        id: 'car-1',
        title: 'Toastmasters International',
        description: 'Find a club near you to improve communication skills.',
        type: 'Link',
        url: 'https://www.toastmasters.org/find-a-club',
        category: 'Career & Soft Skills'
    },
    {
        id: 'car-2',
        title: 'TED Talks',
        description: 'Ideas worth spreading - great for presentation inspiration.',
        type: 'Link',
        url: 'https://www.ted.com/',
        category: 'Career & Soft Skills'
    },
    {
        id: 'car-3',
        title: 'Novoresume',
        description: 'ATS-friendly resume templates.',
        type: 'Link',
        url: 'https://novoresume.com/',
        category: 'Career & Soft Skills'
    },
    {
        id: 'car-4',
        title: 'Pramp (Exponent)',
        description: 'Free peer-to-peer mock interviews.',
        type: 'Link',
        url: 'https://www.pramp.com/',
        category: 'Career & Soft Skills'
    },
    {
        id: 'car-5',
        title: 'Meetup',
        description: 'Find Data Science meetups in your city.',
        type: 'Link',
        url: 'https://www.meetup.com/',
        category: 'Career & Soft Skills'
    },
    {
        id: 'car-6',
        title: 'Notion',
        description: 'Organize your study plan.',
        type: 'Link',
        url: 'https://www.notion.so/',
        category: 'Career & Soft Skills'
    },
    {
        id: 'car-7',
        title: 'Pomodoro Tracker',
        description: 'Simple timer for deep work sessions.',
        type: 'Link',
        url: 'https://pomofocus.io/',
        category: 'Career & Soft Skills'
    },
    {
        id: 'car-8',
        title: '80,000 Hours',
        description: 'High-impact career guide.',
        type: 'Link',
        url: 'https://80000hours.org/',
        category: 'Career & Soft Skills'
    },

    // --- Part IV: Continuous Learning & Trends ---
    {
        id: 'learn-1',
        title: 'Google Data Analytics Cert',
        description: 'Professional certificate on Coursera.',
        type: 'Link',
        url: 'https://www.coursera.org/professional-certificates/google-data-analytics',
        category: 'Learning & Trends'
    },
    {
        id: 'learn-2',
        title: 'edX MicroMasters',
        description: 'Graduate-level courses from top universities.',
        type: 'Link',
        url: 'https://www.edx.org/micromasters',
        category: 'Learning & Trends'
    },
    {
        id: 'learn-3',
        title: 'Storytelling with Data',
        description: 'Book recommendation for data visualization.',
        type: 'Link',
        url: 'https://www.storytellingwithdata.com/books',
        category: 'Learning & Trends'
    },
    {
        id: 'learn-4',
        title: 'Naked Statistics',
        description: 'Book recommendation on statistical concepts.',
        type: 'Link',
        url: 'https://wwnorton.com/books/naked-statistics/',
        category: 'Learning & Trends'
    },
    {
        id: 'learn-5',
        title: 'Towards Data Science',
        description: 'Medium publication for data science articles.',
        type: 'Link',
        url: 'https://towardsdatascience.com/',
        category: 'Learning & Trends'
    },
    {
        id: 'learn-6',
        title: 'Data Skeptic Podcast',
        description: 'Podcast on data science, statistics, machine learning, and AI.',
        type: 'Link',
        url: 'https://dataskeptic.com/',
        category: 'Learning & Trends'
    },
    {
        id: 'learn-7',
        title: 'INFORMS',
        description: 'Institute for Operations Research and the Management Sciences.',
        type: 'Link',
        url: 'https://www.informs.org/',
        category: 'Learning & Trends'
    },
    {
        id: 'learn-8',
        title: 'IEEE Computer Society',
        description: 'Professional association for computer science.',
        type: 'Link',
        url: 'https://www.computer.org/',
        category: 'Learning & Trends'
    },
    {
        id: 'learn-9',
        title: 'Glassdoor',
        description: 'Company reviews and salaries.',
        type: 'Link',
        url: 'https://www.glassdoor.com/',
        category: 'Learning & Trends'
    },
    {
        id: 'learn-10',
        title: 'LinkedIn Jobs',
        description: 'Job search engine.',
        type: 'Link',
        url: 'https://www.linkedin.com/jobs/',
        category: 'Learning & Trends'
    },
    {
        id: 'learn-11',
        title: 'GitHub',
        description: 'Host and review code, manage projects, and build software.',
        type: 'Link',
        url: 'https://github.com/',
        category: 'Learning & Trends'
    },
    {
        id: 'learn-12',
        title: 'Papers with Code',
        description: 'ML papers with code implementations.',
        type: 'Link',
        url: 'https://paperswithcode.com/',
        category: 'Learning & Trends'
    },
    {
        id: 'learn-13',
        title: 'Morning Brew',
        description: 'Daily business news newsletter.',
        type: 'Link',
        url: 'https://www.morningbrew.com/',
        category: 'Learning & Trends'
    },
    {
        id: 'learn-14',
        title: 'TLDR Newsletter',
        description: 'Daily tech news newsletter.',
        type: 'Link',
        url: 'https://tldr.tech/',
        category: 'Learning & Trends'
    },

    // --- Hero Level YouTube ---
    {
        id: 'hero-yt-1',
        title: 'Alex The Analyst',
        description: 'Guided portfolio projects (SQL -> Excel -> Tableau).',
        type: 'Video',
        url: 'https://www.youtube.com/c/AlexTheAnalyst',
        category: 'Technical Skills',
        topic: 'Data Analysis'
    },
    {
        id: 'hero-yt-2',
        title: 'Guy in a Cube',
        description: 'Advanced Power BI & DAX. Real-world complex problems.',
        type: 'Video',
        url: 'https://www.youtube.com/c/GuyinaCube',
        category: 'Technical Skills',
        topic: 'Power BI'
    },
    {
        id: 'hero-yt-3',
        title: 'Seattle Data Guy',
        description: 'Data Engineering & ETL pipelines.',
        type: 'Video',
        url: 'https://www.youtube.com/c/SeattleDataGuy',
        category: 'Technical Skills',
        topic: 'Data Engineering'
    },
    {
        id: 'hero-yt-4',
        title: 'Sundas Khalid',
        description: 'FAANG Interview Prep & Behavioral questions.',
        type: 'Video',
        url: 'https://www.youtube.com/c/SundasKhalid',
        category: 'Career & Soft Skills',
        topic: 'Interview Prep'
    },
    {
        id: 'hero-yt-5',
        title: 'Thu Vu data analytics',
        description: 'Python automation & unique datasets.',
        type: 'Video',
        url: 'https://www.youtube.com/c/ThuVudataanalytics',
        category: 'Technical Skills',
        topic: 'Python'
    },
    {
        id: 'hero-yt-6',
        title: 'StatQuest (Josh Starmer)',
        description: 'Statistics intuition and Machine Learning concepts.',
        type: 'Video',
        url: 'https://www.youtube.com/user/joshstarmer',
        category: 'Technical Skills',
        topic: 'Statistics'
    },
    {
        id: 'hero-yt-7',
        title: 'Dr. Nancy Li',
        description: 'Product Sense & Business Analytics.',
        type: 'Video',
        url: 'https://www.youtube.com/c/DrNancyLi',
        category: 'Business Strategy',
        topic: 'Product Management'
    },
    {
        id: 'hero-yt-8',
        title: 'Krish Naik',
        description: 'End-to-End Data Science & Deployment.',
        type: 'Video',
        url: 'https://www.youtube.com/user/krishnaik06',
        category: 'Technical Skills',
        topic: 'Data Science'
    },

    // --- Special Guides (content-based) ---
    {
        id: 'guide-roadmap',
        title: 'Zero to Hero Roadmap',
        description: 'A 6-month comprehensive roadmap to becoming a "Hero" Analyst.',
        type: 'Article',
        url: '#',
        category: 'Roadmap',
        content: `# The "Zero to Hero" Roadmap

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

### Professor's Verdict
If you consume the syllabus content + the 7 "Hero" channels, and **actually do the work** (not just watch), you will be in the top 1% of freshers. Stop searching for more links now; **start building**.`
    },
    {
        id: 'guide-interview',
        title: 'Interview Cheat Sheet',
        description: 'Top 21 high-probability questions for Google, Amazon, Deloitte, TCS/Accenture.',
        type: 'Article',
        url: '#',
        category: 'Interview',
        content: `# Comprehensive Interview "Cheat Sheet"

I have curated a list of 21 high-probability questions per company, focusing on the "Zero to Hero" transition.

## 1. Google (Role: Business Analyst / Data Analyst)
**Focus**: Product Sense and Analytical Thinking.

### Top Questions
1. **Metric Definition**: How would you measure the success of Google Maps' "Save Route" feature?
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
4. **Data Modeling**: Design a Star Schema for Amazon's Order Management System.
...

### Solution Spotlight: Churn SQL
\`\`\`sql
SELECT A.customer_id
FROM Orders A
LEFT JOIN Orders B ON A.customer_id = B.customer_id 
AND B.order_date BETWEEN '2025-02-01' AND '2025-02-28'
WHERE A.order_date BETWEEN '2025-01-01' AND '2025-01-31'
AND B.customer_id IS NULL;
\`\`\`

---

## 3. Deloitte (Role: Strategy & Operations Analyst)
**Focus**: Consulting Fit, Communication, and Case Studies.

### Top Questions
1. **Guesstimate**: Estimate the number of traffic lights in Mumbai.
2. **Market Sizing**: What is the market size of nappies in India?
3. **Profitability Case**: A cement manufacturer's profits are down 15%. Diagnose the problem.
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
\`\`\`sql
SELECT MAX(Salary)
FROM Employee
WHERE Salary < (SELECT MAX(Salary) FROM Employee);
\`\`\`

### Professor's "Hero" Advice for 2026
* **Google/Amazon**: Practice Medium-level SQL on LeetCode.
* **Deloitte**: Polish communication (Point 1, Point 2, Conclusion).
* **TCS/Accenture**: Know definitions (Agile vs Waterfall).
`
    },
    {
        id: 'coding-platforms',
        title: 'Top Coding Platforms',
        description: 'Curated list of platforms for "Zero to Hero" coding skills.',
        type: 'Article',
        url: '#',
        category: 'Coding',
        content: `# Top Websites to Enhance Coding Skills

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
`
    },
    {
        id: 'coding-leetcode',
        title: 'LeetCode',
        description: 'Gold standard for interview prep.',
        type: 'Link',
        url: 'https://leetcode.com',
        category: 'Coding'
    },
    {
        id: 'coding-stratascratch',
        title: 'Stratascratch',
        description: 'Real data science interview questions.',
        type: 'Link',
        url: 'https://www.stratascratch.com',
        category: 'Coding'
    },
    {
        id: 'coding-hackerrank',
        title: 'HackerRank',
        description: 'Skill assessments and certifications.',
        type: 'Link',
        url: 'https://www.hackerrank.com',
        category: 'Coding'
    },
    {
        id: 'coding-datacamp',
        title: 'DataCamp',
        description: 'Interactive learning for data skills.',
        type: 'Link',
        url: 'https://www.datacamp.com',
        category: 'Coding'
    },
    // --- Subject Specific Resources ---

    // Data Visualization and Story Telling
    {
        id: 'pba207-1',
        title: 'The Data Warehouse Lifecycle Toolkit',
        description: 'Textbook by Kimball et al.',
        type: 'Link',
        url: 'https://www.google.com/search?q=The+Data+Warehouse+Lifecycle+Toolkit+Kimball',
        category: 'Academic',
        topic: 'Data Visualization'
    },
    {
        id: 'pba207-2',
        title: 'Hadoop in Practice',
        description: 'Textbook by Alex Holmes',
        type: 'Link',
        url: 'https://www.google.com/search?q=Hadoop+in+Practice+Alex+Holmes',
        category: 'Academic',
        topic: 'Data Visualization'
    },
    {
        id: 'pba207-3',
        title: 'Tableau Public',
        description: 'Platform for data visualization.',
        type: 'Link',
        url: 'https://public.tableau.com/s/',
        category: 'Academic',
        topic: 'Data Visualization'
    },
    {
        id: 'pba207-4',
        title: 'Kaggle: Data Visualization',
        description: 'Course on Kaggle.',
        type: 'Link',
        url: 'https://www.kaggle.com/learn/data-visualization',
        category: 'Academic',
        topic: 'Data Visualization'
    },
    {
        id: 'pba207-5',
        title: 'MakeoverMonday',
        description: 'Community project.',
        type: 'Link',
        url: 'https://www.makeovermonday.co.uk/',
        category: 'Academic',
        topic: 'Data Visualization'
    },


    // Business Research Methods
    {
        id: 'pba208-1',
        title: 'Business Research Methods',
        description: 'Textbook by Donald R. Cooper.',
        type: 'Link',
        url: 'https://www.google.com/search?q=Business+Research+Methods+Donald+Cooper',
        category: 'Academic',
        topic: 'Business Research'
    },
    {
        id: 'pba208-2',
        title: 'Research Methodology',
        description: 'Textbook by C.R. Kothari.',
        type: 'Link',
        url: 'https://www.google.com/search?q=Research+Methodology+Methods+and+Techniques+Kothari',
        category: 'Academic',
        topic: 'Business Research'
    },
    {
        id: 'pba208-3',
        title: 'Coursera: BRM',
        description: 'Business Research Methods courses.',
        type: 'Link',
        url: 'https://www.coursera.org/search?query=business%20research%20methods',
        category: 'Academic',
        topic: 'Business Research'
    },
    {
        id: 'pba208-4',
        title: 'Google Scholar',
        description: 'Academic search engine.',
        type: 'Link',
        url: 'https://scholar.google.com/',
        category: 'Academic',
        topic: 'Business Research'
    },

    // Production and Operations Management
    {
        id: 'pba204-1',
        title: 'Operations Management (Krajewski)',
        description: 'Textbook resource.',
        type: 'Link',
        url: 'https://www.google.com/search?q=Operations+Management+Krajewski',
        category: 'Academic',
        topic: 'Operations Mgmt'
    },
    {
        id: 'pba204-2',
        title: 'The Goal - Eliyahoo Goldratt',
        description: 'Reference book.',
        type: 'Link',
        url: 'https://www.google.com/search?q=The+Goal+Eliyahoo+Goldratt',
        category: 'Academic',
        topic: 'Operations Mgmt'
    },
    {
        id: 'pba204-3',
        title: 'MIT OpenCourseWare',
        description: 'Supply Chain resources.',
        type: 'Link',
        url: 'https://ocw.mit.edu/search/?q=supply+chain',
        category: 'Academic',
        topic: 'Operations Mgmt'
    },
    {
        id: 'pba204-4',
        title: 'Six Sigma Council',
        description: 'Certification and resources.',
        type: 'Link',
        url: 'https://www.sixsigmacouncil.org/',
        category: 'Academic',
        topic: 'Operations Mgmt'
    },

    // Legal Aspects of Business
    {
        id: 'pba206-1',
        title: 'Labour and Industrial Laws',
        description: 'Textbook by P.K. Padhi.',
        type: 'Link',
        url: 'https://www.google.com/search?q=Labour+and+Industrial+Laws+PK+Padhi',
        category: 'Academic',
        topic: 'Business Law'
    },
    {
        id: 'pba206-2',
        title: 'India Code',
        description: 'Digital Repository of Acts.',
        type: 'Link',
        url: 'https://www.indiacode.nic.in/',
        category: 'Academic',
        topic: 'Business Law'
    },
    {
        id: 'pba206-3',
        title: 'Manupatra',
        description: 'Legal Research platform.',
        type: 'Link',
        url: 'https://www.manupatra.com/',
        category: 'Academic',
        topic: 'Business Law'
    },

    // Business Communication Skills - II
    {
        id: 'pba213-1',
        title: 'Professional Communication',
        description: 'Textbook by Aruna Koneru.',
        type: 'Link',
        url: 'https://www.google.com/search?q=Professional+Communication+Aruna+Koneru',
        category: 'Academic',
        topic: 'Communication'
    },
    {
        id: 'pba213-2',
        title: 'LinkedIn Learning',
        description: 'Business Communication topics.',
        type: 'Link',
        url: 'https://www.linkedin.com/learning/topics/business-communication',
        category: 'Academic',
        topic: 'Communication'
    },
    {
        id: 'pba213-3',
        title: 'Toastmasters International',
        description: 'Public speaking and leadership.',
        type: 'Link',
        url: 'https://www.toastmasters.org/',
        category: 'Academic',
        topic: 'Communication'
    },

    // Data Analysis using Python
    {
        id: 'pba211-1',
        title: 'Hands-on Data Structures (Python)',
        description: 'Textbook by Basant Agarwal.',
        type: 'Link',
        url: 'https://www.google.com/search?q=Hands-on+Data+Structures+and+Algorithms+with+Python+Basant+Agarwal',
        category: 'Academic',
        topic: 'Python Data Analysis'
    },
    {
        id: 'pba211-2',
        title: 'Python For Data Analysis',
        description: 'Reference by Wes McKinney.',
        type: 'Link',
        url: 'https://www.google.com/search?q=Python+For+Data+Analysis+Wes+McKinney',
        category: 'Academic',
        topic: 'Python Data Analysis'
    },
    {
        id: 'pba211-3',
        title: 'Anaconda Distribution',
        description: 'Data science platform.',
        type: 'Link',
        url: 'https://www.anaconda.com/download',
        category: 'Academic',
        topic: 'Python Data Analysis'
    },
    {
        id: 'pba211-4',
        title: 'LeetCode (Python)',
        description: 'Coding practice.',
        type: 'Link',
        url: 'https://leetcode.com/',
        category: 'Academic',
        topic: 'Python Data Analysis'
    },

    // Data Analysis Using Power BI
    {
        id: 'pba212-1',
        title: 'Mastering Microsoft Power BI',
        description: 'Textbook by Brett Powell.',
        type: 'Link',
        url: 'https://www.google.com/search?q=Mastering+Microsoft+Power+BI+Brett+Powell',
        category: 'Academic',
        topic: 'Power BI'
    },
    {
        id: 'pba212-2',
        title: 'Microsoft Learn: PL-300',
        description: 'Certification path.',
        type: 'Link',
        url: 'https://learn.microsoft.com/en-us/certifications/exams/pl-300/',
        category: 'Academic',
        topic: 'Power BI'
    },
    {
        id: 'pba212-3',
        title: 'SQLBI',
        description: 'Power BI & DAX resources.',
        type: 'Link',
        url: 'https://www.sqlbi.com/',
        category: 'Academic',
        topic: 'Power BI'
    },

    // Digital Transformation
    {
        id: 'pb205-1',
        title: 'Leading Digital',
        description: 'Textbook by George Westerman.',
        type: 'Link',
        url: 'https://www.google.com/search?q=Leading+Digital+George+Westerman',
        category: 'Academic',
        topic: 'Digital Transformation'
    },
    {
        id: 'pb205-2',
        title: 'HBR: Digital Transformation',
        description: 'Harvard Business Review topic.',
        type: 'Link',
        url: 'https://hbr.org/topic/digital-transformation',
        category: 'Academic',
        topic: 'Digital Transformation'
    },
    {
        id: 'pb205-3',
        title: 'McKinsey Digital Insights',
        description: 'Industry insights.',
        type: 'Link',
        url: 'https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights',
        category: 'Academic',
        topic: 'Digital Transformation'
    },
    // --- User Imported Cheat Sheets ---
    {
        id: 'cs-1',
        title: 'Divisibility Cheatsheet',
        description: 'Quick reference for math divisibility rules.',
        type: 'PDF',
        url: '/assets/resources/Divisibility_Cheatsheet.pdf',
        category: 'Cheat Sheet',
        topic: 'Math'
    },
    {
        id: 'cs-2',
        title: 'Case Studies Cheat Sheet',
        description: 'Frameworks and tips for solving business case studies.',
        type: 'PDF',
        url: '/assets/resources/Case_Studies_Cheatsheet.pdf',
        category: 'Cheat Sheet',
        topic: 'Business'
    },
    {
        id: 'cs-3',
        title: 'SQL Cheat Sheet',
        description: 'Comprehensive guide to SQL syntax and commands.',
        type: 'PDF',
        url: '/assets/resources/SQL_Cheatsheet.pdf',
        category: 'Cheat Sheet',
        topic: 'SQL'
    },
    {
        id: 'cs-4',
        title: 'Problem Solving Cheatsheet',
        description: 'Strategies and models for effective problem solving.',
        type: 'PDF',
        url: '/assets/resources/Problem_Solving_Cheatsheet.pdf',
        category: 'Cheat Sheet',
        topic: 'Soft Skills'
    },
    {
        id: 'cs-5',
        title: 'Excel Formatting Cheat Sheet',
        description: 'Shortcuts and tips for professional Excel formatting.',
        type: 'PDF',
        url: '/assets/resources/Excel_Formatting_Cheatsheet.pdf',
        category: 'Cheat Sheet',
        topic: 'Excel'
    },
    {
        id: 'cs-6',
        title: 'Sports Analytics Article',
        description: 'In-depth article on sports data analysis.',
        type: 'PDF',
        url: '/assets/resources/Sports_Analytics_Article.pdf',
        category: 'Cheat Sheet',
        topic: 'Analytics'
    },
    // --- User Imported Academic Resources ---
    {
        id: 'acad-1',
        title: 'Data Analysis in Microsoft Excel',
        description: 'Guide to analytics in Excel by Alex Holloway.',
        type: 'PDF',
        url: '/assets/resources/Data_Analysis_Excel.pdf',
        category: 'Academic',
        topic: 'Excel'
    },
    {
        id: 'acad-2',
        title: 'Digital Transformation: Survive and Thrive',
        description: 'Strategic guide by Rice & Siebel.',
        type: 'PDF',
        url: '/assets/resources/Digital_Transformation_Rice.pdf',
        category: 'Academic',
        topic: 'Digital Transformation'
    },
    {
        id: 'acad-3',
        title: 'Labour and Industrial Laws (3rd Ed)',
        description: 'Textbook by P.K. Padhi.',
        type: 'PDF',
        url: '/assets/resources/Labour_Laws_Padhi.pdf',
        category: 'Academic',
        topic: 'Business Law'
    },
    {
        id: 'acad-4',
        title: 'Mastering Data Analysis with Python',
        description: 'Comprehensive guide by Rajender Kumar.',
        type: 'PDF',
        url: '/assets/resources/Data_Analysis_Python.pdf',
        category: 'Academic',
        topic: 'Python Data Analysis'
    },
    {
        id: 'acad-5',
        title: 'Operations Management',
        description: 'Textbook by Krajewski & Lee.',
        type: 'PDF',
        url: '/assets/resources/Operations_Management_Krajewski.pdf',
        category: 'Academic',
        topic: 'Operations Mgmt'
    },
    {
        id: 'acad-6',
        title: 'Research Methodology',
        description: 'Methods and techniques by C.R. Kothari.',
        type: 'PDF',
        url: '/assets/resources/Research_Methodology_Kothari.pdf',
        category: 'Academic',
        topic: 'Business Research'
    },
    {
        id: 'acad-7',
        title: 'Storytelling with Data',
        description: 'Data visualization guide by Cole Nussbaumer Knaflic.',
        type: 'PDF',
        url: '/assets/resources/Storytelling_with_Data.pdf',
        category: 'Academic',
        topic: 'Data Visualization'
    }
];

export const LOCAL_PROMPTS: Prompt[] = [
    {
        id: '53',
        title: 'Business-Focused EDA Framework',
        prompt: `Role: Senior Business Analyst and Data Scientist.\n\nObjective: Conduct a complete, structured, and business-focused Exploratory Data Analysis (EDA) on the provided dataset using Python (snake_case for code).\n\nThe analysis must be:\n- Statistically sound\n- Visually informative\n- Risk-aware\n- Insight-driven\n- Decision-oriented\n\nFocus on why findings matter, not just what they are. Avoid unnecessary jargon. Use clear, practical explanations.\n\nStep 0: Problem Definition & Clarification (Mandatory Gate)\nBefore starting EDA, explicitly confirm or state assumptions for:\n- Business objective\n- Dataset domain and context\n- Unit of analysis\n- Target variable\n- Success criteria\n\n1. Data Understanding & Context\n- Report rows, columns, data types, and target variable.\n- Identify 3 realistic business use cases.\n\n2. Data Quality Audit\n- Analyze missing values, duplicates, and invalid values.\n- Classify issues by severity (Critical, Moderate, Low).\n\n3. Data Cleaning & Preprocessing\n- Apply missing value treatment, duplicate removal, and type corrections.\n- Justify every step.\n\n4. Descriptive Statistics\n- Analyze mean, median, skewness, and frequency tables.\n- Interpret data behavior.\n\n5. Univariate Analysis\n- Histograms, Boxplots, Count plots.\n- Explain distribution shape and outliers.\n\n6. Bivariate Analysis\n- Numerical vs Numerical (Scatter, Correlation)\n- Numerical vs Categorical (Boxplots)\n- Explain business implications.\n\n7. Multivariate Analysis\n- Pairplots and Heatmaps.\n- Identify multicollinearity risks.\n\n8. Outlier Detection\n- IQR and Z-score methods.\n- Classify as errors or signals.\n\n9. Feature Engineering\n- Log transformations, binning, encoding.\n- Explain interpretability improvements.\n\n10. Visualization\n- Create clear plots with titles and key takeaways.\n\n11. Insight Generation\n- Extract 5 strong, data-driven insights linked to business impact.\n\n12. Risk Detection\n- Identify data quality, business, and modeling risks.\n\n13. Actionable Recommendations\n- Provide 3 realistic recommendations based on findings.\n\n14. Exploratory Regression (Optional)\n- Validate linearity and assumptions if target exists.\n\n15. Final Deliverables\n- Quality Report, Cleaned Data Summary, Insight Report, Next Steps.`,
        description: 'Comprehensive 15-step guide for professional EDA.',
        category: 'Data Analysis'
    },
    {
        id: '54',
        title: 'RAG Analytics Pipeline',
        prompt: `🔹 ROLE\nYou are a Senior Business Analytics Mentor trained in Retrieval Augmented Generation (RAG) principles.\nYour responsibility is to prevent unsupported reasoning by forcing every insight to be grounded in retrieved data, frameworks, or evidence.\n\n🔹 OBJECTIVE\nUse RAG to ensure that:\n- No insight is generated without retrieval\n- Analysis is fact-based and reproducible\n- Outputs are decision-ready\n\n🔁 RAG ANALYTICS PIPELINE (MANDATORY)\n\n🟦 PHASE 1: RETRIEVAL (R) — Grounding\nExplicitly retrieve:\n- Relevant concepts (KPIs, metrics, models)\n- Domain context\n- Statistical assumptions\nRule: If retrieval is weak, stop and ask for sources.\n\n🟨 PHASE 2: AUGMENTATION (A) — Context Injection\n- Map retrieved knowledge to the business question\n- Justify metric/method selection\n- Add business meaning to raw data\n\n🟩 PHASE 3: GENERATION (G) — Insight Creation\nGenerate findings, models, or visuals.\nRule: Every insight must trace back to retrieved knowledge or observed data.\n\n🟪 PHASE 4: EVALUATION (E) — Quality Control\nCritically evaluate business relevance, validity, and risks.\n\n📌 OUTPUT FORMAT (STRICT)\nBusiness Question:\n[Question]\n\nRetrieved Knowledge:\n- Source / concept: ...\n- Why it matters: ...\n\nAugmented Reasoning:\n- How retrieval shaped analysis: ...\n\nAnalysis & Findings:\n- Key patterns: ...\n- Evidence: ...\n\nBusiness Insight:\n- Meaning: ...\n- Decision impact: ...\n\nRisks & Limitations:\n- Data/Method/Context: ...\n\nNext Actions:\n- Immediate/Strategic: ...\n\n🛑 STOPPING CONDITION\nStop only when every insight is traceable and assumptions are explicit.`,
        description: 'Enforces grounded, fact-based analysis using RAG principles.',
        category: 'Framework'
    },
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

];
