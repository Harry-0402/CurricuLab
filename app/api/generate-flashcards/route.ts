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

        // Truncate content to ~4000 tokens (approx 15,000 chars) to prevent hitting Groq's 12000 TPM limit
        // which adds input tokens and max_tokens together.
        const MAX_CHARS = 15000;
        if (content.length > MAX_CHARS) {
            content = content.substring(0, MAX_CHARS) + "\n\n...[Content truncated to fit limits]";
        }

        if (!groqApiKey) {
            return NextResponse.json({ error: "Groq API Key missing" }, { status: 500 });
        }

        // 1. Ask Groq to extract flashcards in structured JSON format
        const SYSTEM_PROMPT = `You are an expert tutor. Given the following study material, extract the key concepts and create EXACTLY 30 to 40 high-quality flashcards.
CRITICAL INSTRUCTION: You must generate a minimum of 30 flashcards. Do not stop early. Do not summarize. Create as many flashcards as possible from the material until you reach at least 30.
CRITICAL INSTRUCTION 2: Every single flashcard MUST be entirely unique. Do NOT repeat concepts, questions, or definitions. Ensure a wide variety of topics from the material are covered.
Output your response as a valid JSON object containing a "flashcards" array. Each flashcard must have "frontContent" (the question or concept) and "backContent" (the answer or definition). 
Do NOT output any markdown blocks or text outside the JSON object. Just return the JSON object directly.`;

        let jsonResult = "";

        try {
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: `Study Material:\n\n${content}` }
                ],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.3,
                max_tokens: 3000,
                response_format: { type: "json_object" }
            });
            jsonResult = chatCompletion.choices[0]?.message?.content || "";
        } catch (groqError: any) {
            console.warn("Groq generation failed, attempting OpenRouter fallback:", groqError.message || groqError);
            const openRouterKey = process.env.OPENROUTER_API_KEY;
            
            if (!openRouterKey) {
                // If we don't have a fallback key, re-throw the original Groq error to be caught by the outer catch
                throw groqError;
            }

            // Fallback to OpenRouter using Fetch API
            const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${openRouterKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "meta-llama/llama-3.3-70b-instruct", // Compatible model on OpenRouter
                    messages: [
                        { role: 'system', content: SYSTEM_PROMPT },
                        { role: 'user', content: `Study Material:\n\n${content}` }
                    ],
                    temperature: 0.3,
                    response_format: { type: "json_object" }
                })
            });

            if (!openRouterResponse.ok) {
                const errorText = await openRouterResponse.text();
                console.error("OpenRouter fallback failed:", errorText);
                throw new Error(`OpenRouter Fallback Failed: ${openRouterResponse.statusText}. Original Groq Error: ${groqError.message}`);
            }

            const openRouterData = await openRouterResponse.json();
            jsonResult = openRouterData.choices[0]?.message?.content || "";
        }

        if (!jsonResult) {
            return NextResponse.json({ error: "No response from AI" }, { status: 500 });
        }

        // 2. Parse the JSON response
        let parsedData;
        try {
            // Sanitize response by extracting the outermost JSON object
            const startIndex = jsonResult.indexOf('{');
            const endIndex = jsonResult.lastIndexOf('}');
            
            if (startIndex !== -1 && endIndex !== -1 && endIndex >= startIndex) {
                const cleanJson = jsonResult.substring(startIndex, endIndex + 1);
                parsedData = JSON.parse(cleanJson);
            } else {
                throw new Error("No JSON object found in response");
            }
        } catch (e) {
            console.error("Failed to parse JSON from AI. Raw output:", jsonResult);
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
            return NextResponse.json({ error: `Database error: ${error.message || error.details || 'Failed to save flashcards'}` }, { status: 500 });
        }

        return NextResponse.json({ success: true, count: flashcards.length, data });

    } catch (error: any) {
        console.error("Flashcard generation failed:", error);
        let errorMessage = error.message || "Internal server error";
        
        // Catch Groq rate limit errors and make them user-friendly
        if (errorMessage.includes("Rate limit") || errorMessage.includes("rate_limit_exceeded") || errorMessage.includes("429")) {
            errorMessage = "AI token limit reached. Please wait for 2-3 minutes for tokens to refresh, then try again.";
        }
        
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
