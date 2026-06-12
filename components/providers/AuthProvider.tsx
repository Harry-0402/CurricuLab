'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

interface AuthContextValue {
    user: User | null;
    isAdmin: boolean;
    isAuthLoading: boolean;
    sessionToken: string | undefined;
}

const AuthContext = createContext<AuthContextValue>({
    user: null,
    isAdmin: false,
    isAuthLoading: true,
    sessionToken: undefined
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [sessionToken, setSessionToken] = useState<string | undefined>(undefined);

    useEffect(() => {
        let subscription: any;
        const setupAuth = async () => {
            try {
                const { supabase } = await import('@/utils/supabase/client');
                
                // Get initial session
                const { data: { session } } = await supabase.auth.getSession();
                setUser(session?.user ?? null);
                setSessionToken(session?.access_token);
                
                if (session?.user) {
                    // Fetch admin status
                    const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
                    setIsAdmin(profile?.role === 'admin');
                }
                
                setIsAuthLoading(false);

                // Listen for future auth changes globally
                const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
                    setUser(session?.user ?? null);
                    setSessionToken(session?.access_token);
                    if (session?.user) {
                        const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
                        setIsAdmin(profile?.role === 'admin');
                    } else {
                        setIsAdmin(false);
                    }
                });
                subscription = data.subscription;
            } catch (err) {
                console.error("Global auth provider failed to setup:", err);
                setIsAuthLoading(false);
            }
        };

        setupAuth();

        return () => {
            if (subscription) subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAdmin, isAuthLoading, sessionToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
