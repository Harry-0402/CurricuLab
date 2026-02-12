"use client"

import React from 'react';
import Link from 'next/link';
import { Icons } from '@/components/shared/Icons';

import { cn } from '@/lib/utils';


export function WebHeader() {


    const [user, setUser] = React.useState<any>(null);

    const handleLogout = async () => {
        try {
            await import('@/lib/services/auth.service').then(mod => mod.AuthService.signOut());
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    React.useEffect(() => {
        let subscription: any;

        const setupAuthListener = async () => {
            const { supabase } = await import('@/utils/supabase/client');

            // Initial fetch
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            setUser(currentUser);

            // Subscribe to changes
            const { data } = supabase.auth.onAuthStateChange((_event, session) => {
                setUser(session?.user ?? null);
            });
            subscription = data.subscription;
        };

        setupAuthListener();

        return () => {
            if (subscription) subscription.unsubscribe();
        };
    }, []);

    const getDisplayName = () => {
        if (!user) return 'Student';
        // Prefer metadata name
        if (user.user_metadata?.full_name) return user.user_metadata.full_name;
        // Fallback to email derived name
        if (user.email) {
            const name = user.email.split('@')[0];
            return name.charAt(0).toUpperCase() + name.slice(1);
        }
        return 'Student';
    };

    const displayName = getDisplayName();

    return (
        <header className="h-20 border-b border-gray-100 bg-white sticky top-0 z-30 px-8 flex items-center justify-between print:hidden">
            <div>
                <h1 className="text-sm font-medium text-gray-500 mb-0.5">Hello,</h1>
                <p className="text-lg font-bold text-gray-900 capitalize">{displayName}</p>
            </div>

            <div className="flex items-center gap-2">


                <Link
                    href="/tools/resume"
                    className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-xl transition-all shadow-sm active:scale-95 group"
                >
                    <Icons.Briefcase size={16} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
                    <span className="text-xs font-bold text-gray-600 group-hover:text-indigo-600 transition-colors">ResumeStudio</span>
                </Link>

                <Link
                    href="/profile"
                    className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-xl transition-all shadow-sm active:scale-95 group"
                    title="My Profile"
                >
                    <Icons.User size={16} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
                    <span className="text-xs font-bold text-gray-600 group-hover:text-indigo-600 transition-colors">Profile</span>
                </Link>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-red-50 text-gray-700 px-3 py-2 rounded-xl transition-all shadow-sm active:scale-95 group"
                    title="Sign Out"
                >
                    <Icons.LogOut size={16} className="text-gray-400 group-hover:text-red-600 transition-colors" />
                    <span className="text-xs font-bold text-gray-600 group-hover:text-red-600 transition-colors">Logout</span>
                </button>
            </div>


        </header>
    );
}
