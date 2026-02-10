"use client";

import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from './CodeBlock';

interface AnswerDisplayProps {
    content: string;
}

export const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ content }) => {
    const [activeTab, setActiveTab] = useState<'answer' | 'code'>('answer');

    // Extract code blocks from markdown to show in "Implementation" tab
    const codeBlocks = useMemo(() => {
        const blocks: { language: string; code: string }[] = [];
        const regex = /```(\w+)?\n([\s\S]*?)```/g;
        let match;

        while ((match = regex.exec(content)) !== null) {
            blocks.push({
                language: match[1] || 'text',
                code: match[2].trim()
            });
        }
        return blocks;
    }, [content]);

    const hasCode = codeBlocks.length > 0;

    // Component overrides for ReactMarkdown in the "Answer" tab
    const components = {
        h1: ({ ...props }: any) => <h1 className="text-xl font-black text-gray-900 mt-6 mb-3" {...props} />,
        h2: ({ ...props }: any) => <h2 className="text-lg font-black text-gray-900 mt-6 mb-3 border-b border-gray-200 pb-1" {...props} />,
        h3: ({ ...props }: any) => <h3 className="text-md font-bold text-gray-800 mt-4 mb-2" {...props} />,
        p: ({ ...props }: any) => <p className="text-gray-700 leading-relaxed mb-4 text-sm font-medium" {...props} />,
        ul: ({ ...props }: any) => <ul className="list-disc pl-5 mb-4 space-y-1.5 text-sm text-gray-700" {...props} />,
        ol: ({ ...props }: any) => <ol className="list-decimal pl-5 mb-4 space-y-1.5 text-sm text-gray-700" {...props} />,
        table: ({ ...props }: any) => <div className="overflow-x-auto mb-4"><table className="w-full text-xs text-left border-collapse border border-gray-200" {...props} /></div>,
        th: ({ ...props }: any) => <th className="px-3 py-2 bg-gray-100 border border-gray-200 font-bold" {...props} />,
        td: ({ ...props }: any) => <td className="px-3 py-2 border border-gray-100" {...props} />,
        code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const lang = match ? match[1] : '';
            const codeContent = String(children).replace(/\n$/, '');

            if (!inline && lang) {
                // In main answer, we still show code but styled nicely
                return <CodeBlock code={codeContent} language={lang} />;
            }
            return (
                <code className={cn("bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-md font-mono text-xs font-bold", className)} {...props}>
                    {children}
                </code>
            );
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-3xl overflow-hidden">
            {/* Tab Controls */}
            {hasCode && (
                <div className="flex items-center gap-2 p-1 bg-gray-100/80 rounded-2xl mb-6 self-start">
                    <button
                        onClick={() => setActiveTab('answer')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            activeTab === 'answer'
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        <Icons.FileText size={14} />
                        Answer
                    </button>
                    <button
                        onClick={() => setActiveTab('code')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            activeTab === 'code'
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        <Icons.Code size={14} />
                        Implementation
                        <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded-md text-[8px]">
                            {codeBlocks.length}
                        </span>
                    </button>
                </div>
            )}

            <div className="flex-1 overflow-y-auto no-scrollbar">
                {activeTab === 'answer' ? (
                    <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed font-medium">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={components}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 mb-6">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">Code Lab Context</h4>
                            <p className="text-gray-700 font-medium leading-relaxed text-sm">
                                This implementation contains the core logic requested. You can copy the code directly or download the script to run it locally.
                            </p>
                        </div>
                        {codeBlocks.map((block, idx) => (
                            <CodeBlock
                                key={idx}
                                code={block.code}
                                language={block.language}
                                fileName={codeBlocks.length > 1 ? `part_${idx + 1}.${block.language === 'python' ? 'py' : 'txt'}` : undefined}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
