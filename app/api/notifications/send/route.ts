
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

        // Send via Resend API (works on all platforms)
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


// Create a reusable transporter object using the default SMTP transport
// Create a reusable transporter object using the default SMTP transport
const port = parseInt(process.env.SMTP_PORT || '465');
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: port,
    secure: port === 465, // true for 465, false for other ports (587)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, title, content, link, recipients } = body;

        // Verify configuration
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.error("SMTP credentials missing");
            return NextResponse.json({ error: 'Server misconfigured (SMTP)' }, { status: 500 });
        }

        // Determine recipients
        // If recipients array is provided in body, use it.
        // Otherwise, fallback to a hardcoded admin email if SMTP_USER is not a valid email (e.g. 'resend')
        let targets = (recipients && Array.isArray(recipients) && recipients.length > 0)
            ? recipients
            : [];

        // Fallback: If no recipients and SMTP_USER looks like an email, use it.
        if (targets.length === 0 && process.env.SMTP_USER?.includes('@')) {
            targets = [process.env.SMTP_USER];
        }

        console.log(`[Email] Attempting to send '${type}' to ${targets.length} recipients:`, targets);

        if (targets.length === 0) {
            console.warn("[Email] No valid recipients found. Skipping email send.");
            return NextResponse.json({ warning: "No recipients found using 'authorized_users'. Table might be empty." });
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

        // Send mail with defined transport object
        // NOTE: Gmail allows sending to multiple recipients.
        const info = await transporter.sendMail({
            from: `"CurricuLab" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`, // sender address
            to: process.env.SMTP_USER, // Send TO self (Admin) just to have a 'To' header
            bcc: targets.join(', '), // BCC everyone (the actual broadcast)
            subject: subject, // Subject line
            html: html, // html body
        });

        console.log("Message sent: %s", info.messageId);

        return NextResponse.json({ success: true, messageId: info.messageId });

    } catch (error: any) {
        console.error('Email sending failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
