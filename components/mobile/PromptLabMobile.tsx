"use client"

import React, { useState, useEffect } from 'react';
import { MobileAppShell } from '@/components/mobile/MobileAppShell';
import { Icons } from '@/components/shared/Icons';
import { LOCAL_PROMPTS, Prompt } from '@/lib/data/course-data';

export function PromptLabMobile() {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [activePrompt, setActivePrompt] = useState<Prompt | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setPrompts(LOCAL_PROMPTS);
    }, []);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <MobileAppShell>
            <div className="p-6 space-y-8 pb-32">
                <div>
                    <h1 className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-[0.2em]">Tools</h1>
                    <p className="text-4xl font-black text-gray-900 tracking-tight">Prompt Lab</p>
                </div>

                {activePrompt ? (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <button
                            onClick={() => setActivePrompt(null)}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600"
                        >
                            <Icons.ChevronLeft size={16} /> Back to Library
                        </button>

                        <div className="bg-white p-6 rounded-[32px] border border-gray-100 space-y-6 shadow-sm">
                            <div>
                                <h3 className="text-xl font-black text-gray-900">{activePrompt.title}</h3>
                                <p className="text-xs text-gray-400 mt-1">{activePrompt.description}</p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-5 font-mono text-xs text-gray-700 leading-relaxed whitespace-pre-wrap border border-gray-100 max-h-60 overflow-y-auto">
                                {activePrompt.prompt}
                            </div>

                            <button
                                onClick={() => handleCopy(activePrompt.prompt)}
                                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg ${copied ? "bg-emerald-500 text-white" : "bg-gray-900 text-white"
                                    }`}
                            >
                                {copied ? "Prompt Copied!" : "Copy to Clipboard"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 overflow-y-auto">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Select a Template</p>
                        {prompts.length > 0 ? prompts.map(p => (
                            <button
                                key={p.id}
                                onClick={() => setActivePrompt(p)}
                                className="bg-white p-5 rounded-[32px] border border-gray-100 flex items-center justify-between active:scale-[0.98] transition-all"
                            >
                                <div className="text-left">
                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{p.category}</p>
                                    <h4 className="font-black text-gray-900">{p.title}</h4>
                                </div>
                                <Icons.ChevronRight size={20} className="text-gray-300" />
                            </button>
                        )) : (
                            <div className="py-20 text-center space-y-4">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto text-gray-300">
                                    <Icons.Lightbulb size={32} />
                                </div>
                                <p className="font-bold uppercase tracking-widest text-[10px] text-gray-400">
                                    No prompts found
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </MobileAppShell>
    );
}
