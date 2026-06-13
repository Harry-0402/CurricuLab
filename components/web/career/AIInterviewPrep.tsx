"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '@/components/shared/Icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { CodeBlock } from '../CodeBlock';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function AIInterviewPrep() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hello! I'm your AI Interview Coach. I can help you with:\n\n*   **Coding Problems** (I'll review your efficiency)\n*   **Math/Logic Puzzles** (I support LaTeX equations like $E = mc^2$)\n*   **Behavioral Questions**\n\nWhat would you like to practice today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, { role: 'user', content: userMsg }],
                    mode: 'tutor', // Reusing tutor mode for now, or could make a new 'interview_coach' mode if needed
                    provider: 'groq',
                    model: 'llama-3.3-70b-versatile',
                    systemOverride: "You are an expert Technical Interview Coach. You help candidates prepare for top-tier tech and business roles. You are strict but encouraging. You check code for Big O efficiency. You support LaTeX math formatting (use $ for inline, $$ for block). ALWAYS use markdown code blocks for code."
                })
            });

            if (!response.ok) throw new Error('Failed');

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col max-w-5xl mx-auto">
            <div className="flex-1 overflow-y-auto space-y-6 pr-4 pb-4">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-gray-900 text-white' : 'bg-purple-100 text-purple-600'}`}>
                            {msg.role === 'user' ? <Icons.User size={18} /> : <Icons.Bot size={20} />}
                        </div>
                        <div className={`p-5 rounded-2xl max-w-[85%] shadow-sm ${msg.role === 'user'
                                ? 'bg-gray-900 text-white rounded-tr-none'
                                : 'bg-white border border-gray-100 rounded-tl-none prose prose-sm max-w-none pt-2'
                            }`}>
                            {msg.role === 'user' ? (
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                            ) : (
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                    components={{
                                        code({ node, className, children, ...props }: any) {
                                            const match = /language-(\w+)/.exec(className || '');
                                            const lang = match ? match[1] : '';
                                            const codeContent = String(children).replace(/\n$/, '');

                                            if (lang) {
                                                return <CodeBlock code={codeContent} language={lang} />;
                                            }
                                            return (
                                                <code className="bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded font-mono text-xs font-bold" {...props}>
                                                    {children}
                                                </code>
                                            );
                                        }
                                    }}
                                >
                                    {msg.content}
                                </ReactMarkdown>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-4">
                        <div className="w-10 h-10 shrink-0 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center animate-pulse">
                            <Icons.Bot size={20} />
                        </div>
                        <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <div className="pt-4">
                <form onSubmit={handleSend} className="relative">
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Paste a leetcode problem, ask for a mock interview, or solve a math puzzle..."
                        className="w-full pl-6 pr-14 py-4 bg-white border border-gray-200 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-2 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 transition-colors"
                    >
                        <Icons.Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}
