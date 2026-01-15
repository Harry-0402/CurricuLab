"use client"

import React, { useState, useEffect } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { LOCAL_PROMPTS, Prompt } from '@/lib/data/course-data';

export function PromptLabContent() {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [activePrompt, setActivePrompt] = useState<Prompt | null>(null);
    const [builderText, setBuilderText] = useState('');
    const [copied, setCopied] = useState(false);
    const [isLibraryExpanded, setIsLibraryExpanded] = useState(true);
    const [isAILoading, setIsAILoading] = useState(false);
    const [showGoalModal, setShowGoalModal] = useState(false);
    const [goalInput, setGoalInput] = useState('');

    useEffect(() => {
        setPrompts(LOCAL_PROMPTS);
    }, []);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleAIAction = async (action: 'refine' | 'generate') => {
        if (action === 'refine' && !builderText.trim()) return;
        if (action === 'generate' && !goalInput.trim()) return;

        setIsAILoading(true);
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{
                        role: 'user',
                        content: action === 'refine' ? builderText : goalInput
                    }],
                    mode: 'prompt_engineer',
                    provider: 'groq',
                    model: 'llama-3.3-70b-versatile'
                })
            });

            if (!response.ok) throw new Error('AI Action failed');
            const data = await response.json();

            setBuilderText(data.message);
            if (action === 'generate') {
                setShowGoalModal(false);
                setGoalInput('');
            }
        } catch (error) {
            console.error('AI Action Error:', error);
        } finally {
            setIsAILoading(false);
        }
    };

    const applyTemplate = (prompt: Prompt) => {
        setBuilderText(prompt.prompt);
        setActivePrompt(prompt);
    };

    return (
        <WebAppShell>
            <div className="max-w-[1600px] mx-auto flex flex-col h-[calc(100vh-160px)]">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-[10px] font-black text-gray-300 mb-1 uppercase tracking-[0.2em]">Tools</h1>
                        <p className="text-5xl font-black text-gray-900 tracking-tight">Prompt Lab</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-gray-100 shadow-sm">
                            {[
                                {
                                    name: 'ChatGPT',
                                    url: 'https://chat.openai.com',
                                    color: 'hover:bg-[#10a37f] hover:text-white',
                                    icon: (
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.0462 6.0462 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.5364-1.8405l-1.324-2.3679 6.641-.3016 1.8489-3.7297 1.487 1.1165a4.4755 4.4755 0 0 1 1.7196 2.3726l.0048.0572-.0048.0573v.062a4.5041 4.5041 0 0 1-7.836 4.5741zm6.9858-6.1866a4.4708 4.4708 0 0 1-1.7483 2.6247l-.062.0336-.0525.0335-.062.0335h-.062a4.5041 4.5041 0 0 1-5.0601-1.2415l-.8931-1.6128 3.9931-5.3259h2.3256l1.6272 5.3268v.1281zm-1.8722-8.3562a4.4708 4.4708 0 0 1 2.639 1.7052l.024.0621.0239.062.0239.0573v.062a4.5041 4.5041 0 0 1-2.9736 5.5645l-1.8155.5118-2.6143-6.195 1.5435-1.7895 3.0189.0238h.1292zm-8.8788.5873a4.4708 4.4708 0 0 1 2.5028-1.874l.0573-.0096.062-.0095h.0621a4.5041 4.5041 0 0 1 5.313 3.6385l.2339 1.8539-6.3862 2.0534-2.0867-1.1213.2386-4.5244.005-.007zm-5.466 5.5931a4.4708 4.4708 0 0 1 .845-3.0829l.043-.0525.0429-.0525.0478-.0526.0429-.0477a4.5041 4.5041 0 0 1 6.2762.6586l1.2095 1.3976-1.782 6.4776-2.3584.062-4.1307-5.184-.0931-.1236zm3.1958 8.046a4.4708 4.4708 0 0 1-2.6247-1.7435l-.0335-.062-.0335-.0525-.0336-.0621v-.062a4.5041 4.5041 0 0 1 1.251-5.1077l1.5937-.8787 5.3402 3.9882v2.368l-5.3644 1.5644-.0954.048z" />
                                        </svg>
                                    )
                                }, // OpenAI Swirl
                                {
                                    name: 'Perplexity',
                                    url: 'https://www.perplexity.ai',
                                    color: 'hover:bg-[#20b2aa] hover:text-white',
                                    icon: (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                            <path d="M12 2 L12 22 M2 12 L22 12 M4.9 4.9 L19.1 19.1 M4.9 19.1 L19.1 4.9" />
                                        </svg>
                                    )
                                }, // Asterisk
                                {
                                    name: 'Gemini',
                                    url: 'https://gemini.google.com',
                                    color: 'hover:bg-[#4285f4] hover:text-white',
                                    icon: (
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                            <path d="M12 2l2.5 8.5L23 13l-8.5 2.5L12 24l-2.5-8.5L1 13l8.5-2.5z" />
                                        </svg>
                                    )
                                }, // Sparkle
                                {
                                    name: 'Claude',
                                    url: 'https://claude.ai',
                                    color: 'hover:bg-[#d97757] hover:text-white',
                                    icon: (
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                            <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" opacity=".5" />
                                        </svg>
                                    )
                                }, // Stylized C
                                {
                                    name: 'GPAI',
                                    url: 'https://gpai.app/solver',
                                    color: 'hover:bg-[#f97316] hover:text-white',
                                    icon: (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
                                            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
                                        </svg>
                                    )
                                }, // Brain (Orange)
                                {
                                    name: 'Google AI Mode',
                                    url: 'https://www.google.com/search?sourceid=chrome&udm=50&aep=42',
                                    color: 'hover:bg-[#4285f4] hover:text-white',
                                    icon: (
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.6 0 6.627-1.187 8.96-3.08 2.507-2.36 3.013-6.147 2.547-9.84H12.48z" />
                                        </svg>
                                    )
                                } // Google G
                            ].map((ai) => (
                                <a
                                    key={ai.name}
                                    href={ai.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                        "w-8 h-8 rounded-[12px] flex items-center justify-center text-gray-400 bg-gray-50/50 transition-all duration-200",
                                        ai.color
                                    )}
                                    title={ai.name}
                                >
                                    {ai.icon}
                                </a>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowGoalModal(true)}
                            className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-[24px] font-black uppercase tracking-widest text-xs shadow-lg shadow-orange-100 hover:scale-[1.02] transition-all"
                        >
                            <Icons.Wand2 size={18} />
                            Generate from Goal
                        </button>
                    </div>
                </div>

                <div className="flex gap-6 h-full min-h-0 overflow-hidden">
                    {/* Left: Prompt Builder */}
                    <div className="flex-1 min-w-0 bg-white rounded-[40px] border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                            <div>
                                <h2 className="text-xl font-black text-gray-900">Prompt Builder</h2>
                                <p className="text-xs text-gray-400 font-medium">Draft and customize your AI instructions</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleAIAction('refine')}
                                    disabled={!builderText || isAILoading}
                                    className={cn(
                                        "flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border-2 disabled:opacity-30",
                                        isAILoading ? "bg-gray-50 border-gray-100 text-gray-400" : "bg-white border-blue-600 text-blue-600 hover:bg-blue-50"
                                    )}
                                >
                                    {isAILoading ? <Icons.Loader2 size={16} className="animate-spin" /> : <Icons.Sparkles size={16} />}
                                    {isAILoading ? "Enhancing..." : "Enhance with AI"}
                                </button>
                                <button
                                    onClick={() => handleCopy(builderText)}
                                    disabled={!builderText}
                                    className={cn(
                                        "flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-sm",
                                        copied ? "bg-emerald-500 text-white" : "bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-30"
                                    )}
                                >
                                    {copied ? <Icons.Check size={16} /> : <Icons.Copy size={16} />}
                                    {copied ? "Copied" : "Copy Final Prompt"}
                                </button>
                            </div>
                        </div>

                        <div className="p-8 flex-1 flex flex-col gap-6 overflow-hidden">
                            <textarea
                                value={builderText}
                                onChange={(e) => setBuilderText(e.target.value)}
                                placeholder="Type your prompt here or select a template from the library..."
                                className="flex-1 w-full p-8 bg-gray-50 rounded-[40px] border-none focus:ring-2 focus:ring-blue-500/20 outline-none font-mono text-sm resize-none leading-relaxed text-gray-700 shadow-inner"
                            />

                            <div className="flex items-center gap-4 p-5 bg-blue-50/50 rounded-[24px] border border-blue-100/30">
                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                                    <Icons.Sparkles size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-blue-900 font-black uppercase tracking-[0.1em]">Pro Strategy</p>
                                    <p className="text-[11px] text-blue-700 font-medium">
                                        Use specific headers like [Goal], [Context], and [Output Format] for superior AI quality.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Library */}
                    <div
                        className={cn(
                            "bg-white rounded-[40px] border border-gray-100 shadow-sm flex flex-col overflow-hidden transition-all duration-500 ease-in-out",
                            isLibraryExpanded ? "w-[340px]" : "w-20"
                        )}
                    >
                        <div className={cn(
                            "p-6 border-b border-gray-50 flex items-center bg-gray-50/30 transition-all",
                            isLibraryExpanded ? "justify-between" : "justify-center"
                        )}>
                            {isLibraryExpanded && (
                                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Template Library</h2>
                            )}
                            <button
                                onClick={() => setIsLibraryExpanded(!isLibraryExpanded)}
                                className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-all"
                            >
                                <Icons.Layout size={20} />
                            </button>
                        </div>

                        <div className={cn(
                            "flex-1 overflow-y-auto min-h-0 scrollbar-thin",
                            isLibraryExpanded ? "p-6 space-y-3" : "p-2 flex flex-col items-center gap-3 pt-6"
                        )}>
                            {isLibraryExpanded ? (
                                prompts.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => applyTemplate(p)}
                                        className={cn(
                                            "w-full text-left p-5 rounded-[24px] border transition-all hover:translate-x-1",
                                            activePrompt?.id === p.id
                                                ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-100"
                                                : "bg-white border-gray-100 hover:border-blue-100 group"
                                        )}
                                    >
                                        <p className={cn(
                                            "text-[9px] font-black uppercase tracking-widest mb-1",
                                            activePrompt?.id === p.id ? "text-blue-100" : "text-blue-600"
                                        )}>{p.category}</p>
                                        <h4 className={cn(
                                            "font-black text-sm",
                                            activePrompt?.id === p.id ? "text-white" : "text-gray-900"
                                        )}>{p.title}</h4>
                                        <p className={cn(
                                            "text-[10px] mt-2 line-clamp-2 leading-relaxed",
                                            activePrompt?.id === p.id ? "text-blue-50/80" : "text-gray-400"
                                        )}>{p.description}</p>
                                    </button>
                                ))
                            ) : (
                                prompts.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => applyTemplate(p)}
                                        className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                                            activePrompt?.id === p.id ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600"
                                        )}
                                        title={p.title}
                                    >
                                        <Icons.Lightbulb size={20} />
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Goal Modal */}
            {showGoalModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10 space-y-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900">Generate from Goal</h2>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">AI Prompt Engineering</p>
                                </div>
                                <button onClick={() => setShowGoalModal(false)} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400">
                                    <Icons.X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">What is your study goal?</label>
                                <textarea
                                    value={goalInput}
                                    onChange={(e) => setGoalInput(e.target.value)}
                                    placeholder="e.g., I want to practice case studies for Business Law using specific scenarios..."
                                    className="w-full h-40 p-6 bg-gray-50 rounded-[32px] border-none focus:ring-2 focus:ring-amber-400/20 outline-none text-sm leading-relaxed"
                                />
                            </div>

                            <button
                                onClick={() => handleAIAction('generate')}
                                disabled={!goalInput || isAILoading}
                                className="w-full py-5 bg-gray-900 text-white rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 disabled:opacity-30"
                            >
                                {isAILoading ? <Icons.Loader2 size={18} className="animate-spin" /> : <Icons.Sparkles size={18} />}
                                {isAILoading ? "Engineering..." : "Generate Master Prompt"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </WebAppShell>
    );
}
