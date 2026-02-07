import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_OAUTH_CLIENT_ID,
        process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        process.env.GOOGLE_OAUTH_REDIRECT_URI
    );

    // Generate a url that asks permissions for the Drive scope and Classroom scopes
    const scopes = [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/classroom.courses.readonly',
        'https://www.googleapis.com/auth/classroom.coursework.me',
        'https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly',
        'https://www.googleapis.com/auth/classroom.announcements.readonly',
        'https://www.googleapis.com/auth/classroom.student-submissions.me.readonly',
        'https://www.googleapis.com/auth/classroom.rosters.readonly'
    ];

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline', // Request offline access to get refresh token
        scope: scopes,
        prompt: 'consent', // Force consent prompt to ensure we get a refresh token
    });

    return NextResponse.redirect(url);
}
