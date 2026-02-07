import { NextRequest, NextResponse } from 'next/server';
import { TelegramService } from '@/lib/telegram/telegram-service';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { Api } from 'telegram';

export async function POST(req: NextRequest) {
    const { action, chatId, text, title, users, limit } = await req.json();

    try {
        // Authenticate User & Get Client
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const client = await TelegramService.getClient(user.email);

        if (!client) {
            return NextResponse.json({ error: 'Telegram session not found. Please log in.' }, { status: 403 });
        }

        switch (action) {
            case 'dialogs': {
                const dialogs = await client.getDialogs({ limit: limit || 20 });
                // Simplify data for frontend
                const simplified = dialogs.map(d => ({
                    id: d.id?.toString(),
                    title: d.title,
                    isGroup: d.isGroup,
                    isChannel: d.isChannel,
                    unreadCount: d.unreadCount,
                    date: d.date,
                    message: d.message?.message // Last message preview
                }));
                return NextResponse.json({ success: true, data: simplified });
            }

            case 'history': {
                if (!chatId) throw new Error("Chat ID is required");
                const messages = await client.getMessages(chatId, { limit: limit || 50 });

                const simplifyMessage = (msg: any) => ({
                    id: msg.id,
                    text: msg.message,
                    date: msg.date,
                    senderId: msg.fromId?.userId?.toString() || msg.peerId?.userId?.toString(), // simplified logic
                    isOut: msg.out,
                    media: !!msg.media
                });

                return NextResponse.json({ success: true, data: messages.map(simplifyMessage) });
            }

            case 'send': {
                if (!chatId || !text) throw new Error("Chat ID and Text are required");
                await client.sendMessage(chatId, { message: text });
                return NextResponse.json({ success: true });
            }

            case 'create_group': {
                if (!title || !users) throw new Error("Title and Users are required");
                // Expect users to be an array of usernames or phone numbers
                // For simplicity, let's assume valid InputUser entities or usernames
                const result = await client.invoke(
                    new Api.messages.CreateChat({
                        users: users, // e.g. ["username1", "username2"]
                        title: title,
                    })
                );
                return NextResponse.json({ success: true, data: result });
            }

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

    } catch (error: any) {
        console.error('Telegram Chat Error:', error);
        return NextResponse.json({ error: error.message || 'Action failed' }, { status: 500 });
    }
}
