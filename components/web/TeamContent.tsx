"use client"

import { Icons } from '@/components/shared/Icons';
import Link from 'next/link';

interface TeamMember {
    name: string;
    role?: string;
    subject?: string;
    driveLink?: string;
}

interface TeamSection {
    title: string;
    lead?: string;
    members: TeamMember[];
    description: string;
    color: string;
    icon: string;
}

const TEAMS: TeamSection[] = [
    {
        title: "Technical Team",
        lead: "Kaif",
        members: [
            { name: "Kaif", role: "Lead" },
            { name: "Akash", role: "Developer" },
            { name: "Tejas", role: "Developer" }
        ],
        description: "Responsible for platform development, integration, and technical infrastructure.",
        color: "blue",
        icon: "💻"
    },
    {
        title: "Data Acquisition Team",
        lead: "Tanu",
        members: [
            {
                name: "Georgetta",
                subject: "PBA 207 - Data Visualization & Storytelling",
                driveLink: "https://drive.google.com/drive/folders/1ZM8W2EmxgCdZz0U960KJSlAo0tSli-uA?usp=sharing"
            },
            {
                name: "Tanu",
                role: "Lead",
                subject: "PBA 206 - Legal Aspects of Business",
                driveLink: "https://drive.google.com/drive/folders/1zIP2MjeN3SzFM8Rkfw0xQKKdlR7LJvJD?usp=sharing"
            },
            {
                name: "Anukriti",
                subject: "PBA 205 - Digital Transformation",
                driveLink: "https://drive.google.com/drive/folders/1FJEJWenzKHXnCKiLMImLbHpD464JFLBO?usp=sharing"
            },
            {
                name: "Manishankar",
                subject: "PBA 208 - Business Research Methodology",
                driveLink: "https://drive.google.com/drive/folders/1Jpf6sY6nD28PMVJehRBdtLYsoeXRcw8q?usp=sharing"
            },
            {
                name: "Divya",
                subject: "PBA 204 - Production & Operations Management",
                driveLink: "https://drive.google.com/drive/folders/1nQE5vKrBPNljGPfYcD-i7V9sOWHctqxl?usp=sharing"
            }
        ],
        description: "Responsible for content creation, quality assurance, and MBA Sem 2 resource assembly.",
        color: "green",
        icon: "📊"
    },
    {
        title: "Project Coordinators",
        members: [
            { name: "Harish", role: "Coordinator" },
            { name: "Kaustubh", role: "Coordinator" }
        ],
        description: "Oversee project timeline, resource allocation, and team coordination.",
        color: "yellow",
        icon: "📋"
    }
];

const WORKFLOW_STEPS = [
    {
        title: "Upload & Prepare",
        description: "Upload syllabus and copy-paste the prompt in your preferred AI tool (ChatGPT, Gemini, etc.) for content generation.",
        icon: "📤"
    },
    {
        title: "Verify & Quality Check",
        description: "Verify all questions and answers to avoid duplication, missing values, or gaps. Do cross-checking thoroughly before approval.",
        icon: "✅"
    },
    {
        title: "Clarify Doubts",
        description: "If any doubts or issues arise, contact the Project Coordinators (Harish & Kaustubh) immediately to avoid last-minute hassles.",
        icon: "❓"
    },
    {
        title: "Report Progress",
        description: "After verification, discuss work progress with coordinators. Once approved, forward your finalized file to them.",
        icon: "📋"
    },
    {
        title: "Integration & Website Launch",
        description: "Technical Team (Kaif, Akash, Tejas) will integrate the acquired data into the website and maintain it.",
        icon: "🚀"
    }
];

import { WebAppShell } from '@/components/web/WebAppShell';

