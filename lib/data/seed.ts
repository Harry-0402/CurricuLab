import { Subject, Unit, Note, Question, CaseStudy, Project, TimetableEntry, Announcement, Assignment } from "@/types";

export const subjects: Subject[] = [
    {
        id: "s1",
        code: "PBA204",
        title: "Production and Operations Management",
        icon: "🏭",
        color: "#4f46e5",
        description: "Efficiency, process optimization, and value chain management.",
        progress: 45,
        unitCount: 5,
        lastStudied: "2024-01-12",
        syllabusPdfUrl: "/assets/syllabus/PBA204_Syllabus.docx",
    },
    {
        id: "s2",
        code: "PBA205",
        title: "Digital Transformation",
        icon: "🚀",
        color: "#059669",
        description: "Leveraging digital technologies to create or modify business processes.",
        progress: 30,
        unitCount: 5,
        lastStudied: "2024-01-11",
        syllabusPdfUrl: "/assets/syllabus/PBA205_Syllabus.doc",
    },
    {
        id: "s3",
        code: "PBA206",
        title: "Legal Aspects of Business",
        icon: "⚖️",
        color: "#f43f5e",
        description: "Commercial laws, contracts, and regulatory frameworks.",
        progress: 15,
        unitCount: 5,
        lastStudied: "2024-01-10",
        syllabusPdfUrl: "/assets/syllabus/PBA206_Syllabus.docx",
    },
    {
        id: "s4",
        code: "PBA207",
        title: "Data Visualization and Story Telling",
        icon: "📊",
        color: "#f59e0b",
        description: "Principles of visual perception and effective data narrative.",
        progress: 60,
        unitCount: 5,
        lastStudied: "2024-01-13",
        syllabusPdfUrl: "/assets/syllabus/PBA207_Syllabus.docx",
    },
    {
        id: "s5",
        code: "PBA208",
        title: "Business Research Methods",
        icon: "🔍",
        color: "#0ea5e9",
        description: "Techniques for data collection and systematic investigation.",
        progress: 20,
        unitCount: 5,
        lastStudied: "2024-01-09",
        syllabusPdfUrl: "/assets/syllabus/PBA208_Syllabus.pdf",
    },
    {
        id: "s6",
        code: "PBA211",
        title: "Data Analysis using Python",
        icon: "🐍",
        color: "#6366f1",
        description: "Numerical analysis and statistical modeling using the Python ecosystem.",
        progress: 40,
        unitCount: 5,
        lastStudied: "2024-01-12",
        syllabusPdfUrl: "/assets/syllabus/PBA211_Syllabus.docx",
    },
    {
        id: "s7",
        code: "PBA212",
        title: "Data Analysis using Power BI",
        icon: "📈",
        color: "#10b981",
        description: "Interactive data visualization and business intelligence tools.",
        progress: 25,
        unitCount: 5,
        lastStudied: "2024-01-11",
        syllabusPdfUrl: "/assets/syllabus/PBA212_Syllabus.docx",
    },
    {
        id: "s8",
        code: "PBA213",
        title: "Business Communication Skills II",
        icon: "💬",
        color: "#64748b",
        description: "Advanced verbal and non-verbal communication for professionals.",
        progress: 50,
        unitCount: 5,
        lastStudied: "2024-01-13",
        syllabusPdfUrl: "/assets/syllabus/PBA213_Syllabus.docx",
    },
];

