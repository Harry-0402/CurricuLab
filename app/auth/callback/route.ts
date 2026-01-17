import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') ?? '/'

    if (code) {
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
    }

    // Determine the correct origin
    // In production (Render), request.url might be internal (e.g. localhost:10000)
    // We should use the Host header to forward to the correct public domain
    const host = request.headers.get('host')
    const protocol = request.headers.get('x-forwarded-proto') ?? 'http'

    // Safety check: if we verify it's localhost, keep http. If production, force https if proto header exists?
    // Usually 'host' is sufficient for the domain.

    const baseUrl = host ? `${protocol}://${host}` : requestUrl.origin;

    return NextResponse.redirect(new URL(next, baseUrl))
}
