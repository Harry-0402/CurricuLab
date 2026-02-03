import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';

export async function GET() {
    try {
        const supabase = await createSupabaseServerClient();

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            return NextResponse.json({ connected: false });
        }

        const { data, error } = await supabase
            .from('google_oauth_tokens')
            .select('id')
            .eq('user_id', session.user.id)
            .single();

        return NextResponse.json({ connected: !!data });
    } catch (error) {
        console.error('Error checking Drive status:', error);
        return NextResponse.json({ connected: false });
    }
}
