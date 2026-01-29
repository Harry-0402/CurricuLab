"use client"

import React, { useState, useEffect } from 'react';
import { JobService, JobListing } from '@/lib/services/job-service';
import { Icons } from '@/components/shared/Icons';

export function JobOpenings() {
    const [jobs, setJobs] = useState<JobListing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await JobService.getAll();
            setJobs(data);
            setLoading(false);
        };
        load();
    }, []);

    const handleApply = (url: string) => {
        window.open(url, '_blank');
    };

    if (loading) return (
        <div className="flex justify-center py-20">
            <Icons.Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
    );

    if (jobs.length === 0) return (
        <div className="text-center py-20 text-gray-400">
            <Icons.Briefcase className="mx-auto mb-4 opacity-50" size={48} />
            <p>No job openings found at the moment.</p>
        </div>
    );

    return (
        <div className="grid grid-cols-1 gap-4">
            {jobs.map(job => (
                <div key={job.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 md:items-center justify-between">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
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

                    <div className="flex items-center gap-4 pl-16 md:pl-0">
                        <div className="text-right hidden md:block">
                            <p className="text-[10px] uppercase font-bold text-gray-400">Posted</p>
                            <p className="text-xs font-semibold text-gray-600">{new Date(job.posted_at).toLocaleDateString()}</p>
                        </div>
                        <button
                            onClick={() => handleApply(job.url)}
                            className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all flex items-center gap-2"
                        >
                            <span>Apply Now</span>
                            <Icons.ExternalLink size={14} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
