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
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hello! I am your AI Tutor proficient in Business Analytics. How can I assist you with your studies effectively today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
            <div className="flex flex-col h-[calc(100vh-140px)] rounded-[32px] overflow-hidden bg-white border border-gray-200 shadow-sm relative">
                {/* Chat Header */}
                <div className="bg-white border-b border-gray-100 p-6 flex flex-col justify-center items-center relative z-10 shadow-sm/50">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md mb-2">
                        <Icons.Bot size={28} />
                    </div>
                    <h2 className="text-lg font-black text-gray-900 tracking-tight">AI Personal Tutor</h2>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">Business Analytics Expert</p>
                </div>

                {/* Messages Area - Enhanced Styling */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30 scroll-smooth">
                    {messages.map((m, index) => (
                        <div
                            key={index}
                            className={cn(
                                "flex w-full mb-4",
                                m.role === 'user' ? "justify-end" : "justify-start"
                            )}
                        >
                            <div
                                className={cn(
                                    "max-w-[80%] rounded-[24px] p-5 shadow-sm text-sm leading-relaxed relative group transition-all duration-300",
                                    m.role === 'user'
                                        ? "bg-indigo-600 text-white rounded-tr-none hover:shadow-indigo-200 hover:scale-[1.01]"
                                        : "bg-white text-gray-800 border border-gray-100 rounded-tl-none hover:border-gray-200 hover:shadow-md hover:scale-[1.01]"
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
                            <div className="bg-white border border-gray-100 rounded-[24px] rounded-tl-none p-4 shadow-sm flex items-center gap-2">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100">
                    <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto flex items-center gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask anything about Business Analytics..."
                            className="flex-1 bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-full py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm shadow-inner"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="absolute right-2 p-2.5 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-90 hover:scale-105"
                        >
                            <Icons.Send size={18} className={cn("transition-transform", isLoading ? "translate-x-1" : "")} />
                        </button>
                    </form>
                    <div className="text-center mt-2">
                        <p className="text-[10px] text-gray-400 font-medium tracking-wide">Powered by Groq & LLaMA 3</p>
                    </div>
                </div>
            </div>
        </WebAppShell>
    );
}
