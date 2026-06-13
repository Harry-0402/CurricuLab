import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { GoogleDriveService } from '@/lib/services/google-drive-service';
import { GoogleClassroomService } from '@/lib/services/google-classroom-service';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ fileId: string }> }
) {
    let fileId = 'unknown';
    try {
        const paramsData = await params;
        fileId = paramsData.fileId;
        const supabase = await createSupabaseServerClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get origin for redirect URI
        const requestUrl = new URL(req.url);
        const host = req.headers.get('host');
        const protocol = req.headers.get('x-forwarded-proto') ?? (requestUrl.protocol === 'https:' ? 'https' : 'http');
        const origin = host ? `${protocol}://${host}` : requestUrl.origin;
        const redirectUri = `${origin}/api/auth/google/callback`;

        // Get fresh tokens (handles automatic refresh and DB sync)
        const tokens = await GoogleClassroomService.getFreshTokens(session.user.id, supabase, redirectUri);

        // Download file
        const { buffer, mimeType } = await GoogleDriveService.downloadFile(fileId, tokens, redirectUri);

        let extractedText = undefined;
        // If it's a DOCX file, extract text using mammoth
        if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            try {
                const mammoth = await import('mammoth');
                const result = await mammoth.extractRawText({ buffer });
                extractedText = result.value;
            } catch (err) {
                console.error('Mammoth extraction failed:', err);
            }
        }

        // Convert to Base64
        const base64 = buffer.toString('base64');

        return NextResponse.json({
            base64,
            mimeType,
            text: extractedText
        });

    } catch (error: any) {
        const errorLog = `
--- FILE CONTENT ERROR ---
Timestamp: ${new Date().toISOString()}
FileId: ${fileId}
Error: ${JSON.stringify(error, null, 2)}
Message: ${error.message}
Response: ${JSON.stringify(error.response?.data || {}, null, 2)}
----------------------------------------
`;
        try {
            const fs = await import('fs');
            const path = await import('path');
            fs.appendFileSync(path.join(process.cwd(), 'debug_errors.log'), errorLog);
        } catch (e) {
            console.error('Failed to write log:', e);
        }

        console.error('Error fetching file content:', error);
        return NextResponse.json(
            { error: 'Failed to fetch file content', details: error.message },
            { status: 500 }
        );
    }
}
