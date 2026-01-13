"use client"

import React, { useState } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';

export function FacultyFellowsContent() {
    const [activeTab, setActiveTab] = useState<'faculty' | 'fellows'>('faculty');

    const faculty = [
        { id: 1, name: "Dr. Albus Dumbledore", role: "Dean of Studies", email: "headmaster@curriculab.edu", specialization: "Leadership & Strategy", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Albus" },
        { id: 2, name: "Prof. Minerva McGonagall", role: "Professor", email: "minerva@curriculab.edu", specialization: "Transfiguration & Logic", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Minerva" },
        { id: 3, name: "Prof. Severus Snape", role: "Associate Professor", email: "severus@curriculab.edu", specialization: "Chemistry & Potions", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Severus" },
        { id: 4, name: "Prof. Filius Flitwick", role: "Lecturer", email: "filius@curriculab.edu", specialization: "Charms & Rhetoric", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Filius" },
        { id: 5, name: "Prof. Pomona Sprout", role: "Professor", email: "pomona@curriculab.edu", specialization: "Botany & Herbology", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pomona" },
        { id: 6, name: "Rubeus Hagrid", role: "Practical Instructor", email: "hagrid@curriculab.edu", specialization: "Zoology & Field Work", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hagrid" }
    ];

    const fellows = [
        { id: 7, name: "Harry Potter", role: "Student", email: "harry.p@student.curriculab.edu", major: "Defense Against Dark Arts", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Harry" },
        { id: 8, name: "Hermione Granger", role: "Student", email: "hermione.g@student.curriculab.edu", major: "Arithmancy & Runes", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hermione" },
        { id: 9, name: "Ron Weasley", role: "Student", email: "ron.w@student.curriculab.edu", major: "Strategic Chess", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ron" },
        { id: 10, name: "Draco Malfoy", role: "Student", email: "draco.m@student.curriculab.edu", major: "Potions & Alchemy", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Draco" },
        { id: 11, name: "Luna Lovegood", role: "Student", email: "luna.l@student.curriculab.edu", major: "Cryptozoology", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna" },
        { id: 12, name: "Cedric Diggory", role: "Student", email: "cedric.d@student.curriculab.edu", major: "Sports Science", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cedric" }
    ];

    return (
        <WebAppShell>
            <div className="space-y-8">
                {/* Header Section */}
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">The Faculty & Fellows</h2>
                    <p className="text-gray-500 font-medium">Connect with the brilliant minds shaping our academic journey.</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-100/50 p-1.5 rounded-2xl w-fit border border-gray-100">
                    <button
                        onClick={() => setActiveTab('faculty')}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-sm font-black transition-all",
                            activeTab === 'faculty'
                                ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                                : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
                        )}
                    >
                        Faculty Members
                    </button>
                    <button
                        onClick={() => setActiveTab('fellows')}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-sm font-black transition-all",
                            activeTab === 'fellows'
                                ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                                : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
                        )}
                    >
                        Fellows & Scholars
                    </button>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(activeTab === 'faculty' ? faculty : fellows).map((person) => (
                        <div key={person.id} className="group bg-white p-6 rounded-[32px] border border-gray-100 hover:border-blue-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                                <button className="p-2 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                                    <Icons.MoreVertical size={20} />
                                </button>
                            </div>

                            <div className="flex items-start gap-5">
                                <div className="w-20 h-20 rounded-[2rem] bg-gray-50 border border-gray-100 p-1 shrink-0 group-hover:scale-105 transition-transform duration-300">
                                    <img src={person.image} alt={person.name} className="w-full h-full rounded-[1.8rem] object-cover" />
                                </div>
                                <div className="flex-1 min-w-0 pt-1">
                                    <h3 className="text-lg font-black text-gray-900 leading-tight mb-1 truncate">{person.name}</h3>
                                    <p className="text-sm font-bold text-blue-600 mb-3">{person.role}</p>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Icons.Profile size={14} className="shrink-0" />
                                            <span className="truncate">{activeTab === 'faculty' ? (person as any).specialization : (person as any).major}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Icons.Notes size={14} className="shrink-0" />
                                            <span className="truncate">{person.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-5 border-t border-gray-50 flex items-center justify-between">
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Active Now</span>
                                <div className="flex gap-2">
                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                                        <Icons.Notes size={16} />
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                                        <Icons.Profile size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </WebAppShell>
    );
}
