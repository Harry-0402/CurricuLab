import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Admin Client (to fetch/save user sessions securely)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Ideally use SERVICE_ROLE_KEY for admin tasks, but ANON works if RLS allows
);

const API_ID = parseInt(process.env.TELEGRAM_API_ID || '0');
const API_HASH = process.env.TELEGRAM_API_HASH || '';

export class TelegramService {
    private static instances: Map<string, TelegramClient> = new Map();

    /**
     * Get or create a TelegramClient for a specific user session.
     */
    static async getClient(userId: string): Promise<TelegramClient | null> {
        if (this.instances.has(userId)) {
            const client = this.instances.get(userId)!;
            if (!client.connected) {
                await client.connect();
            }
            return client;
        }

        // Fetch session from DB
        const { data, error } = await supabaseAdmin
            .from('authorized_users')
            .select('telegram_session')
            .eq('email', userId) // Match logic in saveSession (userId is email here)
            .single();

        if (error || !data?.telegram_session) {
            return null;
        }

        const session = new StringSession(data.telegram_session);
        const client = new TelegramClient(session, API_ID, API_HASH, {
            connectionRetries: 5,
        });

        await client.connect();
        this.instances.set(userId, client);
        return client;
    }

    /**
     * Create a temporary client for login flow (before session is saved).
     */
    static async createTemporaryClient(sessionString?: string): Promise<TelegramClient> {
        const session = new StringSession(sessionString || "");
        const client = new TelegramClient(session, API_ID, API_HASH, {
            connectionRetries: 10,
            useWSS: false,
        });
        await client.connect();
        return client;
    }

    /**
     * Save session string to DB after successful login.
     */
    static async saveSession(userId: string, session: string, phone: string) {
        // Implement encryption here if needed (recommended)
        const { error } = await supabaseAdmin
            .from('authorized_users')
            .update({
                telegram_session: session,
                telegram_phone: phone
            })
            .eq('email', userId); // Find mostly by email in this app

        if (error) throw new Error(`Failed to save session: ${error.message}`);
    }
}
