import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; 
const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const groqApiKey = process.env.GROQ_API_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(geminiApiKey);
const groq = new Groq({ apiKey: groqApiKey });

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
        }

        const userQuery = messages[messages.length - 1].content;

        if (!geminiApiKey || !groqApiKey) {
            return NextResponse.json({ error: "Missing required API keys" }, { status: 500 });
        }

        // 1. Generate Embedding for the user's query
        const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const result = await model.embedContent(userQuery);
        const queryEmbedding = result.embedding.values;

        // 2. Search Supabase for similar chunks
        const { data: matchedDocuments, error: searchError } = await supabase.rpc('match_vault_embeddings', {
            query_embedding: queryEmbedding,
            match_threshold: 0.6, // Adjust based on how strict you want matches
            match_count: 5 // Get top 5 relevant chunks
        });

        if (searchError) {
            console.error("Vector search failed:", searchError);
            // Fallback to normal chat if search fails
        }

        // 3. Construct System Prompt with Context
        let contextText = "No relevant context found in the Vault.";
        if (matchedDocuments && matchedDocuments.length > 0) {
            contextText = matchedDocuments.map((doc: any, index: number) => `--- Excerpt ${index + 1} ---\n${doc.content_chunk}`).join('\n\n');
        }

        const SYSTEM_PROMPT = `You are an expert AI Tutor connected directly to the student's Knowledge Vault.
Answer the user's question using ONLY the provided context from their Vault resources. 
If the answer is not contained within the provided context, clearly state that you don't have enough information in the Vault to answer it, but you can try to answer from general knowledge.

VAULT CONTEXT:
${contextText}

FORMATTING RULES:
- Use Markdown for structure.
- Use LaTeX for mathematical equations.
- Synthesize the excerpts naturally. DO NOT say "According to Excerpt 1", just integrate the facts.`;

        // 4. Generate response using GROQ (as requested by user)
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                ...messages
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.2, // Low temp for more factual/grounded responses
            max_tokens: 1024,
        });

        const choice = chatCompletion.choices[0];
        const reply = choice?.message?.content || "";
        const finishReason = choice?.finish_reason || null;

        return NextResponse.json({ message: reply, finishReason, usedContext: matchedDocuments?.length > 0 });

    } catch (error: any) {
        console.error('RAG API Error:', error);
        return NextResponse.json({ error: 'Failed to process RAG request', details: error.message }, { status: 500 });
    }
}
