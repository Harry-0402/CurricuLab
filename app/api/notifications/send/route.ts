import { NextResponse } from 'next/server';
import { generateNotificationEmail } from '@/lib/email-templates';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, title, content, link, recipients } = body;

        console.log(`[Email] Email notification endpoint is disabled - SendGrid functionality has been removed`);

        return NextResponse.json({
            success: false,
            error: 'Email notifications are currently disabled',
            message: 'SendGrid functionality has been removed from this application'
        }, { status: 501 });

    } catch (error: any) {
        console.error('Notification request failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
