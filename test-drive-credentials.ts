// Test Google Drive Credentials
// Run this to verify your credentials are working

import { google } from 'googleapis';

const credentials = {
    client_email: process.env.GOOGLE_DRIVE_CLIENT_EMAIL || '',
    private_key: (process.env.GOOGLE_DRIVE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    project_id: process.env.GOOGLE_DRIVE_PROJECT_ID || '',
};

async function testCredentials() {
    try {
        console.log('Testing Google Drive credentials...');
        console.log('Client email:', credentials.client_email);
        console.log('Project ID:', credentials.project_id);
        console.log('Private key length:', credentials.private_key.length);
        console.log('Private key starts with:', credentials.private_key.substring(0, 27));

        const auth = new google.auth.JWT({
            email: credentials.client_email,
            key: credentials.private_key,
            scopes: ['https://www.googleapis.com/auth/drive.file'],
        });

        const drive = google.drive({ version: 'v3', auth });

        // Try to list files in the classroom folder
        const folderId = process.env.GOOGLE_DRIVE_CLASSROOM_FOLDER_ID;
        console.log('\nTesting access to folder:', folderId);

        const response = await drive.files.list({
            q: `'${folderId}' in parents`,
            fields: 'files(id, name)',
            supportsAllDrives: true,
            includeItemsFromAllDrives: true,
        });

        console.log('\n✅ SUCCESS! Found', response.data.files?.length || 0, 'files/folders');
        console.log('Files:', response.data.files);

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('\n❌ ERROR:', error.message);
        } else {
            console.error('\n❌ ERROR:', String(error));
        }
        console.error('Full error:', error);
    }
}

testCredentials();
