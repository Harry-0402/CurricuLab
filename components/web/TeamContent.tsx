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

export default function TeamContent() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">CurricuLab Team</h1>
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
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">

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

                {/* Footer Note */}
                <section className="bg-gray-900 p-10 rounded-[35px] text-center">
                    <p className="text-lg font-bold text-gray-300">
                        Working together to create the best MBA Semester 2 resource platform
                    </p>
                    <p className="text-sm font-bold text-gray-500 mt-3">
                        CurricuLab • MBA Business Analytics • Semester 2
                    </p>
                </section>
            </div>
        </div>
    );
}
