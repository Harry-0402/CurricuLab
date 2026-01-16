"use client"

import React, { useState, useEffect } from 'react';
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
import { FacultyService, Person, INITIAL_DATA } from '@/lib/data/faculty-service';

export function FacultyFellowsContent() {
    const [activeTab, setActiveTab] = useState<'faculty' | 'fellows'>('faculty');
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const [faculty, setFaculty] = useState<Person[]>([]);
    const [fellows, setFellows] = useState<Person[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    // Form State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPerson, setEditingPerson] = useState<Person | null>(null);
    const [memberType, setMemberType] = useState<'faculty' | 'fellows'>('faculty');
    const [formData, setFormData] = useState<Partial<Person>>({});

    // Fetch Data on Mount
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const allMembers = await FacultyService.getAll();
            setFaculty(allMembers.filter(p => p.category === 'faculty'));
            setFellows(allMembers.filter(p => p.category === 'fellows'));
        } catch (error) {
            console.error("Failed to fetch faculty:", error);
            alert("Failed to load data. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this member?")) return;

        try {
            await FacultyService.delete(id);
            if (activeTab === 'faculty') {
                setFaculty(prev => prev.filter(p => p.id !== id));
            } else {
                setFellows(prev => prev.filter(p => p.id !== id));
            }
            setOpenMenuId(null);
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete member.");
        }
    };

    const handleEdit = (person: Person) => {
        setEditingPerson(person);
        setMemberType(activeTab);
        setFormData(person);
        setIsFormOpen(true);
        setOpenMenuId(null);
    };

    const handleAdd = () => {
        setEditingPerson(null);
        setMemberType(activeTab);
        setFormData({
            gender: 'male' // Default
        });
        setIsFormOpen(true);
    };

    const handleSave = async () => {
        if (!formData.name) {
            alert("Please fill in the required field (Name)");
            return;
        }

        try {
            if (editingPerson) {
                // Update
                const updatedPerson = { ...editingPerson, ...formData } as Person;
                await FacultyService.update(updatedPerson);

                // Optimistic UI Update or Refetch (Refetch ensures consistency)
                await fetchData();
            } else {
                // Add
                const newPersonPayload = {
                    ...formData,
                    category: memberType,
                    contactNo: formData.contactNo || "+1 (555) 000-0000",
                    gender: formData.gender || 'male',
                } as any;

                await FacultyService.add(newPersonPayload);
                await fetchData();
                setActiveTab(memberType);
            }

            setIsFormOpen(false);
            setEditingPerson(null);
            setFormData({});
        } catch (error) {
            console.error("Save failed:", error);
            alert("Failed to save member. Please try again.");
        }
    };

    const handleSeedData = async () => {
        if (!confirm("This will add default mock data to the database. Continue?")) return;
        setIsLoading(true);
        try {
            for (const person of INITIAL_DATA) {
                await FacultyService.add(person);
            }
            await fetchData();
            alert("Data seeded successfully!");
        } catch (error) {
            console.error("Seeding failed:", error);
            alert("Failed to seed data. Check console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    const currentList = activeTab === 'faculty' ? faculty : fellows;

    // Close menu when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if ((e.target as Element).closest('.menu-container')) return;
            setOpenMenuId(null);
        };
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
                    <div className="flex gap-2">
                        {/* Seed Data Button (Dev helper, shows only if list is empty) */}
                        {faculty.length === 0 && fellows.length === 0 && !isLoading && (
                            <button
                                onClick={handleSeedData}
                                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all text-sm"
                            >
                                <Icons.Database size={18} />
                                <span>Seed Data</span>
                            </button>
                        )}

                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all text-sm"
                        >
                            <Icons.Plus size={18} />
                            <span>Add Member</span>
                        </button>
                    </div>
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

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    /* Content Grid */
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {currentList.length === 0 ? (
                            <div className="col-span-full py-12 text-center text-gray-400">
                                <p>No members found. Add a member or seed data to get started.</p>
                            </div>
                        ) : (
                            currentList.map((person) => (
                                <div
                                    key={person.id}
                                    className={cn(
                                        "bg-white p-8 rounded-[40px] border border-gray-100 hover:border-blue-200 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-300 group flex flex-col items-center text-center relative h-full",
                                        openMenuId === person.id ? "z-50" : "z-0"
                                    )}
                                >
                                    <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-t-[40px]" />

                                    {/* Menu Button */}
                                    <div className="absolute top-4 right-4 z-50">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setOpenMenuId(openMenuId === person.id ? null : person.id);
                                            }}
                                            className="menu-container p-2 text-gray-300 hover:text-blue-600 hover:bg-white rounded-xl transition-all active:scale-95 cursor-pointer relative z-50"
                                            title="More Options"
                                        >
                                            <Icons.MoreVertical size={20} />
                                        </button>

                                        {openMenuId === person.id && (
                                            <div className="menu-container absolute right-0 top-full mt-2 w-36 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 py-2 animate-in fade-in zoom-in-95 origin-top-right z-50 overflow-hidden">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit(person);
                                                    }}
                                                    className="w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-gray-50 text-gray-600 transition-colors"
                                                >
                                                    <Icons.Edit size={14} />
                                                    <span>Edit</span>
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(person.id);
                                                    }}
                                                    className="w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-red-50 text-red-500 transition-colors"
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
                                    {person.status && (
                                        <p className="text-sm font-bold text-blue-600 mb-2 relative z-10">{person.status}</p>
                                    )}
                                    {person.subject && (
                                        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest relative z-10 mb-4">{person.subject}</p>
                                    )}

                                    <button
                                        onClick={() => setSelectedPerson(person)}
                                        className="mt-auto px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest opacity-100 transition-all duration-300 transform translate-y-0 cursor-pointer w-full"
                                    >
                                        View Profile
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Detail Modal */}
                <Dialog open={!!selectedPerson} onOpenChange={(open) => !open && setSelectedPerson(null)}>
                    <DialogContent className="sm:max-w-lg max-w-[95vw] max-h-[85vh] overflow-y-auto border-0 bg-white/80 backdrop-blur-xl shadow-2xl">
                        {selectedPerson && (
                            <div className="flex flex-col items-center pt-4">
                                <div className="w-32 h-32 rounded-[3rem] bg-gray-50 border-4 border-white shadow-2xl shadow-blue-100 p-1.5 mb-6 overflow-hidden shrink-0">
                                    <AvatarImage gender={selectedPerson.gender} className="w-full h-full rounded-[2.5rem]" />
                                </div>

                                <DialogHeader className="mb-8 w-full">
                                    <DialogTitle className="text-center text-2xl mb-1">{selectedPerson.name}</DialogTitle>
                                    <DialogDescription asChild>
                                        <div className="text-center space-y-1">
                                            <div className="text-blue-600 font-bold">
                                                {selectedPerson.status && <span>{selectedPerson.status}</span>}
                                                {selectedPerson.status && selectedPerson.subject && <span> • </span>}
                                                {selectedPerson.subject && <span>{selectedPerson.subject}</span>}
                                            </div>
                                            {selectedPerson.prn && (
                                                <div className="text-xs font-mono font-bold text-gray-600 uppercase tracking-widest bg-gray-100 py-1.5 px-4 rounded-lg inline-block border border-gray-200">
                                                    PRN: {selectedPerson.prn}
                                                </div>
                                            )}
                                        </div>
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="w-full space-y-3">
                                    {/* Contact Number */}
                                    <div className="p-4 bg-white/60 hover:bg-blue-50 rounded-2xl flex items-center justify-between group transition-colors border border-gray-100 hover:border-blue-100">
                                        <div className="flex items-center gap-4 min-w-0 flex-1">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shadow-sm group-hover:bg-white group-hover:text-blue-500 transition-colors shrink-0">
                                                <Icons.Profile size={20} />
                                            </div>
                                            <div className="text-left min-w-0">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-blue-500 transition-colors">Contact</p>
                                                <p className="text-sm font-bold text-gray-900 truncate">{selectedPerson.contactNo}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(selectedPerson.contactNo)}
                                            className="p-2 text-gray-300 hover:text-blue-600 bg-transparent hover:bg-white rounded-xl transition-all shrink-0"
                                            title="Copy Contact Number"
                                        >
                                            <Icons.Copy size={16} />
                                        </button>
                                    </div>

                                    {/* WhatsApp (Only if different) */}
                                    {selectedPerson.whatsappNo && selectedPerson.whatsappNo !== selectedPerson.contactNo && (
                                        <div className="p-4 bg-white/60 hover:bg-green-50 rounded-2xl flex items-center justify-between group transition-colors border border-gray-100 hover:border-green-100">
                                            <div className="flex items-center gap-4 min-w-0 flex-1">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shadow-sm group-hover:bg-white group-hover:text-green-500 transition-colors shrink-0">
                                                    <Icons.CheckSquare size={20} />
                                                </div>
                                                <div className="text-left min-w-0">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-green-500 transition-colors">WhatsApp</p>
                                                    <p className="text-sm font-bold text-gray-900 truncate">{selectedPerson.whatsappNo}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(selectedPerson.whatsappNo!)}
                                                className="p-2 text-gray-300 hover:text-green-600 bg-transparent hover:bg-white rounded-xl transition-all shrink-0"
                                                title="Copy WhatsApp Number"
                                            >
                                                <Icons.Copy size={16} />
                                            </button>
                                        </div>
                                    )}

                                    {/* Email */}
                                    <div className="p-4 bg-white/60 hover:bg-indigo-50 rounded-2xl flex items-center justify-between group transition-colors border border-gray-100 hover:border-indigo-100">
                                        <div className="flex items-center gap-4 min-w-0 flex-1">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shadow-sm group-hover:bg-white group-hover:text-indigo-500 transition-colors shrink-0">
                                                <Icons.Notes size={20} />
                                            </div>
                                            <div className="text-left min-w-0">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-indigo-500 transition-colors">Email</p>
                                                <p className="text-sm font-bold text-gray-900 truncate">{selectedPerson.email}</p>
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
                            <DialogTitle>
                                {editingPerson
                                    ? `Edit ${memberType === 'faculty' ? 'Faculty Member' : 'Fellow/Scholar'}`
                                    : `Add New ${memberType === 'faculty' ? 'Faculty Member' : 'Fellow/Scholar'}`
                                }
                            </DialogTitle>
                            <DialogDescription>
                                {editingPerson
                                    ? 'Update the details for this member.'
                                    : `Add a new ${memberType === 'faculty' ? 'faculty member' : 'scholar'} to the list.`
                                }
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            {/* Category Selection for New Members */}
                            {!editingPerson && (
                                <div className="grid gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Category</label>
                                    <select
                                        className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={memberType}
                                        onChange={(e) => setMemberType(e.target.value as 'faculty' | 'fellows')}
                                    >
                                        <option value="faculty">Faculty Member</option>
                                        <option value="fellows">Fellow & Scholar</option>
                                    </select>
                                </div>
                            )}

                            <div className="grid gap-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Name</label>
                                <input
                                    className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g. Harry Potter"
                                    value={formData.name || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </div>

                            {/* PRN Field */}
                            <div className="grid gap-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">PRN / ID No.</label>
                                <input
                                    className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                                    placeholder="e.g. 25010..."
                                    value={formData.prn || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, prn: e.target.value }))}
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Status (Optional)</label>
                                <input
                                    className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={memberType === 'faculty' ? "e.g. Senior Teacher, Assistant Teacher, HOD" : "e.g. Senior Scholar, Research Fellow, Student"}
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
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
                                        {memberType === 'faculty' ? 'Subject (Optional)' : 'Focus Area (Optional)'}
                                    </label>
                                    <input
                                        className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder={memberType === 'faculty' ? "e.g. Mathematics" : "e.g. Computer Science"}
                                        value={formData.subject || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
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
