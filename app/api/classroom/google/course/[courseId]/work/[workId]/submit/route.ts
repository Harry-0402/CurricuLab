import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { GoogleClassroomService } from '@/lib/services/google-classroom-service';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ courseId: string; workId: string }> } // Update type to Promise
) {
    const { courseId, workId } = await params; // Await params
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // const { courseId, workId } = params;

        // Robust origin detection for proxies (Render)
        const requestUrl = new URL(req.url);
        const host = req.headers.get('host');
        const protocol = req.headers.get('x-forwarded-proto') ?? (requestUrl.protocol === 'https:' ? 'https' : 'http');
        const origin = host ? `${protocol}://${host}` : requestUrl.origin;
        const redirectUri = `${origin}/api/auth/google/callback`;

        // Get fresh tokens (handles automatic refresh and DB sync)
        const tokens = await GoogleClassroomService.getFreshTokens(session.user.id, supabase, redirectUri);

        const submission = await GoogleClassroomService.getStudentSubmission(courseId, workId, tokens, redirectUri);

        return NextResponse.json({ submission });

    } catch (error: any) {
        console.error('Error fetching submission:', error);
        return NextResponse.json(
            { error: error?.message || 'Failed to fetch submission' },
            { status: 500 }
        );
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ courseId: string; workId: string }> } // Update type to Promise
) {
    const { courseId, workId } = await params; // Await params
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // const { courseId, workId } = params;
        const { action, attachments, attachmentIds } = await req.json();

        if (!courseId || !workId) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        // Robust origin detection for proxies (Render)
        const requestUrl = new URL(req.url);
        const host = req.headers.get('host');
        const protocol = req.headers.get('x-forwarded-proto') ?? (requestUrl.protocol === 'https:' ? 'https' : 'http');
        const origin = host ? `${protocol}://${host}` : requestUrl.origin;
        const redirectUri = `${origin}/api/auth/google/callback`;

        // Get fresh tokens (handles automatic refresh and DB sync)
        const tokens = await GoogleClassroomService.getFreshTokens(session.user.id, supabase, redirectUri);

        // 1. Get existing submission
        let submission = await GoogleClassroomService.getStudentSubmission(courseId, workId, tokens, redirectUri);

        if (!submission) {
            return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
        }

        if (action === 'attach') {
            submission = await GoogleClassroomService.addAttachmentsToSubmission(
                courseId,
                workId,
                submission.id,
                attachments,
                tokens,
                redirectUri
            );
        } else if (action === 'turnIn') {
            await GoogleClassroomService.turnInAssignment(
                courseId,
                workId,
                submission.id,
                tokens,
                redirectUri
            );
            submission = await GoogleClassroomService.getStudentSubmission(courseId, workId, tokens, redirectUri);
        } else if (action === 'unsubmit') {
            await GoogleClassroomService.reclaimAssignment(
                courseId,
                workId,
                submission.id,
                tokens,
                redirectUri
            );
            submission = await GoogleClassroomService.getStudentSubmission(courseId, workId, tokens, redirectUri);
        } else if (action === 'detach') {
            submission = await GoogleClassroomService.removeAttachmentFromSubmission(
                courseId,
                workId,
                submission.id,
                attachmentIds,
                tokens,
                redirectUri
            );
        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        return NextResponse.json({ success: true, submission });

    } catch (error: any) {
        console.error('Error processing submission:', error);
        return NextResponse.json(
            { error: error?.message || 'Failed to process submission' },
            { status: 500 }
        );
    }
}
