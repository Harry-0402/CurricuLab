import { createBrowserClient } from '@supabase/auth-helpers-nextjs'

// Use relative URL for client-side to hit our Next.js rewrite proxy
// This bypasses ISP bans by routing through our Next.js server first
const isBrowser = typeof window !== 'undefined';
const supabaseUrl = isBrowser ? '/api/supabase' : process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
