"use client"

import React, { useState, useEffect } from 'react';
import { Icons } from '@/components/shared/Icons';
import { JobService, JobListing } from '@/lib/services/job-service';
import { toast } from 'sonner';

interface AddJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: JobListing; // Optional for Edit mode
}

export function AddJobModal({ isOpen, onClose, onSuccess, initialData }: AddJobModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<JobListing>>({
        title: '',
        company: '',
        location: '',
        type: 'Remote',
        salary_range: '',
        url: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            // Reset for Create mode
            setFormData({
                title: '',
                company: '',
                location: '',
                type: 'Remote',
                salary_range: '',
                url: '',
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (initialData) {
                // Update specific fields (excluding ID/dates)
                await JobService.update(initialData.id, {
                    title: formData.title,
                    company: formData.company,
                    location: formData.location,
                    type: formData.type,
                    salary_range: formData.salary_range,
                    url: formData.url
                });
                toast.success('Job updated successfully!');
            } else {
                await JobService.create(formData as JobListing);
                toast.success('Job posted successfully!');
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(initialData ? 'Failed to update job.' : 'Failed to post job.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-black text-gray-900">{initialData ? 'Edit Job' : 'Post a Job'}</h2>
                        <p className="text-xs text-gray-500 font-medium mt-1">{initialData ? 'Update job details' : 'Share an opportunity with the community'}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Icons.X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Job Title</label>
                            <input
                                required
                                className="w-full p-3 bg-gray-50 rounded-xl font-semibold border-2 border-transparent focus:border-green-500 focus:bg-white outline-none transition-all"
                                placeholder="e.g. Senior Product Designer"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Company Name</label>
                            <input
                                required
                                className="w-full p-3 bg-gray-50 rounded-xl font-semibold border-2 border-transparent focus:border-green-500 focus:bg-white outline-none transition-all"
                                placeholder="e.g. Acme Corp"
                                value={formData.company}
                                onChange={e => setFormData({ ...formData, company: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Location</label>
                                <input
                                    required
                                    className="w-full p-3 bg-gray-50 rounded-xl font-semibold border-2 border-transparent focus:border-green-500 focus:bg-white outline-none transition-all"
                                    placeholder="e.g. New York, NY"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Type</label>
                                <select
                                    className="w-full p-3 bg-gray-50 rounded-xl font-semibold border-2 border-transparent focus:border-green-500 focus:bg-white outline-none transition-all appearance-none"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                >
                                    <option value="Remote">Remote</option>
                                    <option value="On-site">On-site</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Salary Range (Optional)</label>
                            <input
                                className="w-full p-3 bg-gray-50 rounded-xl font-semibold border-2 border-transparent focus:border-green-500 focus:bg-white outline-none transition-all"
                                placeholder="e.g. $80k - $120k"
                                value={formData.salary_range}
                                onChange={e => setFormData({ ...formData, salary_range: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Application URL</label>
                            <div className="relative">
                                <Icons.Link className="absolute left-3 top-3.5 text-gray-400" size={16} />
                                <input
                                    required
                                    type="url"
                                    className="w-full pl-10 p-3 bg-gray-50 rounded-xl font-semibold border-2 border-transparent focus:border-green-500 focus:bg-white outline-none transition-all"
                                    placeholder="https://"
                                    value={formData.url}
                                    onChange={e => setFormData({ ...formData, url: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3.5 rounded-xl font-bold bg-green-600 text-white hover:bg-green-700 transition-all shadow-lg shadow-green-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? <Icons.Loader2 className="animate-spin" /> : <Icons.CheckCircle size={18} />}
                                <span>{initialData ? 'Update Job' : 'Post Job'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
