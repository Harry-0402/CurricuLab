"use client"

import React, { useState, useEffect } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { Icons } from '@/components/shared/Icons';
import { LOCAL_RESOURCES, Resource } from '@/lib/data/course-data';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function DigitalLibraryContent() {
    // const [resources, setResources] = useState<Resource[]>([]);
    const [filter, setFilter] = useState('All');
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

    // useEffect(() => {
    //    setResources(LOCAL_RESOURCES);
    // }, []);

    const resources = LOCAL_RESOURCES;

    const categories = ['All', ...Array.from(new Set(resources.map(r => r.category)))];
    const filteredResources = filter === 'All' ? resources : resources.filter(r => r.category === filter);

    const handleResourceClick = (resource: Resource) => {
        if (resource.content || resource.type === 'Article') {
            setSelectedResource(resource);
        } else {
            window.open(resource.url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <WebAppShell>
            <div className="max-w-[1600px] mx-auto space-y-8 h-[calc(100vh-140px)] flex flex-col">
                <div className="flex items-center justify-between shrink-0">
                    <div>
                        <h1 className="text-[10px] font-black text-gray-300 mb-1 uppercase tracking-[0.2em]">Tools</h1>
                        <p className="text-5xl font-black text-gray-900 tracking-tight">Digital Library</p>
                    </div>
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm border border-blue-100">
                        <Icons.Database size={32} />
                    </div>
                </div>

                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none shrink-0">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === cat
                                ? "bg-gray-900 text-white shadow-lg shadow-gray-200 ring-2 ring-gray-900 ring-offset-2 scale-105"
                                : "bg-white text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-100 shadow-sm hover:shadow-md"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {filteredResources.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 overflow-y-auto pb-10 pr-2">
                        {filteredResources.map(resource => (
                            <div
                                key={resource.id}
                                role="button"
                                onClick={() => handleResourceClick(resource)}
                                className="group bg-white p-5 rounded-[24px] border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4 text-left cursor-pointer h-full"
                            >
                                {/* Header: Icon + Arrow */}
                                <div className="flex items-start justify-between">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-gray-100 ${resource.type === 'Video' ? 'bg-red-50 text-red-600' :
                                            resource.type === 'PDF' ? 'bg-orange-50 text-orange-600' :
                                                resource.type === 'Article' ? 'bg-purple-50 text-purple-600' :
                                                    'bg-blue-50 text-blue-600'
                                        }`}>
                                        {resource.type === 'Video' ? <Icons.Youtube size={20} /> :
                                            resource.type === 'PDF' ? <Icons.FileText size={20} /> :
                                                resource.type === 'Article' ? <Icons.BookOpen size={20} /> :
                                                    <Icons.Link size={20} />}
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <Icons.ArrowUpRight size={16} />
                                    </div>
                                </div>

                                {/* Content */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${resource.category.includes('Hero') ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {resource.category}
                                        </span>
                                    </div>
                                    <h3 className="text-base font-black text-black group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-2">
                                        {resource.title}
                                    </h3>
                                    <p className="text-xs font-medium text-gray-400 mt-2 line-clamp-2 leading-relaxed">{resource.description}</p>
                                </div>

                                {/* Footer */}
                                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{resource.type}</span>
                                    <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">
                                        {resource.content ? 'Read Now' : 'Open Link'}
                                    </span>
                                </div>
                            </div>
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

            {/* Content Modal */}
            {selectedResource && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[32px] w-full max-w-5xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 ring-1 ring-white/20">
                        {/* Modal Header */}
                        <div className="p-8 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${selectedResource.type === 'Article' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                                        }`}>
                                        {selectedResource.category}
                                    </span>
                                    <span className="px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white border border-gray-200 text-gray-500">
                                        {selectedResource.type}
                                    </span>
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">{selectedResource.title}</h2>
                                <p className="text-sm font-medium text-gray-500 mt-2">{selectedResource.description}</p>
                            </div>
                            <button
                                onClick={() => setSelectedResource(null)}
                                className="p-3 bg-white hover:bg-gray-100 rounded-2xl transition-all text-gray-400 hover:text-gray-900 shadow-sm border border-gray-100 hover:rotate-90 duration-300"
                            >
                                <Icons.X size={24} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-8 md:p-12 bg-white scrollbar-thin">
                            {selectedResource.content ? (
                                <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:text-gray-900 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            h1: ({ node, ...props }) => <h1 className="text-3xl font-black text-gray-900 mb-6 pb-4 border-b border-gray-100" {...props} />,
                                            h2: ({ node, ...props }) => <h2 className="text-2xl font-black text-gray-800 mt-8 mb-4 flex items-center gap-3 before:content-[''] before:w-1.5 before:h-6 before:bg-blue-600 before:rounded-full" {...props} />,
                                            h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-6 space-y-2 mb-6 marker:text-blue-500" {...props} />,
                                            ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-6 space-y-2 mb-6 marker:text-gray-900 marker:font-bold" {...props} />,
                                            li: ({ node, ...props }) => <li className="pl-2" {...props} />,
                                            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-blue-500 pl-6 py-2 bg-blue-50/30 rounded-r-xl italic text-gray-700 my-6" {...props} />,
                                            code: ({ node, ...props }) => <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded-md text-sm font-mono font-bold" {...props} />,
                                            pre: ({ node, ...props }) => <pre className="bg-gray-900 text-gray-50 p-6 rounded-2xl overflow-x-auto shadow-lg my-6 border border-gray-800" {...props} />,
                                        }}
                                    >
                                        {selectedResource.content}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
                                    <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm animate-bounce">
                                        <Icons.ExternalLink size={40} />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 mb-2">External Resource</h3>
                                    <p className="text-gray-500 mb-8 font-medium">This resource is hosted on an external website.</p>
                                    <a
                                        href={selectedResource.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2"
                                    >
                                        <span>Visit Website</span>
                                        <Icons.ArrowRight size={18} />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </WebAppShell>
    );
}
