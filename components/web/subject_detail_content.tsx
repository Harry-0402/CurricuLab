"use client"

import React from 'react';
import { useParams } from 'next/navigation';
import { WebAppShell } from '@/components/web/WebAppShell';
import { UnitCard } from '@/components/web/UnitCard';
import { Icons } from '@/components/shared/Icons';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { Subject, Unit } from '@/types';

export default function WebSubjectDetailContent() {
    const params = useParams();
    // Static Data Revert
    const SUBJECTS: Subject[] = [
        { id: "s1", code: "PBA204", title: "Production and Operations Management", icon: "🏭", color: "#4f46e5", description: "Efficiency, process optimization, and value chain management.", progress: 45, unitCount: 5, lastStudied: "2024-01-12", syllabusPdfUrl: "/assets/syllabus/PBA204_Syllabus.docx" },
        { id: "s2", code: "PBA205", title: "Digital Transformation", icon: "🚀", color: "#059669", description: "Leveraging digital technologies.", progress: 30, unitCount: 5, lastStudied: "2024-01-11", syllabusPdfUrl: "/assets/syllabus/PBA205_Syllabus.doc" },
        { id: "s3", code: "PBA206", title: "Legal Aspects of Business", icon: "⚖️", color: "#f43f5e", description: "Commercial laws and regulations.", progress: 15, unitCount: 5, lastStudied: "2024-01-10", syllabusPdfUrl: "/assets/syllabus/PBA206_Syllabus.docx" },
        { id: "s4", code: "PBA207", title: "Data Visualization and Story Telling", icon: "📊", color: "#f59e0b", description: "Visual perception and data narrative.", progress: 60, unitCount: 5, lastStudied: "2024-01-13", syllabusPdfUrl: "/assets/syllabus/PBA207_Syllabus.docx" },
        { id: "s5", code: "PBA208", title: "Business Research Methodology", icon: "🔍", color: "#0ea5e9", description: "Techniques for systematic investigation.", progress: 20, unitCount: 5, lastStudied: "2024-01-09", syllabusPdfUrl: "/assets/syllabus/PBA208_Syllabus.pdf" },
        { id: "s6", code: "PBA211", title: "Data Analysis using Python", icon: "🐍", color: "#6366f1", description: "Numerical analysis with Python.", progress: 40, unitCount: 5, lastStudied: "2024-01-12", syllabusPdfUrl: "/assets/syllabus/PBA211_Syllabus.docx" },
        { id: "s7", code: "PBA212", title: "Data Analysis using Power BI", icon: "📈", color: "#10b981", description: "Interactive data visualization.", progress: 25, unitCount: 5, lastStudied: "2024-01-11", syllabusPdfUrl: "/assets/syllabus/PBA212_Syllabus.docx" },
        { id: "s8", code: "PBA213", title: "Business Communication Skills II", icon: "💬", color: "#64748b", description: "Advanced communication for professionals.", progress: 50, unitCount: 5, lastStudied: "2024-01-13", syllabusPdfUrl: "/assets/syllabus/PBA213_Syllabus.docx" },
    ];

    const UNITS: Unit[] = [
        // s1: Production and Operations Management (PBA204)
        { id: "u1-1", subjectId: "s1", title: "Unit I: Introduction to Operations Management", description: "Nature, Scope, Importance and Functions", order: 1, isCompleted: true, topics: ["Evolution from manufacturing to operations management", "Evolution of the factory system", "Manufacturing systems", "Quality", "Mass customization", "Contribution of Henry Ford, Deming, Crossby, Taguchi"] },
        { id: "u1-2", subjectId: "s1", title: "Unit II: Productivity and Work Study", description: "Productivity, Objectives, Scope and Uses", order: 2, isCompleted: true, topics: ["Methods Study", "Flow process chart", "Flow diagram", "Process mapping", "Work Measurement", "Elements", "Performance Rating", "Allowances", "Standard Time", "Synthetic Time Standards", "Work Sampling"] },
        { id: "u1-3", subjectId: "s1", title: "Unit III: Facilities Location and Layout", description: "Strategic importance and Factors", order: 3, isCompleted: false, topics: ["Installation of facilities", "Single location decisions", "Multi-location decisions", "Principles of Facilities Layout", "Types of Facilities Layout"] },
        { id: "u1-4", subjectId: "s1", title: "Unit IV: Types of Industries and Manufacturing Methods", description: "Variety of Businesses and Integration", order: 4, isCompleted: false, topics: ["Scale of Operations", "Methods of Manufacturing", "Project / Jobbing", "Batch Production", "Flow / Continuous Production", "Process Production", "Characteristics of each method"] },
        { id: "u1-5", subjectId: "s1", title: "Unit V: Inspection, Quality Control and Lean Systems", description: "Inspection and Statistical Quality Control", order: 5, isCompleted: false, topics: ["Cent percent Inspection", "Sample Inspection", "Operation Characteristics Curves", "Control Charts (X-R, n, p, c, np)", "Introduction to Six Sigma", "Lean Production Systems", "TOYOTA system", "JIT", "KANBAN", "Theory of Constraints"] },

        // s2: Digital Transformation (PBA205)
        { id: "u2-1", subjectId: "s2", title: "Unit I: Understanding Digital Transformation", description: "Definition, Scope and Importance", order: 1, isCompleted: true, topics: ["Benefits of digital transformation", "Key drivers", "Trends in digital transformation", "Overview of digital transformation frameworks"] },
        { id: "u2-2", subjectId: "s2", title: "Unit II: Leading Digital Transformation", description: "Role of leadership and culture", order: 2, isCompleted: false, topics: ["Key competencies for digital leaders", "Building a digital culture", "Introduction to Agile and Lean methodologies", "Applying Agile and Lean principles"] },
        { id: "u2-3", subjectId: "s2", title: "Unit III: Digital Transformation in Various Industries", description: "Retail, Fintech and Healthcare", order: 3, isCompleted: false, topics: ["Trends and technologies in retail", "Omnichannel strategies", "Fintech innovations", "Impact on banking services", "Technologies transforming healthcare", "Telemedicine", "Health informatics", "Challenges and opportunities"] },
        { id: "u2-4", subjectId: "s2", title: "Unit IV: Innovation in the Digital Age", description: "Types of innovation and Environment", order: 4, isCompleted: false, topics: ["Incremental, Disruptive, Radical Innovation", "Creating innovation-friendly environment", "Design thinking", "Open innovation", "Innovation labs and incubators", "Crowdsourcing"] },
        { id: "u2-5", subjectId: "s2", title: "Unit V: Digital Technologies and Trends", description: "Emerging Technologies", order: 5, isCompleted: false, topics: ["Artificial Intelligence", "Internet of Things", "Blockchain", "Cloud computing", "Big data", "Machine learning", "Impact on businesses and industries"] },

        // s3: Legal Aspects of Business (PBA206)
        { id: "u3-1", subjectId: "s3", title: "Unit I: Law of Contract", description: "The Indian Contract Act, 1872", order: 1, isCompleted: true, topics: ["Nature and kinds of contracts", "Essential elements", "Offer and acceptance", "Consideration", "Capacity and Free consent", "Legality and object", "Contingent contracts", "Performance & Discharge", "Quasi contract", "Remedies for breach", "Indemnity and guarantee", "Bailment and pledge", "Law of agency"] },
        { id: "u3-2", subjectId: "s3", title: "Unit II: Sale of Goods and Partnership", description: "Sales of Goods Act 1930 & Partnership Act 1932", order: 2, isCompleted: true, topics: ["Conditions and warranties", "Doctrine of caveat emptor", "Transfer of ownership", "Performance of sale contract", "Formation of partnership", "Rights and liabilities of partners", "Dissolution of partnership firms"] },
        { id: "u3-3", subjectId: "s3", title: "Unit III: Company Law", description: "The Indian Companies Act, 1956", order: 3, isCompleted: false, topics: ["Formation of a company", "Memorandum & Articles of association", "Prospectus & Share allotment", "Membership & Directors", "Meetings and proceedings", "Prevention of oppression", "Winding up"] },
        { id: "u3-4", subjectId: "s3", title: "Unit IV: Insurance, Insolvency, Carriage and Arbitration", description: "Principles and Regulations", order: 4, isCompleted: false, topics: ["Life, General, Fire, Marine Insurance", "Insolvency law procedure", "Carriage of goods (Land, Sea, Air)", "Arbitration modes and provisions"] },
        { id: "u3-5", subjectId: "s3", title: "Unit V: Miscellaneous Laws", description: "Economic and Consumer Laws", order: 5, isCompleted: false, topics: ["Essential Commodities Act 1955", "Consumer Protection Act 1986", "Co-operative Societies Act", "FEMA 1999", "MRTP Act", "Information Technology Act 2000"] },

        // s4: Data Visualization and Story Telling (PBA207)
        { id: "u4-1", subjectId: "s4", title: "Unit I: Visualization Basics", description: "Introduction to visualization", order: 1, isCompleted: true, topics: ["Why and How to visualize", "Stages of data visualizing", "Usages of visualization", "Types of charts"] },
        { id: "u4-2", subjectId: "s4", title: "Unit II: Visualization of Structured Data", description: "Exploratory and Multivariate analysis", order: 2, isCompleted: true, topics: ["Univariate & Multivariate analysis", "Charts for multiple measures", "Modeling", "Visualization during deployment"] },
        { id: "u4-3", subjectId: "s4", title: "Unit III: Visualization of Unstructured Data", description: "Text data visualization", order: 3, isCompleted: false, topics: ["Importance and challenges", "Forms of text data", "Pre-processing pipeline", "Visualizing text data", "Visualizing conversations"] },
        { id: "u4-4", subjectId: "s4", title: "Unit IV: Visual Story Telling", description: "Introduction to Narrative", order: 4, isCompleted: false, topics: ["Why storytelling matters", "Science behind storytelling"] },
        { id: "u4-5", subjectId: "s4", title: "Unit V: Storytelling Framework", description: "Business and Data Storytelling", order: 5, isCompleted: false, topics: ["Importance of business storytelling", "Narrative types", "Dimensions of narrative", "Data story types", "Analytics dashboard"] },

        // s5: Business Research Methodology (PBA208)
        { id: "u5-1", subjectId: "s5", title: "Unit I: Introduction to Business Research", description: "Types and Process", order: 1, isCompleted: true, topics: ["Types of research", "Process of research", "Formulation of research problem", "Development of research hypothesis"] },
        { id: "u5-2", subjectId: "s5", title: "Unit II: Research Design", description: "Definitions, functions and Validity", order: 2, isCompleted: true, topics: ["Exploratory, descriptive, experimental", "Experimental designs", "Face, Content, Construct Validity", "Methods of data collection", "Attitudinal scales (Likert)", "Questionnaire designing"] },
        { id: "u5-3", subjectId: "s5", title: "Unit III: Sampling", description: "Concept and Data Processing", order: 3, isCompleted: false, topics: ["Sampling design types (Probability/Non-probability)", "Sampling frame & size", "Data processing (Editing, Coding, Tabulating)"] },
        { id: "u5-4", subjectId: "s5", title: "Unit IV: Data Analysis", description: "Analysis and Hypothesis Testing", order: 4, isCompleted: false, topics: ["Univariate, Bivariate, Multivariate analysis", "Hypothesis testing concepts", "Types of errors", "Steps in hypothesis testing"] },
        { id: "u5-5", subjectId: "s5", title: "Unit V: Analytical Techniques", description: "Parametric vs non-parametric tests", order: 5, isCompleted: false, topics: ["ANOVA", "Correlation and regression", "Chi-square test", "Non-parametric tests", "Run test", "Factor analysis", "Discriminant analysis", "Conjoint analysis"] },
    ];

    const subject = SUBJECTS.find(s => s.id === params.subjectId) || null;
    let units = UNITS.filter(u => u.subjectId === params.subjectId);

    // Light fallback generator just for missing subjects (s6-s8)
    if (subject && units.length === 0) {
        for (let i = 1; i <= 5; i++) {
            units.push({
                id: `gen-${subject.id}-${i}`,
                subjectId: subject.id,
                title: `Unit ${i}: ${subject.title} Concepts`,
                description: "Core fundamental concepts and applications.",
                order: i,
                isCompleted: false,
                topics: ["Introduction", "Key Principles", "Case Studies", "Advanced Topics"]
            });
        }
    }

    if (!subject) return null;

    return (
        <WebAppShell>
            <div className="space-y-10">
                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
                    <div className="space-y-4 flex-1">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">{subject.title}</h2>
                        <p className="text-lg font-bold text-gray-400 max-w-2xl leading-relaxed">{subject.description}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                        {subject.syllabusPdfUrl && (
                            <div className="w-full sm:w-72 bg-white p-6 rounded-[30px] shadow-sm border border-gray-100 flex flex-col justify-between">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Official Syllabus</span>
                                    <Icons.Download size={14} className="text-blue-600" />
                                </div>
                                <a
                                    href={subject.syllabusPdfUrl}
                                    download
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all border border-blue-100"
                                >
                                    Download PDF
                                </a>
                            </div>
                        )}

                        <div className="w-full sm:w-72 space-y-3 bg-white p-6 rounded-[30px] shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Course Progress</span>
                                <span className="text-sm font-black text-gray-900">{subject.progress}%</span>
                            </div>
                            <ProgressBar value={subject.progress} color={subject.color} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {units.map((unit) => (
                        <UnitCard key={unit.id} unit={unit} />
                    ))}
                </div>
            </div>
        </WebAppShell>
    );
}
