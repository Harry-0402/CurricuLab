"use client"

import React, { useState, useRef, useEffect } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function AiTutorContent() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, { role: 'user', content: userMessage }] })
            });

            if (!response.ok) throw new Error('Failed to get response');

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting right now. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <WebAppShell>
            {/* 
                Main Layout Container
                - h-[calc(100vh-140px)]: Fits exactly in viewport.
            */}
            <div className="flex flex-col h-[calc(100vh-160px)] space-y-6">

                {/* 1. Page Title (Left Aligned, Static) */}
                <div className="flex flex-col shrink-0">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">LearnPilot</h2>
                    <p className="text-sm font-medium text-gray-500">Business Analytics Expert & Study Companion</p>
                </div>

                {/* 2. Unified Chat Card (Wraps Content + Input) */}
                <div className="flex-1 min-h-0 bg-white border border-gray-100 rounded-[32px] shadow-sm relative overflow-hidden flex flex-col">

                    {/* A. Middle Content Area (Switches between Hero and Messages) */}
                    <div
                        ref={scrollRef}
                        className="flex-1 min-h-0 overflow-y-auto scroll-smooth custom-scrollbar relative"
                    >
                        {messages.length === 0 ? (
                            /* Hero Content */
                            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-900">
                                <h2 className="text-2xl sm:text-3xl font-bold mb-2">What can I help with?</h2>
                                <p className="text-gray-400 text-sm font-medium">I'm here to support your MBA studies.</p>
                            </div>
                        ) : (
                            /* Message History */
                            <div className="flex flex-col space-y-6 p-6 max-w-3xl mx-auto w-full">
                                {messages.map((m, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "flex w-full",
                                            m.role === 'user' ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "max-w-[85%] rounded-[20px] px-5 py-3 shadow-sm text-sm leading-relaxed relative",
                                                m.role === 'user'
                                                    ? "bg-gray-100 text-gray-900 rounded-tr-sm"
                                                    : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm"
                                            )}
                                        >
                                            {m.role === 'assistant' ? (
                                                <div className="markdown-content">
                                                    <ReactMarkdown
                                                        components={{
                                                            code: ({ node, ...props }) => <code className="bg-gray-100 text-gray-800 rounded px-1 py-0.5 text-xs font-mono" {...props} />,
                                                            strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
                                                            ul: ({ node, ...props }) => <ul className="list-disc pl-4 my-2 space-y-1" {...props} />,
                                                            ol: ({ node, ...props }) => <ol className="list-decimal pl-4 my-2 space-y-1" {...props} />
                                                        }}
                                                    >
                                                        {m.content}
                                                    </ReactMarkdown>
                                                </div>
                                            ) : (
                                                m.content
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start w-full">
                                        <div className="bg-white border border-gray-100 rounded-[20px] rounded-tl-sm px-4 py-3 shadow-sm">
                                            <div className="flex space-x-1">
                                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* <div ref={messagesEndRef} /> */}
                            </div>
                        )}
                    </div>

                    {/* B. Persistent Input Area (Common for both states) */}
                    <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-gray-50/50 flex justify-center sticky bottom-0 z-10 w-full shrink-0">
                        <div className="w-full max-w-3xl relative">
                            <form onSubmit={handleSubmit} className="relative bg-white rounded-[24px] border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={messages.length === 0 ? "Ask anything..." : "Message AI Tutor..."}
                                    className="w-full min-h-[52px] max-h-[200px] bg-transparent text-gray-900 placeholder-gray-400 border-none focus:ring-0 resize-none py-3.5 px-5 pr-14 text-base scrollbar-hide align-middle"
                                    rows={1}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSubmit(e);
                                        }
                                    }}
                                />
                                <div className="flex items-center justify-between px-3 pb-2.5">
                                    <div className="flex items-center gap-2">
                                        <button type="button" className="p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600 rounded-lg transition-colors flex items-center gap-2">
                                            <Icons.PlusCircle size={18} />
                                            <span className="text-xs font-semibold hidden sm:inline">Attach</span>
                                        </button>
                                        <button type="button" className="p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600 rounded-lg transition-colors flex items-center gap-2">
                                            <Icons.Search size={18} />
                                            <span className="text-xs font-semibold hidden sm:inline">Deep Search</span>
                                        </button>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading || !input.trim()}
                                        className={cn(
                                            "p-2 rounded-xl transition-all duration-300",
                                            input.trim()
                                                ? "bg-black text-white hover:bg-gray-800 shadow-md"
                                                : "bg-gray-100 text-gray-300 cursor-not-allowed"
                                        )}
                                    >
                                        <Icons.Send size={18} className={cn("transition-transform", isLoading ? "translate-x-1" : "")} />
                                    </button>
                                </div>
                            </form>
                            <div className="text-center mt-3">
                                <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Powered by Groq & LLaMA 3</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </WebAppShell>
    );
}
