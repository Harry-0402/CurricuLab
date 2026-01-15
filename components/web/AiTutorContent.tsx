"use client"

import React, { useState, useRef, useEffect } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- CONFIG ---
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const MODELS = [
    { id: "llama-3.3-70b-versatile", name: "Llama (Thinking)", provider: 'groq' },
    { id: "llama-3.1-8b-instant", name: "Llama (Fast)", provider: 'groq' },
    { id: "copilot-gpt-4o", name: "GPT-4o (Thinking)", provider: 'copilot' },
    { id: "gemini-3-flash-preview", name: "Gemini (Thinking)", provider: 'gemini' },
    { id: "gemini-2.5-flash", name: "Gemini (Fast)", provider: 'gemini' },
    { id: "deepseek/deepseek-chat", name: "DeepSeek (Thinking)", provider: 'openrouter' },
    { id: "deepseek/deepseek-r1:free", name: "DeepSeek (Reasoning)", provider: 'openrouter' },
    { id: "anthropic/claude-3.5-sonnet", name: "Claude (Thinking)", provider: 'openrouter' },
    { id: "xiaomi/mimo-v2-flash:free", name: "Mimo (Fast)", provider: 'openrouter' },
    { id: "mistralai/devstral-2512:free", name: "Devstral (Thinking)", provider: 'openrouter' },
    { id: "z-ai/glm-4.5-air:free", name: "GLM (Fast)", provider: 'openrouter' },
    { id: "qwen/qwen3-4b:free", name: "Qwen (Fast)", provider: 'openrouter' },
    { id: "arcee-ai/trinity-mini:free", name: "Trinity (Fast)", provider: 'openrouter' },
    { id: "nvidia/nemotron-3-nano-30b-a3b:free", name: "Nemotron (Reasoning)", provider: 'openrouter' },
];

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

// Helper to extract text from React nodes for the copy button
const getCodeString = (children: any): string => {
    if (typeof children === 'string') return children;
    if (Array.isArray(children)) return children.map(getCodeString).join('');
    if (children?.props?.children) return getCodeString(children.props.children);
    return String(children || '');
};

