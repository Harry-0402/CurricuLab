"use client"

import React, { useState, useEffect } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { Icons } from '@/components/shared/Icons';
import { LOCAL_RESOURCES, Resource } from '@/lib/data/course-data';

export function DigitalLibraryContent() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        setResources(LOCAL_RESOURCES);
    }, []);

    const categories = ['All', ...Array.from(new Set(resources.map(r => r.type)))];
    const filteredResources = filter === 'All' ? resources : resources.filter(r => r.type === filter);

    return (
        <WebAppShell>
            <div className="max-w-6xl mx-auto space-y-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-[10px] font-black text-gray-300 mb-1 uppercase tracking-[0.2em]">Tools</h1>
                        <p className="text-5xl font-black text-gray-900 tracking-tight">Digital Library</p>
                    </div>
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        <Icons.Database size={32} />
                    </div>
                </div>

                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === cat
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                    : "bg-white text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-100 shadow-sm"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {filteredResources.length > 0 ? (
                    <div className="grid grid-cols-3 gap-6">
                        {filteredResources.map(resource => (
                            <a
                                key={resource.id}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-6"
                            >
                                <div className="flex items-start justify-between">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${resource.type === 'Video' ? 'bg-red-50 text-red-600' :
                                            resource.type === 'PDF' ? 'bg-orange-50 text-orange-600' :
                                                resource.type === 'Link' ? 'bg-blue-50 text-blue-600' :
                                                    'bg-purple-50 text-purple-600'
                                        }`}>
                                        {resource.type === 'Video' ? <Icons.Bot size={24} /> :
                                            resource.type === 'PDF' ? <Icons.FileText size={24} /> :
                                                <Icons.Share2 size={24} />}
                                    </div>
                                    <Icons.ChevronRight size={20} className="text-gray-200 group-hover:text-blue-600 transition-colors" />
                                </div>

                                <div>
                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{resource.category}</p>
                                    <h3 className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{resource.title}</h3>
                                    <p className="text-sm text-gray-400 mt-2 line-clamp-2">{resource.description}</p>
                                </div>

                                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-gray-400">{resource.type}</span>
                                    <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">Open Resource</span>
                                </div>
                            </a>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border border-dashed border-gray-200 text-gray-400 gap-3">
                        <Icons.Database size={40} className="mb-2" />
                        <p className="font-bold uppercase tracking-widest text-xs">No resources found in this library.</p>
                        <p className="text-[10px] text-gray-300 font-medium">Add data to LOCAL_RESOURCES in course-data.ts</p>
                    </div>
                )}
            </div>
        </WebAppShell>
    );
}
