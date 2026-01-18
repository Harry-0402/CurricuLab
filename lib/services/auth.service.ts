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
    },

    async resetPasswordForEmail(email: string) {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
        });
        return { data, error };
    },

    async updateUserPassword(password: string) {
        const { data, error } = await supabase.auth.updateUser({
            password: password
        });
        return { data, error };
    },

    async updateProfile(attributes: { email?: string, data?: { full_name?: string } }) {
        const { data, error } = await supabase.auth.updateUser(attributes);
        return { data, error };
    },

    async sendEmailOTP(email: string) {
        const { data, error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                // We want a code, not a magic link.
                // Supabase might still send a link depending on template, but effectively it's the same flow if we verify the token.
                // Actually, strictly speaking 'shouldCreateUser: false' is good if we only want existing users.
                shouldCreateUser: false,
            }
        });
        return { data, error };
    },

    async verifyEmailOTP(email: string, token: string) {
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'email'
        });
        return { data, error };
    },

    async signInWithOAuth(provider: 'google' | 'github') {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        });
        return { data, error };
    }
};
