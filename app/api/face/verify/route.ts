import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';

const COMPREFACE_URL = process.env.COMPREFACE_URL || 'http://localhost:8000';
const COMPREFACE_API_KEY = process.env.COMPREFACE_API_KEY || '00000000-0000-0000-0000-000000000002';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as Blob;

        if (!file) {
            return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
        }

        const userId = session.user.id;

        // Forward to CompreFace for Recognition
        // API: POST /api/v1/recognition/recognize
        const comprefaceUrl = `${COMPREFACE_URL}/api/v1/recognition/recognize`;

        const backendFormData = new FormData();
        backendFormData.append('file', file);

        const response = await fetch(comprefaceUrl, {
            method: 'POST',
            headers: {
                'x-api-key': COMPREFACE_API_KEY,
            },
            body: backendFormData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('CompreFace Verification Error:', errorText);
            return NextResponse.json({ error: 'Failed to communicate with recognition service' }, { status: 500 });
        }

        const result = await response.json();

        // Check results
        // Result format: { result: [ { subjects: [ { subject: 'userId', similarity: 0.99 } ] } ] }

        if (!result.result || result.result.length === 0) {
            return NextResponse.json({ verified: false, message: 'No face detected' });
        }

        const subjects = result.result[0].subjects;
        if (!subjects || subjects.length === 0) {
            return NextResponse.json({ verified: false, message: 'Face not recognized' });
        }

        // Find match for current user
        const match = subjects.find((s: any) => s.subject === userId);

        if (match && match.similarity >= 0.90) { // 90% threshold
            return NextResponse.json({
                verified: true,
                similarity: match.similarity
            });
        } else {
            return NextResponse.json({
                verified: false,
                message: 'Identity mismatch',
                similarity: match ? match.similarity : 0
            });
        }

    } catch (error: any) {
        console.error('Verification API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
