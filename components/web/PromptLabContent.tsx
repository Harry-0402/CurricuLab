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

    const insertVariable = (variable: string) => {
        setBuilderText(prev => prev + (prev.endsWith(' ') || !prev ? '' : ' ') + variable);
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
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowGoalModal(true)}
                            className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-[24px] font-black uppercase tracking-widest text-xs shadow-lg shadow-orange-100 hover:scale-[1.02] transition-all"
                        >
                            <Icons.Wand2 size={18} />
                            Generate from Goal
                        </button>
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                            <Icons.Lightbulb size={24} />
                        </div>
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
                            <div className="flex flex-wrap gap-2">
                                <p className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Quick Variables</p>
                                {['[TOPIC]', '[UNIT_GOALS]', '[NOTE_SUMMARY]', '[EXAM_DATE]', '[KEY_TERMS]'].map(v => (
                                    <button
                                        key={v}
                                        onClick={() => insertVariable(v)}
                                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-colors border border-blue-100/50"
                                    >
                                        + {v}
                                    </button>
                                ))}
                            </div>

                            <textarea
                                value={builderText}
                                onChange={(e) => setBuilderText(e.target.value)}
                                placeholder="Type your prompt here or select a template from the library..."
                                className="flex-1 w-full p-8 bg-gray-50 rounded-[32px] border-none focus:ring-2 focus:ring-blue-500/20 outline-none font-mono text-sm resize-none leading-relaxed text-gray-700"
                            />

                            <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100/50">
                                <Icons.Info size={20} className="text-amber-600 flex-shrink-0" />
                                <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wide">
                                    Pro-tip: Combine variables into your prompts for highly personalized AI responses.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Library */}
                    <div
                        className={cn(
                            "bg-white rounded-[40px] border border-gray-100 shadow-sm flex flex-col overflow-hidden transition-all duration-500 ease-in-out",
                            isLibraryExpanded ? "w-[450px]" : "w-20"
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
