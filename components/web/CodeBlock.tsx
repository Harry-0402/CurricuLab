"use client";

import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CodeBlockProps {
    code: string;
    language?: string;
    fileName?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
    code,
    language = 'python',
    fileName
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            toast.success('Code copied to clipboard');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error('Failed to copy code');
        }
    };

    const handleDownload = () => {
        const extension = language === 'python' ? 'py' : language === 'javascript' ? 'js' : 'txt';
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName || `script.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Script downloaded');
    };

    return (
        <div className="group relative my-6 rounded-2xl overflow-hidden border border-gray-200 bg-[#1e1e1e] shadow-xl">
            {/* Header / Tab Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    </div>
                    {fileName && (
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">
                            {fileName}
                        </span>
                    )}
                    <span className="text-[10px] font-black text-blue-400/80 uppercase tracking-[0.2em] px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                        {language}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCopy}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-all active:scale-90"
                        title="Copy code"
                    >
                        {copied ? <Icons.Check size={14} className="text-green-400" /> : <Icons.Copy size={14} />}
                    </button>
                    <button
                        onClick={handleDownload}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-all active:scale-90"
                        title="Download script"
                    >
                        <Icons.Download size={14} />
                    </button>
                </div>
            </div>

            {/* Code Content */}
            <div className="p-6 overflow-x-auto custom-scrollbar">
                <pre className="text-sm font-mono text-gray-300 leading-relaxed">
                    <code>{code}</code>
                </pre>
            </div>

            {/* Bottom Accent */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-30" />
        </div>
    );
};
