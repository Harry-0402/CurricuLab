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

            <div className="w-full max-w-[420px] bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[40px] border border-white/50 shadow-2xl shadow-blue-500/5">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20 transform rotate-3">
                        <Icons.LayoutGrid size={36} />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Sign In</h1>
                    <p className="text-gray-500 font-medium mt-3 text-sm">Choose your preferred method to access the workspace</p>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
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
                            className="flex items-center justify-center gap-3 px-6 py-4 bg-white border border-gray-100 rounded-[24px] hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 active:translate-y-0 transition-all group disabled:opacity-50 disabled:pointer-events-none"
                        >
                            <Icons.Google size={24} className="text-gray-900 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600">Continue with Google</span>
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
                            className="flex items-center justify-center gap-3 px-6 py-4 bg-white border border-gray-100 rounded-[24px] hover:border-gray-300 hover:bg-gray-50 hover:shadow-xl hover:shadow-gray-500/5 hover:-translate-y-1 active:translate-y-0 transition-all group disabled:opacity-50 disabled:pointer-events-none"
                        >
                            <Icons.Github size={24} className="text-gray-900 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-bold text-gray-700 group-hover:text-black">Continue with GitHub</span>
                        </button>
                    </div>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-100" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-gray-300">
                            <span className="bg-[#fafbfc] px-4">Or explore as guest</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => router.push(callbackUrl)}
                        disabled={loading}
                        className="w-full py-4 bg-white border-2 border-dashed border-gray-100 text-gray-400 hover:text-blue-500 hover:border-blue-100 hover:bg-blue-50/30 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:pointer-events-none"
                    >
                        <Icons.Users size={18} className="group-hover:scale-110 transition-transform" />
                        <span>Continue with Guest Mode</span>
                    </button>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-50">
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                            Protected System • CurricuLab IO
                        </p>
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
