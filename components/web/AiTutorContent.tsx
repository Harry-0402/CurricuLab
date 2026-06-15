"use client"

import React, { useState, useRef, useEffect } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { GoogleGenerativeAI, FinishReason } from "@google/generative-ai";
import { CodeBlock } from './CodeBlock';

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
// Removed local ChatCodeBlock in favor of global CodeBlock

// Regex to fix common spacing issues in math blocks
const preprocessContent = (content: string) => {
    return content
        // Fix inline math with spaces ($ x $) -> ($x$)
        .replace(/(\$)(?=\S)([^$]+?)(?<=\S)(\$)/g, '$1$2$3')
        // Ensure block math has newlines
        .replace(/\$\$/g, '\n$$$\n');
};



export function AiTutorContent() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedModelId, setSelectedModelId] = useState(MODELS[0].id);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [vaultMode, setVaultMode] = useState(false); // RAG toggle
    const scrollRef = useRef<HTMLDivElement>(null);
    const hasLoaded = useRef(false);

    // Initialize Gemini Client
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    // Load form Local Storage on Mount
    useEffect(() => {
        if (typeof window !== 'undefined' && !hasLoaded.current) {
            const stored = localStorage.getItem('curriculab_learnpilot_chat');
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
            localStorage.setItem('curriculab_learnpilot_chat', JSON.stringify(messages));
        }
    }, [messages]);


    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleClearChat = () => {
        if (confirm("Are you sure you want to clear the chat history?")) {
            setMessages([]);
            localStorage.removeItem('curriculab_learnpilot_chat');
            setShowExportMenu(false);
        }
    };

    const handleExportWord = async () => {
        if (messages.length === 0) return;
        const { PlatformExportService } = await import('@/lib/services/export-service');
        await PlatformExportService.generateChatExport(messages);
        setShowExportMenu(false);
    };

    const handleExportHTML = async () => {
        if (messages.length === 0) return;
        const { PlatformExportService } = await import('@/lib/services/export-service');
        await PlatformExportService.generateChatHTMLExport(messages, "AI Tutor Chat");
        setShowExportMenu(false);
    };

    const generateResponse = async (modelId: string, currentMessages: Message[], userPrompt: string): Promise<{ text: string, isTruncated: boolean }> => {
        const selectedModel = MODELS.find(m => m.id === modelId) || MODELS[0];

        // Handles Groq, Copilot, OpenRouter, AND RAG
        if (vaultMode || selectedModel.provider === 'groq' || selectedModel.provider === 'copilot' || selectedModel.provider === 'openrouter') {
            const endpoint = vaultMode ? '/api/chat-rag' : '/api/chat';
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...currentMessages, { role: 'user', content: userPrompt }],
                    provider: vaultMode ? 'groq' : selectedModel.provider, // RAG uses Groq
                    model: selectedModel.id
                })
            });

            if (!response.ok) throw new Error(`${selectedModel.name} API Error: ${response.statusText}`);
            const data = await response.json();
            return {
                text: data.message,
                isTruncated: data.finishReason === 'length' || data.finishReason === 'max_tokens'
            };
        } else {
            const history = currentMessages.slice(-10).map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }],
            }));

            const model = genAI.getGenerativeModel({
                model: selectedModel.id,
                systemInstruction: "You are an expert AI Tutor. Use Markdown for structure. use LaTeX for ALL math equations (inline: $...$, block: $$...$$)."
            });
            const chat = model.startChat({
                history: history, // history shouldn't include the new user prompt yet, standard gemini pattern is startChat -> sendMessage
                generationConfig: { maxOutputTokens: 2000 },
            });

            const result = await chat.sendMessage(userPrompt);
            const response = result.response;
            const finishReason = response.candidates?.[0]?.finishReason;
            return {
                text: response.text(),
                isTruncated: finishReason === FinishReason.MAX_TOKENS
            };
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
            const { text, isTruncated } = await generateResponse(selectedModelId, messages, userMessage);

            let finalText = text;
            if (isTruncated) {
                finalText += "\n\n_... (The response was cut off due to length limits. Ask me to 'continue' to see the rest!)_";
            }

            setMessages(prev => [...prev, { role: 'assistant', content: finalText }]);
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
            <div className="flex flex-col h-[calc(100vh-220px)] md:h-[calc(100vh-140px)] space-y-6">

                {/* Header & Model Selector */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">LearnPilot</h2>
                        <p className="text-sm font-medium text-gray-500">AI Study Companion</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Clear Chat Button */}
                        <button
                            onClick={handleClearChat}
                            disabled={messages.length === 0}
                            className="flex items-center gap-2 bg-white hover:bg-red-50 text-gray-700 hover:text-red-600 border border-gray-200 px-4 py-2.5 rounded-xl transition-all shadow-sm font-bold text-sm disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-gray-700"
                            title="Clear Chat History"
                        >
                            <Icons.Trash2 size={18} />
                            <span className="hidden sm:inline">Clear</span>
                        </button>

                        {/* Export Button */}
                        <div className="relative print:hidden">
                            <button
                                onClick={() => setShowExportMenu(!showExportMenu)}
                                className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2.5 rounded-xl transition-all shadow-sm font-bold text-sm"
                            >
                                <Icons.Download size={18} />
                                <span className="hidden sm:inline">Export</span>
                                <Icons.ChevronDown size={16} className={`transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
                            </button>

                            {showExportMenu && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                    <button
                                        onClick={handleExportWord}
                                        disabled={messages.length === 0}
                                        className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-colors text-left group disabled:opacity-50"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
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
                                        className="w-full flex items-center gap-3 p-3 hover:bg-amber-50 rounded-xl transition-colors text-left group disabled:opacity-50"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
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

                        {/* Model Select Dropdown */}
                        <div className="relative group">
                            <select
                                value={selectedModelId}
                                onChange={(e) => setSelectedModelId(e.target.value)}
                                disabled={vaultMode} // Disable model select in vault mode
                                className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl px-4 py-2.5 pr-10 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                            >
                                {MODELS.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                            <Icons.ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>

                        {/* Vault Mode Toggle */}
                        <button
                            onClick={() => setVaultMode(!vaultMode)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all shadow-sm font-bold text-sm border",
                                vaultMode 
                                    ? "bg-blue-600 border-blue-600 text-white shadow-blue-200" 
                                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                            )}
                            title="Toggle Vault Mode (RAG)"
                        >
                            <Icons.Database size={18} />
                            <span className="hidden sm:inline">Vault Mode</span>
                        </button>
                    </div>
                </div>

                {/* Chat Area */}
                {/* Chat Area */}
                <div id="learnpilot-chat-container" className="flex-1 min-h-0 bg-white border border-gray-100 rounded-[32px] shadow-sm relative overflow-hidden flex flex-col">

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
                                                    remarkPlugins={[remarkGfm, remarkMath]}
                                                    rehypePlugins={[rehypeKatex]}
                                                    components={{
                                                        // Custom styling for markdown elements
                                                        h1: ({ node, ...props }) => <h1 className="text-xl font-black text-gray-900 mt-6 mb-3" {...props} />,
                                                        h2: ({ node, ...props }) => <h2 className="text-lg font-black text-gray-900 mt-6 mb-3 border-b border-gray-100 pb-1" {...props} />,
                                                        h3: ({ node, ...props }) => <h3 className="text-md font-bold text-gray-800 mt-4 mb-2" {...props} />,
                                                        p: ({ node, ...props }) => <p className="text-gray-700 leading-relaxed mb-4 text-sm font-medium" {...props} />,
                                                        table: ({ node, ...props }) => <div className="overflow-x-auto my-4 rounded-xl border border-gray-100"><table className="w-full text-left text-sm" {...props} /></div>,
                                                        thead: ({ node, ...props }) => <thead className="bg-gray-50 text-gray-600 font-bold" {...props} />,
                                                        th: ({ node, ...props }) => <th className="px-4 py-3 border-b border-gray-100" {...props} />,
                                                        td: ({ node, ...props }) => <td className="px-4 py-3 border-b border-gray-50" {...props} />,
                                                        code: ({ node, inline, className, children, ...props }: any) => {
                                                            const match = /language-(\w+)/.exec(className || '');
                                                            const lang = match ? match[1] : '';
                                                            const codeContent = String(children).replace(/\n$/, '');

                                                            if (!inline && lang) {
                                                                return <CodeBlock code={codeContent} language={lang} />;
                                                            }
                                                            return (
                                                                <code className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-md font-mono text-xs font-bold" {...props}>
                                                                    {children}
                                                                </code>
                                                            );
                                                        },
                                                        strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
                                                        ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-3 space-y-2 text-gray-700 text-sm font-medium" {...props} />,
                                                        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-3 space-y-2 text-gray-700 text-sm font-medium" {...props} />
                                                    }}
                                                >
                                                    {preprocessContent(m.content)}
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



        </WebAppShell >
    );
}
