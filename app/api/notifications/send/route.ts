
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
        const adminEmail = 'hrchavan0402@gmail.com';
        if (targets.length === 0) {
            targets = [adminEmail];
        }

        console.log(`[Email] Attempting to send '${type}' to ${targets.length} recipients:`, targets);

        if (targets.length === 0) {
            console.warn("[Email] No valid recipients found. Skipping email send.");
            return NextResponse.json({ warning: "No recipients found" });
        }

        // HTML Template
        const subject = `New ${type}: ${title}`;

        // Generate Professional HTML Template
        const html = generateNotificationEmail({
            type,
            title,
            content,
            link,
            linkText: link ? 'View Resource' : undefined
        });

        // Send via Resend API (works on all cloud platforms)
        const { data, error } = await resend.emails.send({
            from: 'CurricuLab <onboarding@resend.dev>',
            to: targets,
            subject: subject,
            html: html,
        });

        if (error) {
            console.error('Resend API error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log("Email sent successfully:", data);

        return NextResponse.json({ success: true, messageId: data?.id });

    } catch (error: any) {
        console.error('Email sending failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
