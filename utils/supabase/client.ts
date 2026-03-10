import { createBrowserClient } from '@supabase/auth-helpers-nextjs'

// Use window.location.origin to form a valid HTTP/HTTPS URL for client-side
// to hit our Next.js rewrite proxy and avoid "Invalid supabaseUrl" validation errors
const isBrowser = typeof window !== 'undefined';
const supabaseUrl = isBrowser ? `${window.location.origin}/api/supabase` : process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
