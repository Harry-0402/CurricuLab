"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from '../CodeBlock';

type ConversationMessage = { role: 'user' | 'assistant'; content: string };

export function AiMentorTab() {
    const [messages, setMessages] = useState<ConversationMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const hasLoaded = useRef(false);

    // Load from Local Storage on Mount
    useEffect(() => {
        if (typeof window !== 'undefined' && !hasLoaded.current) {
            const stored = localStorage.getItem('curriculab_skillforge_chat');
            if (stored) {
                try {
                    setMessages(JSON.parse(stored));
                } catch (e) {
                    console.error("Failed to parse chat history");
                }
            }
            hasLoaded.current = true;
        }
    }, []);

    // Save to Local Storage on Update
    useEffect(() => {
        if (hasLoaded.current) { // Prevent overwriting with empty array on initial render
            localStorage.setItem('curriculab_skillforge_chat', JSON.stringify(messages));
        }
    }, [messages]);

    const handleClearChat = () => {
        if (confirm("Are you sure you want to clear the chat history?")) {
            setMessages([]);
            localStorage.removeItem('curriculab_skillforge_chat');
            setShowExportMenu(false);
        }
    };

    const handleExportWord = async () => {
        if (messages.length === 0) return;
        // Functionality removed during LearnPilot deletion
        setShowExportMenu(false);
    };

    const handleExportHTML = async () => {
        if (messages.length === 0) return;
        // Functionality removed during LearnPilot deletion
        setShowExportMenu(false);
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg: ConversationMessage = { role: 'user', content: input };
        setMessages([...messages, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/skillforge/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    conversationHistory: messages
                })
            });
            const data = await res.json();
            const responseContent = data.message || 'Sorry, I could not generate a response.';
            setMessages(prev => [...prev, { role: 'assistant', content: responseContent }]);
        } catch {
            toast.error('Failed to get response');
        } finally {
            setLoading(false);
        }
    };

    const generateStudyPlan = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/skillforge/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: 'Generate a personalized study plan for me based on my current learning tracks and skills. Include strategies for organizing learning tracks, managing multiple skills, and staying motivated.',
                    conversationHistory: []
                })
            });
            const data = await res.json();
            const responseContent = data.message || 'Unable to generate study plan.';
            const planMsg = { role: 'user' as const, content: 'Generate study plan' };
            setMessages([planMsg, { role: 'assistant', content: responseContent }]);
        } catch {
            toast.error('Failed to generate plan');
        } finally {
            setLoading(false);
        }
    };

    const getSuggestions = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/skillforge/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: 'Suggest learning resources, online courses, and next steps for continuous skill development based on my current tracks, skills, and progress.',
                    conversationHistory: []
                })
            });
            const data = await res.json();
            const responseContent = data.message || 'Unable to get suggestions.';
            const suggestMsg = { role: 'user' as const, content: 'Get suggestions' };
            setMessages([suggestMsg, { role: 'assistant', content: responseContent }]);
        } catch {
            toast.error('Failed to get suggestions');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* Header with Export Controls */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">AI Learning Mentor</h2>
                    <p className="text-gray-500 text-sm">Get personalized guidance for your learning journey</p>
                </div>

                <div className="flex items-center gap-2">
                    {/* Clear Chat Button */}
                    <button
                        onClick={handleClearChat}
                        disabled={messages.length === 0}
                        className="flex items-center gap-2 bg-white hover:bg-red-50 text-gray-700 hover:text-red-600 border border-gray-200 px-3 py-2 rounded-xl transition-all font-medium text-sm disabled:opacity-50"
                        title="Clear Chat History"
                    >
                        <Icons.Trash2 size={16} />
                        <span className="hidden sm:inline">Clear</span>
                    </button>

                    {/* Export Button */}
                    <div className="relative">
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            disabled={messages.length === 0}
                            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-3 py-2 rounded-xl transition-all font-medium text-sm disabled:opacity-50"
                        >
                            <Icons.Download size={16} />
                            <span className="hidden sm:inline">Export</span>
                            <Icons.ChevronDown size={14} className={`transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {showExportMenu && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50">
                                <button
                                    onClick={handleExportWord}
                                    disabled={messages.length === 0}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-pink-50 rounded-xl transition-colors text-left group disabled:opacity-50"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition-colors">
                                        <Icons.FileText size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Word Document</p>
                                        <p className="text-[10px] font-medium text-gray-500">Save chat as .docx</p>
                                    </div>
                                </button>
                                <button
                                    onClick={handleExportHTML}
                                    disabled={messages.length === 0}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-purple-50 rounded-xl transition-colors text-left group disabled:opacity-50"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                        <Icons.Globe size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Web Page</p>
                                        <p className="text-[10px] font-medium text-gray-500">Save as .html</p>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col min-h-0">
                {messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8">
                        <Icons.Sparkles size={64} className="text-pink-500" />
                        <h3 className="text-xl font-bold text-gray-900">How can I help you learn?</h3>
                        <div className="grid md:grid-cols-3 gap-4 w-full max-w-3xl">
                            <button onClick={generateStudyPlan} disabled={loading} className="p-6 bg-white rounded-2xl hover:shadow-lg transition-all border-2 border-transparent hover:border-pink-200 disabled:opacity-50">
                                <Icons.Calendar size={32} className="text-pink-600 mb-3" />
                                <h4 className="font-bold text-gray-900 mb-1">Study Plan</h4>
                                <p className="text-sm text-gray-500">Generate a personalized learning roadmap</p>
                            </button>
                            <button onClick={getSuggestions} disabled={loading} className="p-6 bg-white rounded-2xl hover:shadow-lg transition-all border-2 border-transparent hover:border-purple-200 disabled:opacity-50">
                                <Icons.Lightbulb size={32} className="text-purple-600 mb-3" />
                                <h4 className="font-bold text-gray-900 mb-1">Suggestions</h4>
                                <p className="text-sm text-gray-500">Get resource recommendations</p>
                            </button>
                            <button onClick={() => { }} className="p-6 bg-white rounded-2xl hover:shadow-lg transition-all border-2 border-transparent hover:border-blue-200">
                                <Icons.MessageCircle size={32} className="text-blue-600 mb-3" />
                                <h4 className="font-bold text-gray-900 mb-1">Ask Anything</h4>
                                <p className="text-sm text-gray-500">Type your question below</p>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 bg-gray-50 rounded-2xl p-6 space-y-4 overflow-y-auto custom-scrollbar">
                        {messages.map((msg, i) => (
                            <div key={i} className={cn("flex gap-3", msg.role === 'user' ? "justify-end" : "justify-start")}>
                                {msg.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shrink-0">
                                        <Icons.Bot size={16} className="text-white" />
                                    </div>
                                )}
                                <div className={cn("max-w-[80%] rounded-2xl px-4 py-3", msg.role === 'user' ? "bg-pink-600 text-white" : "bg-white text-gray-900 border border-gray-100")}>
                                    {msg.role === 'assistant' ? (
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-2 text-gray-900" {...props} />,
                                                h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-2 text-gray-900" {...props} />,
                                                h3: ({ node, ...props }) => <h3 className="text-base font-bold mb-2 text-gray-900" {...props} />,
                                                h4: ({ node, ...props }) => <h4 className="text-sm font-bold mb-1 text-gray-800" {...props} />,
                                                p: ({ node, ...props }) => <p className="mb-2 text-sm leading-relaxed" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-0.5 text-sm" {...props} />,
                                                ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-0.5 text-sm" {...props} />,
                                                li: ({ node, ...props }) => <li className="text-sm" {...props} />,
                                                strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
                                                code({ node, className, children, ...props }: any) {
                                                    const match = /language-(\w+)/.exec(className || '');
                                                    const lang = match ? match[1] : '';
                                                    const codeContent = String(children).replace(/\n$/, '');

                                                    if (lang) {
                                                        return <CodeBlock code={codeContent} language={lang} />;
                                                    }
                                                    return (
                                                        <code className="bg-pink-100 text-pink-700 rounded px-1.5 py-0.5 text-xs font-mono font-bold" {...props}>
                                                            {children}
                                                        </code>
                                                    );
                                                }
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    ) : (
                                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                    )}
                                </div>
                                {msg.role === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                                        <Icons.User size={16} className="text-gray-600" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                                    <Icons.Bot size={16} className="text-white" />
                                </div>
                                <div className="bg-white rounded-2xl px-4 py-3 border border-gray-100">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Input Area - Always Visible */}
            <div className="flex gap-2 shrink-0">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="Ask me anything about your learning journey..."
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    disabled={loading}
                />
                <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Icons.Loader2 size={18} className="animate-spin" /> : <Icons.Send size={18} />}
                </button>
            </div>
        </div>
    );
}
