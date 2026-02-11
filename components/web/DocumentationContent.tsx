"use client"

import React, { useState } from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { WebAppShell } from '@/components/web/WebAppShell';

const CONTRIBUTORS = [
    { name: "Harish", role: "Project Coordinator" },
    { name: "Kaustubh", role: "Project Coordinator" },
    { name: "Kaif", role: "Technical Lead" },
    { name: "Tanu", role: "Data Lead" },
    { name: "Akash", role: "Developer" },
    { name: "Tejas", role: "Developer" },
    { name: "Georgetta", role: "Researcher" },
    { name: "Anukriti", role: "Researcher" },
    { name: "Manishankar", role: "Researcher" }
];

const CATEGORIES = [
    { id: "academic", label: "Academic Suite", icon: <Icons.GraduationCap size={18} /> },
    { id: "materials", label: "Study Materials", icon: <Icons.Database size={18} /> },
    { id: "ai", label: "AI Tools", icon: <Icons.Bot size={18} /> },
    { id: "growth", label: "Personal Growth", icon: <Icons.Zap size={18} /> },
    { id: "community", label: "Community", icon: <Icons.Users size={18} /> }
];

const MODULES = [
    // --- Academic Suite ---
    {
        id: "dashboard",
        category: "academic",
        title: "Dashboard",
        description: "Your mission control center. Get a high-level overview of upcoming deadlines, recent course activity, and quick actions for common tasks.",
        icon: <Icons.Home size={24} />,
        color: "blue",
        features: ["Upcoming Deadlines", "Recent Activity", "Quick Action Tiles"]
    },
    {
        id: "subjects",
        category: "academic",
        title: "My Courses",
        description: "A centralized hub for all your academic subjects. Track progress, view unit breakdowns, and access subject-specific AI tutoring.",
        icon: <Icons.Subjects size={24} />,
        color: "blue",
        features: ["Subject Management", "Unit Progress", "Teacher Directory"]
    },
    {
        id: "classroom",
        category: "academic",
        title: "Classroom",
        description: "Seamlessly map your Google Classroom courses to internal subjects. Access unit-wise resources, lecture notes, and recorded sessions directly from your dashboard.",
        icon: <Icons.FolderOpen size={24} />,
        color: "blue",
        features: ["GCR Sync", "Drive Resource Mapping", "Unit-wise Organization"],
        image: "media__1770733186911.png"
    },
    {
        id: "assignments",
        category: "academic",
        title: "Assignments",
        description: "A multi-question tracker with AI modal integration. Use Smart Paste to extract questions from unstructured text and auto-generate AI answers from context.",
        icon: <Icons.Questions size={24} />,
        color: "indigo",
        features: ["Smart Paste (OCR/AI)", "Multi-Question Flow", "Notebook Export (.ipynb)"],
        image: "media__1770830009148.png"
    },
    {
        id: "career",
        category: "academic",
        title: "Career Gateway",
        description: "Bridge the gap between academia and industry. Track applications, prep for interviews, and optimize your academic CV for real-world roles.",
        icon: <Icons.Briefcase size={24} />,
        color: "blue",
        features: ["Application Tracker", "CV Optimization", "Interview Prep"]
    },

    // --- Study Materials ---
    {
        id: "vault",
        category: "materials",
        title: "Knowledge Vault",
        description: "Your personal repository for course resources. Store PDFs, images, and links, and let AI index them for instant retrieval during study sessions.",
        icon: <Icons.Notes size={24} />,
        color: "emerald",
        features: ["Resource Storage", "AI Indexing", "Searchable Context"]
    },
    {
        id: "library",
        category: "materials",
        title: "Digital Library",
        description: "A vast collection of academic texts and reference materials. Browsable by subject, unit, or author for comprehensive research.",
        icon: <Icons.Database size={24} />,
        color: "emerald",
        features: ["Subject Catalog", "Quick Retrieval", "Integrated Viewer"]
    },
    {
        id: "papertrail",
        category: "materials",
        title: "PaperTrail PYQs",
        description: "Access a structured archive of Previous Year Questions. Predict trends and test your knowledge against actual exam patterns.",
        icon: <Icons.FileText size={24} />,
        color: "emerald",
        features: ["PYQ Archive", "Structural Analysis", "Exam Sim Prep"]
    },
    {
        id: "revision",
        category: "materials",
        title: "Revision Notes",
        description: "Produce comprehensive revision sheets for any unit. AI-generated notes are formatted with Mindmaps and flowcharts, ready for export to Word or HTML.",
        icon: <Icons.Notes size={24} />,
        color: "amber",
        features: ["AI Note Synthesis", "Progressive Generation", "Word/HTML Export"],
        image: "media__1770831852186.png"
    },

    // --- AI Tools ---
    {
        id: "ai-tutor",
        category: "ai",
        title: "LearnPilot AI",
        description: "The core intelligence engine. Upload resources or attach syllabus files to get context-aware, cited answers. Supports LaTeX, code rendering, and multimodal analysis.",
        icon: <Icons.Bot size={24} />,
        color: "emerald",
        features: ["Context-Aware Q&A", "Multimodal Analysis", "LaTeX & Code Support"],
        image: "media__1770831602998.png"
    },
    {
        id: "mindgrid",
        category: "ai",
        title: "MindGrid",
        description: "AI-powered layout and visual logic grid. Organize complex thoughts and academic concepts into structured, interactive mind maps.",
        icon: <Icons.LayoutGrid size={24} />,
        color: "emerald",
        features: ["Visual Hierarchy", "Concept Mapping", "AI Suggested nodes"]
    },
    {
        id: "prompts",
        category: "ai",
        title: "Prompt Lab",
        description: "Master the art of prompt engineering. Build, test, and save complex AI instructions using a library of academic templates.",
        icon: <Icons.Lightbulb size={24} />,
        color: "emerald",
        features: ["Template Library", "Drafting & Testing", "AI Enhancements"],
        image: "media__1770731002379.png"
    },

    // --- Personal Growth ---
    {
        id: "skillforge",
        category: "growth",
        title: "SkillForge",
        description: "Career-oriented learning paths. Track your progress across various domains and interface with AI mentors to bridge skill gaps.",
        icon: <Icons.Zap size={24} />,
        color: "purple",
        features: ["Personalized Tracks", "Career Gateway Sync", "AI Skill Mentorship"]
    },
    {
        id: "focus",
        category: "growth",
        title: "Focus Zone",
        description: "Maximize your productivity with deep-work timers, ambient sounds, and task prioritization tools designed to eliminate distractions.",
        icon: <Icons.Clock size={24} />,
        color: "purple",
        features: ["Deep Work Timers", "Ambient Sounds", "State Flow Tracker"]
    },

    // --- Community ---
    {
        id: "community",
        category: "community",
        title: "Community Forum",
        description: "Peer-to-peer knowledge sharing. Post doubts, share resources, and collaborate on projects with fellow students and faculty.",
        icon: <Icons.Users size={24} />,
        color: "rose",
        features: ["Public Doubts", "Resource Sharing", "Collaborative Q&A"]
    },
    {
        id: "faculty",
        category: "community",
        title: "The Faculty & Fellows",
        description: "Connect with educators and researchers. View profiles, academic backgrounds, and contact information for your department's members.",
        icon: <Icons.GraduationCap size={24} />,
        color: "rose",
        features: ["Member Directory", "Academic Profiles", "Office Hours"]
    },
    {
        id: "docs",
        category: "community",
        title: "Documentation",
        description: "This very guide! An exhaustive visual and technical manual for navigating and mastering the CurricuLab ecosystem.",
        icon: <Icons.BookOpen size={24} />,
        color: "rose",
        features: ["Visual Manual", "Technical Context", "Release Notes"]
    }
];

