"use client"

import React, { useState, useEffect } from 'react';
import { Icons } from '@/components/shared/Icons';
import { focusQuotes } from '@/lib/data/focus-quotes';

export function QuoteGenerator() {
    const [quote, setQuote] = useState({ text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" });
    const [loading, setLoading] = useState(false);

    const fetchQuote = () => {
        setLoading(true);
        // Simulate a small delay for effect
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * focusQuotes.length);
            setQuote(focusQuotes[randomIndex]);
            setLoading(false);
        }, 600);
    };

    // Initial fetch
    useEffect(() => {
        // Optional: Fetch a fresh quote on mount or just use default
        // fetchQuote();
    }, []);

    return (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-lg flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[400px] h-full">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <Icons.Quote size={200} className="absolute -top-10 -left-10" />
            </div>

            <div className="relative z-10 max-w-lg">
                <div className="mb-6 flex justify-center">
                    <Icons.Quote size={40} className="text-white/80" />
                </div>

                <h3 className="text-2xl md:text-3xl font-serif italic font-medium leading-relaxed mb-6">
                    "{quote.text}"
                </h3>

                <p className="text-lg font-medium text-white/90 mb-10">
                    — {quote.author}
                </p>

                <button
                    onClick={fetchQuote}
                    disabled={loading}
                    className="group bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl px-6 py-3 flex items-center gap-2 mx-auto transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Icons.Sparkles size={18} className={loading ? "animate-spin" : "group-hover:text-yellow-300 transition-colors"} />
                    <span className="font-semibold">
                        {loading ? 'Finding Inspiration...' : 'Inspire Me'}
                    </span>
                </button>
            </div>
        </div>
    );
}
