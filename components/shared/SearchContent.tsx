"use client"

import React, { useState } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { MobileAppShell } from '@/components/mobile/MobileAppShell';
import { searchAll } from '@/lib/services/app.service';
import { Icons } from '@/components/shared/Icons';

// Note: In a real app, these would be separate files, but for the master prompt delivery, 
// I'll ensure the routes are defined.

export function SearchContent({ isMobile = false }: { isMobile?: boolean }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;
        const res = await searchAll(query);
        setResults(res);
    };

    return (
        <div className={isMobile ? "px-6 py-4 space-y-6" : "space-y-8"}>
            <h2 className={isMobile ? "text-2xl font-black" : "text-3xl font-black"}>Search</h2>
            <form onSubmit={handleSearch} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search everything..."
                    className="w-full bg-gray-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                />
                <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </form>

            {results && (
                <div className="space-y-6">
                    {results.notes.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Notes</h3>
                            {results.notes.map((n: any) => (
                                <div key={n.id} className="p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                                    <span className="font-bold text-gray-900">{n.title}</span>
                                    <Icons.ChevronRight size={18} className="text-gray-300" />
                                </div>
                            ))}
                        </div>
                    )}
                    {/* ... other results ... */}
                    {results.notes.length === 0 && results.subjects.length === 0 && (
                        <div className="py-20 text-center text-gray-400 font-medium">No results found for &quot;{query}&quot;</div>
                    )}
                </div>
            )}
        </div>
    );
}
