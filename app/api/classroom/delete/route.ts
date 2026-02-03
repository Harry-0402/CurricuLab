import { NextRequest, NextResponse } from 'next/server';
import { GoogleDriveService } from '@/lib/services/google-drive-service';
import { createSupabaseServerClient } from '@/utils/supabase/server';

export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();

        // 1. Authenticate user
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const fileId = searchParams.get('fileId');

        if (!fileId) {
            return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
        }

        // 2. Get user's Google tokens
        const { data: tokens, error: tokenError } = await supabase
            .from('google_oauth_tokens')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

        if (tokenError || !tokens) {
            return NextResponse.json(
                { error: 'Google Drive not connected', code: 'DRIVE_NOT_CONNECTED' },
                { status: 403 }
            );
        }

        // 3. Delete from Google Drive using user's tokens
        const success = await GoogleDriveService.deleteFile(fileId, {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expiry_date: new Date(tokens.expires_at).getTime(),
            scope: tokens.scope,
            token_type: tokens.token_type
        });

        if (success) {
            return NextResponse.json({ message: 'File deleted successfully' }, { status: 200 });
        } else {
            return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
        }
    } catch (error: any) {
        console.error('Error in delete API:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete file' },
            { status: 500 }
        );
    }
}
