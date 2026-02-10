import { NextResponse } from 'next/server';
import { generateNotificationEmail } from '@/lib/email-templates';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, title, content, link, recipients } = body;

        console.log(`[Email] Notification simulation: Email would be sent to ${recipients?.length} recipients (Service Disabled)`);

        return NextResponse.json({
            success: true,
            warning: 'Email notifications are currently disabled (Simulated Success)',
            message: 'Notification logged but not sent'
        }, { status: 200 });

    } catch (error: any) {
        console.error('Notification request failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
