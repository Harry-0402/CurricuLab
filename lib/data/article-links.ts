import { Resource } from './course-data';

export const ARTICLE_RESOURCES: Resource[] = [
    // --- Business Analytics Foundations ---
    { id: 'art-ba-1', title: '4 Types of Data Analytics', description: 'HBS Online: Descriptive to Prescriptive', type: 'Article', url: 'https://online.hbs.edu/blog/post/types-of-data-analysis', category: 'Academic', topic: 'Analytics Foundations' },
    { id: 'art-ba-2', title: 'Analytics Types Overview', description: 'Univ of Bath: Three types of analytics', type: 'Article', url: 'https://online.bath.ac.uk/content/descriptive-predictive-and-prescriptive-three-types-business-analytics', category: 'Academic', topic: 'Analytics Foundations' },
    { id: 'art-ba-3', title: 'Guide to Data Analytics Types', description: 'Insightsoftware: Comparing analytics types', type: 'Article', url: 'https://insightsoftware.com/blog/comparing-descriptive-predictive-prescriptive-and-diagnostic-analytics/', category: 'Academic', topic: 'Analytics Foundations' },

    // --- SQL for Business Analytics ---
    { id: 'art-sql-1', title: 'SQL Tutorial (W3Schools)', description: 'W3Schools: Comprehensive SQL basics', type: 'Article', url: 'https://www.w3schools.com/sql/', category: 'Academic', topic: 'SQL' },
    { id: 'art-sql-2', title: 'SQL for Data Analysis Intro', description: 'ThoughtSpot: Tutorial introduction', type: 'Article', url: 'https://www.thoughtspot.com/sql-tutorial/introduction-to-sql', category: 'Academic', topic: 'SQL' },
    { id: 'art-sql-3', title: 'SQL Beginner Tutorial', description: 'Data36: Hands-on SQL guide', type: 'Article', url: 'https://data36.com/sql-for-data-analysis-tutorial-beginners/', category: 'Academic', topic: 'SQL' },

    // --- Statistics & Hypothesis Testing ---
    { id: 'art-stat-1', title: 'Statistical Analysis Guidelines', description: 'PubMed: Choosing appropriate tests', type: 'Article', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11467495/', category: 'Academic', topic: 'Statistics' },
    { id: 'art-stat-2', title: 'Understanding Regression', description: 'SAGE: Hypothesis testing in regression', type: 'Article', url: 'https://methods.sagepub.com/book/mono/understanding-regression-analysis/chpt/hypothesis-testing', category: 'Academic', topic: 'Statistics' },

    // --- Data Visualization & Storytelling ---
    { id: 'art-viz-1', title: 'Viz Best Practices', description: 'Tableau: Tips for effective viz', type: 'Article', url: 'https://www.tableau.com/visualization/data-visualization-best-practices', category: 'Academic', topic: 'Data Visualization' },
    { id: 'art-viz-2', title: 'How to Tell a Great Story', description: 'ThoughtSpot: Data storytelling guide', type: 'Article', url: 'https://www.thoughtspot.com/data-trends/best-practices/data-storytelling', category: 'Academic', topic: 'Data Visualization' },
    { id: 'art-viz-3', title: 'Storytelling Best Practices', description: 'Domo: From dashboards to impact', type: 'Article', url: 'https://www.domo.com/blog/data-storytelling-best-practices-from-dashboards-to-impact', category: 'Academic', topic: 'Data Visualization' },
    { id: 'art-viz-4', title: 'Data Viz & Storytelling (PDF)', description: 'IE University: Comprehensive notes', type: 'PDF', url: 'https://files.thesaurus.ie.edu/data-visualization-dashboards-storytelling.pdf', category: 'Academic', topic: 'Data Visualization' }
];
