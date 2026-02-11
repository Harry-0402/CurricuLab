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

        // Forward to CompreFace
        // API: POST /api/v1/recognition/faces?subject=<subject_name>
        const comprefaceUrl = `${COMPREFACE_URL}/api/v1/recognition/faces?subject=${userId}`;

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
            console.error('CompreFace Enrollment Error:', errorText);
            return NextResponse.json({ error: 'Failed to enroll face with recognition service' }, { status: 500 });
        }

        const result = await response.json();

        // Optionally update profile to set has_face_id = true
        // For now, client logic handles this assumption or we can add it here.
        await supabase.from('profiles').update({ has_face_id: true }).eq('id', userId);

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('Enrollment API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
