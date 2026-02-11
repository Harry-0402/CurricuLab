"use client"

import React from 'react';
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

export default function DocumentationContent() {
    return (
        <WebAppShell>
            <div className="max-w-[1400px] mx-auto p-4 animate-in fade-in duration-500">
                {/* Standardized Header */}
                <div className="flex items-center justify-between mb-12">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 mb-2">
                            <Icons.BookOpen size={12} />
                            System Documentation
                        </div>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tight">
                            Documentation
                        </h1>
                        <p className="text-gray-400 font-medium max-w-xl">
                            Your comprehensive guide to navigating the CurricuLab ecosystem and leveraging AI research tools.
                        </p>
                    </div>

                    <div className="hidden md:flex gap-3">
                        <div className="px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest border border-gray-100">
                            v1.2 Beta
                        </div>
                    </div>
                </div>

                {/* Core Modules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                    {[
                        {
                            title: "Academic Suite",
                            desc: "Centralized hub for Classroom access, Assignment tracking, and Grade monitoring.",
                            icon: <Icons.GraduationCap size={24} />,
                            color: "blue"
                        },
                        {
                            title: "Study Vault",
                            desc: "Deep-indexed repository for Syllabi, Reference Books, and Revision Notes.",
                            icon: <Icons.Library size={24} />,
                            color: "purple"
                        },
                        {
                            title: "MindGrid AI",
                            desc: "How to deploy and interface with specialized AI agents for research and coding.",
                            icon: <Icons.Zap size={24} />,
                            color: "emerald"
                        }
                    ].map((module, i) => (
                        <div key={i} className="group p-8 bg-white border border-gray-100 rounded-[40px] hover:shadow-2xl hover:shadow-indigo-100 transition-all hover:-translate-y-2">
                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
                                module.color === 'blue' ? "bg-blue-50 text-blue-600" :
                                    module.color === 'purple' ? "bg-purple-50 text-purple-600" : "bg-emerald-50 text-emerald-600"
                            )}>
                                {module.icon}
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">{module.title}</h3>
                            <p className="text-sm font-medium text-gray-400 leading-relaxed">{module.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Detailed Sections */}
                <div className="space-y-24 pb-20">

                    {/* Feature Ecosystem Deep Dive */}
                    <section className="space-y-16">
                        <div className="grid md:grid-cols-2 gap-12">
                            {/* Academic Suite Detail */}
                            <div className="space-y-6">
                                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                    <Icons.GraduationCap size={24} className="text-blue-600" />
                                    Academic Suite
                                </h3>
                                <div className="space-y-4">
                                    <div className="p-5 bg-white border border-gray-100 rounded-3xl">
                                        <h4 className="font-bold text-gray-900 mb-1 text-sm">Classroom Integration</h4>
                                        <p className="text-[11px] text-gray-400 font-medium">Linked directly to Google Drive repositories, providing unit-wise lecture recordings and handouts.</p>
                                    </div>
                                    <div className="p-5 bg-white border border-gray-100 rounded-3xl">
                                        <h4 className="font-bold text-gray-900 mb-1 text-sm">Career Gateway</h4>
                                        <p className="text-[11px] text-gray-400 font-medium">Smart job search and resume tracking hub for official university placements and internships.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Study Materials Detail */}
                            <div className="space-y-6">
                                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                    <Icons.Library size={24} className="text-purple-600" />
                                    Study Materials
                                </h3>
                                <div className="space-y-4">
                                    <div className="p-5 bg-white border border-gray-100 rounded-3xl">
                                        <h4 className="font-bold text-gray-900 mb-1 text-sm">Knowledge Vault & PYQs</h4>
                                        <p className="text-[11px] text-gray-400 font-medium">Access over 500+ scanned previous year papers and unit-specific research notes.</p>
                                    </div>
                                    <div className="p-5 bg-white border border-gray-100 rounded-3xl">
                                        <h4 className="font-bold text-gray-900 mb-1 text-sm">MarkWise Analytics</h4>
                                        <p className="text-[11px] text-gray-400 font-medium">Visualization engine for internal assessments, attendance, and exam performance tracking.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Intelligence Guide */}
                        <div className="bg-gray-900 p-12 rounded-[50px] text-white overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                <Icons.Zap size={200} />
                            </div>
                            <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                                <div className="space-y-8">
                                    <h2 className="text-4xl font-black tracking-tight flex items-center gap-4">
                                        <div className="p-3 bg-indigo-600 rounded-2xl text-white">
                                            <Icons.Bot size={24} />
                                        </div>
                                        AI Intelligence
                                    </h2>
                                    <div className="space-y-6">
                                        <div className="flex gap-4 p-4 rounded-3xl hover:bg-white/5 transition-colors">
                                            <div className="text-indigo-400 font-extrabold text-xl">01</div>
                                            <div>
                                                <h4 className="font-black text-xl mb-1">LearnPilot AI</h4>
                                                <p className="text-gray-400 text-sm leading-relaxed">Context-aware tutor that processes textbooks to provide cited, hallucination-free answers.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 p-4 rounded-3xl hover:bg-white/5 transition-colors">
                                            <div className="text-indigo-400 font-extrabold text-xl">02</div>
                                            <div>
                                                <h4 className="font-black text-xl mb-1">MindGrid AI Workspace</h4>
                                                <p className="text-gray-400 text-sm leading-relaxed">Multi-agent interface for specialized research units and custom automation agents.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-xl">
                                    <div className="space-y-6 text-center">
                                        <div className="flex justify-center gap-1">
                                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1.5 h-6 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />)}
                                        </div>
                                        <p className="text-[10px] uppercase font-black tracking-[0.3em] text-indigo-300">Neural Sync Processing...</p>
                                        <p className="text-xs text-gray-400 font-medium leading-relaxed italic">
                                            "The future of academic research is mediated by context-aware intelligence."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Attendance & Biometrics */}
                        <div className="bg-white p-12 rounded-[50px] border border-gray-100 overflow-hidden relative">
                            <div className="grid lg:grid-cols-2 gap-16 items-center">
                                <div className="space-y-8">
                                    <h2 className="text-4xl font-black tracking-tight flex items-center gap-4 text-gray-900">
                                        <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
                                            <Icons.Calendar size={24} />
                                        </div>
                                        Attendance & Face ID
                                    </h2>
                                    <div className="space-y-6">
                                        <div className="flex gap-4 p-5 rounded-3xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                            <div className="text-blue-600 font-extrabold text-xl">01</div>
                                            <div>
                                                <h4 className="font-black text-xl mb-1 text-gray-900">Smart Enrollment</h4>
                                                <p className="text-gray-400 text-sm leading-relaxed">Enroll your biometric data via Profile settings. Our AI automatically handles the capture and verification flow.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 p-5 rounded-3xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                            <div className="text-blue-600 font-extrabold text-xl">02</div>
                                            <div>
                                                <h4 className="font-black text-xl mb-1 text-gray-900">Zero-Click Verification</h4>
                                                <p className="text-gray-400 text-sm leading-relaxed">Mark your daily attendance instantly by looking at the camera. Audio confirmation ensures verification is logged.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 border border-gray-100 p-10 rounded-[40px] relative overflow-hidden">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                            <div className="w-8 h-8 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                                                <Icons.Check size={16} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Face Verified</p>
                                                <p className="text-[9px] font-medium text-gray-400">Attendance Marked Successfully</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm opacity-60">
                                            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                                <Icons.Camera size={16} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Searching Face...</p>
                                                <p className="text-[9px] font-medium text-gray-400">Scan initiated</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* AI Methodology */}
                    <section className="space-y-12">
                        <div className="text-center max-w-2xl mx-auto space-y-4">
                            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Research Methodology</h2>
                            <p className="text-gray-400 font-medium">Internal protocols used by our researchers to ensure high-fidelity academic content generation.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-blue-50/50 p-10 rounded-[40px] border border-blue-100 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-blue-200">S</div>
                                    <h3 className="text-2xl font-black text-gray-900">Syllabrix Protocol</h3>
                                </div>
                                <p className="text-sm font-medium text-gray-500 leading-relaxed">
                                    Our primary Q&A engine designed to map unit-wise subtopics to official reference books using simple, human-centric explanations.
                                </p>
                                <div className="bg-white p-6 rounded-3xl border border-blue-100 overflow-hidden">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Active Prompt</span>
                                        <div className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black">STABLE</div>
                                    </div>
                                    <p className="font-mono text-[11px] text-gray-300 line-clamp-3 italic">
                                        "Source of Truth: Use only the specified Reference Books... output in a human coffee-shop style..."
                                    </p>
                                </div>
                            </div>

                            <div className="bg-purple-50/50 p-10 rounded-[40px] border border-purple-100 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-purple-600 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-purple-200">N</div>
                                    <h3 className="text-2xl font-black text-gray-900">NoteSmith Engine</h3>
                                </div>
                                <p className="text-sm font-medium text-gray-500 leading-relaxed">
                                    A structured engine for generating exam-oriented notes, case studies, and visual text-flowcharts for complex models.
                                </p>
                                <div className="bg-white p-6 rounded-3xl border border-purple-100 overflow-hidden">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Active Prompt</span>
                                        <div className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded text-[9px] font-black">STABLE</div>
                                    </div>
                                    <p className="font-mono text-[11px] text-gray-300 line-clamp-3 italic">
                                        "Format: Use Markdown headers and include text-based flowcharts (A - B - C) where logical..."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Contributors */}
                    <section className="pt-20 border-t border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                            <div className="space-y-4">
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Project Contributors</h2>
                                <p className="text-gray-400 font-medium">The collective intelligence behind CurricuLab.</p>
                            </div>
                            <div className="hidden lg:flex gap-2">
                                <div className="px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest border border-gray-100">
                                    v1.2 Beta
                                </div>
                                <div className="px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest border border-gray-100">
                                    2026 Edition
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {CONTRIBUTORS.map((c, i) => (
                                <div key={i} className="p-6 bg-white border border-gray-50 rounded-3xl hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group text-center">
                                    <p className="font-black text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">{c.name}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{c.role}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Footer Quote */}
                <div className="text-center py-20 opacity-30 select-none">
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-gray-900">CurricuLab Architecture</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Designing the future of Academic Mastery</p>
                </div>
            </div>
        </WebAppShell>
    );
}
