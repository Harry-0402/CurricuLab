"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { CodeBlock } from './CodeBlock';

interface AnswerDisplayProps {
    content: string;
}

export const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ content }) => {
    // Component overrides for ReactMarkdown
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
            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed font-medium">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={components}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
};
