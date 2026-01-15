import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || '',
});

export async function POST(req: Request) {
    try {
        const { messages, provider = 'groq', model, mode = 'tutor' } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
        }

        // --- SYSTEM PROMPTS ---
        const TUTOR_PROMPT = `You are an expert AI Tutor for a Business Analytics MBA program. 
        Your role is to help students understand complex concepts in Operations Management, Digital Transformation, Business Law, Data Visualization, and Research Methodology.
        Current Context: The user is a student in the "CurricuLab" platform.`;

        const PROMPT_ENGINEER_PROMPT = `You are a Strict Prompt Optimizer.
        Your ONLY output must be the refined, professional version of the user's input.
        
        RULES:
        1. **NO CONVERSATION**: Do not talk to the user. Do not say "Here is your prompt" or ask questions.
        2. **STRICT OUTPUT**: Output ONLY the final prompt text.
        3. **STRUCTURE**: Wrap the user's idea in a professional framework (Goal, Persona, Constraints, Format).
        4. **PLACEHOLDERS**: If the user uses [TOPIC], [KEY_TERMS], etc., leave them exactly as they are in the final output.
        5. **TOPIC AGNOSTIC**: Focus on the subject provided in the draft. Do not force an MBA context.`;

        const systemPrompt = {
            role: 'system',
            content: mode === 'prompt_engineer' ? PROMPT_ENGINEER_PROMPT : TUTOR_PROMPT
        };

        const PROMPT_ENGINEER_MODELS = [
            'google/gemini-2.0-flash-exp:free',
            'deepseek/deepseek-r1-distill-llama-70b:free',
            'xiaomi/mimo-v2-flash:free',
            'google/gemma-3-27b:free',
            'openai/gpt-oss-20b:free'
        ];

        const TUTOR_MODELS = [
            'google/gemini-2.0-flash-exp:free',
            'google/gemma-3-27b:free',
            'deepseek/deepseek-r1-distill-llama-70b:free',
            'openai/gpt-oss-20b:free'
        ];

        let reply = "";
        let errorDetails = "";

        // --- SMART ROUTER (OPENROUTER COMPETITIVE RACING) ---
        if (provider === 'openrouter' || mode === 'prompt_engineer') {
            const orKey = process.env.OPENROUTER_API_KEY;
            if (!orKey) return NextResponse.json({ message: "OpenRouter API Key is missing." });

            const modelList = mode === 'prompt_engineer' ? PROMPT_ENGINEER_MODELS : TUTOR_MODELS;

            // Define the call function for racing
            const callModel = async (modelId: string) => {
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${orKey}`,
                        "HTTP-Referer": "https://curriculab.vercel.app",
                        "X-Title": "CurricuLab"
                    },
                    body: JSON.stringify({
                        messages: [systemPrompt, ...messages],
                        model: modelId,
                        temperature: mode === 'prompt_engineer' ? 0.2 : 0.7,
                        max_tokens: 1024
                    })
                });

                if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(`Model ${modelId} failed: ${errText}`);
                }

                const data = await response.json();
                const content = data.choices[0]?.message?.content;
                if (!content) throw new Error(`Model ${modelId} returned no content`);
                return content;
            };

            // Race the top 3 models for maximum speed
            const topCandidates = modelList.slice(0, 3);
            const remainingCandidates = modelList.slice(3);

            try {
                // Return the first one that successfully completes
                reply = await Promise.any(topCandidates.map(model => callModel(model)));
            } catch (error: any) {
                console.warn("Primary model race failed, falling back to sequential:", error);
                errorDetails = "Race failed. | ";

                // Fallback to sequential for remaining models if race completely fails
                for (const modelId of remainingCandidates) {
                    try {
                        reply = await callModel(modelId);
                        if (reply) break;
                    } catch (e: any) {
                        console.error(`Sequential fallback failed for ${modelId}:`, e);
                        errorDetails += `${modelId}: error | `;
                    }
                }
            }
        }

        // --- GROQ FALLBACK (If OpenRouter fails or provider is Groq) ---
        if (!reply && (provider === 'groq' || provider === 'openrouter')) {
            if (process.env.GROQ_API_KEY) {
                try {
                    const chatCompletion = await groq.chat.completions.create({
                        messages: [systemPrompt, ...messages],
                        model: 'llama-3.3-70b-versatile',
                        temperature: mode === 'prompt_engineer' ? 0.2 : 0.7,
                        max_tokens: 1024,
                    });
                    reply = chatCompletion.choices[0]?.message?.content || "";
                } catch (e: any) {
                    console.error('Groq fallback failed:', e);
                }
            }
        }

        // --- COPILOT FALLBACK ---
        if (!reply && provider === 'copilot') {
            const copilotKey = process.env.COPILOT_API_KEY;
            if (copilotKey) {
                const response = await fetch("https://models.inference.ai.azure.com/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${copilotKey}`
                    },
                    body: JSON.stringify({
                        messages: [systemPrompt, ...messages],
                        model: "gpt-4o",
                        temperature: mode === 'prompt_engineer' ? 0.2 : 0.7,
                    })
                });
                if (response.ok) {
                    const data = await response.json();
                    reply = data.choices[0]?.message?.content || "";
                }
            }
        }

        if (!reply) {
            return NextResponse.json({
                message: "I'm having trouble connecting to my AI models right now. Please try again in a moment.",
                error: errorDetails
            });
        }

        return NextResponse.json({ message: reply });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Failed to process request', details: error.message },
            { status: 500 }
        );
    }
}