const ChatCodeBlock = ({ children }: { children?: any }) => {
    const [copied, setCopied] = useState(false);
    const codeString = getCodeString(children);

    const handleCopy = () => {
        if (!codeString) return;
        navigator.clipboard.writeText(codeString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="group relative my-4 overflow-hidden rounded-xl border border-white/5 bg-gray-950 shadow-2xl">
            <div className="absolute right-3 top-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleCopy}
                    className="flex h-8 items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-gray-400 hover:bg-white/10 hover:text-white transition-all backdrop-blur-md border border-white/10 shadow-lg"
                >
                    {copied ? (
                        <>
                            <Icons.CheckCircle size={12} className="text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                        </>
                    ) : (
                        <>
                            <Icons.Copy size={12} />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <pre className="p-5 text-[13px] font-mono text-gray-300 leading-relaxed selection:bg-blue-500/30">
                    {children}
                </pre>
            </div>
        </div>
    );
};

export function AiTutorContent() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedModelId, setSelectedModelId] = useState(MODELS[0].id);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initialize Gemini Client
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const generateResponse = async (modelId: string, currentMessages: Message[], userPrompt: string): Promise<string> => {
        const selectedModel = MODELS.find(m => m.id === modelId) || MODELS[0];

        // Handles Groq, Copilot, and OpenRouter via server-side route
        if (selectedModel.provider === 'groq' || selectedModel.provider === 'copilot' || selectedModel.provider === 'openrouter') {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...currentMessages, { role: 'user', content: userPrompt }],
                    provider: selectedModel.provider,
                    model: selectedModel.id
                })
            });

            if (!response.ok) throw new Error(`${selectedModel.name} API Error: ${response.statusText}`);
            const data = await response.json();
            return data.message;
        } else {
            const history = currentMessages.slice(-10).map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }],
            }));

            const model = genAI.getGenerativeModel({ model: selectedModel.id });
            const chat = model.startChat({
                history: history, // history shouldn't include the new user prompt yet, standard gemini pattern is startChat -> sendMessage
                generationConfig: { maxOutputTokens: 2000 },
            });

            const result = await chat.sendMessage(userPrompt);
            const response = result.response;
            return response.text();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const text = await generateResponse(selectedModelId, messages, userMessage);
            setMessages(prev => [...prev, { role: 'assistant', content: text }]);
        } catch (error: any) {
            console.error(`Model ${selectedModelId} failed:`, error);

            // Extract a more helpful error message if possible
            const errorMsg = error.message || "Unknown error";
            const isRateLimit = errorMsg.toLowerCase().includes("limit") || errorMsg.includes("429");
            const isNotFound = errorMsg.toLowerCase().includes("not found") || errorMsg.includes("404");

            let displayMessage = "⚠️ **Service Unavailable**: The model encountered an error.";
            if (isRateLimit) displayMessage = "⚠️ **Limit Exceeded**: You've hit the free tier rate limit for this model. Please wait a moment or try another model.";
            if (isNotFound) displayMessage = `⚠️ **Model Not Found**: The ID \`${selectedModelId}\` might be incorrect or unavailable in your region.`;

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `${displayMessage}\n\n*Error Detail: ${errorMsg}*`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <WebAppShell>
            <div className="flex flex-col h-[calc(100vh-160px)] space-y-6">

                {/* Header & Model Selector */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">LearnPilot</h2>
                        <p className="text-sm font-medium text-gray-500">AI Study Companion</p>
                    </div>

                    {/* Model Select Dropdown */}
                    <div className="relative group">
                        <select
                            value={selectedModelId}
                            onChange={(e) => setSelectedModelId(e.target.value)}
                            className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl px-4 py-2.5 pr-10 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer shadow-sm"
                        >
                            {MODELS.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                        <Icons.ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 min-h-0 bg-white border border-gray-100 rounded-[32px] shadow-sm relative overflow-hidden flex flex-col">

                    {/* Messages */}
                    <div
                        ref={scrollRef}
                        className="flex-1 min-h-0 overflow-y-auto scroll-smooth custom-scrollbar relative p-4 md:p-6"
                    >
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center text-gray-900 space-y-4">
                                <div className="p-4 bg-blue-50 rounded-full text-blue-600 mb-2">
                                    <Icons.Bot size={32} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black mb-2">Hello! I'm LearnPilot.</h2>
                                    <p className="text-gray-400 text-sm font-medium max-w-md mx-auto">
                                        Powered by {MODELS.find(m => m.id === selectedModelId)?.name}. Ask me anything!
                                    </p>
                                </div>
                                <div className="flex flex-wrap justify-center gap-2 mt-4">
                                    {["Explain Regression", "Create a study timetable", "Compare SQL vs NoSQL in a table"].map(q => (
                                        <button
                                            key={q}
                                            onClick={() => setInput(q)}
                                            className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-600 rounded-full transition-colors border border-gray-100"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-6 max-w-4xl mx-auto w-full">
                                {messages.map((m, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "flex w-full gap-3",
                                            m.role === 'user' ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        {m.role === 'assistant' && (
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-1">
                                                <Icons.Bot size={16} />
                                            </div>
                                        )}

                                        <div
                                            className={cn(
                                                "max-w-[85%] md:max-w-[75%] rounded-[24px] px-6 py-4 shadow-sm text-sm leading-relaxed",
                                                m.role === 'user'
                                                    ? "bg-gray-900 text-white rounded-tr-sm"
                                                    : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm markdown-body" // Apply markdown styles class
                                            )}
                                        >
                                            {m.role === 'assistant' ? (
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        // Custom styling for markdown elements
                                                        table: ({ node, ...props }) => <div className="overflow-x-auto my-4 rounded-lg border border-gray-200"><table className="w-full text-left text-sm" {...props} /></div>,
                                                        thead: ({ node, ...props }) => <thead className="bg-gray-50 text-gray-700 font-bold" {...props} />,
                                                        th: ({ node, ...props }) => <th className="px-4 py-3 border-b border-gray-200" {...props} />,
                                                        td: ({ node, ...props }) => <td className="px-4 py-3 border-b border-gray-100" {...props} />,
                                                        pre: ({ node, ...props }) => <ChatCodeBlock {...props} />,
                                                        code: ({ node, className, children, ...props }) => {
                                                            // Check if it's inline code by looking for absence of newline or parent tag analysis
                                                            // Ideally, react-markdown distinguishes inline code. 
                                                            // Usually, block code is inside 'pre'. Inline is not.
                                                            // We can leave block styling to 'pre' and just styling text here.
                                                            // But simpler check: if we are inside a pre, we don't need background.
                                                            // Since we can't easily check parent here without complexity,
                                                            // we will rely on the fact that `pre` renders its own bg.
                                                            // So we just style inline code if it doesn't look like a block?
                                                            // Actually, standard react-markdown:
                                                            // Inline: <code>...</code>
                                                            // Block: <pre><code>...</code></pre>

                                                            // If we assume the generic code props:
                                                            const match = /language-(\w+)/.exec(className || '');
                                                            const isBlock = !!match || String(children).includes('\n');

                                                            return isBlock
                                                                ? <code className={cn("font-mono text-inherit", className)} {...props}>{children}</code>
                                                                : <code className="bg-gray-100 text-pink-600 rounded px-1.5 py-0.5 text-xs font-mono font-bold" {...props}>{children}</code>
                                                        },
                                                        strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
                                                        ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2 space-y-1" {...props} />,
                                                        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />
                                                    }}
                                                >
                                                    {m.content}
                                                </ReactMarkdown>
                                            ) : (
                                                m.content
                                            )}
                                        </div>

                                        {m.role === 'user' && (
                                            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center shrink-0 mt-1">
                                                <Icons.User size={16} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start w-full gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-1">
                                            <Icons.Bot size={16} />
                                        </div>
                                        <div className="bg-white border border-gray-100 rounded-[24px] rounded-tl-sm px-6 py-4 shadow-sm">
                                            <div className="flex space-x-1.5">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-50 z-10 w-full shrink-0">
                        <div className="w-full max-w-4xl mx-auto relative">
                            <form onSubmit={handleSubmit} className="relative bg-white rounded-[28px] border-2 border-gray-100 hover:border-gray-200 focus-within:border-blue-100 focus-within:ring-4 focus-within:ring-blue-50 transition-all shadow-sm">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={messages.length === 0 ? "Ask anything..." : "Message LearnPilot..."}
                                    className="w-full h-[60px] bg-transparent text-gray-900 placeholder-gray-400 border-none focus:ring-0 px-6 pr-14 text-base font-medium rounded-[28px]"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className={cn(
                                        "absolute right-2 top-2 p-3 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95",
                                        input.trim()
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                            : "bg-gray-100 text-gray-300 cursor-not-allowed"
                                    )}
                                >
                                    <Icons.Send size={20} className={cn("transition-transform", isLoading ? "translate-x-1" : "")} />
                                </button>
                            </form>
                            <div className="text-center mt-3 flex items-center justify-center gap-2">
                                <span className={cn("w-2 h-2 rounded-full animate-pulse", selectedModelId.includes('groq') ? "bg-purple-500" : "bg-green-500")}></span>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                    {MODELS.find(m => m.id === selectedModelId)?.name} Active
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </WebAppShell>
    );
}
