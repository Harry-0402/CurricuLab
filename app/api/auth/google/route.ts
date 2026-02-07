import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);

    // Robust origin detection for proxies (Render)
    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') ?? (requestUrl.protocol === 'https:' ? 'https' : 'http');
    const origin = host ? `${protocol}://${host}` : requestUrl.origin;

    const redirectUri = `${origin}/api/auth/google/callback`;

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_OAUTH_CLIENT_ID,
        process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        redirectUri
    );

    // Generate a url that asks permissions for the Drive scope and Classroom scopes
    const scopes = [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/classroom.courses.readonly',
        'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
        'https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly',
        'https://www.googleapis.com/auth/classroom.announcements.readonly',
        'https://www.googleapis.com/auth/classroom.student-submissions.me.readonly'
    ];

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline', // Request offline access to get refresh token
        scope: scopes,
        prompt: 'consent', // Force consent prompt to ensure we get a refresh token
    });

    return NextResponse.redirect(url);
}
