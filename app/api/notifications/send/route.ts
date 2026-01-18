
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
        const { type, title, content, link } = body;

        // Verify configuration
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.error("SMTP credentials missing");
            // Fail silently or return error? Return error for debugging.
            return NextResponse.json({ error: 'Server misconfigured (SMTP)' }, { status: 500 });
        }

        // TODO: In a real production app, you would fetch the list of subscribed students from Supabase here.
        // For this demo, we will send it to the 'SMTP_USER' (the dev) or a hardcoded test list.
        // You can also add a 'to' field in the request body if you want to target specific users.

        // For testing purposes, we send the notification to the sender/admin email to verify it works.
        const recipients = [process.env.SMTP_USER];

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
            to: recipients.join(', '), // list of receivers
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
