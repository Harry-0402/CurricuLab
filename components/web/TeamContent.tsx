"use client"

import { Icons } from '@/components/shared/Icons';
import Link from 'next/link';
import { WebAppShell } from '@/components/web/WebAppShell';
import { cn } from '@/lib/utils';

// --- STATIC DATA ---
const TEAMS = [
    {
        id: 1,
        title: "Project Coordinators",
        description: "Strategic planning and overall project management",
        lead: "Anushka & Shreyanshi",
        color: "blue",
        icon: <Icons.Users size={32} />,
        order: 1
    },
    {
        id: 2,
        title: "Technical Team",
        description: "Platform development and technical infrastructure",
        lead: "Harish & Kaif",
        color: "indigo",
        icon: <Icons.Code2 size={32} />,
        order: 2
    },
    {
        id: 3,
        title: "Data Acquisition Team",
        description: "Collecting and organizing study materials",
        lead: "Tanisha & Shubh",
        color: "orange",
        icon: <Icons.Database size={32} />,
        order: 3
    },
    {
        id: 4,
        title: "Social Media Team",
        description: "Marketing and community engagement",
        lead: "Diya & Tanishq",
        color: "pink",
        icon: <Icons.Share2 size={32} />,
        order: 4
    },
];

const TEAM_MEMBERS = [
    // Project Coordinators (Team 1)
    { id: 1, teamId: 1, name: "Anushka", role: "Co-Lead", subject: "Management" },
    { id: 2, teamId: 1, name: "Shreyanshi", role: "Co-Lead", subject: "General" },

    // Technical Team (Team 2)
    { id: 3, teamId: 2, name: "Harish", role: "Tech Lead", subject: "Development", driveLink: "https://github.com/Harry-0402" },
    { id: 4, teamId: 2, name: "Kaif", role: "Developer", subject: "Frontend" },

    // Data Acquisition (Team 3)
    { id: 5, teamId: 3, name: "Tanisha", role: "Data Lead", subject: "Research" },
    { id: 6, teamId: 3, name: "Shubh", role: "Data Specialist", subject: "Analysis" },

    // Social Media (Team 4)
    { id: 7, teamId: 4, name: "Diya", role: "Marketing Lead", subject: "Social" },
    { id: 8, teamId: 4, name: "Tanishq", role: "Community Manager", subject: "Engagement" }
];

const WORKFLOW_STEPS = [
    { id: 1, title: "Data Collection", description: "Gathering resources", icon: <Icons.Database size={24} /> },
    { id: 2, title: "Digitization", description: "Scanning & Formatting", icon: <Icons.FileText size={24} /> },
    { id: 3, title: "Review", description: "Quality Check", icon: <Icons.CheckCircle size={24} /> },
    { id: 4, title: "Publication", description: "Live on Platform", icon: <Icons.Upload size={24} /> },
];

export default function TeamContent() {
    return (
        <WebAppShell>
            <div className="space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">CurricuLab Team</h1>
                        <p className="text-xl font-bold text-gray-400 max-w-3xl">
                            Meet the talented individuals behind CurricuLab - MBA Semester 2 Content Platform
                        </p>
                    </div>
                </div>

                <div className="space-y-12">
                    {/* Project Goal */}
                    <section className="bg-white p-10 rounded-[35px] border border-gray-100 shadow-sm">
                        <h2 className="text-3xl font-black text-gray-900 mb-6">Project Goal</h2>
                        <p className="text-lg font-bold text-gray-500 leading-relaxed mb-4">
                            CurricuLab is a comprehensive website containing MBA Semester 2 resources.
                            Our main output includes exam-style questions with answers (unit-wise) and structured notes.
                        </p>
                    </section>

                    {/* Team Structure */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black text-gray-900">Team Structure</h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {TEAMS.map((team) => (
                                <div
                                    key={team.id}
                                    className={cn(
                                        "bg-white p-8 rounded-[35px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 relative group/card",
                                        team.title.includes("Acquisition") ? "lg:col-span-2" : ""
                                    )}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="text-gray-900">{team.icon}</div>
                                        <div className="flex-1">
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
                                    <div className={cn(
                                        "grid gap-4",
                                        team.title.includes("Acquisition") ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"
                                    )}>
                                        {TEAM_MEMBERS.filter(m => m.teamId === team.id).map((member) => (
                                            <div
                                                key={member.id}
                                                className={cn(
                                                    "p-5 rounded-2xl border relative group/member transition-all",
                                                    team.color === "blue" ? "bg-blue-50 border-blue-100" :
                                                        team.color === "green" ? "bg-green-50 border-green-100" :
                                                            "bg-yellow-50 border-yellow-100" // Default/Other colors
                                                )}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-black text-gray-900">{member.name}</span>
                                                    {member.role && (
                                                        <span className={cn(
                                                            "px-3 py-1 rounded-full text-xs font-black",
                                                            member.role.toLowerCase().includes("lead") ? "bg-blue-600 text-white" :
                                                                member.role.toLowerCase().includes("coordinator") ? "bg-yellow-400 text-yellow-900" :
                                                                    "bg-gray-200 text-gray-700"
                                                        )}>
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
                                                                Resources
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

                    {/* Workflow */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black text-gray-900">Project Workflow</h2>
                        <div className="grid gap-6">
                            {WORKFLOW_STEPS.map((step, idx) => (
                                <div
                                    key={step.id}
                                    className="bg-white p-8 rounded-[35px] border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="flex items-start gap-5">
                                        <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-black shrink-0">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="text-gray-900">{step.icon}</div>
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
                </div>
            </div>
        </WebAppShell>
    );
}
