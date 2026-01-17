"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/services/auth.service';
import { Icons } from '@/components/shared/Icons';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const { error } = await AuthService.resetPasswordForEmail(email);
            if (error) throw error;
            setMessage("Check your email for the password reset link.");
        } catch (err: any) {
            setError(err.message || "Failed to send reset link");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#fafbfc] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10" />
            <div className="absolute top-1/2 -left-24 w-72 h-72 bg-purple-100/30 rounded-full blur-3xl -z-10" />

            <div className="w-full max-w-[420px] bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[40px] border border-white/50 shadow-2xl shadow-blue-500/5">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Icons.Key size={32} />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900">Forgot Password?</h1>
                    <p className="text-gray-500 font-medium mt-2 text-sm max-w-xs mx-auto">Enter your email and we'll send you instructions to reset your password.</p>
                </div>

                <form onSubmit={handleReset} className="space-y-6">
                    {message && (
                        <div className="p-4 bg-green-50 text-green-700 text-sm font-bold rounded-2xl border border-green-200 flex items-center gap-3">
                            <Icons.CheckCircle size={18} className="shrink-0" />
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl border border-red-100 flex items-center gap-3">
                            <Icons.AlertTriangle size={18} className="shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Email Address</label>
                        <div className="relative group">
                            <div className="absolute left-5 top-4 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                <Icons.Mail size={18} />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] font-bold text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all placeholder:text-gray-300 placeholder:font-medium"
                                placeholder="name@curriculab.com"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gray-900 text-white rounded-[24px] font-black text-sm uppercase tracking-wider hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-gray-200 disabled:opacity-70 disabled:pointer-events-none mt-2 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Icons.Loader2 size={18} className="animate-spin" />
                                <span>Sending...</span>
                            </>
                        ) : (
                            <>
                                <span>Send Reset Link</span>
                                <Icons.ArrowRight size={18} />
                            </>
                        )}
                    </button>

                    <div className="text-center">
                        <a href="/login" className="text-xs font-bold text-gray-400 hover:text-gray-800 transition-colors inline-flex items-center gap-1">
                            <Icons.ArrowLeft size={12} />
                            Back to Login
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
