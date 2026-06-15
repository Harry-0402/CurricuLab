import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; // Usually we want a Service Key for inserts, but using what's available
const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(geminiApiKey);

export async function POST(req: Request) {
    try {
        const { vaultResourceId, contentChunk } = await req.json();

        if (!vaultResourceId || !contentChunk) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (!geminiApiKey) {
            return NextResponse.json({ error: "Gemini API Key missing" }, { status: 500 });
        }

        // 1. Generate Embedding using Gemini
        const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const result = await model.embedContent(contentChunk);
        const embedding = result.embedding.values;

        // 2. Save to Supabase
        const { error } = await supabase
            .from('vault_embeddings')
            .insert({
                vault_resource_id: vaultResourceId,
                content_chunk: contentChunk,
                embedding: embedding
            });

        if (error) {
            console.error("Supabase insert error:", error);
            return NextResponse.json({ error: "Failed to save embedding to database" }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Embedding generated and saved successfully" });

    } catch (error: any) {
        console.error("Embedding generation failed:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
