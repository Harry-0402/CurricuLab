"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/services/auth.service';
import { Icons } from '@/components/shared/Icons';

export default function UnauthorizedPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            await AuthService.signOut();
            router.push('/login');
        } catch (error) {
            console.error("Logout failed:", error);
            // Fallback redirect even if signOut fails
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center border border-gray-100">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icons.Lock size={40} />
                </div>

                <h1 className="text-3xl font-black text-gray-900 mb-2">Access Denied</h1>
                <p className="text-gray-500 font-medium mb-8">
                    Your email is not on the authorized access list for this private workspace.
                </p>

                <div className="space-y-3">
                    <button
                        onClick={handleLogout}
                        disabled={loading}
                        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none"
                    >
                        {loading ? (
                            <Icons.Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Icons.LogOut size={18} />
                        )}
                        {loading ? "Signing Out..." : "Sign Out & Specify Account"}
                    </button>
                </div>
            </div>
        </div>
    )
}
