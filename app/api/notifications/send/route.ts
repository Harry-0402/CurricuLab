
import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import { generateNotificationEmail } from '@/lib/email-templates';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, title, content, link, recipients } = body;

        // Verify configuration
        if (!process.env.SENDGRID_API_KEY) {
            console.error("SendGrid API key missing");
            return NextResponse.json({ error: 'Server misconfigured (SendGrid API Key)' }, { status: 500 });
        }

        if (!process.env.SENDGRID_FROM_EMAIL) {
            console.error("SendGrid FROM email missing");
            return NextResponse.json({ error: 'Server misconfigured (FROM email)' }, { status: 500 });
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

        // Send via SendGrid (DEMO MODE - admin only)
        const msg = {
            to: adminEmail,
            from: {
                email: process.env.SENDGRID_FROM_EMAIL!,
                name: 'CurricuLab'
            },
            subject: subject,
            html: html,
        };

        const response = await sgMail.send(msg);

        console.log("Email sent successfully (demo mode):", response[0].statusCode);

        return NextResponse.json({
            success: true,
            messageId: response[0].headers['x-message-id'],
            statusCode: response[0].statusCode,
            mode: 'demo',
            wouldSendTo: originalRecipientCount
        });

    } catch (error: any) {
        console.error('Email sending failed:', error);

        // SendGrid error handling
        if (error.response) {
            console.error('SendGrid error body:', error.response.body);
            return NextResponse.json({
                error: error.message,
                details: error.response.body
            }, { status: error.code || 500 });
        }

        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
