import { NextResponse } from 'next/server';
import { sendPushNotification } from '@/lib/services/push-service';
import { createSupabaseServerClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
    try {
        const supabase = await createSupabaseServerClient();

        const { data: { session } } = await supabase.auth.getSession();
        
        // Verify Admin status to allow sending global push notifications
        if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
            
        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        const { title, message, url, targetSemesterId } = body;

        if (!title || !message) {
            return NextResponse.json({ error: 'Missing title or message' }, { status: 400 });
        }

        // Send to subscribed users (filtered by class if targetSemesterId is provided)
        await sendPushNotification(title, message, url, targetSemesterId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Send Push Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
