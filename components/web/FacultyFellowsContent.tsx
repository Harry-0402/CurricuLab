"use client"

import React, { useState } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/shared/Dialog";

interface Person {
    id: number;
    name: string;
    role: string;
    email: string;
    specialization: string;
    image: string;
    contactNo: string;
    whatsappNo?: string;
}

export function FacultyFellowsContent() {
    const [activeTab, setActiveTab] = useState<'faculty' | 'fellows'>('faculty');
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

    const faculty: Person[] = [
        { id: 1, name: "Dr. Albus Dumbledore", role: "Dean of Studies", email: "headmaster@curriculab.edu", specialization: "Leadership & Strategy", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Albus", contactNo: "+1 (555) 010-1001" },
        { id: 2, name: "Prof. Minerva McGonagall", role: "Professor", email: "minerva@curriculab.edu", specialization: "Transfiguration & Logic", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Minerva", contactNo: "+1 (555) 010-1002", whatsappNo: "+1 (555) 010-9999" },
        { id: 3, name: "Prof. Severus Snape", role: "Associate Professor", email: "severus@curriculab.edu", specialization: "Chemistry & Potions", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Severus", contactNo: "+1 (555) 010-1003" },
        { id: 4, name: "Prof. Filius Flitwick", role: "Lecturer", email: "filius@curriculab.edu", specialization: "Charms & Rhetoric", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Filius", contactNo: "+1 (555) 010-1004" },
        { id: 5, name: "Prof. Pomona Sprout", role: "Professor", email: "pomona@curriculab.edu", specialization: "Botany & Herbology", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pomona", contactNo: "+1 (555) 010-1005" },
        { id: 6, name: "Rubeus Hagrid", role: "Practical Instructor", email: "hagrid@curriculab.edu", specialization: "Zoology & Field Work", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hagrid", contactNo: "+1 (555) 010-1006" }
    ];

    const fellows: Person[] = [
        { id: 7, name: "Harry Potter", role: "Student", email: "harry.p@student.curriculab.edu", specialization: "Defense Against Dark Arts", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Harry", contactNo: "+1 (555) 020-2001" },
        { id: 8, name: "Hermione Granger", role: "Student", email: "hermione.g@student.curriculab.edu", specialization: "Arithmancy & Runes", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hermione", contactNo: "+1 (555) 020-2002" },
        { id: 9, name: "Ron Weasley", role: "Student", email: "ron.w@student.curriculab.edu", specialization: "Strategic Chess", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ron", contactNo: "+1 (555) 020-2003" },
        { id: 10, name: "Draco Malfoy", role: "Student", email: "draco.m@student.curriculab.edu", specialization: "Potions & Alchemy", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Draco", contactNo: "+1 (555) 020-2004" },
        { id: 11, name: "Luna Lovegood", role: "Student", email: "luna.l@student.curriculab.edu", specialization: "Cryptozoology", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna", contactNo: "+1 (555) 020-2005" },
        { id: 12, name: "Cedric Diggory", role: "Student", email: "cedric.d@student.curriculab.edu", specialization: "Sports Science", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cedric", contactNo: "+1 (555) 020-2006" }
    ];

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add a toast notification here
    };

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
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {(activeTab === 'faculty' ? faculty : fellows).map((person) => (
                        <div
                            key={person.id}
                            onClick={() => setSelectedPerson(person)}
                            className="bg-white p-8 rounded-[40px] border border-gray-100 hover:border-blue-200 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-300 cursor-pointer group flex flex-col items-center text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            <div className="w-24 h-24 rounded-[2.5rem] bg-gray-50 border-2 border-white shadow-xl shadow-gray-100 p-1 mb-6 group-hover:scale-110 transition-transform duration-300 overflow-hidden relative z-10">
                                <img src={person.image} alt={person.name} className="w-full h-full rounded-[2.2rem] object-cover" />
                            </div>

                            <h3 className="text-lg font-black text-gray-900 leading-tight mb-1 relative z-10">{person.name}</h3>
                            <p className="text-sm font-bold text-blue-600 mb-2 relative z-10">{person.role}</p>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest relative z-10">{person.specialization}</p>

                            <button className="mt-6 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                View Profile
                            </button>
                        </div>
                    ))}
                </div>

                {/* Detail Modal */}
                <Dialog open={!!selectedPerson} onOpenChange={(open) => !open && setSelectedPerson(null)}>
                    <DialogContent className="sm:max-w-md border-0 bg-white/80 backdrop-blur-xl shadow-2xl">
                        {selectedPerson && (
                            <div className="flex flex-col items-center pt-4">
                                <div className="w-32 h-32 rounded-[3rem] bg-gray-50 border-4 border-white shadow-2xl shadow-blue-100 p-1.5 mb-6 overflow-hidden">
                                    <img src={selectedPerson.image} alt={selectedPerson.name} className="w-full h-full rounded-[2.5rem] object-cover" />
                                </div>

                                <DialogHeader className="mb-8 w-full">
                                    <DialogTitle className="text-center text-2xl mb-1">{selectedPerson.name}</DialogTitle>
                                    <DialogDescription className="text-center text-blue-600 font-bold">{selectedPerson.role} • {selectedPerson.specialization}</DialogDescription>
                                </DialogHeader>

                                <div className="w-full space-y-3">
                                    {/* Contact Number */}
                                    <div className="p-4 bg-white/60 hover:bg-blue-50 rounded-2xl flex items-center justify-between group transition-colors border border-gray-100 hover:border-blue-100">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shadow-sm group-hover:bg-white group-hover:text-blue-500 transition-colors">
                                                <Icons.Profile size={20} />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-blue-400 transition-colors">Contact</p>
                                                <p className="text-sm font-bold text-gray-900">{selectedPerson.contactNo}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(selectedPerson.contactNo)}
                                            className="p-2 text-gray-300 hover:text-blue-600 bg-transparent hover:bg-white rounded-xl transition-all"
                                            title="Copy Contact Number"
                                        >
                                            <Icons.Copy size={16} />
                                        </button>
                                    </div>

                                    {/* WhatsApp (Only if different) */}
                                    {selectedPerson.whatsappNo && selectedPerson.whatsappNo !== selectedPerson.contactNo && (
                                        <div className="p-4 bg-white/60 hover:bg-green-50 rounded-2xl flex items-center justify-between group transition-colors border border-gray-100 hover:border-green-100">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shadow-sm group-hover:bg-white group-hover:text-green-500 transition-colors">
                                                    <Icons.CheckSquare size={20} />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-green-400 transition-colors">WhatsApp</p>
                                                    <p className="text-sm font-bold text-gray-900">{selectedPerson.whatsappNo}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(selectedPerson.whatsappNo!)}
                                                className="p-2 text-gray-300 hover:text-green-600 bg-transparent hover:bg-white rounded-xl transition-all"
                                                title="Copy WhatsApp Number"
                                            >
                                                <Icons.Copy size={16} />
                                            </button>
                                        </div>
                                    )}

                                    {/* Email */}
                                    <div className="p-4 bg-white/60 hover:bg-indigo-50 rounded-2xl flex items-center justify-between group transition-colors border border-gray-100 hover:border-indigo-100">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shadow-sm group-hover:bg-white group-hover:text-indigo-500 transition-colors">
                                                <Icons.Notes size={20} />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-indigo-400 transition-colors">Email</p>
                                                <p className="text-sm font-bold text-gray-900">{selectedPerson.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(selectedPerson.email)}
                                            className="p-2 text-gray-300 hover:text-indigo-600 bg-transparent hover:bg-white rounded-xl transition-all"
                                            title="Copy Email"
                                        >
                                            <Icons.Copy size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </WebAppShell>
    );
}
