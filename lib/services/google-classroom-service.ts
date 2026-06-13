import { google, classroom_v1 } from 'googleapis';
import { DriveTokens } from './google-drive-service';

export interface ClassroomCourse {
    id: string;
    name: string;
    section?: string;
    descriptionHeading?: string;
    description?: string;
    room?: string;
    ownerId: string;
    creationTime: string;
    updateTime: string;
    enrollmentCode?: string;
    courseState: string;
    alternateLink: string;
    teacherGroupEmail?: string;
    courseGroupEmail?: string;
    teacherFolder?: {
        id: string;
    };
    guardiansEnabled?: boolean;
}

export interface ClassroomCourseWork {
    id: string;
    title?: string;
    description?: string;
    materials?: any[];
    state?: string;
    alternateLink?: string;
    creationTime?: string;
    updateTime?: string;
    dueDate?: {
        year?: number;
        month?: number;
        day?: number;
    };
    dueTime?: {
        hours?: number;
        minutes?: number;
        nanos?: number;
    };
    scheduledTime?: string;
    maxPoints?: number;
    workType?: string;
    submissionModificationMode?: string;
    assignment?: {
        studentWorkFolder?: {
            id: string;
        };
    };
    multipleChoiceQuestion?: {
        choices?: string[];
    };
    topicId?: string;
}

export interface ClassroomAnnouncement {
    id: string;
    text?: string;
    materials?: any[];
    state?: string;
    alternateLink?: string;
    creationTime?: string;
    updateTime?: string;
    scheduledTime?: string;
    assigneeMode?: string;
    individualStudentsOptions?: {
        studentIds?: string[];
    };
    creatorUserId?: string;
}

export interface ClassroomStudentSubmission {
    id: string;
    courseId: string;
    courseWorkId: string;
    userId: string;
    state: string;
    assignedGrade?: number;
    alternateLink?: string;
    submissionHistory?: any[];
    assignmentSubmission?: {
        attachments?: any[];
    };
}

