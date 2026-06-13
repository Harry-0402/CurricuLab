import { google } from 'googleapis';
import { Readable } from 'stream';

export interface UploadFileInput {
    fileBuffer: Buffer;
    fileName: string;
    mimeType: string;
    metadata: {
        subjectId: string;
        subjectTitle: string;
        unitId?: string;
        unitTitle?: string;
        category?: string;
        title: string;
        description?: string;
        // For submissions
        type?: 'submission';
        studentName?: string;
        assignmentTitle?: string;
    };
}

export interface DriveTokens {
    access_token: string;
    refresh_token?: string;
    scope?: string;
    token_type?: string;
    expiry_date?: number;
}

export interface DriveFile {
    id: string;
    name: string;
    mimeType: string;
    size: string;
    webViewLink: string;
    webContentLink?: string;
}

const CATEGORY_Folder_NAMES: Record<string, string> = {
    'study_notes': '01_Study Notes',
    'assignments': '02_Assignments',
    'announcements': '00_Announcements',
    'cia': '03_CIAs',
    'other': '04_Other Resources'
};

export const GoogleDriveService = {
    /**
     * Get authenticated Drive client using user tokens
     */
    getAuthenticatedClient(tokens: DriveTokens, redirectUri?: string) {
        // Fallback logic for universal support
        const effectiveRedirectUri = redirectUri ||
            process.env.GOOGLE_OAUTH_REDIRECT_URI ||
            'https://curriculab-sj6g.onrender.com/api/auth/google/callback';

        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_OAUTH_CLIENT_ID,
            process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            effectiveRedirectUri
        );

        // The scopes are typically requested during the OAuth consent flow,
        // but if the token's scope needs to be explicitly set or verified here,
        // it would be part of the setCredentials or a separate check.
        // The instruction implies adding a 'drive.readonly' scope.
        // If the token already has a scope, we should merge or ensure 'drive.readonly' is present.
        // For now, we'll just ensure the token's scope is passed.
        // The provided snippet for `scopes` array is not directly used in `setCredentials`
        // unless `tokens.scope` is intended to be derived from it.
        // Assuming the instruction meant to ensure the token has the necessary scopes,
        // and `tokens.scope` already contains them from the OAuth flow.
        // If the intent was to *request* these scopes, it would be part of the authorization URL generation.
        // For an authenticated client, we just use the scopes already granted to the token.

        oauth2Client.setCredentials({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            scope: tokens.scope, // This should already contain the necessary scopes from the OAuth flow
            token_type: tokens.token_type,
            expiry_date: tokens.expiry_date
        });

        return google.drive({ version: 'v3', auth: oauth2Client });
    },

    /**
     * Upload a file to Google Drive
     */
    async uploadFile(input: UploadFileInput, tokens: DriveTokens, redirectUri?: string): Promise<DriveFile> {
        try {
            const drive = this.getAuthenticatedClient(tokens, redirectUri);
            const { fileBuffer, fileName, mimeType, metadata } = input;

            // 1. Use root folder from env
            const rootFolderId = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_CLASSROOM_FOLDER_ID;
            if (!rootFolderId) {
                throw new Error('NEXT_PUBLIC_GOOGLE_DRIVE_CLASSROOM_FOLDER_ID is not set');
            }

            // 2. Create/Get Subject folder
            const subjectFolderId = await this.createOrGetFolder(drive, metadata.subjectTitle, rootFolderId);

            let parentFolderId = subjectFolderId;

            // Handle Submissions vs Regular Uploads
            if (metadata.type === 'submission') {
                // Path: Subject -> 05_Submissions -> [Assignment Name] -> [Student Name]

                // 3. Create/Get "05_Submissions" folder
                const submissionsFolderId = await this.createOrGetFolder(drive, '05_Submissions', subjectFolderId);

                // 4. Create/Get Assignment folder
                const assignmentFolderId = await this.createOrGetFolder(drive, metadata.assignmentTitle || 'Unknown Assignment', submissionsFolderId);

                // 5. Create/Get Student folder
                const studentFolderId = await this.createOrGetFolder(drive, metadata.studentName || 'Unknown Student', assignmentFolderId);

                parentFolderId = studentFolderId;

            } else {
                // Regular Material Upload

                // 3. Create/Get Category folder
                const categoryName = CATEGORY_Folder_NAMES[metadata.category || 'other'] || '04_Other Resources';
                const categoryFolderId = await this.createOrGetFolder(drive, categoryName, subjectFolderId);

                // 4. Create/Get Unit folder (optional)
                parentFolderId = categoryFolderId;
                if (metadata.unitId && metadata.unitTitle) {
                    parentFolderId = await this.createOrGetFolder(drive, metadata.unitTitle, categoryFolderId);
                }
            }

            // Convert buffer to readable stream
            const bufferStream = new Readable();
            bufferStream.push(fileBuffer);
            bufferStream.push(null);

            // Upload file
            const response = await drive.files.create({
                requestBody: {
                    name: fileName,
                    parents: [parentFolderId],
                    description: metadata.description || metadata.title,
                },
                media: {
                    mimeType: mimeType,
                    body: bufferStream,
                },
                fields: 'id, name, mimeType, size, webViewLink, webContentLink',
            });

            // Set permissions (anyone with link can view - needed for sharing)
            // Skip for student submissions to preserve privacy and academic integrity
            if (metadata.type !== 'submission') {
                await drive.permissions.create({
                    fileId: response.data.id!,
                    requestBody: {
                        role: 'reader',
                        type: 'anyone',
                    },
                });
            }

            return response.data as DriveFile;
        } catch (error) {
            console.error('Error uploading file to Google Drive:', error);
            throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },

    /**
     * Delete a file from Google Drive
     */
    async deleteFile(fileId: string, tokens: DriveTokens, redirectUri?: string): Promise<boolean> {
        try {
            const drive = this.getAuthenticatedClient(tokens, redirectUri);
            await drive.files.delete({ fileId });
            return true;
        } catch (error) {
            console.error('Error deleting file from Drive:', error);
            // Don't throw if file not found (maybe already deleted)
            return false;
        }
    },

    /**
     * Create a folder or get existing folder by name
     */
    async createOrGetFolder(drive: any, folderName: string, parentId: string | null): Promise<string> {
        try {
            let query = `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;

            if (parentId) {
                query += ` and '${parentId}' in parents`;
            }

            const searchResponse = await drive.files.list({
                q: query,
                fields: 'files(id, name)',
            });

            if (searchResponse.data.files && searchResponse.data.files.length > 0) {
                return searchResponse.data.files[0].id!;
            }

            // Create new folder
            const folderMetadata: any = {
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder',
            };

            if (parentId) {
                folderMetadata.parents = [parentId];
            }

            const folderResponse = await drive.files.create({
                requestBody: folderMetadata,
                fields: 'id',
            });

            return folderResponse.data.id!;
        } catch (error) {
            console.error('Error creating/getting folder:', error);
            throw error;
        }
    },

    /**
     * Download a file from Google Drive as a Buffer
     */
    async downloadFile(fileId: string, tokens: DriveTokens, redirectUri?: string): Promise<{ buffer: Buffer; mimeType: string }> {
        try {
            const drive = this.getAuthenticatedClient(tokens, redirectUri);

            // 1. Get metadata to check if it's a Google Doc
            const metadata = await drive.files.get({
                fileId,
                fields: 'mimeType, name'
            });

            const mimeType = metadata.data.mimeType!;
            const isGoogleDoc = mimeType.startsWith('application/vnd.google-apps');

            if (isGoogleDoc) {
                // Determine export mime type (default to PDF for docs/sheets/slides)
                let exportMimeType = 'application/pdf';
                if (mimeType.includes('spreadsheet')) exportMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                if (mimeType.includes('presentation')) exportMimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';

                const response = await drive.files.export(
                    { fileId, mimeType: exportMimeType },
                    { responseType: 'arraybuffer' }
                );

                return {
                    buffer: Buffer.from(response.data as ArrayBuffer),
                    mimeType: exportMimeType
                };
            }

            // 2. Download binary content
            const response = await drive.files.get(
                { fileId, alt: 'media' },
                { responseType: 'arraybuffer' }
            );

            return {
                buffer: Buffer.from(response.data as ArrayBuffer),
                mimeType
            };
        } catch (error) {
            console.error('Error downloading file from Drive:', error);
            throw new Error(`Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
};
