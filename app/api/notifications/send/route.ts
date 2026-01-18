
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true, // true for 465, false for other ports
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
        // Otherwise, fallback to the SMTP_USER (Dev/Admin) for testing.
        const targets = (recipients && Array.isArray(recipients) && recipients.length > 0)
            ? recipients
            : [process.env.SMTP_USER];

        // HTML Template
        const subject = `New ${type}: ${title}`;

        // Basic HTML Template
        const html = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #4f46e5;">New ${type} Posted</h1>
                <p><strong>${title}</strong></p>
                <p>${content}</p>
                ${link ? `<a href="${link}" style="display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Resource</a>` : ''}
                <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;" />
                <p style="color: #888; font-size: 12px;">CurricuLab Notification System</p>
            </div>
        `;

        // Send mail with defined transport object
        const info = await transporter.sendMail({
            from: `"CurricuLab" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`, // sender address
            to: process.env.SMTP_USER, // Send TO self (admin) to ensure delivery
            bcc: targets.join(', '), // BCC everyone else for privacy
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
