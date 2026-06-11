'use client';

import React, { useEffect, useState } from 'react';
import { AdminShell } from '@/components/web/admin/AdminShell';
import { Icons } from '@/components/shared/Icons';
import Link from 'next/link';

export default function AdminPage() {
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // null = loading
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const { supabase } = await import('@/utils/supabase/client');
                const { data: { session } } = await supabase.auth.getSession();

                if (!session?.user) {
                    setIsAdmin(false);
                    setIsLoading(false);
                    return;
                }

                // Check profile role
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                setIsAdmin(profile?.role === 'admin');
            } catch (err) {
                console.error('Admin check failed:', err);
                setIsAdmin(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAdmin();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fafbfc]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-gray-400 font-medium">Verifying access...</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fafbfc] p-8">
                <div className="max-w-sm w-full text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Icons.Shield size={36} className="text-red-500" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-500 text-sm mb-8">
                        You need admin privileges to access this page. Contact the system administrator.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-200"
                    >
                        <Icons.Home size={18} />
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return <AdminShell />;
}
