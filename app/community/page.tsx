"use client"

import React, { useEffect, useState } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { TelegramLogin } from '@/components/web/community/TelegramLogin';
import { TelegramChatInterface } from '@/components/web/community/TelegramChatInterface';
import { supabase } from '@/utils/supabase/client';
import { Icons } from '@/components/shared/Icons';

export default function CommunityPage() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            // const supabase = createClient(); // No longer needed
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // Check if user has telegram_session in authorized_users
                const { data, error } = await supabase
                    .from('authorized_users')
                    .select('telegram_session')
                    .eq('email', user.email!)
                    .single();

                if (data?.telegram_session) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    if (isLoading) {
        return (
            <WebAppShell>
                <div className="flex items-center justify-center h-full">
                    <Icons.Loader2 className="animate-spin text-blue-600" size={40} />
                </div>
            </WebAppShell>
        );
    }

    return (
        <WebAppShell>
            <div className="h-[calc(100vh-8rem)] bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                                <Icons.MessageCircle size={24} />
                            </div>
                            Community Forum
                        </h1>
                        <p className="text-gray-500 font-medium ml-14">Connect, discuss, and learn with your peers.</p>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden relative">
                    {isAuthenticated ? (
                        <TelegramChatInterface onLogout={() => setIsAuthenticated(false)} />
                    ) : (
                        <TelegramLogin onLoginSuccess={() => setIsAuthenticated(true)} />
                    )}
                </div>
            </div>
        </WebAppShell>
    );
}
