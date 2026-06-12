"use client"

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthService } from '@/lib/services/auth.service';
import { Icons } from '@/components/shared/Icons';
import { toast } from 'sonner';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const [loading, setLoading] = useState(false);

    return (
        <div className="min-h-screen w-full bg-[#fafbfc] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10" />
            <div className="absolute top-1/2 -left-24 w-72 h-72 bg-purple-100/30 rounded-full blur-3xl -z-10" />

            <div className="w-full max-w-[420px] bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-[40px] border border-white/50 shadow-2xl shadow-blue-500/5">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-[24px] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20 transform rotate-3">
                        <Icons.LayoutGrid size={36} />
                    </div>
                    <h1 className="text-3xl font-black text-[#0f172a] tracking-tight">Welcome Back</h1>
                    <p className="text-gray-500 font-medium mt-3 text-sm max-w-[280px] mx-auto leading-relaxed">
                        Choose your preferred method to access the workspace
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={async () => {
                                setLoading(true);
                                const { error } = await AuthService.signInWithOAuth('google', callbackUrl);
                                if (error) {
                                    toast.error(error.message);
                                    setLoading(false);
                                }
                            }}
                            disabled={loading}
                            className="flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-100 rounded-[20px] hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all group disabled:opacity-50"
                        >
                            <Icons.Google size={20} className="text-[#0f172a]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#0f172a]">Google</span>
                        </button>

                        <button
                            type="button"
                            onClick={async () => {
                                setLoading(true);
                                const { error } = await AuthService.signInWithOAuth('github', callbackUrl);
                                if (error) {
                                    toast.error(error.message);
                                    setLoading(false);
                                }
                            }}
                            disabled={loading}
                            className="flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-100 rounded-[20px] hover:border-gray-300 hover:bg-gray-50 hover:shadow-xl hover:shadow-gray-500/5 transition-all group disabled:opacity-50"
                        >
                            <Icons.Github size={20} className="text-[#0f172a]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#0f172a]">GitHub</span>
                        </button>
                    </div>

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-100" />
                        </div>
                        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                            <span className="bg-white px-4">Or exploration first</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => router.push(callbackUrl)}
                        disabled={loading}
                        className="w-full h-16 bg-white border-2 border-dashed border-blue-100 text-blue-600 hover:text-blue-700 hover:border-blue-200 hover:bg-blue-50/30 rounded-[24px] transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
                    >
                        <div className="w-10 h-10 bg-blue-50/50 rounded-xl flex items-center justify-center group-hover:bg-blue-100/50 transition-colors">
                            <Icons.Users size={20} className="text-blue-600 group-hover:text-blue-700" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Continue with Guest Mode</span>
                    </button>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-50 flex flex-col items-center gap-2">
                    <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                        Protected System • CurricuLab IO
                    </p>
                    <div className="flex gap-4 text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                        <a href="/terms" className="hover:text-blue-500 transition-colors">Terms</a>
                        <span>•</span>
                        <a href="/privacy" className="hover:text-blue-500 transition-colors">Privacy</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen w-full bg-[#fafbfc] flex items-center justify-center p-4">
                <div className="flex flex-col items-center gap-4">
                    <Icons.Loader2 size={40} className="animate-spin text-blue-500" />
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">CurricuLab</p>
                </div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