export const units: Unit[] = [
    // Subject s1 Units
    {
        id: "u1", subjectId: "s1", title: "Unit 1: Intro to Operations", description: "Nature and scope of production management.", order: 1, isCompleted: true,
        topics: ["Definition and Scope", "Evolution of Production Management", "Production vs Service System", "Value Chain Concept"]
    },
    {
        id: "u2", subjectId: "s1", title: "Unit 2: Process Planning", description: "Methodology and tools for production planning.", order: 2, isCompleted: false,
        topics: ["Process Selection", "Capacity Planning", "Make or Buy Decisions", "BPR Fundamentals"]
    },
    {
        id: "u3", subjectId: "s1", title: "Unit 3: Facilities Management", description: "Plant layout and location strategies.", order: 3, isCompleted: false,
        topics: ["Location Factors", "Types of Layouts", "Material Handling", "Line Balancing"]
    },
    {
        id: "u4", subjectId: "s1", title: "Unit 4: Quality & Productivity", description: "Quality control and performance metrics.", order: 4, isCompleted: false,
        topics: ["TQM Principles", "Statistical Quality Control", "JIT / Lean Systems", "Six Sigma Basics"]
    },
    {
        id: "u5", subjectId: "s1", title: "Unit 5: Supply Chain Management", description: "End-to-end logistics and value delivery.", order: 5, isCompleted: false,
        topics: ["Logistics Strategy", "Inventory Models", "Vendor Management", "Digital SCM Trends"]
    },

    // First units for other subjects
    { id: "u6", subjectId: "s2", title: "Unit 1: Digital Landscape", description: "Understanding the digital ecosystem.", order: 1, isCompleted: false, topics: ["Digital Economy", "Cloud Computing", "AI in Business"] },
    { id: "u7", subjectId: "s3", title: "Unit 1: Business Law", description: "Basics of commercial regulations.", order: 1, isCompleted: false, topics: ["Indian Contract Act", "Sales of Goods"] },
    { id: "u8", subjectId: "s4", title: "Unit 1: Visual Perception", description: "How we see and interpret data.", order: 1, isCompleted: false, topics: ["Gestalt Laws", "Preattentive Attributes"] },

    // Subject s5 (Business Research Methods) Units - Authentic Data
    {
        id: "u9", subjectId: "s5", title: "Unit 1: Intro to Research", description: "Basic concepts in research methodology.", order: 1, isCompleted: false,
        topics: ["Types of research", "Process of research", "Formulation of research problem", "Development of research hypothesis"]
    },
    {
        id: "u13", subjectId: "s5", title: "Unit 2: Research Design", description: "Planning and structuring systematic investigations.", order: 2, isCompleted: false,
        topics: ["Definitions and functions", "Exploratory, descriptive, experimental", "Experimental types (Pre, Quasi, True)", "Statistical designs"]
    },
    {
        id: "u14", subjectId: "s5", title: "Unit 3: Sampling", description: "Techniques for selecting representative data groups.", order: 3, isCompleted: false,
        topics: ["Concept and Design", "Probability vs Non-probability", "Mixed sampling design", "Sample size determination"]
    },
    {
        id: "u15", subjectId: "s5", title: "Unit 4: Data Analysis", description: "Statistical processing and hypothesis testing.", order: 4, isCompleted: false,
        topics: ["Univariate, Bivariate, Multivariate", "Hypothesis testing concept", "Types of errors", "Steps in testing"]
    },
    {
        id: "u16", subjectId: "s5", title: "Unit 5: Analytical Techniques", description: "Advanced statistical tools and tests.", order: 5, isCompleted: false,
        topics: ["Parametric vs Non-parametric", "ANOVA", "Correlation & Regression", "Factor & Conjoint analysis"]
    },

    { id: "u10", subjectId: "s6", title: "Unit 1: Python Basics", description: "Fundamentals of data analysis.", order: 1, isCompleted: false, topics: ["NumPy Basics", "Pandas Intro"] },
    { id: "u11", subjectId: "s7", title: "Unit 1: BI Core", description: "Introduction to business intelligence.", order: 1, isCompleted: false, topics: ["Power Query", "Data Modeling"] },
    { id: "u12", subjectId: "s8", title: "Unit 1: Professional Comm", description: "Verbal and non-verbal foundations.", order: 1, isCompleted: false, topics: ["Barriers to Comm", "Non-verbal Cues"] },
];