export const GoogleClassroomService = {
    /**
     * Get fresh OAuth2 tokens, refreshing the token in the database if it is expired.
     * Prevents redundant OAuth roundtrips on every request by persisting the refreshed access token.
     */
    async getFreshTokens(userId: string, supabase: any, redirectUri?: string): Promise<DriveTokens> {
        // Fetch token from database
        const { data: tokenData, error: tokenError } = await supabase
            .from('google_oauth_tokens')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (tokenError || !tokenData) {
            throw new Error('Google account not connected');
        }

        let tokens: DriveTokens = {
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token,
            scope: tokenData.scope,
            token_type: tokenData.token_type,
            expiry_date: new Date(tokenData.expires_at).getTime(),
        };

        const now = Date.now();
        // Check if expired or expiring within 1 minute
        if (tokens.expiry_date && now >= tokens.expiry_date - 60000) {
            try {
                console.log(`[GoogleClassroomService] Token expired for user ${userId}. Refreshing...`);
                const effectiveRedirectUri = redirectUri ||
                    process.env.GOOGLE_OAUTH_REDIRECT_URI ||
                    'https://curriculab-sj6g.onrender.com/api/auth/google/callback';

                const oauth2Client = new google.auth.OAuth2(
                    process.env.GOOGLE_OAUTH_CLIENT_ID,
                    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
                    effectiveRedirectUri
                );

                oauth2Client.setCredentials({
                    access_token: tokens.access_token,
                    refresh_token: tokens.refresh_token,
                    scope: tokens.scope,
                    token_type: tokens.token_type,
                    expiry_date: tokens.expiry_date
                });

                const { credentials } = await oauth2Client.refreshAccessToken();

                if (!credentials.access_token) {
                    throw new Error('No access token returned from refresh');
                }

                const updates: any = {
                    access_token: credentials.access_token,
                    expires_at: new Date(credentials.expiry_date!).toISOString(),
                    updated_at: new Date().toISOString()
                };
                if (credentials.refresh_token) {
                    updates.refresh_token = credentials.refresh_token;
                }

                const { error: updateError } = await supabase
                    .from('google_oauth_tokens')
                    .update(updates)
                    .eq('user_id', userId);

                if (updateError) {
                    throw updateError;
                }

                tokens = {
                    access_token: credentials.access_token,
                    refresh_token: credentials.refresh_token || tokens.refresh_token,
                    scope: credentials.scope || tokens.scope,
                    token_type: credentials.token_type || tokens.token_type,
                    expiry_date: credentials.expiry_date!
                };
                console.log(`[GoogleClassroomService] Token refreshed successfully in DB for user ${userId}`);
            } catch (refreshError) {
                console.error(`[GoogleClassroomService] Failed to refresh token for user ${userId}:`, refreshError);
            }
        }

        return tokens;
    },

    /**
     * Get authenticated Classroom client using user tokens
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

        oauth2Client.setCredentials({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            scope: tokens.scope,
            token_type: tokens.token_type,
            expiry_date: tokens.expiry_date
        });

        return google.classroom({ version: 'v1', auth: oauth2Client });
    },

    /**
     * List all active courses for the authenticated user
     */
    async listCourses(tokens: DriveTokens, redirectUri?: string): Promise<ClassroomCourse[]> {
        const classroom = this.getAuthenticatedClient(tokens, redirectUri);
        try {
            const response = await classroom.courses.list({
                courseStates: ['ACTIVE'],
            });
            return (response.data.courses as ClassroomCourse[]) || [];
        } catch (error) {
            console.error('Error listing courses:', error);
            throw error;
        }
    },

    /**
     * List coursework for a specific course
     */
    async listCourseWork(courseId: string, tokens: DriveTokens, redirectUri?: string): Promise<ClassroomCourseWork[]> {
        const classroom = this.getAuthenticatedClient(tokens, redirectUri);
        let allCourseWork: ClassroomCourseWork[] = [];
        let nextPageToken: string | undefined = undefined;
        let pageCount = 0;
        const MAX_PAGES = 5; // Limit to 5 pages (500 items) to improve performance

        try {
            do {
                const response: any = await classroom.courses.courseWork.list({
                    courseId,
                    orderBy: 'updateTime desc', // Simplified to avoid bad request errors
                    pageSize: 100,
                    pageToken: nextPageToken,
                });

                if (response.data.courseWork) {
                    allCourseWork = [...allCourseWork, ...(response.data.courseWork as ClassroomCourseWork[])];
                }
                nextPageToken = response.data.nextPageToken || undefined;
                pageCount++;
            } while (nextPageToken && pageCount < MAX_PAGES);

            return allCourseWork;
        } catch (error: any) {
            console.error('Error listing coursework:', error);
            // Write detailed error to log file
            if (process.env.NODE_ENV === 'development') {
                const fs = require('fs');
                const path = require('path');
                const logPath = path.join(process.cwd(), 'debug_coursework_error.log');
                const logEntry = `[${new Date().toISOString()}] Course ${courseId} Error: ${error.message}\nStack: ${error.stack}\nResponse: ${JSON.stringify(error.response?.data || {})}\n\n`;
                try {
                    fs.appendFileSync(logPath, logEntry);
                } catch (e) {
                    // Ignore write error
                }
            }
            return []; // Return empty instead of throwing to prevent crashing the whole page
        }
    },

    /**
     * List course work materials (e.g. PPTs, reading materials)
     */
    async listCourseWorkMaterials(courseId: string, tokens: DriveTokens, redirectUri?: string): Promise<any[]> {
        const classroom = this.getAuthenticatedClient(tokens, redirectUri);
        let allMaterials: any[] = [];
        let nextPageToken: string | undefined = undefined;
        let pageCount = 0;
        const MAX_PAGES = 5;

        try {
            console.log(`[GoogleClassroomService] Fetching materials for course ${courseId}...`);
            do {
                const response: any = await classroom.courses.courseWorkMaterials.list({
                    courseId,
                    orderBy: 'updateTime desc',
                    pageSize: 100,
                    pageToken: nextPageToken,
                });

                if (response.data.courseWorkMaterial) {
                    allMaterials = [...allMaterials, ...response.data.courseWorkMaterial];
                } else {
                    console.log(`[GoogleClassroomService] No materials found in page for course ${courseId}`);
                }
                nextPageToken = response.data.nextPageToken || undefined;
                pageCount++;
            } while (nextPageToken && pageCount < MAX_PAGES);

            console.log(`[GoogleClassroomService] Course ${courseId} has ${allMaterials.length} materials.`);
            // Write to a temporary file for debugging
            if (process.env.NODE_ENV === 'development') {
                const fs = require('fs');
                const path = require('path');
                const logPath = path.join(process.cwd(), 'debug_materials.log');
                const logEntry = `[${new Date().toISOString()}] Course ${courseId}: Found ${allMaterials.length} materials.\n`;
                try {
                    fs.appendFileSync(logPath, logEntry);
                } catch (e) {/* ignore */ }
            }

            return allMaterials;
        } catch (error: any) {
            console.error('Error listing course materials:', error);
            // Write detailed error to log file
            if (process.env.NODE_ENV === 'development') {
                const fs = require('fs');
                const path = require('path');
                const logPath = path.join(process.cwd(), 'debug_materials_error.log');
                const logEntry = `[${new Date().toISOString()}] Course ${courseId} Error: ${error.message}\nStack: ${error.stack}\nResponse: ${JSON.stringify(error.response?.data || {})}\n\n`;
                try {
                    fs.appendFileSync(logPath, logEntry);
                } catch (e) {/* ignore */ }
            }
            return [];
        }
    },

    /**
     * List announcements for a specific course
     */
    async listAnnouncements(courseId: string, tokens: DriveTokens, redirectUri?: string): Promise<ClassroomAnnouncement[]> {
        const classroom = this.getAuthenticatedClient(tokens, redirectUri);
        let allAnnouncements: ClassroomAnnouncement[] = [];
        let nextPageToken: string | undefined = undefined;
        let pageCount = 0;
        const MAX_PAGES = 5;

        try {
            do {
                const response: any = await classroom.courses.announcements.list({
                    courseId,
                    orderBy: 'updateTime desc',
                    pageSize: 50,
                    pageToken: nextPageToken,
                });

                if (response.data.announcements) {
                    allAnnouncements = [...allAnnouncements, ...(response.data.announcements as ClassroomAnnouncement[])];
                }
                nextPageToken = response.data.nextPageToken || undefined;
                pageCount++;
            } while (nextPageToken && pageCount < MAX_PAGES);

            return allAnnouncements;
        } catch (error) {
            console.error('Error listing announcements:', error);
            // Return empty instead of throwing to avoid blocking other data
            return [];
        }
    },

    /**
     * Get a student's submission for a specific coursework
     */
    async getStudentSubmission(courseId: string, courseWorkId: string, tokens: DriveTokens, redirectUri?: string): Promise<ClassroomStudentSubmission | null> {
        const classroom = this.getAuthenticatedClient(tokens, redirectUri);
        try {
            // We can only get 'me' submission for the student
            const response = await classroom.courses.courseWork.studentSubmissions.list({
                courseId,
                courseWorkId,
                userId: 'me',
            });

            if (response.data.studentSubmissions && response.data.studentSubmissions.length > 0) {
                return response.data.studentSubmissions[0] as ClassroomStudentSubmission;
            }
            return null;
        } catch (error) {
            console.error('Error getting student submission:', error);
            throw error;
        }
    },

    /**
     * Turn in an assignment
     * Note: 'turnIn' action might not be directly available via API in all cases without modifying the submission first.
     * Usually, you modify the submission (add attachments) and then turn it in.
     */
    async turnInAssignment(
        courseId: string,
        courseWorkId: string,
        submissionId: string,
        tokens: DriveTokens,
        redirectUri?: string
    ): Promise<void> {
        const classroom = this.getAuthenticatedClient(tokens, redirectUri);
        try {
            await classroom.courses.courseWork.studentSubmissions.turnIn({
                courseId,
                courseWorkId,
                id: submissionId,
            });
        } catch (error) {
            console.error('Error turning in assignment:', error);
            throw error;
        }
    },

    /**
     * Reclaim an assignment (unsubmit)
     */
    async reclaimAssignment(
        courseId: string,
        courseWorkId: string,
        submissionId: string,
        tokens: DriveTokens,
        redirectUri?: string
    ): Promise<void> {
        const classroom = this.getAuthenticatedClient(tokens, redirectUri);
        try {
            await classroom.courses.courseWork.studentSubmissions.reclaim({
                courseId,
                courseWorkId,
                id: submissionId,
            });
        } catch (error) {
            console.error('Error reclaiming assignment:', error);
            throw error;
        }
    },

    /**
     * Add attachments to a submission (e.g., Link or Drive File)
     */
    async addAttachmentsToSubmission(
        courseId: string,
        courseWorkId: string,
        submissionId: string,
        attachments: classroom_v1.Schema$Attachment[],
        tokens: DriveTokens,
        redirectUri?: string
    ): Promise<ClassroomStudentSubmission | null> {
        const classroom = this.getAuthenticatedClient(tokens, redirectUri);
        try {
            await classroom.courses.courseWork.studentSubmissions.modifyAttachments({
                courseId,
                courseWorkId,
                id: submissionId,
                requestBody: {
                    addAttachments: attachments
                }
            });

            // Re-fetch to get the updated state immediately
            return await this.getStudentSubmission(courseId, courseWorkId, tokens);
        } catch (error) {
            console.error('Error adding attachments:', error);
            throw error;
        }
    },

    /**
     * Remove attachments from a submission
     */
    async removeAttachmentFromSubmission(
        courseId: string,
        courseWorkId: string,
        submissionId: string,
        attachmentIds: string[],
        tokens: DriveTokens,
        redirectUri?: string
    ): Promise<ClassroomStudentSubmission | null> {
        const classroom = this.getAuthenticatedClient(tokens, redirectUri);
        try {
            // Using any because deleteIds might not be in the current @types/googleapis version
            // but is part of the API according to some docs
            await (classroom.courses.courseWork.studentSubmissions as any).modifyAttachments({
                courseId,
                courseWorkId,
                id: submissionId,
                requestBody: {
                    deleteIds: attachmentIds
                }
            });

            // Re-fetch to get the updated state immediately
            return await this.getStudentSubmission(courseId, courseWorkId, tokens);
        } catch (error) {
            console.error('Error removing attachments:', error);
            throw error;
        }
    }
};
