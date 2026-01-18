
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateNotificationEmail } from '@/lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, title, content, link, recipients } = body;

        // Verify configuration
        if (!process.env.RESEND_API_KEY) {
            console.error("Resend API key missing");
            return NextResponse.json({ error: 'Server misconfigured (Resend API Key)' }, { status: 500 });
        }

        // Determine recipients
        let targets = (recipients && Array.isArray(recipients) && recipients.length > 0)
            ? recipients
            : [];

        // Fallback to admin email if no recipients
        const adminEmail = 'curriculab01@gmail.com';
        if (targets.length === 0) {
            targets = [adminEmail];
        }

        console.log(`[Email] Found ${targets.length} recipients for broadcast`);

        // DEMO MODE: Only send to admin
        const originalRecipientCount = targets.length;
        console.log(`[Email - DEMO MODE] Sending to admin only (simulating broadcast to ${originalRecipientCount} users)`);

        // HTML Template
        const subject = `New ${type}: ${title}`;

        // Generate HTML with demo notice showing recipient count
        const html = generateNotificationEmail({
            type,
            title,
            content,
            link,
            linkText: link ? 'View Resource' : undefined,
            recipientCount: originalRecipientCount
        });

        // Send via Resend API (DEMO MODE - admin only)
        const { data, error } = await resend.emails.send({
            from: 'CurricuLab <onboarding@resend.dev>',
            to: [adminEmail],
            subject: subject,
            html: html,
        });

        if (error) {
            console.error('Resend API error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log("Email sent successfully (demo mode):", data);

        return NextResponse.json({
            success: true,
            messageId: data?.id,
            mode: 'demo',
            wouldSendTo: originalRecipientCount
        });

    } catch (error: any) {
        console.error('Email sending failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
