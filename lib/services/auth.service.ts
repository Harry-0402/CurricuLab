import { supabase } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export const AuthService = {
    async signInWithEmail(email: string) {
        // For this app, we might use Magic Links or Password
        // Using Magic Link for simplicity if SMTP is set up, or Password if enabled
        // Let's assume Password for now as per plan
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: 'password123', // Hardcoded for prototype simplicity or user entered
        });
        return { data, error };
    },

    async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        return { data, error };
    },

    async signOut() {
        const { error } = await supabase.auth.signOut();
        return { error };
    },

    async getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    onAuthStateChange(callback: (user: User | null) => void) {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            callback(session?.user ?? null);
        });
        return subscription;
    }
};
