import { createSupabaseServerClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
        const supabase = await createSupabaseServerClient();

        // Get current user session
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
            const oauth2Client = new google.auth.OAuth2(
                process.env.GOOGLE_OAUTH_CLIENT_ID,
                process.env.GOOGLE_OAUTH_CLIENT_SECRET,
                process.env.GOOGLE_OAUTH_REDIRECT_URI
            );

            try {
                const { tokens } = await oauth2Client.getToken(code);

                // Store tokens in database
                const updates: any = {
                    user_id: session.user.id,
                    access_token: tokens.access_token,
                    expires_at: new Date(tokens.expiry_date!).toISOString(),
                    token_type: tokens.token_type,
                    scope: tokens.scope,
                    updated_at: new Date().toISOString(),
                };

                // Only update refresh token if a new one was returned
                if (tokens.refresh_token) {
                    updates.refresh_token = tokens.refresh_token;
                }

                // We use upsert to handle both new and existing token records
                const { error } = await supabase
                    .from('google_oauth_tokens')
                    .upsert(updates, { onConflict: 'user_id' });

                if (error) {
                    console.error('Error storing tokens:', error);
                    return NextResponse.redirect(`${requestUrl.origin}/classroom?error=token_storage_failed`);
                }
            } catch (error) {
                console.error('Error retrieving access token:', error);
                return NextResponse.redirect(`${requestUrl.origin}/classroom?error=oauth_failed`);
            }
        } else {
            // User not logged in
            return NextResponse.redirect(`${requestUrl.origin}/classroom?error=unauthorized`);
        }
    }

    // Redirect to classroom page
    return NextResponse.redirect(`${requestUrl.origin}/classroom?drive_connected=true`);
}
