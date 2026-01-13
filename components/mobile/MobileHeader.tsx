import React from 'react';
import { Icons } from '@/components/shared/Icons';

export function MobileHeader() {
    return (
        <header className="sticky top-0 bg-white/50 backdrop-blur-md z-40 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                    <Icons.Home size={24} />
                </div>
                <div>
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hi, Hermione</h2>
                    <p className="text-sm font-black text-gray-900">Good Morning! ⚡</p>
                </div>
            </div>

            <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500">
                <Icons.Analytics size={20} />
            </button>
        </header>
    );
}
