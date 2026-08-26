import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { generateDueReminderEmail } from '@/lib/email-templates';

// Initialize Resend with the API key
const resend = new Resend(process.env.RESEND_API_KEY || 're_test_key');

export async function GET(request: NextRequest) {
    try {
        // 1. Authenticate the cron job request
        // Render cron jobs can send a custom header or we can use a Bearer token
        const authHeader = request.headers.get('authorization');
        const expectedToken = `Bearer ${process.env.CRON_SECRET_KEY}`;
        
        // If CRON_SECRET_KEY is defined in env, enforce it
        if (process.env.CRON_SECRET_KEY && authHeader !== expectedToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Calculate the time window (Now to Now + 24 hours)
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        
        const nowStr = now.toISOString();
        const tomorrowStr = tomorrow.toISOString();

        // 3. Fetch assignments due in exactly the next 24 hours
        // We use the admin client since this is a background job without a user session
        const adminClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
        
        const { data: assignments, error: assignmentsError } = await adminClient
            .from('assignments')
            .select(`
                id,
                title,
                due_date,
                subjects(name)
            `)
            .gte('due_date', nowStr)
            .lte('due_date', tomorrowStr);

        if (assignmentsError) {
            throw new Error(`Failed to fetch assignments: ${assignmentsError.message}`);
        }

        if (!assignments || assignments.length === 0) {
            return NextResponse.json({ message: 'No assignments due in the next 24 hours. No emails sent.' });
        }

        // 4. Format the assignments for the email template
        const formattedAssignments = assignments.map((a: any) => ({
            title: a.title,
            subjectName: a.subjects ? (a.subjects as any).name : 'Unknown Subject',
            dueDate: new Date(a.due_date).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short'
            }),
            link: `https://curriculab-sj6g.onrender.com/dashboard/assignments/${a.id}`
        }));

        // 5. Fetch all registered users to send the email to
        // For a full implementation, we could filter out those in assignment_submissions.
        // But since this bundles multiple assignments into one broadcast email,
        // we just notify all users of the deadlines.
        const { data: users, error: usersError } = await adminClient
            .from('authorized_users')
            .select('email');

        if (usersError || !users) {
            throw new Error('Failed to fetch users for notification');
        }

        const recipients = users.map((u: any) => u.email).filter(Boolean);

        if (recipients.length === 0) {
            return NextResponse.json({ message: 'No users found to send reminders to.' });
        }

        // 6. Generate email HTML and send via Resend
        const htmlContent = generateDueReminderEmail({
            assignments: formattedAssignments,
            recipientCount: recipients.length
        });

        // Split recipients into batches of 50 (Resend limit for single API call)
        const BATCH_SIZE = 50;
        const sendPromises = [];

        for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
            const batch = recipients.slice(i, i + BATCH_SIZE);
            
            sendPromises.push(
                resend.emails.send({
                    from: 'CurricuLab <notifications@curriculab.in>', // Use your verified domain
                    to: batch,
                    subject: `⏰ Action Required: ${formattedAssignments.length} Assignment(s) Due Tomorrow`,
                    html: htmlContent,
                })
            );
        }

        const results = await Promise.allSettled(sendPromises);
        const failedBatches = results.filter(r => r.status === 'rejected');

        if (failedBatches.length > 0) {
            console.error('Some email batches failed:', failedBatches);
            return NextResponse.json({ 
                message: 'Partially succeeded but some batches failed',
                totalAssignments: formattedAssignments.length
            }, { status: 207 });
        }

        return NextResponse.json({ 
            success: true, 
            message: `Successfully sent reminders for ${formattedAssignments.length} assignments to ${recipients.length} users.`
        });

    } catch (error: any) {
        console.error('Cron job error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
