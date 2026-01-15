"use client"

import React, { useState, useEffect } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { Icons } from '@/components/shared/Icons';
import { LOCAL_PROMPTS, Prompt } from '@/lib/data/course-data';

export function PromptLabContent() {
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
        <WebAppShell>
            <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8">
                <div className="col-span-12">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h1 className="text-[10px] font-black text-gray-300 mb-1 uppercase tracking-[0.2em]">Tools</h1>
                            <p className="text-5xl font-black text-gray-900 tracking-tight">Prompt Lab</p>
                        </div>
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                            <Icons.Lightbulb size={32} />
                        </div>
                    </div>
                </div>

                <div className="col-span-4 space-y-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Prompt Library</p>
                    <div className="space-y-3 overflow-y-auto max-h-[600px] pr-2 scrollbar-thin">
                        {prompts.length > 0 ? prompts.map(p => (
                            <button
                                key={p.id}
                                onClick={() => setActivePrompt(p)}
                                className={`w-full text-left p-5 rounded-3xl border transition-all ${activePrompt?.id === p.id
                                        ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100"
                                        : "bg-white border-gray-100 text-gray-900 hover:border-blue-200"
                                    }`}
                            >
                                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${activePrompt?.id === p.id ? "text-blue-100" : "text-blue-600"
                                    }`}>{p.category}</p>
                                <h4 className="font-black text-sm">{p.title}</h4>
                            </button>
                        )) : (
                            <div className="p-10 bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-center">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Empty Library</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-span-8">
                    {activePrompt ? (
                        <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8 h-full flex flex-col">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900">{activePrompt.title}</h3>
                                    <p className="text-sm text-gray-400 mt-1">{activePrompt.description}</p>
                                </div>
                                <button
                                    onClick={() => handleCopy(activePrompt.prompt)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${copied ? "bg-emerald-500 text-white" : "bg-gray-900 text-white hover:bg-gray-800"
                                        }`}
                                >
                                    {copied ? <Icons.Check size={16} /> : <Icons.Copy size={16} />}
                                    {copied ? "Copied" : "Copy Prompt"}
                                </button>
                            </div>

                            <div className="flex-1 bg-gray-50 rounded-[32px] p-8 font-mono text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border border-gray-100 overflow-y-auto max-h-[400px]">
                                {activePrompt.prompt}
                            </div>

                            <div className="bg-blue-50 p-6 rounded-[32px] flex items-center gap-4 border border-blue-100">
                                <Icons.Info size={24} className="text-blue-600 flex-shrink-0" />
                                <p className="text-xs text-blue-700 font-medium leading-relaxed">
                                    Tip: Use this prompt with the LearnPilot AI or any external AI model (ChatGPT, Gemini) to get consistent study results.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200 h-full flex flex-col items-center justify-center text-gray-300 gap-4">
                            <Icons.Lightbulb size={64} className="opacity-20" />
                            <p className="font-bold uppercase tracking-widest text-xs">Select a prompt to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </WebAppShell>
    );
}
