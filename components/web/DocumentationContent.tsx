"use client"

import React from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { WebAppShell } from '@/components/web/WebAppShell';

const TEAM_DISTRIBUTION = [
    { team: "Coordinator", member: "Tanu Chaudhary", role: "Workflow and Project Manager" },
    { team: "Technical Team", member: "Harish Ravindra Chavan", role: "Code Base Manager and Core Developer" },
    { team: "Technical Team", member: "Kaustubh Nandurkar", role: "APIs and Database Manager" },
    { team: "Data Acquisition", member: "Anukriti Srivastava", role: "Resource Manager and Team Leader" },
    { team: "Data Acquisition", member: "Tejas Patil", role: "Assistant Resource Manager" },
    { team: "Data Acquisition", member: "Manishankar Veermalla", role: "Junior Resource Manager" },
    { team: "Data Acquisition", member: "Georgetta Wilson", role: "Junior Resource Manager" },
    { team: "Research & Quality", member: "Kaif Shah", role: "Quality Assessment Manager" },
    { team: "Research & Quality", member: "Akash Jayaprakash Mangalumthodi", role: "R&D Manager" }
];

const SUBJECT_ALLOCATION = [
    { code: "PBA204", name: "Production and Operations Management", manager: "Anukriti Srivastava" },
    { code: "PBA205", name: "Digital Transformation", manager: "Anukriti Srivastava" },
    { code: "PBA206", name: "Legal aspects of business", manager: "Tejas Patil" },
    { code: "PBA211", name: "Data analysis using python", manager: "Tejas Patil" },
    { code: "PBA208", name: "Business research methods", manager: "Manishankar Veermalla" },
    { code: "PBA212", name: "Data analysis using Power Bi", manager: "Manishankar Veermalla" },
    { code: "PBA207", name: "Data visualization and story telling", manager: "Georgetta Wilson" },
    { code: "PBA213", name: "Business communication skills", manager: "Georgetta Wilson" }
];

const TECHNICAL_STEPS = [
    { title: "Requirement Analysis", desc: "Understanding system needs and expectations from the Coordinator and other teams." },
    { title: "System Design", desc: "Planning architecture, database schema, and module structure with R&D Manager." },
    { title: "Development", desc: "Building frontend interfaces and backend logic for a seamless user experience." },
    { title: "Integration", desc: "Connecting APIs (Google Classroom), databases (Supabase), and external services." },
    { title: "Testing", desc: "Continuous review of functionality, usability, and performance with Quality Manager." },
    { title: "Deployment", desc: "Publishing validated UI with content using GitHub and Render's free tier." },
    { title: "Maintenance", desc: "Post-deployment bug fixes, module updates, and workflow improvements." }
];

const QUALITY_STEPS = [
    { title: "Content Reception", desc: "Receiving HTML files, study notes, question banks, and case studies." },
    { title: "Academic Review", desc: "Cross-checking with syllabus, verifying concept clarity and completeness." },
    { title: "Structural Review", desc: "Ensuring uniform headings, paragraph segmentation, and numerical formatting." },
    { title: "Quality Evaluation", desc: "Word count precision, logical explanation, and elimination of hallucinations." },
    { title: "Feedback & Correction", desc: "Communicating corrections and reviewing revised versions." },
    { title: "Final Approval", desc: "Handing over approved content to the Technical Team for system integration." }
];

const CORE_MODULES = [
    { title: "Knowledge Vault", desc: "Personal storage space for students to store notes, study materials, and important documents in one organized place, eliminating the need to search through multiple chats.", icon: <Icons.Search size={20} /> },
    { title: "Classroom", desc: "Brings academic updates together in one space by connecting with Google Classroom and ERP, allowing users to check assignments without switching apps.", icon: <Icons.Subjects size={20} /> },
    { title: "Career Gateway", desc: "Focuses on future opportunities by providing updates about interview lineups, job openings, and preparation support to keep students career-ready.", icon: <Icons.Briefcase size={20} /> },
    { title: "Skill Forge & Resume Studio", desc: "Guides students in creating and improving resumes in a structured way, helping them become more confident for placements and interviews.", icon: <Icons.GraduationCap size={20} /> }
];

const LEARNING_OUTCOMES = [
    "Full-stack web development using Antigravity IDE and Supabase.",
    "Custom GPT creation for personalized academic use with reduced hallucinations.",
    "Real-world API integration (Google Classroom) and collaborative development.",
    "Business research methodology applied to database management and UX design."
];

