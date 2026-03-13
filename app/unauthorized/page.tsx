"use client"

import { Icons } from '@/components/shared/Icons';
import { AuthService } from '@/lib/services/auth.service';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';

export default function UnauthorizedPage() {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUserEmail(session?.user?.email || null);
        };
        getUser();
    }, []);

    const handleSignOut = async () => {
        await AuthService.signOut();
        router.push('/');
        router.refresh();
    };

    return (
        <div className="min-h-screen w-full bg-[#fafbfc] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-red-50/50 to-transparent -z-10" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-100/40 rounded-full blur-3xl -z-10" />
            <div className="absolute top-1/2 -left-24 w-72 h-72 bg-orange-100/30 rounded-full blur-3xl -z-10" />

            <div className="w-full max-w-[480px] bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[40px] border border-white/50 shadow-2xl shadow-red-500/5 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-red-500/20 transform -rotate-3 transition-transform hover:rotate-0 duration-500">
                    <Icons.AlertTriangle size={44} />
                </div>

                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Access Restricted</h1>

                <div className="space-y-4 mb-10">
                    <p className="text-gray-500 font-medium">
                        CurricuLab is currently in <span className="text-red-600 font-bold uppercase tracking-wider text-[10px] px-2 py-1 bg-red-50 rounded-lg">Private Beta</span>.
                    </p>

                    <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 mt-6">
                        <p className="text-xs text-gray-400 uppercase font-black tracking-widest mb-2">Signed in as</p>
                        <p className="text-sm font-bold text-gray-900 break-all">{userEmail || 'Unknown User'}</p>
                    </div>

                    <p className="text-sm text-gray-500 leading-relaxed px-4">
                        This email address is not yet on our authorized list. Please contact the administrator or your institution to request access.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <button
                        onClick={handleSignOut}
                        className="w-full py-4 bg-gray-900 text-white rounded-[24px] font-black text-sm uppercase tracking-wider hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2 group"
                    >
                        <Icons.LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Sign Out & Switch Account</span>
                    </button>

                    <a
                        href="mailto:curriculab01@gmail.com?subject=Access Request"
                        className="w-full py-4 bg-white border-2 border-gray-100 text-gray-900 rounded-[24px] font-black text-sm uppercase tracking-wider hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                        <Icons.Mail size={18} />
                        <span>Request Invitation</span>
                    </a>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100">
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                        Security Layer • CurricuLab Beta
                    </p>
                </div>
            </div>
        </div>
    );
}
