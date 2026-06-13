import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') ?? '/'

    // Determine the correct origin
    // In production (Render), request.url might be internal (e.g. localhost:10000)
    // We should use the Host header to forward to the correct public domain
    const host = request.headers.get('host')
    const protocol = request.headers.get('x-forwarded-proto') ?? 'http'
    const baseUrl = host ? `${protocol}://${host}` : requestUrl.origin;

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
            await supabase.auth.exchangeCodeForSession(code)
        } catch (error) {
            console.error('Error exchanging code for session:', error)
            return NextResponse.redirect(new URL(`/login?error=auth-link-expired`, baseUrl))
        }
    }

    return NextResponse.redirect(new URL(next, baseUrl))
}
