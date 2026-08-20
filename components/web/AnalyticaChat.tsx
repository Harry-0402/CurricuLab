"use client"

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store/useAppStore';

interface AnalyticaChatProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AnalyticaChat({ isOpen, onClose }: AnalyticaChatProps) {
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', text: string, isTruncated?: boolean }[]>([]);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const analyticaInput = useAppStore(state => state.analyticaInput);
    const setAnalyticaInput = useAppStore(state => state.setAnalyticaInput);

    useEffect(() => {
        if (analyticaInput) {
            setInput(analyticaInput);
            setAnalyticaInput('');
        }
    }, [analyticaInput, setAnalyticaInput]);

    useEffect(() => {
        const saved = localStorage.getItem('analytica_chat_history');
        if (saved) {
            try {
                setMessages(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse chat history");
            }
        } else {
            setMessages([{ role: 'assistant', text: "Hi there! I'm Analytica, your AI study assistant. How can I help you today?" }]);
        }
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('analytica_chat_history', JSON.stringify(messages));
        }
    }, [messages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleCopy = (text: string, idx: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(idx);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleClear = () => {
        if (confirm("Are you sure you want to clear the chat history?")) {
            setMessages([{ role: 'assistant', text: "Hi there! I'm Analytica, your AI study assistant. How can I help you today?" }]);
            localStorage.removeItem('analytica_chat_history');
        }
    };

    const handleSend = async (overrideInput?: string) => {
        const textToSend = overrideInput || input.trim();
        if (!textToSend || isLoading) return;
        
        const userMessage = { role: 'user' as const, text: textToSend };
        setMessages(prev => {
            // Remove the truncation flag from the previous message if we are continuing it
            const newMessages = [...prev];
            if (newMessages.length > 0 && newMessages[newMessages.length - 1].isTruncated) {
                newMessages[newMessages.length - 1].isTruncated = false;
            }
            return [...newMessages, userMessage];
        });
        
        if (!overrideInput) {
            setInput('');
        }
        setIsLoading(true);
        
        try {
            // Prepare messages format for Groq/OpenRouter API
            // Note: we take the updated messages from the state variable before we pushed userMessage, so we need to construct it manually
            const apiMessages = [...messages, userMessage].map(m => ({
                role: m.role,
                content: m.text
            }));

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: apiMessages })
            });

            if (!response.ok) {
                throw new Error('API response error');
            }

            const data = await response.json();
            
            if (data.reply) {
                setMessages(prev => [...prev, { 
                    role: 'assistant', 
                    text: data.reply, 
                    isTruncated: data.finishReason === 'length'
                }]);
            } else {
                throw new Error('No reply in response');
            }
        } catch (error) {
            console.error('Chat API Error:', error);
            setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I'm having trouble connecting right now. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={cn(
            "fixed bottom-6 right-6 w-full max-w-[440px] h-[600px] max-h-[calc(100vh-48px)] bg-white shadow-2xl rounded-2xl z-[60] flex flex-col transform transition-all duration-300 ease-out border border-gray-200 overflow-hidden origin-bottom-right",
            isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 translate-y-4 pointer-events-none"
        )}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-md">
                        <Icons.Sparkles size={18} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Analytica</h3>
                        <p className="text-xs font-medium text-indigo-600 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={handleClear} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Clear Chat">
                        <Icons.Trash2 size={16} />
                    </button>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                        <Icons.X size={20} />
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 bg-gray-50/30">
                {messages.map((msg, idx) => (
                    <div key={idx} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                        <div className={cn(
                            "max-w-[85%] p-3 rounded-2xl text-sm shadow-sm relative group/message break-words",
                            msg.role === 'user' 
                                ? "bg-indigo-600 text-white rounded-br-sm whitespace-pre-wrap" 
                                : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm prose prose-sm prose-indigo leading-relaxed max-w-full pr-10"
                        )}>
                            {msg.role === 'assistant' && (
                                <button
                                    onClick={() => handleCopy(msg.text, idx)}
                                    className="absolute right-2 top-2 p-1.5 bg-gray-50 border border-gray-100 text-gray-400 hover:text-indigo-600 rounded-lg opacity-0 group-hover/message:opacity-100 transition-all shadow-sm"
                                    title="Copy response"
                                >
                                    {copiedIndex === idx ? <Icons.Check size={14} className="text-green-500" /> : <Icons.Copy size={14} />}
                                </button>
                            )}
                            {msg.role === 'user' ? (
                                msg.text
                            ) : (
                                <ReactMarkdown 
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-relaxed break-words" {...props} />,
                                        ul: ({node, ...props}) => <ul className="list-disc ml-5 mb-2 space-y-1 break-words" {...props} />,
                                        ol: ({node, ...props}) => <ol className="list-decimal ml-5 mb-2 space-y-1 break-words" {...props} />,
                                        li: ({node, ...props}) => <li className="pl-1" {...props} />,
                                        hr: ({node, ...props}) => <hr className="my-4 border-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent opacity-60" {...props} />,
                                        strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                                        table: ({node, ...props}) => (
                                            <div className="overflow-x-auto my-3 rounded-lg border border-gray-200">
                                                <table className="w-full text-left text-sm border-collapse bg-white" {...props} />
                                            </div>
                                        ),
                                        thead: ({node, ...props}) => <thead className="bg-gray-50 border-b border-gray-200 text-gray-700" {...props} />,
                                        th: ({node, ...props}) => <th className="p-2.5 font-semibold" {...props} />,
                                        td: ({node, ...props}) => <td className="p-2.5 border-t border-gray-100" {...props} />,
                                        a: ({node, ...props}) => <a className="text-indigo-600 hover:underline font-medium" target="_blank" rel="noreferrer" {...props} />,
                                        code: ({node, inline, ...props}: any) => 
                                            inline ? (
                                                <code className="bg-indigo-50 text-indigo-700 px-1 py-0.5 rounded text-[13px] font-mono border border-indigo-100" {...props} />
                                            ) : (
                                                <pre className="bg-gray-900 text-gray-100 p-3 rounded-xl overflow-x-auto my-3 text-[13px] font-mono shadow-inner custom-scrollbar">
                                                    <code {...props} />
                                                </pre>
                                            ),
                                    }}
                                >
                                    {msg.text}
                                </ReactMarkdown>
                            )}
                        </div>
                    </div>
                ))}
                
                {messages.length > 0 && messages[messages.length - 1].isTruncated && !isLoading && (
                    <div className="flex justify-start pl-2">
                        <button 
                            onClick={() => handleSend("Please continue from where you left off.")}
                            className="flex items-center gap-1.5 px-3 py-2 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 text-xs font-semibold rounded-lg transition-colors shadow-sm"
                        >
                            <Icons.ArrowDown size={14} className="shrink-0" />
                            Response cut off. Click to continue generating
                        </button>
                    </div>
                )}
                
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-100 text-gray-500 rounded-2xl rounded-bl-sm p-3 shadow-sm flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100 bg-white shrink-0">
                <div className="relative flex items-center">
                    <input 
                        type="text" 
                        placeholder="Ask Analytica..." 
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !isLoading && handleSend()}
                        disabled={isLoading}
                        className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
                    />
                    <button 
                        onClick={() => handleSend()}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-sm"
                    >
                        <Icons.ArrowRight size={16} />
                    </button>
                </div>
                <div className="flex items-center justify-center gap-1.5 mt-3 text-gray-400 opacity-80">
                    <Icons.AlertCircle size={12} />
                    <p className="text-center text-[10px] font-medium">Analytica can make mistakes. Consider verifying important information.</p>
                </div>
            </div>
        </div>
    )
}
