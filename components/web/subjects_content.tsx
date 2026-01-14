"use client"

import React from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { SubjectCard } from '@/components/web/SubjectCard';
import { Subject } from '@/types';

export default function WebSubjectsContent() {
    // Static Data Revert (User Request)
    const SUBJECTS: Subject[] = [
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

    return (
        <WebAppShell>
            <div className="space-y-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h2>
                    <p className="text-gray-500">Manage your subjects and track your study progress.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {SUBJECTS.map((subject) => (
                        <SubjectCard key={subject.id} subject={subject} />
                    ))}
                </div>
            </div>
        </WebAppShell>
    );
}
