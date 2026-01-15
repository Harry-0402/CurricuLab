"use client"

import React, { useState, useEffect } from 'react';
import { MobileAppShell } from '@/components/mobile/MobileAppShell';
import { Icons } from '@/components/shared/Icons';
import { LOCAL_RESOURCES, Resource } from '@/lib/data/course-data';

export function DigitalLibraryMobile() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        setResources(LOCAL_RESOURCES);
    }, []);

    const categories = ['All', ...Array.from(new Set(resources.map(r => r.type)))];
    const filteredResources = filter === 'All' ? resources : resources.filter(r => r.type === filter);

    return (
        <MobileAppShell>
            <div className="p-6 space-y-8 pb-32">
                <div>
                    <h1 className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-[0.2em]">Tools</h1>
                    <p className="text-4xl font-black text-gray-900 tracking-tight">Digital Library</p>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-6 px-6">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${filter === cat
                                    ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                                    : "bg-white text-gray-400 border-gray-100"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {filteredResources.length > 0 ? filteredResources.map(resource => (
                        <a
                            key={resource.id}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white p-5 rounded-[32px] border border-gray-100 flex flex-col gap-4 shadow-sm active:scale-[0.98] transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${resource.type === 'Video' ? 'bg-red-50 text-red-600' :
                                        resource.type === 'PDF' ? 'bg-orange-50 text-orange-600' :
                                            'bg-blue-50 text-blue-600'
                                    }`}>
                                    {resource.type === 'Video' ? <Icons.Bot size={24} /> : <Icons.FileText size={20} />}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">{resource.type}</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{resource.category}</p>
                                <h3 className="text-lg font-black text-gray-900 leading-tight">{resource.title}</h3>
                                <p className="text-xs text-gray-400 mt-2 line-clamp-2">{resource.description}</p>
                            </div>
                        </a>
                    )) : (
                        <div className="py-20 text-center space-y-4">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto text-gray-300">
                                <Icons.Database size={32} />
                            </div>
                            <p className="font-bold uppercase tracking-widest text-[10px] text-gray-400">
                                No resources found
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </MobileAppShell>
    );
}
