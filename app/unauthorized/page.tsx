"use client"

import Link from 'next/link';
import { Icons } from '@/components/shared/Icons';

export default function UnauthorizedPage() {
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
                    <Link
                        href="/login"
                        onClick={() => {
                            // Force clear any client side state if needed
                            // In a real app, we might want to call signOut() here
                            import('@/lib/services/auth.service').then(m => m.AuthService.signOut())
                        }}
                        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                    >
                        <Icons.LogOut size={18} />
                        Sign Out & specificy Account
                    </Link>
                </div>
            </div>
        </div>
    )
}
