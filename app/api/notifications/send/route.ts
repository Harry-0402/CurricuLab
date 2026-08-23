import { NextResponse } from 'next/server';
import { generateNotificationEmail, generateAssignmentEmail } from '@/lib/email-templates';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, title, content, link, recipients, authorName, dueDate } = body;

        if (!recipients || recipients.length === 0) {
            return NextResponse.json({ success: false, error: 'No recipients provided' }, { status: 400 });
        }

        const htmlBody = type === 'Assignment' 
            ? generateAssignmentEmail({ title, dueDate, authorName: authorName || 'A Student', link, recipientCount: recipients.length })
            : generateNotificationEmail({ type, title, content, link, recipientCount: recipients.length });

        const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_MAIL_URL;
        if (!scriptUrl) {
            console.error('[Email] Error: GOOGLE_APPS_SCRIPT_MAIL_URL is not defined in environment variables.');
            return NextResponse.json({ success: false, error: 'Missing mailer configuration' }, { status: 500 });
        }

        const subject = title || "CurricuLab Notification";

        let response = await fetch(scriptUrl, {
            method: 'POST',
            body: JSON.stringify({
                recipients: recipients,
                subject: subject,
                htmlBody: htmlBody
            }),
            redirect: 'manual'
        });

        // Google Apps Script usually returns 302 Found and redirects to a googleusercontent.com URL
        // By default, fetch converts POST to GET on 302, losing our payload. We manually follow it as POST.
        if (response.status === 302 || response.status === 301 || response.status === 307) {
            const redirectUrl = response.headers.get('location');
            if (redirectUrl) {
                response = await fetch(redirectUrl, {
                    method: 'POST',
                    body: JSON.stringify({
                        recipients: recipients,
                        subject: subject,
                        htmlBody: htmlBody
                    })
                });
            }
        }

        const result = await response.json();
        
        if (result.status !== 'success') {
            throw new Error(result.message || 'Apps Script returned an error');
        }

        console.log(`[Email] Notification routed through Apps Script to ${recipients.length} recipients successfully.`);

        return NextResponse.json({
            success: true,
            message: 'Notification sent successfully'
        }, { status: 200 });

    } catch (error: any) {
        console.error('Notification request failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
