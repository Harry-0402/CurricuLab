"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/services/auth.service';
import { WebAppShell } from '@/components/web/WebAppShell';
import { Icons } from '@/components/shared/Icons';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await AuthService.signIn(email, password);
            if (error) throw error;
            router.push('/'); // Redirect to home or previous page
        } catch (err: any) {
            setError(err.message || "Failed to sign in");
        } finally {
            setLoading(false);
        }
    };

    return (
        <WebAppShell>
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
                <div className="w-full max-w-md bg-white p-8 rounded-[35px] border border-gray-100 shadow-xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Icons.Lock size={32} />
                        </div>
                        <h1 className="text-3xl font-black text-gray-900">Team Login</h1>
                        <p className="text-gray-500 font-bold mt-2">Sign in to manage content</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100 flex items-center gap-2">
                                <Icons.Info size={16} />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-wider text-gray-400 pl-1">Email</label>
                            <div className="relative">
                                <Icons.Profile className="absolute left-4 top-3 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                    placeholder="name@curriculab.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-wider text-gray-400 pl-1">Password</label>
                            <div className="relative">
                                <Icons.Lock className="absolute left-4 top-3 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-lg hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:pointer-events-none mt-4 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    Sign In <Icons.ChevronRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-xs font-bold text-gray-400 mt-8">
                        Authorized Personnel Only • CurricuLab
                    </p>
                </div>
            </div>
        </WebAppShell>
    );
}
