"use client"

import React, { useState, useEffect } from 'react';
import { ResourceService } from '@/lib/services/resource-service';
import { Resource } from '@/lib/data/course-data';
import { Icons } from '@/components/shared/Icons';

export function InterviewResources() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const all = await ResourceService.getAll();
            // Filter for interview related content
            const interviewRegex = /interview|career|resume|job|salary/i;
            const filtered = all.filter(r =>
                r.category === 'Interview Prep' ||
                interviewRegex.test(r.title) ||
                interviewRegex.test(r.topic || '') ||
                interviewRegex.test(r.category)
            );
            setResources(filtered);
            setLoading(false);
        };
        load();
    }, []);

    const openResource = (r: Resource) => {
        window.open(r.url, '_blank');
    };

    if (loading) return <div className="flex justify-center py-20"><Icons.Loader2 className="animate-spin text-gray-400" /></div>;

    if (resources.length === 0) return (
        <div className="text-center py-20 text-gray-400">
            <Icons.Library className="mx-auto mb-4 opacity-50" size={48} />
            <p>No specific interview resources found.</p>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {resources.map(r => (
                <div key={r.id} onClick={() => openResource(r)} className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                            {r.type === 'PDF' ? <Icons.FileText size={20} /> : <Icons.Link size={20} />}
                        </div>
                        <Icons.ExternalLink size={16} className="text-gray-300 group-hover:text-blue-600" />
                    </div>
                    <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">{r.category}</span>
                    <h3 className="font-bold text-gray-900 mt-1 mb-2 group-hover:text-blue-600 transition-colors">{r.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{r.description}</p>
                </div>
            ))}
        </div>
    );
}