const QUALITY_METRICS = [
    { label: "Syllabus Alignment", value: "100%", desc: "Direct mapping to university curriculum." },
    { label: "Content Accuracy", value: "Strict", desc: "Peer-reviewed for concept clarity." },
    { label: "Hallucination Rate", value: "Zero", desc: "Mitigated by 4-stage verification." },
    { label: "Format Consistency", value: "Uniform", desc: "Standardized across all subjects." }
];

const DEV_ENVIRONMENT = [
    { category: "Hardware", specs: "8 GB RAM, Modern Processor, Stable Connection" },
    { category: "Software", specs: "Windows/macOS/Linux, Modern Web Browser" },
    { category: "Tools", specs: "Antigravity IDE, Node.js Environment, Git" }
];

const ROADMAP = [
    { title: "Project Flashcards", desc: "Rapid-recall interactive cards for key subject definitions." },
    { title: "Cheat Sheets", desc: "Single-page condensed summaries for last-minute revisions." },
    { title: "Project GPTs", desc: "Specialized AI agents for specific academic projects and CIAs." }
];

export default function DocumentationContent() {
    return (
        <WebAppShell>
            <div className="space-y-24 pb-24">
                {/* Hero Header */}
                <header className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                        <Icons.Activity size={12} className="animate-pulse" />
                        Version 1.2 Beta
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight">
                        CurricuLab Ecosystem <br />
                        <span className="text-gray-400 font-bold">The Student-Centric Technical Manual</span>
                    </h1>
                    <p className="text-xl font-bold text-gray-400 max-w-4xl leading-relaxed italic">
                        "Designed to save time, reduce confusion, and make student academic life more structured and manageable."
                    </p>
                </header>

                {/* Section: Strategic Acknowledgement */}
                <section className="space-y-10">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-amber-500 rounded-full" />
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Strategic Foundation</h2>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-[40px] shadow-sm p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <h3 className="text-xl font-black text-gray-900">Academic Guidance</h3>
                                <p className="text-sm font-medium text-gray-500 leading-relaxed">
                                    Special thanks to our mentors <strong>Dr. Zahir Shaikh</strong> and <strong>Dr. Samadhan Bundhe</strong> from Sandip University. Under their guidance, we applied core concepts of Business Research Methods and Data Management to build this robust system.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {['SQL Handling', 'SQL Logic', 'BRM Concepts', 'Warehousing'].map(tag => (
                                    <div key={tag} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                                        <p className="text-[10px] font-black uppercase text-gray-400">{tag}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section: The Business Choice */}
                <section className="space-y-10">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-indigo-600 rounded-full" />
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Technical Strategy</h2>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-[40px] shadow-sm p-12 space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-gray-900">Custom AI over Generic Gems</h3>
                            <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-3xl">
                                After series of discussions with the Coordinator (Tanu Chaudhary) and Quality Manager (Kaif Shah), the team chose to tailor <strong>Custom ChatGPT Protocols</strong> over standard Gemini Gems. This decision was based on the need for literal word-count adherence, mark-specific segmentation (2/7/15 marks), and superior formatting for numerical knowledge.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-50">
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Smart Auto-Switching</h4>
                                <p className="text-xs font-bold text-gray-400 leading-relaxed">
                                    To bypass free-tier caps and temporary outages, CurricuLab automatically redirects requests between <strong>OpenRouter, Grok, and GitHub LLMs</strong>, ensuring 99.9% uptime during peak exam periods.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600">OCR & Data Security</h4>
                                <p className="text-xs font-bold text-gray-400 leading-relaxed">
                                    Google extensions were utilized to convert AI-generated answers into HTML files, securing formatting and saving time from manual copy-paste workflows.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section: Quality Metrics */}
                <section className="space-y-10">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-emerald-600 rounded-full" />
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Performance & Quality Metrics</h2>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {QUALITY_METRICS.map((metric, i) => (
                            <div key={i} className="bg-white p-8 rounded-[35px] border border-gray-100 shadow-sm text-center space-y-2 hover:border-emerald-200 transition-all">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{metric.label}</p>
                                <p className="text-3xl font-black text-emerald-600 tracking-tight">{metric.value}</p>
                                <p className="text-[10px] font-bold text-gray-400">{metric.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section: Feature Encyclopedia */}
                <section className="space-y-10">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Core Module Deep-Dive</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {CORE_MODULES.map((module, i) => (
                            <div key={i} className="bg-white p-8 rounded-[35px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex items-start gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                                        {module.icon}
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-lg font-black text-gray-900">{module.title}</h4>
                                        <p className="text-sm font-medium text-gray-500 leading-relaxed">{module.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section: Environments & Roadmap */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="space-y-10">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-8 bg-slate-900 rounded-full" />
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Dev Constraints</h2>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-[40px] shadow-sm overflow-hidden">
                            {DEV_ENVIRONMENT.map((dev, i) => (
                                <div key={i} className="px-8 py-5 flex items-center justify-between border-b border-gray-50 last:border-0">
                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{dev.category}</span>
                                    <span className="text-xs font-bold text-gray-900">{dev.specs}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-10">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-8 bg-purple-600 rounded-full" />
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Upcoming Horizons</h2>
                        </div>
                        <div className="space-y-4">
                            {ROADMAP.map((item, i) => (
                                <div key={i} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                    <h4 className="text-sm font-black text-gray-900 mb-1">{item.title}</h4>
                                    <p className="text-xs font-bold text-gray-400">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section: Operational Workflows (Two-Column) */}
                <section className="grid grid-cols-1 xl:grid-cols-2 gap-16">
                    <div className="space-y-10">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-8 bg-emerald-600 rounded-full" />
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Technical Workflow</h2>
                        </div>
                        <div className="space-y-4">
                            {TECHNICAL_STEPS.map((step, i) => (
                                <div key={i} className="flex gap-6 p-6 bg-white rounded-[24px] border border-gray-100 shadow-sm">
                                    <div className="text-sm font-black text-emerald-600">0{i + 1}</div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">{step.title}</h4>
                                        <p className="text-xs font-bold text-gray-400 leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-10">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-8 bg-purple-600 rounded-full" />
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Quality Workflow</h2>
                        </div>
                        <div className="space-y-4">
                            {QUALITY_STEPS.map((step, i) => (
                                <div key={i} className="flex gap-6 p-6 bg-white rounded-[24px] border border-gray-100 shadow-sm">
                                    <div className="text-sm font-black text-purple-600">0{i + 1}</div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">{step.title}</h4>
                                        <p className="text-xs font-bold text-gray-400 leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section: Subject & Resource Allocation */}
                <section className="space-y-10">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-amber-600 rounded-full" />
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Subject & Resource Allocation</h2>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-[40px] shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Code</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Subject Name</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Resource Manager</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {SUBJECT_ALLOCATION.map((s, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-8 py-4 text-[10px] font-black text-amber-600 uppercase tracking-widest">{s.code}</td>
                                            <td className="px-8 py-4 text-xs font-black text-gray-900">{s.name}</td>
                                            <td className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.manager}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Section: Learning Outcomes */}
                <section className="space-y-10">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-emerald-600 rounded-full" />
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Core Learning Outcomes</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {LEARNING_OUTCOMES.map((outcome, i) => (
                            <div key={i} className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 flex items-start gap-4">
                                <Icons.CheckCircle size={18} className="text-emerald-600 mt-0.5" />
                                <p className="text-sm font-bold text-emerald-900/70 leading-relaxed">{outcome}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section: The Management Team */}
                <section className="space-y-10">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-rose-600 rounded-full" />
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">The Collective Mind</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {TEAM_DISTRIBUTION.map((c, i) => (
                            <div key={i} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm text-center hover:bg-gray-50 transition-colors group">
                                <div className="w-10 h-10 bg-gray-50 rounded-full mx-auto mb-3 flex items-center justify-center text-gray-300 font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    {c.member[0]}
                                </div>
                                <h4 className="text-xs font-black text-gray-900 leading-tight mb-1">{c.member}</h4>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{c.role}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer Insight */}
                <div className="pt-10 border-t border-gray-100 text-center space-y-6">
                    <div className="flex justify-center gap-4">
                        {['Student-Centric', 'Scalability', 'Sustainability'].map(tag => (
                            <span key={tag} className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        CurricuLab Technical Ecosystem &copy; 2026
                    </p>
                </div>
            </div>
        </WebAppShell>
    );
}
