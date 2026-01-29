"use client"

import React, { useState, useEffect } from 'react';
import { JobService, JobListing } from '@/lib/services/job-service';
import { CareerService } from '@/lib/services/career-service';
import { Icons } from '@/components/shared/Icons';
import { AddJobModal } from '@/components/web/AddJobModal';
import { toast } from 'sonner';

export function JobOpenings() {
    const [jobs, setJobs] = useState<JobListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingJob, setEditingJob] = useState<JobListing | undefined>(undefined);
    const [trackingIds, setTrackingIds] = useState<Set<string>>(new Set());

    const load = async () => {
        setLoading(true);
        const data = await JobService.getAll();
        setJobs(data);
        setLoading(false);
    };

    useEffect(() => {
        load();
    }, []);

    const handleApply = (url: string) => {
        window.open(url, '_blank');
    };

    const handleTrack = async (job: JobListing, status: 'Wishlist' | 'Applied') => {
        if (trackingIds.has(job.id)) return;

        setTrackingIds(prev => new Set(prev).add(job.id));
        try {
            await CareerService.create({
                company: job.company,
                role: job.title,
                status: status,
                notes: `Tracked from Job Board. Location: ${job.location}, Salary: ${job.salary_range || 'N/A'}. URL: ${job.url}`,
                date: new Date().toISOString()
            });
            toast.success(`Job added to ${status} in Interview Lineup!`);
        } catch (error) {
            console.error('Failed to track job:', error);
            toast.error('Failed to track job. Please try again.');
            setTrackingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(job.id);
                return newSet;
            });
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this job posting?')) return;

        try {
            await JobService.delete(id);
            toast.success('Job deleted successfully');
            load();
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete job');
        }
    };

    const handleEdit = (e: React.MouseEvent, job: JobListing) => {
        e.stopPropagation();
        setEditingJob(job);
        setShowAddModal(true);
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setEditingJob(undefined);
    };

    if (loading) return (
        <div className="flex justify-center py-20">
            <Icons.Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900 hidden md:block">Recent Openings</h3>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-green-50 text-green-700 border border-green-100 rounded-xl font-bold hover:bg-green-100 transition-all"
                >
                    <Icons.PlusCircle size={18} />
                    <span>Post a Job</span>
                </button>
            </div>

            {jobs.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <Icons.Briefcase className="mx-auto mb-4 opacity-50" size={48} />
                    <p>No job openings found. Be the first to post one!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {jobs.map(job => (
                        <div key={job.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 md:items-center justify-between group relative">
                            {/* Edit/Delete Actions */}
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => handleEdit(e, job)}
                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit Job"
                                >
                                    <Icons.Edit size={16} />
                                </button>
                                <button
                                    onClick={(e) => handleDelete(e, job.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Job"
                                >
                                    <Icons.Trash2 size={16} />
                                </button>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Icons.Building size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{job.title}</h3>
                                    <p className="text-sm font-semibold text-gray-600 mb-2">{job.company}</p>

                                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 font-medium">
                                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                                            <Icons.MapPin size={12} /> {job.location}
                                        </span>
                                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                                            <Icons.Briefcase size={12} /> {job.type}
                                        </span>
                                        {job.salary_range && (
                                            <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md">
                                                <Icons.Banknote size={12} /> {job.salary_range}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:items-end gap-3 pl-16 md:pl-0 mt-4 md:mt-0">
                                <div className="text-right hidden md:block">
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Posted</p>
                                    <p className="text-xs font-semibold text-gray-600">{new Date(job.posted_at).toLocaleDateString()}</p>
                                </div>
                                <div className="flex gap-2 w-full md:w-auto">
                                    <button
                                        onClick={() => handleTrack(job, 'Wishlist')}
                                        disabled={trackingIds.has(job.id)}
                                        className="p-3 rounded-xl font-bold text-gray-400 hover:text-orange-500 hover:bg-orange-50 border border-gray-100 transition-all"
                                        title="Add to Wishlist"
                                    >
                                        <Icons.Heart size={20} className={trackingIds.has(job.id) ? "fill-orange-500 text-orange-500" : ""} />
                                    </button>
                                    <button
                                        onClick={() => handleTrack(job, 'Applied')}
                                        disabled={trackingIds.has(job.id)}
                                        className="p-3 rounded-xl font-bold text-gray-400 hover:text-blue-500 hover:bg-blue-50 border border-gray-100 transition-all"
                                        title="Mark as Applied"
                                    >
                                        <Icons.CheckCircle size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleApply(job.url)}
                                        className="flex-1 md:flex-none bg-black text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                                    >
                                        <span>Apply Now</span>
                                        <Icons.ExternalLink size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AddJobModal
                isOpen={showAddModal}
                onClose={handleCloseModal}
                onSuccess={load}
                initialData={editingJob}
            />
        </div>
    );
}
