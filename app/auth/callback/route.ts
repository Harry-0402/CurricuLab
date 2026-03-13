import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') ?? '/'

    if (code) {
        try {
            const cookieStore = await cookies()
            const supabase = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    cookies: {
                        getAll() {
                            return cookieStore.getAll()
                        },
                        setAll(cookiesToSet) {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        },
                    },
                }
            )
            const { error } = await supabase.auth.exchangeCodeForSession(code)
            if (error) {
                console.error('Auth Callback Error:', error.message)
                return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin))
            }
        } catch (err: any) {
            console.error('Auth Callback Unexpected Error:', err)
        }
    }

    // Determine the correct origin for absolute redirect
    const host = request.headers.get('host')
    const protocol = request.headers.get('x-forwarded-proto') ?? (host?.includes('localhost') ? 'http' : 'https')
    const origin = host ? `${protocol}://${host}` : requestUrl.origin;

    return NextResponse.redirect(new URL(next, origin))
}
