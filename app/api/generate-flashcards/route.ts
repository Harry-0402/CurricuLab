import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; 
const groqApiKey = process.env.GROQ_API_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);
const groq = new Groq({ apiKey: groqApiKey });

export async function POST(req: Request) {
    try {
        let { vaultResourceId, content, url } = await req.json();

        if (!vaultResourceId) {
            return NextResponse.json({ error: "Missing vaultResourceId" }, { status: 400 });
        }

        if (!content && url) {
            try {
                const fetched = await fetch(url);
                content = await fetched.text();
            } catch (e) {
                return NextResponse.json({ error: "Failed to fetch content from URL" }, { status: 400 });
            }
        }

        if (!content) {
            return NextResponse.json({ error: "Missing content or valid URL" }, { status: 400 });
        }

        if (!groqApiKey) {
            return NextResponse.json({ error: "Groq API Key missing" }, { status: 500 });
        }

        // 1. Ask Groq to extract flashcards in structured JSON format
        const SYSTEM_PROMPT = `You are an expert tutor. Given the following study material, extract the key concepts and create 5 high-quality flashcards.
Output your response as a valid JSON object containing a "flashcards" array. Each flashcard must have "frontContent" (the question or concept) and "backContent" (the answer or definition). 
Do NOT output any markdown blocks or text outside the JSON object. Just return the JSON object directly.`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: `Study Material:\n\n${content}` }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.3,
            response_format: { type: "json_object" }
        });

        const reply = chatCompletion.choices[0]?.message?.content || "{}";
        let parsedData;
        try {
            parsedData = JSON.parse(reply);
        } catch (e) {
            return NextResponse.json({ error: "Failed to parse JSON from AI" }, { status: 500 });
        }

        const flashcards = parsedData.flashcards || [];

        if (flashcards.length === 0) {
            return NextResponse.json({ error: "No flashcards generated" }, { status: 400 });
        }

        // 2. Prepare data for Supabase insert
        const flashcardInserts = flashcards.map((card: any) => ({
            vault_resource_id: vaultResourceId,
            front_content: card.frontContent,
            back_content: card.backContent
        }));

        // 3. Save to Supabase
        const { data, error } = await supabase
            .from('vault_flashcards')
            .insert(flashcardInserts)
            .select();

        if (error) {
            console.error("Supabase insert error:", error);
            return NextResponse.json({ error: "Failed to save flashcards to database" }, { status: 500 });
        }

        return NextResponse.json({ success: true, count: flashcards.length, data });

    } catch (error: any) {
        console.error("Flashcard generation failed:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