export const notes: Note[] = [
    { id: "n1", unitId: "u1", title: "Core Process Optimization", content: "Notes on efficiency and value chain...", lastModified: "2024-01-12", isBookmarked: false },
    { id: "n2", unitId: "u1", title: "Value Chain Framework", content: "Porter's value chain analysis for operations...", lastModified: "2024-01-10", isBookmarked: false },
    { id: "n3", unitId: "u2", title: "Digital Transformation 101", content: "Key pillars of digital strategy...", lastModified: "2024-01-11", isBookmarked: false },
    { id: "n4", unitId: "u4", title: "Gestalt Principles in Viz", content: "How visual perception affects chart design...", lastModified: "2024-01-13", isBookmarked: false },
    { id: "n5", unitId: "u6", title: "Pandas DataFrame Mastery", content: "Advanced data manipulation with Python...", lastModified: "2024-01-12", isBookmarked: false },
    { id: "n6", unitId: "u7", title: "DAX Expression Basics", content: "Introduction to Power BI calculation engine...", lastModified: "2024-01-11", isBookmarked: false },
];
export const questions: Question[] = [];
export const caseStudies: CaseStudy[] = [];
export const projects: Project[] = [];

export const assignments: Assignment[] = [
    {
        id: "as1",
        subjectId: "s1",
        title: "Operational Efficiency Report",
        description: "Analyze the current production line efficiency and suggest improvements based on the case study discussed in class.",
        dueDate: "2024-02-15",
    },
    {
        id: "as2",
        subjectId: "s1",
        title: "Value Chain Analysis",
        description: "Map the internal value chain of a chosen startup and identify competitive advantages.",
        dueDate: "2024-02-28",
    },
    {
        id: "as3",
        subjectId: "s2",
        title: "Digital Transformation Strategy",
        description: "Develop a 5-year digital transformation roadmap for a traditional retail business.",
        dueDate: "2024-03-05",
    },
];

export const timetable: TimetableEntry[] = [
    // 09:00 AM
    { id: "t1", day: "Monday", subjectTitle: "Production & Ops", subjectCode: "PBA204", location: "Hall A", startTime: "09:00 AM", endTime: "10:00 AM", teacher: "Prof. Sharma", progress: 35 },
    { id: "t4", day: "Tuesday", subjectTitle: "Digital Trans", subjectCode: "PBA205", location: "Lab 2", startTime: "09:00 AM", endTime: "10:00 AM", teacher: "Prof. Gupta", progress: 5 },
    { id: "t6", day: "Wednesday", subjectTitle: "Data Viz", subjectCode: "PBA207", location: "M-18", startTime: "09:00 AM", endTime: "10:00 AM", teacher: "Prof. Verma", progress: 15 },
    { id: "t12", day: "Friday", subjectTitle: "Python Data", subjectCode: "PBA211", location: "Lab 1", startTime: "09:00 AM", endTime: "10:00 AM", teacher: "Prof. Das", progress: 15 },
    { id: "t11", day: "Saturday", subjectTitle: "Capstone Project", subjectCode: "PRJ2", location: "Online", startTime: "09:00 AM", endTime: "10:00 AM", teacher: "Self", progress: 60 },

    // 10:00 AM
    { id: "t2", day: "Monday", subjectTitle: "Power BI BI", subjectCode: "PBA212", location: "Lab 3", startTime: "10:00 AM", endTime: "11:00 AM", teacher: "Prof. Iyer", progress: 20 },
    { id: "t5", day: "Tuesday", subjectTitle: "Research Methods", subjectCode: "PBA208", location: "M-10", startTime: "10:00 AM", endTime: "11:00 AM", teacher: "Prof. Rao", progress: 50 },
    { id: "t8", day: "Thursday", subjectTitle: "Legal Business", subjectCode: "PBA206", location: "Room 4", startTime: "10:00 AM", endTime: "11:00 AM", teacher: "Prof. Singh", progress: 40 },

    // 11:00 AM
    { id: "t3", day: "Monday", subjectTitle: "Communication II", subjectCode: "PBA213", location: "Seminar 1", startTime: "11:00 AM", endTime: "12:00 PM", teacher: "Prof. Nair", progress: 10 },
];

export const announcements: Announcement[] = [
    {
        id: "a1",
        title: "MBA BA Semester 2 Results",
        content: "Provisional results for the previous semester have been released. Check your portal.",
        date: "2024-01-13",
        type: "info",
    },
    {
        id: "a2",
        title: "Power BI Workshop",
        content: "A mandatory workshop on Advanced DAX for Power BI is scheduled for this Friday.",
        date: "2024-01-12",
        type: "warning",
    },
];
