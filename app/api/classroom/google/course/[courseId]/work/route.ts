import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { GoogleClassroomService } from '@/lib/services/google-classroom-service';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ courseId: string }> } // Update type to Promise
) {
    const { courseId } = await params; // Await params
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }


        if (!courseId) {
            return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
        }

        // Get tokens
        const { data: tokenData, error: tokenError } = await supabase
            .from('google_oauth_tokens')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

        if (tokenError || !tokenData) {
            return NextResponse.json({ error: 'Google account not connected' }, { status: 400 });
        }

        const tokens = {
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token,
            scope: tokenData.scope,
            token_type: tokenData.token_type,
            expiry_date: new Date(tokenData.expires_at).getTime(),
        };

        // Robust origin detection for proxies (Render)
        const requestUrl = new URL(req.url);
        const host = req.headers.get('host');
        const protocol = req.headers.get('x-forwarded-proto') ?? (requestUrl.protocol === 'https:' ? 'https' : 'http');
        const origin = host ? `${protocol}://${host}` : requestUrl.origin;
        const redirectUri = `${origin}/api/auth/google/callback`;

        const [courseWork, courseMaterials, announcements] = await Promise.all([
            GoogleClassroomService.listCourseWork(courseId, tokens, redirectUri),
            GoogleClassroomService.listCourseWorkMaterials(courseId, tokens, redirectUri),
            GoogleClassroomService.listAnnouncements(courseId, tokens, redirectUri)
        ]);

        console.log(`Debug: Course ${courseId} - Work: ${courseWork.length}, Materials: ${courseMaterials.length}, Announcements: ${announcements.length}`);

        return NextResponse.json({ courseWork, courseMaterials, announcements });

    } catch (error) {
        console.error('Error fetching course work:', error);
        return NextResponse.json(
            { error: 'Failed to fetch course work' },
            { status: 500 }
        );
    }
}
