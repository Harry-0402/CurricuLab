import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    let res = NextResponse.next({
        request: {
            headers: req.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value));
                    res = NextResponse.next({
                        request: {
                            headers: req.headers,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        res.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { session },
    } = await supabase.auth.getSession();

    const publicPaths = [
        '/', '/subjects', '/unauthorized',
        '/tools/mindgrid', '/tools/prompts',
        '/tools/resume',
        '/skillforge', '/focus',
        '/community', '/faculty-fellows', '/docs'
    ];
    const publicPrefixes = ['/subject/', '/unit/', '/auth/'];

    const isPublicPath = publicPaths.includes(req.nextUrl.pathname) || 
                         publicPrefixes.some(prefix => req.nextUrl.pathname.startsWith(prefix));

    // FAILSAFE: If code is in URL but we are NOT on auth/callback, redirect to auth/callback
    const code = req.nextUrl.searchParams.get('code');
    if (code && !req.nextUrl.pathname.startsWith('/auth')) {
        const host = req.headers.get('host');
        const protocol = req.headers.get('x-forwarded-proto') ?? (host?.includes('localhost') ? 'http' : 'https');
        const origin = host ? `${protocol}://${host}` : req.nextUrl.origin;
        
        const callbackUrl = new URL('/auth/callback', origin);
        callbackUrl.searchParams.set('code', code);
        const next = req.nextUrl.searchParams.get('next') || req.nextUrl.pathname;
        if (next) callbackUrl.searchParams.set('next', next);
        
        return NextResponse.redirect(callbackUrl);
    }

    // If session exists and user is on login page, redirect to Dashboard
    if (session && req.nextUrl.pathname === '/login') {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/';
        return NextResponse.redirect(redirectUrl);
    }

    // CHECK AUTHORIZATION (Whitelist) - Only for authenticated users
    if (session && !isPublicPath) {
        // Query authorized_users table to verify this email is allowed (Case-insensitive)
        const { data: isAuthorized, error } = await supabase
            .from('authorized_users')
            .select('email')
            .ilike('email', session.user.email!)
            .single();

        // If not found in whitelist, redirect to Unauthorized page
        // (Excluding the unauthorized page itself to avoid loops)
        if ((!isAuthorized || error) && req.nextUrl.pathname !== '/unauthorized') {
            const redirectUrl = req.nextUrl.clone();
            redirectUrl.pathname = '/unauthorized';
            return NextResponse.redirect(redirectUrl);
        }
    }

    return res;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - .svg, .png, etc (static assets)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
