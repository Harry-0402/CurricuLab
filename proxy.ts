import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(req: NextRequest) {
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

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error("Missing Supabase environment variables in proxy");
        return new NextResponse("Internal Server Error: Missing Supabase Env Variables", { status: 500 });
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    // Keep track of existing cookies we might have manually set on `res`
                    const existingCookies = res.cookies.getAll();
                    
                    cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
                    res = NextResponse.next({
                        request: {
                            headers: req.headers,
                        },
                    });
                    
                    // Re-apply any previous cookies
                    existingCookies.forEach((cookie) => {
                        res.cookies.set(cookie.name, cookie.value);
                    });
                    
                    // Apply new Supabase cookies
                    cookiesToSet.forEach(({ name, value, options }) =>
                        res.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

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

    // If user is authenticated and on login page, redirect to Dashboard
    if (user && req.nextUrl.pathname === '/login') {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/';
        return redirectWithCookies(redirectUrl);
    }

    // CHECK AUTHORIZATION (Whitelist) - Only for authenticated users
    if (user && !isPublicPath) {
        if (!user.email) {
            console.error("User missing email address attempting to access secure route:", user.id);
            const redirectUrl = req.nextUrl.clone();
            redirectUrl.pathname = '/unauthorized';
            return redirectWithCookies(redirectUrl);
        }

        const cookieKey = `app_is_authorized_${user.id}`;
        let isAuthorized = req.cookies.get(cookieKey)?.value === 'true';

        if (!isAuthorized) {
            // Query authorized_users table to verify this email is allowed (Case-insensitive)
            const { data, error } = await supabase
                .from('authorized_users')
                .select('email')
                .ilike('email', user.email)
                .single();

            isAuthorized = !!data && !error;

            if (isAuthorized) {
                // Cache the authorization status in a cookie to prevent DB hits on every request
                // Cache set to 1 hour to ensure changes in whitelist propagate relatively quickly
                res.cookies.set(cookieKey, 'true', {
                    path: '/',
                    maxAge: 60 * 60, // 1 hour cache
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
         * - assets (public assets)
         * (Removed 'api' from exclusion to process API routes)
         */
        '/((?!_next/static|_next/image|favicon.ico|assets|.*\\..*).*)',
    ],
};
