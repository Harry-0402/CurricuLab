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
        title: "Business Research Methodology",
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
    // Subject s1: Production and Operations Management (PBA204)
    {
        id: "u_pba204_1", subjectId: "s1", title: "Unit I: Introduction to Operations Management", description: "Nature, Scope, Importance and Functions", order: 1, isCompleted: false,
        topics: ["Nature, Scope, Importance and Functions", "Evolution from manufacturing to operations management", "Evolution of the factory system", "Manufacturing systems", "Quality", "Mass customization", "Contribution of Henry Ford, Deming, Crossby, Taguchi"]
    },
    {
        id: "u_pba204_2", subjectId: "s1", title: "Unit II: Productivity and Work Study", description: "Productivity and Work Measurement", order: 2, isCompleted: false,
        topics: ["Productivity", "Work Study – Objectives, Scope and Uses", "Methods Study", "Flow process chart", "Flow diagram", "Process mapping", "Work Measurement", "Elements", "Performance Rating", "Allowances", "Standard Time", "Synthetic Time Standards", "Work Sampling", "Numericals expected for Standard Time"]
    },
    {
        id: "u_pba204_3", subjectId: "s1", title: "Unit III: Facilities Location and Layout", description: "Strategic importance and layout types", order: 3, isCompleted: false,
        topics: ["Strategic importance", "Factors affecting location and layout", "Installation of facilities", "Single location decisions", "Multi-location decisions", "Principles of Facilities Layout", "Types of Facilities Layout"]
    },
    {
        id: "u_pba204_4", subjectId: "s1", title: "Unit IV: Types of Industries and Manufacturing Methods", description: "Manufacturing systems and characteristics", order: 4, isCompleted: false,
        topics: ["Variety of Businesses", "Integration of Manufacturing and Services", "Scale of Operations", "Methods of Manufacturing", "Project / Jobbing", "Batch Production", "Flow / Continuous Production", "Process Production", "Characteristics of each method"]
    },
    {
        id: "u_pba204_5", subjectId: "s1", title: "Unit V: Inspection, Quality Control and Lean Systems", description: "Quality assurance and lean methodologies", order: 5, isCompleted: false,
        topics: ["Inspection", "Cent percent Inspection", "Sample Inspection", "Operation Characteristics Curves", "Statistical Quality Control", "Construction and Interpretation of Control Charts", "X-R, n, p, c, np charts", "Introduction to Six Sigma", "Numericals expected for Control Charts", "Lean Production Systems", "TOYOTA system", "JIT", "KANBAN", "Theory of Constraints"]
    },

    // Subject s2: Digital Transformation (PBA205)
    {
        id: "u_pba205_1", subjectId: "s2", title: "Unit I: Understanding Digital Transformation", description: "Definition and Scope", order: 1, isCompleted: false,
        topics: ["Definition", "Scope of digital transformation", "Importance", "Benefits of digital transformation", "Key drivers", "Trends in digital transformation", "Overview of digital transformation frameworks"]
    },
    {
        id: "u_pba205_2", subjectId: "s2", title: "Unit II: Leading Digital Transformation", description: "Leadership and Culture", order: 2, isCompleted: false,
        topics: ["Role of leadership in driving digital transformation", "Key competencies for digital leaders", "Building a digital culture within organizations", "Introduction to Agile and Lean methodologies", "Applying Agile and Lean principles to digital transformation"]
    },
    {
        id: "u_pba205_3", subjectId: "s2", title: "Unit III: Digital Transformation in Various Industries", description: "Industry trends and impact", order: 3, isCompleted: false,
        topics: ["Trends and technologies in retail", "Omnichannel strategies and customer experience", "Fintech innovations and trends", "Impact of digital transformation on banking and financial services", "Technologies transforming healthcare", "Telemedicine", "Health informatics", "Challenges and opportunities in healthcare digital transformation"]
    },
    {
        id: "u_pba205_4", subjectId: "s2", title: "Unit IV: Innovation in the Digital Age", description: "Types of innovation and tools", order: 4, isCompleted: false,
        topics: ["Types of innovation (Incremental, Disruptive, Radical)", "Creating an innovation-friendly environment", "Encouraging creativity and experimentation", "Tools and Techniques for Digital Innovation", "Design thinking", "Open innovation", "Innovation labs and incubators", "Crowdsourcing"]
    },
    {
        id: "u_pba205_5", subjectId: "s2", title: "Unit V: Digital Technologies and Trends", description: "Emerging Technologies", order: 5, isCompleted: false,
        topics: ["Emerging Technologies", "Overview of key digital technologies", "Artificial Intelligence", "Internet of Things", "Blockchain", "Cloud computing", "Big data", "Machine learning", "Impact of technologies on businesses and industries"]
    },

    // Subject s3: Legal Aspects of Business (PBA206)
    {
        id: "u_pba206_1", subjectId: "s3", title: "Unit I: Law of Contract", description: "The Indian Contract Act, 1872", order: 1, isCompleted: false,
        topics: ["The Indian Contract Act, 1872", "Nature and kinds of contracts", "Essential elements of a valid contract", "Offer and acceptance", "Consideration", "Capacity to contract", "Free consent", "Legality and object", "Types of Contracts", "Contingent contracts", "Performance of contract", "Discharge of contract", "Quasi contract", "Remedies for breach of contract", "Indemnity and guarantee", "Bailment and pledge", "Law of agency"]
    },
    {
        id: "u_pba206_2", subjectId: "s3", title: "Unit II: Sale of Goods and Partnership", description: "Sales of Goods Act & Partnership Act", order: 2, isCompleted: false,
        topics: ["Law of Sales of Goods Act, 1930", "General principles", "Conditions and warranties", "Doctrine of caveat emptor", "Transfer of ownership", "Performance of contract of sale", "Remedial measures", "Law of Partnership – Indian Partnership Act, 1932", "Definition and general principles", "Formation of partnership", "Rights and liabilities of partners", "Dissolution of partnership firms"]
    },
    {
        id: "u_pba206_3", subjectId: "s3", title: "Unit III: Company Law", description: "The Indian Companies Act, 1956", order: 3, isCompleted: false,
        topics: ["The Indian Companies Act, 1956", "Company and its various forms", "Formation of a company", "Memorandum of association", "Articles of association", "Prospectus", "Share allotment", "Shares and share capital", "Promoters", "Membership of a company", "Meetings and proceedings", "Directors", "Managers and remuneration", "Secretary", "Prevention of oppression and mismanagement", "Winding up of a company"]
    },
    {
        id: "u_pba206_4", subjectId: "s3", title: "Unit IV: Insurance, Insolvency, Carriage and Arbitration", description: "Miscellaneous Commercial Laws", order: 4, isCompleted: false,
        topics: ["Nature and principles of insurance", "Life insurance", "General insurance", "Fire insurance", "Marine insurance", "Insolvency law", "Objects and scope", "Procedure", "Property and debt of insolvent", "Discharge of insolvent", "Carriage of goods (By land, sea, air)", "Arbitration (General provisions, Modes)"]
    },
    {
        id: "u_pba206_5", subjectId: "s3", title: "Unit V: Miscellaneous Laws", description: "Consumer Protection, FEMA, IT Act", order: 5, isCompleted: false,
        topics: ["Essential Commodities Act, 1955", "Consumer Protection Act, 1986", "Co-operative Societies Act, 1912", "Multi-State Co-operative Societies Act, 1984", "Foreign Exchange Management Act, 1999", "MRTP Act", "Information Technology Act, 2000"]
    },

    // Subject s4: Data Visualization and Story Telling (PBA207)
    {
        id: "u_pba207_1", subjectId: "s4", title: "Unit I: Visualization Basics", description: "Introduction to visualization", order: 1, isCompleted: false,
        topics: ["Introduction to visualization", "Why to visualize", "How to visualize", "Stages of data visualizing", "Usages of visualization", "Types of charts"]
    },
    {
        id: "u_pba207_2", subjectId: "s4", title: "Unit II: Visualization of Structured Data", description: "Structured Data Analysis", order: 2, isCompleted: false,
        topics: ["Introduction", "Exploratory analysis", "Univariate analysis", "Multivariate analysis", "Charts to visualize multiple measures", "Modeling", "Visualization during deployment"]
    },
    {
        id: "u_pba207_3", subjectId: "s4", title: "Unit III: Visualization of Unstructured Data", description: "Text and Conversation Viz", order: 3, isCompleted: false,
        topics: ["Introduction", "Importance and challenges of text data visualization", "Forms of text data", "Pre-processing pipeline", "Visualizing text data", "Visualizing conversations"]
    },
    {
        id: "u_pba207_4", subjectId: "s4", title: "Unit IV: Visual Story Telling", description: "Narrative visualization", order: 4, isCompleted: false,
        topics: ["Introduction", "Why storytelling matters", "Science behind storytelling"]
    },
    {
        id: "u_pba207_5", subjectId: "s4", title: "Unit V: Storytelling Framework", description: "Business Storytelling", order: 5, isCompleted: false,
        topics: ["Introduction", "Importance of business storytelling", "Data storytelling", "Narrative types", "Dimensions of narrative storytelling", "Data story types", "Analytics dashboard"]
    },

    // Subject s5: Business Research Methodology (PBA208)
    {
        id: "u_pba208_1", subjectId: "s5", title: "Unit I: Introduction to Business Research", description: "Research definition and process", order: 1, isCompleted: false,
        topics: ["Types of research", "Process of research", "Formulation of research problem", "Development of research hypothesis"]
    },
    {
        id: "u_pba208_2", subjectId: "s5", title: "Unit II: Research Design", description: "Design and Data Collection", order: 2, isCompleted: false,
        topics: ["Definitions and functions", "Exploratory, descriptive and experimental research", "Experimental designs (Pre, Quasi, True, Statistical)", "Validity of research instruments", "Methods of data collection", "Attitudinal scales", "Questionnaire designing"]
    },
    {
        id: "u_pba208_3", subjectId: "s5", title: "Unit III: Sampling", description: "Sampling and Data Processing", order: 3, isCompleted: false,
        topics: ["Concept of sampling", "Sampling design", "Types of sampling designs", "Sampling frame & size", "Data processing (Editing, Coding, Tabulating)"]
    },
    {
        id: "u_pba208_4", subjectId: "s5", title: "Unit IV: Data Analysis", description: "Analysis and Hypothesis Testing", order: 4, isCompleted: false,
        topics: ["Univariate, Bivariate, Multivariate analysis", "Hypothesis testing", "Concept", "Types of errors", "Steps in hypothesis testing"]
    },
    {
        id: "u_pba208_5", subjectId: "s5", title: "Unit V: Analytical Techniques", description: "Advanced Tests", order: 5, isCompleted: false,
        topics: ["Parametric vs non-parametric tests", "ANOVA", "Correlation and regression", "Chi-square test", "Non-parametric tests for normality", "Run test", "Factor analysis", "Discriminant analysis", "Conjoint analysis"]
    },

    // Remaining subjects
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
