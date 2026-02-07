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

        const submission = await GoogleClassroomService.getStudentSubmission(courseId, workId, tokens);

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

        // 1. Get existing submission
        let submission = await GoogleClassroomService.getStudentSubmission(courseId, workId, tokens);

        if (!submission) {
            return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
        }

        if (action === 'attach') {
            submission = await GoogleClassroomService.addAttachmentsToSubmission(
                courseId,
                workId,
                submission.id,
                attachments,
                tokens
            );
        } else if (action === 'turnIn') {
            await GoogleClassroomService.turnInAssignment(
                courseId,
                workId,
                submission.id,
                tokens
            );
            submission = await GoogleClassroomService.getStudentSubmission(courseId, workId, tokens);
        } else if (action === 'unsubmit') {
            await GoogleClassroomService.reclaimAssignment(
                courseId,
                workId,
                submission.id,
                tokens
            );
            submission = await GoogleClassroomService.getStudentSubmission(courseId, workId, tokens);
        } else if (action === 'detach') {
            submission = await GoogleClassroomService.removeAttachmentFromSubmission(
                courseId,
                workId,
                submission.id,
                attachmentIds,
                tokens
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
