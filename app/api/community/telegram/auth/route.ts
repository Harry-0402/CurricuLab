import { NextRequest, NextResponse } from 'next/server';
import { TelegramService } from '@/lib/telegram/telegram-service';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { TelegramClient, Api } from 'telegram';
import { StringSession } from 'telegram/sessions';

const API_ID = parseInt(process.env.TELEGRAM_API_ID || '0');
const API_HASH = process.env.TELEGRAM_API_HASH || '';

export async function POST(req: NextRequest) {
    const { action, phone, code, phoneCodeHash, password } = await req.json();

    try {
        if (action === 'send_code') {
            const client = await TelegramService.createTemporaryClient();

            const { phoneCodeHash } = await client.sendCode(
                { apiId: API_ID, apiHash: API_HASH },
                phone
            );

            const sessionString = client.session.save() as unknown as string;

            await client.disconnect();
            return NextResponse.json({ success: true, phoneCodeHash, sessionString });
        }

        if (action === 'sign_in') {
            const { sessionString } = await req.json(); // Extract sessionString from request
            // Use the SAME session that requested the code
            const client = await TelegramService.createTemporaryClient(sessionString);

            // Perform sign in using raw API call to pass phoneCodeHash directly
            const result = await client.invoke(
                new Api.auth.SignIn({
                    phoneNumber: phone,
                    phoneCodeHash: phoneCodeHash,
                    phoneCode: code,
                })
            ) as unknown as Api.auth.Authorization;

            // Save Session (It might have updated)
            const newSessionString = client.session.save() as unknown as string; // Capture potentially updated session

            // Get Current User
            const supabase = await createSupabaseServerClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user?.email) {
                await TelegramService.saveSession(user.email, newSessionString, phone);
            } else {
                throw new Error("User not authenticated with CurricuLab");
            }

            await client.disconnect();
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        console.error('Telegram Auth Error:', error);
        return NextResponse.json({ error: error.message || 'Authentication failed' }, { status: 500 });
    }
}
