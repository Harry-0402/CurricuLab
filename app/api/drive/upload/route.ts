import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { GoogleDriveService } from '@/lib/services/google-drive-service';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;
        const metadataStr = formData.get('metadata') as string;

        if (!file || !metadataStr) {
            return NextResponse.json({ error: 'Missing file or metadata' }, { status: 400 });
        }

        const metadata = JSON.parse(metadataStr);

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

        const buffer = Buffer.from(await file.arrayBuffer());

        const driveFile = await GoogleDriveService.uploadFile({
            fileBuffer: buffer,
            fileName: file.name,
            mimeType: file.type,
            metadata: {
                ...metadata,
                title: file.name,
            }
        }, tokens, redirectUri);

        return NextResponse.json({ file: driveFile });

    } catch (error: any) {
        console.error('Error in drive upload route:', error);
        return NextResponse.json(
            { error: error?.message || 'Failed to upload file' },
            { status: 500 }
        );
    }
}