export default function TeamContent() {
    return (
        <WebAppShell>
            <div className="space-y-12">
                {/* Header Section */}
                <div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">CurricuLab Team</h1>
                    <p className="text-xl font-bold text-gray-400 max-w-3xl">
                        Meet the talented individuals behind CurricuLab - MBA Semester 2 Content Platform
                    </p>
                    <div className="flex gap-3 mt-6 flex-wrap">
                        <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-wider border border-blue-100">
                            Semester 2 Resources
                        </span>
                        <span className="px-4 py-2 bg-green-50 text-green-600 rounded-full text-xs font-black uppercase tracking-wider border border-green-100">
                            Exam-style Q&A
                        </span>
                        <span className="px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-xs font-black uppercase tracking-wider border border-purple-100">
                            Notes + Case Studies + Projects
                        </span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-12">

                    {/* Project Goal */}
                    <section className="bg-white p-10 rounded-[35px] border border-gray-100 shadow-sm">
                        <h2 className="text-3xl font-black text-gray-900 mb-6">Project Goal</h2>
                        <p className="text-lg font-bold text-gray-500 leading-relaxed mb-4">
                            CurricuLab is a comprehensive website containing MBA Semester 2 resources.
                            Our main output includes exam-style questions with answers (unit-wise) and structured notes.
                        </p>
                        <p className="text-lg font-bold text-gray-500 leading-relaxed">
                            We provide two options for content creation, focusing on stable output with minimal rework.
                        </p>
                    </section>

                    {/* Team Structure */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black text-gray-900">Team Structure</h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {TEAMS.map((team, idx) => (
                                <div
                                    key={idx}
                                    className={`bg-white p-8 rounded-[35px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 ${team.title === "Data Acquisition Team" ? "lg:col-span-2" : ""
                                        }`}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-3xl">{team.icon}</span>
                                        <div>
                                            <h3 className="text-2xl font-black text-gray-900">
                                                {team.title}
                                                {team.lead && (
                                                    <span className="text-base font-bold text-blue-600 ml-3">
                                                        (Lead: {team.lead})
                                                    </span>
                                                )}
                                            </h3>
                                        </div>
                                    </div>

                                    <p className="text-sm font-bold text-gray-400 mb-6">{team.description}</p>

                                    {/* Team Members */}
                                    <div className={`grid gap-4 ${team.title === "Data Acquisition Team" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                                        {team.members.map((member, mIdx) => (
                                            <div
                                                key={mIdx}
                                                className={`p-5 rounded-2xl border ${team.color === "blue" ? "bg-blue-50 border-blue-100" :
                                                    team.color === "green" ? "bg-green-50 border-green-100" :
                                                        "bg-yellow-50 border-yellow-100"
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-black text-gray-900">{member.name}</span>
                                                    {member.role && (
                                                        <span className={`px-3 py-1 rounded-full text-xs font-black ${member.role === "Lead" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                                                            }`}>
                                                            {member.role}
                                                        </span>
                                                    )}
                                                </div>
                                                {member.subject && (
                                                    <>
                                                        <p className="text-xs font-bold text-gray-600 mb-3">{member.subject}</p>
                                                        {member.driveLink && (
                                                            <Link
                                                                href={member.driveLink}
                                                                target="_blank"
                                                                className="flex items-center gap-2 text-xs font-black text-blue-600 hover:text-blue-800 transition-colors"
                                                            >
                                                                <Icons.Database size={14} />
                                                                View Drive Folder
                                                            </Link>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Leadership */}
                    <section className="bg-gradient-to-br from-blue-50 to-purple-50 p-10 rounded-[35px] border border-blue-100">
                        <h3 className="text-2xl font-black text-gray-900 mb-4">Leadership & Accountability</h3>
                        <p className="text-base font-bold text-gray-600 mb-4">
                            <strong className="text-gray-900">Leaders (Kaif & Tanu)</strong> are accountable and responsible for:
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm font-bold text-gray-600">
                                <Icons.CheckSquare size={20} className="text-blue-600 mt-0.5 shrink-0" />
                                Team performance and delivery of assigned tasks
                            </li>
                            <li className="flex items-start gap-3 text-sm font-bold text-gray-600">
                                <Icons.CheckSquare size={20} className="text-blue-600 mt-0.5 shrink-0" />
                                Quality assurance of all outputs
                            </li>
                            <li className="flex items-start gap-3 text-sm font-bold text-gray-600">
                                <Icons.CheckSquare size={20} className="text-blue-600 mt-0.5 shrink-0" />
                                Reporting to Project Coordinators (Harish & Kaustubh)
                            </li>
                            <li className="flex items-start gap-3 text-sm font-bold text-gray-600">
                                <Icons.CheckSquare size={20} className="text-blue-600 mt-0.5 shrink-0" />
                                Escalation and issue resolution within their teams
                            </li>
                            <li className="flex items-start gap-3 text-sm font-bold text-gray-600">
                                <Icons.CheckSquare size={20} className="text-blue-600 mt-0.5 shrink-0" />
                                Progress tracking and status updates
                            </li>
                        </ul>
                    </section>

                    {/* Workflow */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black text-gray-900">Project Workflow</h2>

                        <div className="grid gap-6">
                            {WORKFLOW_STEPS.map((step, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white p-8 rounded-[35px] border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="flex items-start gap-5">
                                        <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-black shrink-0">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="text-2xl">{step.icon}</span>
                                                <h3 className="text-xl font-black text-gray-900">{step.title}</h3>
                                            </div>
                                            <p className="text-sm font-bold text-gray-500 leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* AI Tools & Prompts */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black text-gray-900">Content Creation Tools</h2>
                        <p className="text-base font-bold text-gray-500">
                            We recommend <strong className="text-green-600">Option 1: Custom GPT Workflow</strong> for best results
                        </p>

                        {/* Option 1: Custom GPTs */}
                        <div className="bg-gradient-to-br from-green-50 to-blue-50 p-10 rounded-[35px] border border-green-100">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="px-4 py-2 bg-green-600 text-white rounded-full text-xs font-black uppercase">
                                    ✅ Recommended
                                </span>
                                <h3 className="text-2xl font-black text-gray-900">Option 1: Custom GPT Workflow</h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Syllabrix */}
                                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-3xl">📝</span>
                                        <div>
                                            <h4 className="text-xl font-black text-gray-900">Syllabrix</h4>
                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-black rounded">
                                                Q&A Generator
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold text-gray-500 mb-4">
                                        Unit-wise Question–Answers with pre-defined marks pattern and question format.
                                    </p>
                                    <Link
                                        href="https://chatgpt.com/g/g-69624841e9808191847e5f0682c8a6de-syllabrix"
                                        target="_blank"
                                        className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-black hover:bg-blue-700 transition-all mb-4"
                                    >
                                        <Icons.Database size={16} />
                                        Open Syllabrix GPT
                                    </Link>
                                    <div className="p-4 bg-gray-900 rounded-xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-black text-gray-400 uppercase">Prompt</span>
                                            <button
                                                onClick={(e) => {
                                                    const text = "I have an attached syllabus of a [subject name] along with a reference book. Create detailed Question with proper structure and language should be simple, clear and humanoid.";
                                                    navigator.clipboard.writeText(text);
                                                    const btn = e.currentTarget;
                                                    const original = btn.innerHTML;
                                                    btn.innerHTML = '✅ Copied!';
                                                    setTimeout(() => { btn.innerHTML = original; }, 2000);
                                                }}
                                                className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-black hover:bg-blue-700 transition-all"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-300 font-mono leading-relaxed">
                                            I have an attached syllabus of a [subject name] along with a reference book. Create detailed Question with proper structure and language should be simple, clear and humanoid.
                                        </p>
                                    </div>
                                </div>

                                {/* NoteSmith */}
                                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-3xl">📚</span>
                                        <div>
                                            <h4 className="text-xl font-black text-gray-900">NoteSmith</h4>
                                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-black rounded">
                                                Notes Generator
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold text-gray-500 mb-4">
                                        Notes + Case Studies + Mini Project with stable formatting for website and PDF export.
                                    </p>
                                    <Link
                                        href="https://chatgpt.com/g/g-6962605ee32481918f2c0ee70c521b90-notesmith"
                                        target="_blank"
                                        className="flex items-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-xl text-sm font-black hover:bg-purple-700 transition-all mb-4"
                                    >
                                        <Icons.Database size={16} />
                                        Open NoteSmith GPT
                                    </Link>
                                    <div className="p-4 bg-gray-900 rounded-xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-black text-gray-400 uppercase">Prompt</span>
                                            <button
                                                onClick={(e) => {
                                                    const text = "I have an attached syllabus of a [subject name] along with a reference book. Create detailed notes with proper structure and language should be simple, clear and humanoid.";
                                                    navigator.clipboard.writeText(text);
                                                    const btn = e.currentTarget;
                                                    const original = btn.innerHTML;
                                                    btn.innerHTML = '✅ Copied!';
                                                    setTimeout(() => { btn.innerHTML = original; }, 2000);
                                                }}
                                                className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-black hover:bg-purple-700 transition-all"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-300 font-mono leading-relaxed">
                                            I have an attached syllabus of a [subject name] along with a reference book. Create detailed notes with proper structure and language should be simple, clear and humanoid.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 p-5 bg-white rounded-2xl border border-gray-100">
                                <h4 className="text-sm font-black text-gray-900 mb-3">✨ Why Option 1 is Best</h4>
                                <ul className="grid md:grid-cols-2 gap-3">
                                    <li className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                        <Icons.CheckSquare size={16} className="text-green-600 shrink-0" />
                                        Less flow break (GPT does 1 job at a time)
                                    </li>
                                    <li className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                        <Icons.CheckSquare size={16} className="text-green-600 shrink-0" />
                                        Less unit mixing
                                    </li>
                                    <li className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                        <Icons.CheckSquare size={16} className="text-green-600 shrink-0" />
                                        Less repeated questions
                                    </li>
                                    <li className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                        <Icons.CheckSquare size={16} className="text-green-600 shrink-0" />
                                        Same output format across all team members
                                    </li>
                                    <li className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                        <Icons.CheckSquare size={16} className="text-green-600 shrink-0" />
                                        Fast and clean for website upload
                                    </li>
                                    <li className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                        <Icons.CheckSquare size={16} className="text-green-600 shrink-0" />
                                        High unit accuracy
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Comparison Table */}
                        <div className="bg-white p-10 rounded-[35px] border border-gray-100 shadow-sm overflow-x-auto">
                            <h3 className="text-2xl font-black text-gray-900 mb-6">Option Comparison</h3>
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-4 px-4 text-sm font-black text-gray-900">Factor</th>
                                        <th className="text-left py-4 px-4 text-sm font-black text-gray-900">Option 1: Custom GPTs</th>
                                        <th className="text-left py-4 px-4 text-sm font-black text-gray-900">Option 2: Master Prompt</th>
                                        <th className="text-center py-4 px-4 text-sm font-black text-gray-900">Best</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { factor: "Marks format", opt1: "Fixed + final aligned", opt2: "Depends on prompt accuracy", best: 1 },
                                        { factor: "Consistency", opt1: "High", opt2: "Medium", best: 1 },
                                        { factor: "Flow disturbance", opt1: "Low", opt2: "High", best: 1 },
                                        { factor: "Unit accuracy", opt1: "High", opt2: "Medium", best: 1 },
                                        { factor: "Repeated questions", opt1: "Low", opt2: "Medium–High", best: 1 },
                                        { factor: "Flexibility", opt1: "Medium", opt2: "High", best: 2 },
                                        { factor: "Best for team work", opt1: "Strong (same tools)", opt2: "Weak (varies by member)", best: 1 }
                                    ].map((row, idx) => (
                                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-4 text-sm font-bold text-gray-900">{row.factor}</td>
                                            <td className="py-4 px-4 text-sm font-medium text-gray-600">{row.opt1}</td>
                                            <td className="py-4 px-4 text-sm font-medium text-gray-600">{row.opt2}</td>
                                            <td className="py-4 px-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-black ${row.best === 1 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                                    }`}>
                                                    Option {row.best}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-6 p-5 bg-green-50 rounded-2xl border border-green-200">
                                <p className="text-sm font-black text-green-900 flex items-center gap-2">
                                    <span className="text-xl">✅</span>
                                    <span>Final Decision: Use <strong>Option 1 (Custom GPT Workflow)</strong> for full production</span>
                                </p>
                            </div>
                        </div>

                        {/* Option 2: Master Prompt */}
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-10 rounded-[35px] border border-yellow-100">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="px-4 py-2 bg-yellow-500 text-white rounded-full text-xs font-black uppercase">
                                    ⚠️ For Polishing Only
                                </span>
                                <h3 className="text-2xl font-black text-gray-900">Option 2: Master Prompt</h3>
                            </div>

                            <p className="text-sm font-bold text-gray-600 mb-6 leading-relaxed">
                                Use this prompt only for editing, rewriting, or when flexibility is needed.
                                Features strict syllabus mapping, exam-style Q&A, and content control.
                            </p>

                            <div className="bg-white p-6 rounded-3xl border border-yellow-200 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-lg font-black text-gray-900">Master Prompt Content</h4>
                                    <button
                                        onClick={(e) => {
                                            const text = `MASTER PROMPT — MBA Sem 2 (All‑in‑one)\n\nROLE\nYou are a business analytics and decision‑science expert, university‑level subject expert, MBA professor, syllabus analyst, and exam‑oriented answer writer. Help me do well in exams, understand concepts, and apply them in real business.\n\nINPUTS I WILL PROVIDE\n- Full syllabus (units and subtopics)\n- Reference book(s) or PDFs (author list provided)\n\nEXECUTION RULES\n- Work one unit at a time. Do not mix content across units.\n- Use simple, clear, professional language. Avoid jargon unless explained.\n- Keep output well‑structured, consistent, and exam‑ready.\n\nSTEP 1 — STRICT SYLLABUS MAPPING (MANDATORY)\n1) List ALL units in exact order.\n2) Under each unit, list every subtopic clearly (no collapsing or merging).\n3) After each unit, add placeholders only: Case Studies (2 titles + 1‑line context each), Mini Project (problem + result only), Mind Map (node list). Do NOT elaborate yet.\n⛔ STOP after mapping. Wait for my confirmation before Step 2.\n\nSTEP 2 — QUESTIONS AND ANSWERS (PER UNIT)\nWork on one unit at a time. For the selected unit, generate at least 50 questions across marks categories:\n- 2 Marks × 10 (4–9 lines) — short theory\n- 7 Marks × 10 (14–19 lines) — medium analytical\n- 8 Marks × 10 (16–21 lines) — medium analytical\n- 10 Marks × 10 (20–25 lines) — long integrative\n- 15 Marks × 10 (30–35 lines) — long analytical\nDistribution: ~40% direct, ~35% application‑based, ~25% Socratic.\n\nHOW TO WRITE ANSWERS\n- Explain/Describe: opening → meaning/definition → types/classification (if any) → full explanation → real‑world example → highlight KEYWORDS in context.\n- Compare/Difference: use a table; include concise bullets only if requested for types/differences; add a real example at end.\n- Depth scales with marks. Keep structure clean and consistent.\n\nCONTENT CONTROL (VERY IMPORTANT)\n- ❌ No content from other units\n- ❌ No duplicate questions\n- ❌ No extra theory beyond syllabus\n- ✅ Simple, clear language suitable for MBA exams\n- ✅ Cite standard academic understanding (no hallucinations)\n\nSPECIAL MODES (ALWAYS ON)\n- Question Paper Prediction Mode: focus on likely exam questions\n- Concept Clarity Mode: ensure conceptual accuracy and coherence\n- Hallucination Control: stay within syllabus and reference materials\n\nAFTER EACH UNIT (POST‑WORK)\n1) Final integrative challenge that combines multiple ideas\n2) Reflection prompts (what/why/meaning/when‑not/how/where)\n3) Suggest business/industry analytics project use or simulation\n4) Notes pack: detailed explanations (paragraphs), comparison tables, helpful analogies, tips & tricks, last‑minute revision points\n\nFORMAT/STYLE\n- Headings/subheadings; numbered/bulleted lists where needed\n- Tables for comparisons; examples grounded in business scenarios\n- Keep tone polite, focused, analytical, and exam‑oriented\n\nEXECUTION CONTROL\nAfter each step or unit, STOP and wait for my next instruction (e.g., "Begin Unit 1" or "Proceed to Q&A").\n\nSTARTER INSTRUCTIONS FOR YOU\n1) Acknowledge Step 1 and request the full syllabus PDF + reference book(s).\n2) After mapping, pause and ask me to confirm the next unit.\n3) While generating Q&A, maintain marks‑wise structure and enforce line limits.\n4) If any source is missing, ask for it before proceeding.\n\nCONTEXT\nSubject: [subject name]\nOutputs must be consistent and website‑ready.`;
                                            navigator.clipboard.writeText(text);
                                            const btn = e.currentTarget;
                                            const original = btn.innerHTML;
                                            btn.innerHTML = '✅ Copied!';
                                            setTimeout(() => { btn.innerHTML = original; }, 2000);
                                        }}
                                        className="px-4 py-2 bg-yellow-500 text-white rounded-xl text-sm font-black hover:bg-yellow-600 transition-all shadow-sm"
                                    >
                                        Copy Master Prompt
                                    </button>
                                </div>
                                <div className="h-64 overflow-y-auto bg-gray-50 p-4 rounded-xl border border-gray-100 font-mono text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
                                    {`MASTER PROMPT — MBA Sem 2 (All‑in‑one)

ROLE
You are a business analytics and decision‑science expert...
(Click 'Copy Master Prompt' to get the full text)`}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Footer Note */}
                    <section className="bg-gray-900 p-10 rounded-[35px] text-center">
                        <p className="text-lg font-bold text-gray-300">
                            Working together to create the best MBA Semester 2 resource platform
                        </p>
                        <p className="text-sm font-bold text-gray-500 mt-3">
                            CurricuLab • MBA Business Analytics • Semester 2
                        </p>
                </div>
            </div>
        </WebAppShell>
    );
}
