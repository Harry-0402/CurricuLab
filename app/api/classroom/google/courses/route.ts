import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { GoogleClassroomService } from '@/lib/services/google-classroom-service';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            console.log('debug: No session found');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Robust origin detection for proxies (Render)
        const requestUrl = new URL(req.url);
        const host = req.headers.get('host');
        const protocol = req.headers.get('x-forwarded-proto') ?? (requestUrl.protocol === 'https:' ? 'https' : 'http');
        const origin = host ? `${protocol}://${host}` : requestUrl.origin;
        const redirectUri = `${origin}/api/auth/google/callback`;

        // Get fresh tokens (handles automatic refresh and DB sync)
        const tokens = await GoogleClassroomService.getFreshTokens(session.user.id, supabase, redirectUri);

        const courses = await GoogleClassroomService.listCourses(tokens, redirectUri);
        console.log('debug: Courses fetched:', courses.length);

        return NextResponse.json({ courses });

    } catch (error: any) {
        const errorLog = `
Timestamp: ${new Date().toISOString()}
Error: ${JSON.stringify(error, null, 2)}
Message: ${error.message}
Response: ${JSON.stringify(error.response?.data || {}, null, 2)}
----------------------------------------
`;
        try {
            fs.appendFileSync(path.join(process.cwd(), 'debug_errors.log'), errorLog);
        } catch (e) {
            console.error('Failed to write log:', e);
        }
        console.error('Error fetching courses full error:', JSON.stringify(error, null, 2));
        return NextResponse.json(
            { error: 'Failed to fetch courses' },
            { status: 500 }
        );
    }
}
