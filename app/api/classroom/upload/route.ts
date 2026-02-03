import { NextRequest, NextResponse } from 'next/server';
import { GoogleDriveService } from '@/lib/services/google-drive-service';
import { createSupabaseServerClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();

        // 1. Authenticate user
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

        // 3. Get form data
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const metadataString = formData.get('metadata') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const metadata = JSON.parse(metadataString);

        // 4. Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 5. Upload to Google Drive using user's tokens
        const driveFile = await GoogleDriveService.uploadFile({
            fileBuffer: buffer,
            fileName: file.name,
            mimeType: file.type,
            metadata,
        }, {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expiry_date: new Date(tokens.expires_at).getTime(),
            scope: tokens.scope,
            token_type: tokens.token_type
        });

        return NextResponse.json(driveFile, { status: 200 });

    } catch (error: any) {
        console.error('Error in upload API:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to upload file' },
            { status: 500 }
        );
    }
}
