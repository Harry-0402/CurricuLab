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
    DialogFooter,
} from "@/components/shared/Dialog";

interface Person {
    id: number;
    name: string;
    status: string;
    email: string;
    specialization: string;
    gender: 'male' | 'female';
    contactNo: string;
    whatsappNo?: string;
}

const INITIAL_FACULTY: Person[] = [
    { id: 1, name: "Dr. Albus Dumbledore", status: "Head of Department", email: "headmaster@curriculab.edu", specialization: "Leadership & Strategy", gender: 'male', contactNo: "+1 (555) 010-1001" },
    { id: 2, name: "Prof. Minerva McGonagall", status: "Senior Teacher", email: "minerva@curriculab.edu", specialization: "Transfiguration & Logic", gender: 'female', contactNo: "+1 (555) 010-1002", whatsappNo: "+1 (555) 010-9999" },
    { id: 3, name: "Prof. Severus Snape", status: "Senior Teacher", email: "severus@curriculab.edu", specialization: "Chemistry & Potions", gender: 'male', contactNo: "+1 (555) 010-1003" },
    { id: 4, name: "Prof. Filius Flitwick", status: "Assistant Teacher", email: "filius@curriculab.edu", specialization: "Charms & Rhetoric", gender: 'male', contactNo: "+1 (555) 010-1004" },
    { id: 5, name: "Prof. Pomona Sprout", status: "Senior Teacher", email: "pomona@curriculab.edu", specialization: "Botany & Herbology", gender: 'female', contactNo: "+1 (555) 010-1005" },
    { id: 6, name: "Rubeus Hagrid", status: "Lab Instructor", email: "hagrid@curriculab.edu", specialization: "Zoology & Field Work", gender: 'male', contactNo: "+1 (555) 010-1006" }
];

const INITIAL_FELLOWS: Person[] = [
    { id: 7, name: "Harry Potter", status: "Senior Scholar", email: "harry.p@student.curriculab.edu", specialization: "Defense Against Dark Arts", gender: 'male', contactNo: "+1 (555) 020-2001" },
    { id: 8, name: "Hermione Granger", status: "Research Fellow", email: "hermione.g@student.curriculab.edu", specialization: "Arithmancy & Runes", gender: 'female', contactNo: "+1 (555) 020-2002" },
    { id: 9, name: "Ron Weasley", status: "Junior Scholar", email: "ron.w@student.curriculab.edu", specialization: "Strategic Chess", gender: 'male', contactNo: "+1 (555) 020-2003" },
    { id: 10, name: "Draco Malfoy", status: "Junior Scholar", email: "draco.m@student.curriculab.edu", specialization: "Potions & Alchemy", gender: 'male', contactNo: "+1 (555) 020-2004" },
    { id: 11, name: "Luna Lovegood", status: "Research Fellow", email: "luna.l@student.curriculab.edu", specialization: "Cryptozoology", gender: 'female', contactNo: "+1 (555) 020-2005" },
    { id: 12, name: "Cedric Diggory", status: "Senior Scholar", email: "cedric.d@student.curriculab.edu", specialization: "Sports Science", gender: 'male', contactNo: "+1 (555) 020-2006" }
];

