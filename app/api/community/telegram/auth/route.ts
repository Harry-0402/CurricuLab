import { NextRequest, NextResponse } from 'next/server';
import { TelegramService } from '@/lib/telegram/telegram-service';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { TelegramClient } from 'telegram';
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

            await client.disconnect();
            return NextResponse.json({ success: true, phoneCodeHash });
        }

        if (action === 'sign_in') {
            const client = await TelegramService.createTemporaryClient();

            // Perform sign in
            await client.signInUser(
                { apiId: API_ID, apiHash: API_HASH },
                {
                    phoneNumber: phone,
                    phoneCodeHash: phoneCodeHash,
                    phoneCode: code,
                    password: password || undefined,
                    onError: (err) => { throw err; },
                }
            );

            // Save Session
            const sessionString = client.session.save() as unknown as string;

            // Get Current User
            const supabase = await createSupabaseServerClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user?.email) {
                await TelegramService.saveSession(user.email, sessionString, phone);
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