export default function DocumentationContent() {
    const [activeTab, setActiveTab] = useState<string>("academic");

    return (
        <WebAppShell>
            <div className="max-w-[1400px] mx-auto p-4 animate-in fade-in duration-700">
                {/* Standardized Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                            <Icons.BookOpen size={12} />
                            System Documentation
                        </div>
                        <h1 className="text-6xl font-black text-gray-900 tracking-tight leading-none">
                            Master <span className="text-indigo-600">CurricuLab</span>
                        </h1>
                        <p className="text-gray-400 font-medium max-w-2xl text-lg leading-relaxed">
                            A comprehensive guide to every module, tool, and feature within our multimodal AI ecosystem.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <div className="px-5 py-3 bg-gray-900 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest border border-gray-800 shadow-xl shadow-gray-200">
                            v1.2 Stable
                        </div>
                    </div>
                </div>

                {/* Category Navigation */}
                <div className="flex flex-wrap gap-4 mb-24 sticky top-0 z-20 bg-white/80 backdrop-blur-xl py-6 border-b border-gray-50">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id)}
                            className={cn(
                                "flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                activeTab === cat.id
                                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100 scale-105"
                                    : "bg-gray-50 text-gray-400 hover:bg-gray-100 border border-gray-100"
                            )}
                        >
                            {cat.icon}
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Module Exploration */}
                <div className="space-y-32 mb-40">
                    {MODULES.filter(m => m.category === activeTab).map((module, i) => (
                        <section key={module.id} className={cn(
                            "group grid lg:grid-cols-2 gap-16 items-center",
                            i % 2 === 1 ? "lg:flex-row-reverse" : ""
                        )}>
                            <div className={cn("space-y-8", i % 2 === 1 ? "lg:order-2" : "")}>
                                <div className={cn(
                                    "w-20 h-20 rounded-[2.5rem] flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 duration-500",
                                    module.color === 'blue' ? "bg-blue-50 text-blue-600 shadow-blue-100" :
                                        module.color === 'indigo' ? "bg-indigo-50 text-indigo-600 shadow-indigo-100" :
                                            module.color === 'emerald' ? "bg-emerald-50 text-emerald-600 shadow-emerald-100" :
                                                module.color === 'amber' ? "bg-amber-50 text-amber-600 shadow-amber-100" :
                                                    module.color === 'purple' ? "bg-purple-50 text-purple-600 shadow-purple-100" : "bg-rose-50 text-rose-600 shadow-rose-100"
                                )}>
                                    {module.icon}
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">{module.title}</h2>
                                    <p className="text-gray-500 text-lg font-medium leading-relaxed">
                                        {module.description}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {module.features.map(f => (
                                        <span key={f} className="px-4 py-2 bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-widest rounded-xl border border-gray-100">
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className={cn(
                                "relative rounded-[45px] overflow-hidden border border-gray-100 shadow-2xl transition-all duration-700 hover:shadow-indigo-200/50",
                                i % 2 === 1 ? "lg:order-1" : ""
                            )}>
                                {module.image ? (
                                    <div className="aspect-video bg-gray-50 relative">
                                        <img
                                            src={`/brain/b0283a3f-fc96-427b-b8ab-9ea546953941/${module.image}`}
                                            alt={module.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent pointer-events-none" />
                                        <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Preview</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="aspect-video bg-gray-50 flex flex-col items-center justify-center gap-6 group">
                                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-200 shadow-sm transition-transform group-hover:rotate-12 duration-500">
                                            <Icons.Camera size={32} />
                                        </div>
                                        <div className="text-center space-y-1">
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Visual Coming Soon</p>
                                            <p className="text-[10px] text-gray-300 font-medium">Capture in Settings &gt; Sync Visuals</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    ))}
                </div>

                {/* AI Methodology Details */}
                <div className="bg-gray-900 rounded-[60px] p-16 text-white mb-40 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none">
                        <Icons.Zap size={300} />
                    </div>
                    <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <h2 className="text-5xl font-black tracking-tight leading-tight">Multimodal AI Engineering</h2>
                                <p className="text-gray-400 text-lg font-medium">Our research methodology utilizes specialized protocols for context-aware academic synthesis.</p>
                            </div>

                            <div className="grid gap-6">
                                <div className="p-8 bg-white/5 border border-white/10 rounded-[35px] hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black">S</div>
                                        <h3 className="text-xl font-black">Syllabrix Protocol</h3>
                                    </div>
                                    <p className="text-sm text-gray-400 font-medium leading-relaxed">Maps unit-wise subtopics to official reference books using human-centric phrasing.</p>
                                </div>
                                <div className="p-8 bg-white/5 border border-white/10 rounded-[35px] hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black">N</div>
                                        <h3 className="text-xl font-black">NoteSmith Engine</h3>
                                    </div>
                                    <p className="text-sm text-gray-400 font-medium leading-relaxed">Generates exam-oriented structured materials including text-flowcharts and visual mental models.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-indigo-600/10 border border-indigo-500/20 p-12 rounded-[50px] backdrop-blur-2xl space-y-8 text-center text-white">
                            <div className="flex justify-center gap-1.5 mb-8">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="w-2 h-8 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                                ))}
                            </div>
                            <p className="text-[10px] uppercase font-black tracking-[0.4em] text-indigo-300">Neural Sync Processing...</p>
                            <p className="text-sm text-indigo-100 font-medium leading-relaxed italic max-w-sm mx-auto">
                                "Designing the future where academic mastery is augmented by contextually aware artificial intelligence."
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contributors List */}
                <section className="pt-32 border-t border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black text-gray-900 tracking-tight">The Collective Mind</h2>
                            <p className="text-gray-400 font-medium text-lg">Meet the brilliant minds responsible for building and maintaining CurricuLab.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                        {CONTRIBUTORS.map((c, i) => (
                            <div key={i} className="p-8 bg-white border border-gray-100 rounded-[35px] hover:border-indigo-200 hover:bg-indigo-50/20 transition-all group text-center shadow-sm">
                                <p className="text-lg font-black text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">{c.name}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{c.role}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="text-center py-40 select-none opacity-20">
                    <p className="text-md font-black uppercase tracking-[0.5em] text-gray-900 mb-4">CurricuLab Ecosystem</p>
                    <div className="flex justify-center gap-4">
                        <div className="px-3 py-1 bg-gray-100 rounded-full text-[8px] font-black uppercase tracking-widest text-gray-500">Multimodal</div>
                        <div className="px-3 py-1 bg-gray-100 rounded-full text-[8px] font-black uppercase tracking-widest text-gray-500">Autonomous</div>
                        <div className="px-3 py-1 bg-gray-100 rounded-full text-[8px] font-black uppercase tracking-widest text-gray-500">Security-First</div>
                    </div>
                </div>
            </div>
        </WebAppShell>
    );
}