export function FacultyFellowsContent() {
    const [activeTab, setActiveTab] = useState<'faculty' | 'fellows'>('faculty');
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const [faculty, setFaculty] = useState<Person[]>(INITIAL_FACULTY);
    const [fellows, setFellows] = useState<Person[]>(INITIAL_FELLOWS);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    // Form State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPerson, setEditingPerson] = useState<Person | null>(null);
    const [formData, setFormData] = useState<Partial<Person>>({});

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const handleDelete = (id: number) => {
        if (activeTab === 'faculty') {
            setFaculty(prev => prev.filter(p => p.id !== id));
        } else {
            setFellows(prev => prev.filter(p => p.id !== id));
        }
        setOpenMenuId(null);
    };

    const handleEdit = (person: Person) => {
        setEditingPerson(person);
        setFormData(person);
        setIsFormOpen(true);
        setOpenMenuId(null);
    };

    const handleAdd = () => {
        setEditingPerson(null);
        setFormData({
            gender: 'male' // Default
        });
        setIsFormOpen(true);
    };

    const handleSave = () => {
        if (!formData.name || !formData.status) {
            alert("Please fill in the required fields (Name, Status)");
            return;
        }

        const newPerson = {
            id: editingPerson ? editingPerson.id : Date.now(),
            name: formData.name,
            status: formData.status,
            email: formData.email,
            specialization: formData.specialization || (activeTab === 'faculty' ? "General" : "Undecided"),
            contactNo: formData.contactNo || "+1 (555) 000-0000",
            whatsappNo: formData.whatsappNo,
            gender: formData.gender || 'male',
        } as Person;

        if (activeTab === 'faculty') {
            if (editingPerson) {
                setFaculty(prev => prev.map(p => p.id === editingPerson.id ? newPerson : p));
            } else {
                setFaculty(prev => [...prev, newPerson]);
            }
        } else {
            if (editingPerson) {
                setFellows(prev => prev.map(p => p.id === editingPerson.id ? newPerson : p));
            } else {
                setFellows(prev => [...prev, newPerson]);
            }
        }

        setIsFormOpen(false);
        setEditingPerson(null);
        setFormData({});
    };

    const currentList = activeTab === 'faculty' ? faculty : fellows;

    // Close menu when clicking outside
    React.useEffect(() => {
        const handleClickOutside = () => setOpenMenuId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const AvatarImage = ({ gender, className }: { gender: 'male' | 'female', className?: string }) => (
        <div
            className={cn("bg-no-repeat bg-cover", className)}
            style={{
                backgroundImage: 'url(/assets/faculty-avatars.jpg)',
                backgroundSize: '200% 100%',
                backgroundPosition: gender === 'male' ? '0% 0%' : '100% 0%'
            }}
        />
    );

    return (
        <WebAppShell>
            <div className="space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">The Faculty & Fellows</h2>
                        <p className="text-gray-500 font-medium">Connect with the brilliant minds shaping our academic journey.</p>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all text-sm"
                    >
                        <Icons.Plus size={18} />
                        <span>Add Member</span>
                    </button>
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
                    {currentList.map((person) => (
                        <div
                            key={person.id}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPerson(person);
                            }}
                            className="bg-white p-8 rounded-[40px] border border-gray-100 hover:border-blue-200 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-300 cursor-pointer group flex flex-col items-center text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            {/* Menu Button */}
                            <div className="absolute top-4 right-4 z-20">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenuId(openMenuId === person.id ? null : person.id);
                                    }}
                                    className="p-2 text-gray-300 hover:text-blue-600 hover:bg-white rounded-xl transition-all active:scale-95"
                                >
                                    <Icons.MoreVertical size={20} />
                                </button>

                                {openMenuId === person.id && (
                                    <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in-95 origin-top-right overflow-hidden">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(person);
                                            }}
                                            className="w-full px-4 py-2.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-gray-50 text-gray-600 transition-colors"
                                        >
                                            <Icons.Edit size={14} />
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(person.id);
                                            }}
                                            className="w-full px-4 py-2.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-red-50 text-red-500 transition-colors"
                                        >
                                            <Icons.Trash2 size={14} />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="w-24 h-24 rounded-[2.5rem] bg-gray-50 border-2 border-white shadow-xl shadow-gray-100 p-1 mb-6 group-hover:scale-110 transition-transform duration-300 overflow-hidden relative z-10">
                                <AvatarImage gender={person.gender} className="w-full h-full rounded-[2.2rem]" />
                            </div>

                            <h3 className="text-lg font-black text-gray-900 leading-tight mb-1 relative z-10">{person.name}</h3>
                            <p className="text-sm font-bold text-blue-600 mb-2 relative z-10">{person.status}</p>
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
                                    <AvatarImage gender={selectedPerson.gender} className="w-full h-full rounded-[2.5rem]" />
                                </div>

                                <DialogHeader className="mb-8 w-full">
                                    <DialogTitle className="text-center text-2xl mb-1">{selectedPerson.name}</DialogTitle>
                                    <DialogDescription className="text-center text-blue-600 font-bold">{selectedPerson.status} • {selectedPerson.specialization}</DialogDescription>
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

                {/* Add/Edit Form Modal */}
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{editingPerson ? 'Edit Member' : 'Add New Member'}</DialogTitle>
                            <DialogDescription>
                                {editingPerson ? 'Update the details for this member.' : 'Add a new member to the list.'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Name</label>
                                <input
                                    className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g. Harry Potter"
                                    value={formData.name || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Status</label>
                                <input
                                    className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g. Senior Teacher, Assistant Teacher"
                                    value={formData.status || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Gender</label>
                                    <select
                                        className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={formData.gender || 'male'}
                                        onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' }))}
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Specialization</label>
                                    <input
                                        className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g. Physics"
                                        value={formData.specialization || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email</label>
                                    <input
                                        className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="email@example.com"
                                        value={formData.email || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Contact No</label>
                                    <input
                                        className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="+1 (555) 000-0000"
                                        value={formData.contactNo || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, contactNo: e.target.value }))}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">WhatsApp</label>
                                    <input
                                        className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Optional"
                                        value={formData.whatsappNo || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, whatsappNo: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <button
                                onClick={() => setIsFormOpen(false)}
                                className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
                            >
                                {editingPerson ? 'Save Changes' : 'Add Member'}
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </WebAppShell>
    );
}
