"use client"

import React, { useState, useEffect } from 'react';
import { MobileAppShell } from '@/components/mobile/MobileAppShell';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { LOCAL_PROMPTS, Prompt } from '@/lib/data/course-data';

export function PromptLabMobile() {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [activePrompt, setActivePrompt] = useState<Prompt | null>(null);
    const [builderText, setBuilderText] = useState('');
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<'builder' | 'library'>('builder');
    const [isAILoading, setIsAILoading] = useState(false);

    useEffect(() => {
        setPrompts(LOCAL_PROMPTS);
    }, []);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleAIAction = async () => {
        if (!builderText.trim()) return;
        setIsAILoading(true);
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: builderText }],
                    mode: 'prompt_engineer',
                    provider: 'groq',
                    model: 'llama-3.3-70b-versatile'
                })
            });
            if (!response.ok) throw new Error('AI Refinement failed');
            const data = await response.json();
            setBuilderText(data.message);
        } catch (error) {
            console.error('AI refinement Error:', error);
        } finally {
            setIsAILoading(false);
        }
    };

    const insertVariable = (variable: string) => {
        setBuilderText(prev => prev + (prev.endsWith(' ') || !prev ? '' : ' ') + variable);
    };

    const applyTemplate = (prompt: Prompt) => {
        setBuilderText(prompt.prompt);
        setActivePrompt(prompt);
        setActiveTab('builder');
    };

    return (
        <MobileAppShell>
            <div className="p-6 space-y-8 pb-32">
                <div>
                    <h1 className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-[0.2em]">Tools</h1>
                    <p className="text-4xl font-black text-gray-900 tracking-tight">Prompt Lab</p>
                </div>

                <div className="flex bg-gray-100 p-1.5 rounded-[24px]">
                    <button
                        onClick={() => setActiveTab('builder')}
                        className={cn(
                            "flex-1 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all",
                            activeTab === 'builder' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400"
                        )}
                    >
                        Prompt Builder
                    </button>
                    <button
                        onClick={() => setActiveTab('library')}
                        className={cn(
                            "flex-1 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all",
                            activeTab === 'library' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400"
                        )}
                    >
                        Template Library
                    </button>
                </div>

                {activeTab === 'builder' ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex flex-wrap gap-2">
                                    {['[TOPIC]', '[KEY_TERMS]', '[SUMMARY]'].map(v => (
                                        <button
                                            key={v}
                                            onClick={() => insertVariable(v)}
                                            className="px-4 py-3 bg-blue-50 text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-blue-100"
                                        >
                                            + {v}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={handleAIAction}
                                    disabled={!builderText || isAILoading}
                                    className={cn(
                                        "p-3 rounded-2xl flex items-center justify-center border-2 transition-all active:scale-95 disabled:opacity-30",
                                        isAILoading ? "bg-gray-50 border-gray-100 text-gray-400" : "bg-white border-blue-600 text-blue-600 shadow-sm"
                                    )}
                                >
                                    {isAILoading ? <Icons.Loader2 size={20} className="animate-spin" /> : <Icons.Sparkles size={20} />}
                                </button>
                            </div>

                            <textarea
                                value={builderText}
                                onChange={(e) => setBuilderText(e.target.value)}
                                placeholder="Draft your AI prompt here..."
                                className="w-full h-80 p-6 bg-white border border-gray-100 rounded-[32px] font-mono text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                            />

                            <button
                                onClick={() => handleCopy(builderText)}
                                disabled={!builderText}
                                className={cn(
                                    "w-full py-5 rounded-[24px] font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-blue-50",
                                    copied ? "bg-emerald-500 text-white" : "bg-gray-900 text-white disabled:opacity-20"
                                )}
                            >
                                {copied ? "Prompt Copied!" : "Copy to Clipboard"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        {prompts.length > 0 ? prompts.map(p => (
                            <button
                                key={p.id}
                                onClick={() => applyTemplate(p)}
                                className="w-full bg-white p-6 rounded-[32px] border border-gray-100 flex flex-col items-start gap-4 active:scale-[0.98] transition-all shadow-sm"
                            >
                                <div className="flex items-center justify-between w-full">
                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{p.category}</p>
                                    <Icons.ChevronRight size={18} className="text-gray-300" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-black text-gray-900 text-lg">{p.title}</h4>
                                    <p className="text-xs text-gray-400 mt-2 font-medium leading-relaxed">{p.description}</p>
                                </div>
                            </button>
                        )) : (
                            <div className="py-20 text-center space-y-4">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto text-gray-300">
                                    <Icons.Lightbulb size={32} />
                                </div>
                                <p className="font-bold uppercase tracking-widest text-[10px] text-gray-400">
                                    Library is empty
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </MobileAppShell>
    );
}
