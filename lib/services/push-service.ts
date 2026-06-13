import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '';

if (vapidPublicKey && vapidPrivateKey) {
    webpush.setVapidDetails(
        'mailto:curriculab01@gmail.com',
        vapidPublicKey,
        vapidPrivateKey
    );
}

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function sendPushNotification(title: string, body: string, url?: string, targetSemesterId?: string) {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing. Administrative queries for push notifications will fail due to RLS policies.');
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing. Cannot fetch subscriber lists securely without bypassing RLS.');
    }

    if (!vapidPublicKey || !vapidPrivateKey) {
        console.warn('VAPID keys not configured. Skipping push notification.');
        return;
    }

    try {
        let query = supabaseAdmin.from('push_subscriptions').select('*, profiles!inner(class_id)');
        
        if (targetSemesterId) {
            query = query.eq('profiles.class_id', targetSemesterId);
        }

        const { data: subscriptions, error } = await query;

        if (error) {
            console.error('Failed to fetch subscriptions:', error);
            return;
        }

        const payload = JSON.stringify({
            title,
            body,
            url: url || '/',
        });

        const promises = subscriptions.map(async (sub) => {
            try {
                await webpush.sendNotification({
                    endpoint: sub.endpoint,
                    keys: {
                        p256dh: sub.p256dh,
                        auth: sub.auth
                    }
                }, payload);
            } catch (err: any) {
                // If subscription is gone, remove it from DB
                if (err.statusCode === 404 || err.statusCode === 410) {
                    await supabaseAdmin.from('push_subscriptions').delete().eq('id', sub.id);
                } else {
                    console.error('Failed to send push to subscription:', err);
                }
            }
        });

        await Promise.all(promises);
    } catch (error) {
        console.error('Push notification error:', error);
    }
}
