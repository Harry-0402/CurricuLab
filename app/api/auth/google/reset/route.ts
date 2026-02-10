import { createSupabaseServerClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const supabase = await createSupabaseServerClient();

        // Get current user session
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Delete tokens from google_oauth_tokens
        const { error } = await supabase
            .from('google_oauth_tokens')
            .delete()
            .eq('user_id', session.user.id);

        if (error) {
            console.error('Error deleting tokens:', error);
            return NextResponse.json({ error: 'Failed to reset connection' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Classroom connection reset successfully' });
    } catch (error) {
        console.error('Reset error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
