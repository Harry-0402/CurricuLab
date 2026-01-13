"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';

const mobileNavItems = [
    { label: 'Home', href: '/mobile', icon: Icons.Home },
    { label: 'Subjects', href: '/mobile/subjects', icon: Icons.Subjects },
    { label: 'Quick Add', href: '/mobile/add', icon: Icons.Plus, isCenter: true },
    { label: 'Search', href: '/mobile/search', icon: Icons.Search },
    { label: 'Profile', href: '/mobile/profile', icon: Icons.Profile },
];

export function MobileBottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex items-center justify-around h-20 pb-2 px-4 z-50">
            {mobileNavItems.map((item) => {
                const isActive = pathname === item.href;

                if (item.isCenter) {
                    return (
                        <Link key={item.href} href={item.href} className="-mt-12 bg-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 ring-4 ring-white">
                            <item.icon size={28} />
                        </Link>
                    );
                }

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center gap-1 min-w-[64px]",
                            isActive ? "text-blue-600" : "text-gray-400"
                        )}
                    >
                        <item.icon size={22} className={cn("transition-transform", isActive && "scale-110")} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
