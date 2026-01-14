"use client"

import { useState, useEffect } from 'react';
import { Icons } from '@/components/shared/Icons';
import Link from 'next/link';
import { WebAppShell } from '@/components/web/WebAppShell';
import { TeamService, Team, TeamMember, WorkflowStep } from '@/lib/services/team.service';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/shared/Dialog";
import { cn } from '@/lib/utils';
import { AuthService } from '@/lib/services/auth.service';
import { User } from '@supabase/supabase-js';

export default function TeamContent() {
    // Data State
    const [teams, setTeams] = useState<Team[]>([]);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Edit State
    const [isMemberFormOpen, setIsMemberFormOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [memberFormData, setMemberFormData] = useState<Partial<TeamMember>>({});
    const [targetTeamId, setTargetTeamId] = useState<string | null>(null); // For adding new member

    // Fetch Data
    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [tData, mData, wData] = await Promise.all([
                TeamService.getTeams(),
                TeamService.getMembers(),
                TeamService.getWorkflow()
            ]);

            // Auto-seed if empty (Dev Helper)
            if (tData.length === 0) {
                console.log("Empty database detected. Seeding...");
                await TeamService.seed();
                return fetchData(); // Retry
            }

            setTeams(tData);
            setTeamMembers(mData);
            setWorkflowSteps(wData);
        } catch (err: any) {
            console.error("Failed to load team data:", err);
            setError(err.message || "Failed to load data. Please ensure your database is set up.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        AuthService.getCurrentUser().then(setUser);
        const { unsubscribe } = AuthService.onAuthStateChange(setUser);
        return () => unsubscribe();
    }, []);

    // Handlers
    const handleAddMember = (teamId: string) => {
        setEditingMember(null);
        setTargetTeamId(teamId);
        setMemberFormData({ teamId });
        setIsMemberFormOpen(true);
    };

    const handleEditMember = (member: TeamMember) => {
        setEditingMember(member);
        setMemberFormData(member);
        setIsMemberFormOpen(true);
    };

    const handleDeleteMember = async (id: string) => {
        if (!confirm("Remove this team member?")) return;
        try {
            await TeamService.deleteMember(id);
            setTeamMembers(prev => prev.filter(m => m.id !== id));
        } catch (error) {
            alert("Failed to delete member.");
        }
    };

    const handleSaveMember = async () => {
        if (!memberFormData.name || !memberFormData.teamId) {
            alert("Name is required!");
            return;
        }

        try {
            if (editingMember) {
                // Update
                const updated = await TeamService.updateMember(editingMember.id, memberFormData);
                setTeamMembers(prev => prev.map(m => m.id === updated.id ? updated : m));
            } else {
                // Create
                const created = await TeamService.addMember(memberFormData as any);
                setTeamMembers(prev => [...prev, created]);
            }
            setIsMemberFormOpen(false);
            setEditingMember(null);
            setMemberFormData({});
        } catch (error) {
            console.error("Save failed:", error);
            alert("Failed to save. Check console.");
        }
    };

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

                {error ? (
                    <div className="bg-red-50 border border-red-200 rounded-[35px] p-12 text-center">
                        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Icons.Info size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">Connection Issue</h3>
                        <p className="text-gray-600 font-medium mb-6 max-w-lg mx-auto">
                            {error}
                        </p>
                        <div className="text-sm bg-white p-4 rounded-xl border border-red-100 inline-block text-left text-gray-500 font-mono">
                            <p className="font-bold text-red-500 mb-2">Troubleshooting:</p>
                            1. Did you run the SQL migration?<br />
                            2. Check your internet connection.<br />
                            3. Verify Supabase tables exist.
                        </div>
                    </div>
                ) : isLoading ? (
                    <div className="h-64 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
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
                                {teams.map((team) => (
                                    <div
                                        key={team.id}
                                        className={cn(
                                            "bg-white p-8 rounded-[35px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 relative group/card",
                                            team.title.includes("Acquisition") ? "lg:col-span-2" : ""
                                        )}
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-3xl">{team.icon}</span>
                                            <div className="flex-1 flex flex-wrap items-center justify-between gap-3">
                                                <h3 className="text-2xl font-black text-gray-900">
                                                    {team.title}
                                                    {team.lead && (
                                                        <span className="text-base font-bold text-blue-600 ml-3">
                                                            (Lead: {team.lead})
                                                        </span>
                                                    )}
                                                </h3>

                                                {/* Add Member Button - Auth Only */}
                                                {user && (
                                                    <button
                                                        onClick={() => handleAddMember(team.id)}
                                                        className="opacity-0 group-hover/card:opacity-100 transition-opacity p-2 bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl"
                                                        title="Add Member"
                                                    >
                                                        <Icons.Plus size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <p className="text-sm font-bold text-gray-400 mb-6">{team.description}</p>

                                        {/* Team Members */}
                                        <div className={cn(
                                            "grid gap-4",
                                            team.title.includes("Acquisition") ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"
                                        )}>
                                            {teamMembers.filter(m => m.teamId === team.id).map((member) => (
                                                <div
                                                    key={member.id}
                                                    className={cn(
                                                        "p-5 rounded-2xl border relative group/member transition-all",
                                                        team.color === "blue" ? "bg-blue-50 border-blue-100" :
                                                            team.color === "green" ? "bg-green-50 border-green-100" :
                                                                "bg-yellow-50 border-yellow-100"
                                                    )}
                                                >
                                                    {/* Edit/Delete Actions - Auth Only */}
                                                    {user && (
                                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/member:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => handleEditMember(member)}
                                                                className="p-1.5 bg-white/80 rounded-lg hover:text-blue-600 hover:scale-110 transition-all"
                                                            >
                                                                <Icons.Edit size={12} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteMember(member.id)}
                                                                className="p-1.5 bg-white/80 rounded-lg hover:text-red-600 hover:scale-110 transition-all"
                                                            >
                                                                <Icons.Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    )}

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
                                {workflowSteps.map((step, idx) => (
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
                    </div>
                )}

                {/* Edit Form Modal */}
                <Dialog open={isMemberFormOpen} onOpenChange={setIsMemberFormOpen}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{editingMember ? 'Edit Member' : 'Add New Member'}</DialogTitle>
                            <DialogDescription>
                                {editingMember ? 'Make changes to team member details.' : 'Add a new person to this team.'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Name</label>
                                <input
                                    className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={memberFormData.name || ''}
                                    onChange={(e) => setMemberFormData({ ...memberFormData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Role</label>
                                <input
                                    className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={memberFormData.role || ''}
                                    onChange={(e) => setMemberFormData({ ...memberFormData, role: e.target.value })}
                                    placeholder="e.g. Lead, Developer"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Subject (Optional)</label>
                                <input
                                    className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={memberFormData.subject || ''}
                                    onChange={(e) => setMemberFormData({ ...memberFormData, subject: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Drive Link (Optional)</label>
                                <input
                                    className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={memberFormData.driveLink || ''}
                                    onChange={(e) => setMemberFormData({ ...memberFormData, driveLink: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <button
                                onClick={() => setIsMemberFormOpen(false)}
                                className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveMember}
                                className="px-6 py-2 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg"
                            >
                                Save Changes
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </WebAppShell>
    );
}
