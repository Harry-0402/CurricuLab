import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { GoogleDriveService } from '@/lib/services/google-drive-service';
import { GoogleClassroomService } from '@/lib/services/google-classroom-service';

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

        // Robust origin detection for proxies (Render)
        const requestUrl = new URL(req.url);
        const host = req.headers.get('host');
        const protocol = req.headers.get('x-forwarded-proto') ?? (requestUrl.protocol === 'https:' ? 'https' : 'http');
        const origin = host ? `${protocol}://${host}` : requestUrl.origin;
        const redirectUri = `${origin}/api/auth/google/callback`;

        // Get fresh tokens (handles automatic refresh and DB sync)
        const tokens = await GoogleClassroomService.getFreshTokens(session.user.id, supabase, redirectUri);

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
