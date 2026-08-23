import { NextResponse } from 'next/server';
import { generateNotificationEmail, generateAssignmentEmail } from '@/lib/email-templates';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, title, content, link, recipients, authorName, dueDate } = body;

        if (!recipients || recipients.length === 0) {
            return NextResponse.json({ success: false, error: 'No recipients provided' }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_APP_PASSWORD
            }
        });

        const htmlBody = type === 'Assignment' 
            ? generateAssignmentEmail({ title, dueDate, authorName: authorName || 'A Student', link, recipientCount: recipients.length })
            : generateNotificationEmail({ type, title, content, link, recipientCount: recipients.length });

        await transporter.sendMail({
            from: `"CurricuLab" <${process.env.SMTP_EMAIL}>`,
            bcc: recipients.join(','),
            subject: title || "CurricuLab Notification",
            html: htmlBody
        });

        console.log(`[Email] Notification sent to ${recipients.length} recipients successfully.`);

        return NextResponse.json({
            success: true,
            message: 'Notification sent successfully'
        }, { status: 200 });

    } catch (error: any) {
        console.error('Notification request failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
