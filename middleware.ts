import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    let res = NextResponse.next({
        request: {
            headers: req.headers,
        },
    });

    // Helper function to redirect while preserving cookies set on `res`
    const redirectWithCookies = (url: URL | string) => {
        const redirectRes = NextResponse.redirect(url);
        res.cookies.getAll().forEach((cookie) => {
            redirectRes.cookies.set(cookie);
        });
        return redirectRes;
    };

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

    // List of public paths and prefixes
    const publicPaths = [
        '/', '/community', '/unauthorized', '/login', '/forgot-password',
        '/auth/callback'
    ];
    const publicPrefixes = ['/auth/'];

    const isPublicPath = publicPaths.includes(req.nextUrl.pathname) || 
                         publicPrefixes.some(prefix => req.nextUrl.pathname.startsWith(prefix));

    // Secure Dashboard Protection for Guests is handled by WebAppShell
    // so we don't redirect them here, allowing them to see the Restricted Access warning.

    // If session exists and user is on login page, redirect to Dashboard
    if (session && req.nextUrl.pathname === '/login') {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/';
        return redirectWithCookies(redirectUrl);
    }

    // CHECK AUTHORIZATION (Whitelist) - Only for authenticated users
    if (session && !isPublicPath) {
        const cookieKey = `app_is_authorized_${session.user.id}`;
        let isAuthorized = req.cookies.get(cookieKey)?.value === 'true';

        if (!isAuthorized) {
            // Query authorized_users table to verify this email is allowed (Case-insensitive)
            const { data, error } = await supabase
                .from('authorized_users')
                .select('email')
                .ilike('email', session.user.email!)
                .single();

            isAuthorized = !!data && !error;

            if (isAuthorized) {
                // Cache the authorization status in a cookie to prevent DB hits on every request
                res.cookies.set(cookieKey, 'true', {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 365, // 1 year cache
                    httpOnly: true,
                    sameSite: 'lax',
                    secure: process.env.NODE_ENV === 'production'
                });
            }
        }

        // If not found in whitelist, redirect to Unauthorized page
        // (Excluding the unauthorized page itself to avoid loops)
        if (!isAuthorized && req.nextUrl.pathname !== '/unauthorized') {
            const redirectUrl = req.nextUrl.clone();
            redirectUrl.pathname = '/unauthorized';
            return redirectWithCookies(redirectUrl);
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
         * - api (API routes, except likely auth)
         * - assets (public assets)
         */
        '/((?!_next/static|_next/image|favicon.ico|api|assets|.*\\..*).*)',
    ],
};
