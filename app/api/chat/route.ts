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

        const PROMPT_ENGINEER_PROMPT = `You are a Universal Prompt Engineer.
        Your goal is to optimize the user's input into a high-quality, structured prompt.
        
        Guidelines:
        1. **Context-First**: Use the user's entered draft as the primary context. Do not force an MBA/Tutor persona if the topic is unrelated.
        2. **Topic Agnostic**: Adapt your instructions and tone to the specific subject matter provided (coding, cooking, business, etc.).
        3. **Enhancement**: Take the draft and add professional structure: persona, clear task, constraints, and output format.
        4. **Variables**: Preserve placeholders like [TOPIC], [KEY_TERMS] if present.`;

        const systemPrompt = {
            role: 'system',
            content: mode === 'prompt_engineer' ? PROMPT_ENGINEER_PROMPT : TUTOR_PROMPT
        };

        let reply = "";

        // --- COPILOT (GITHUB MODELS) HANDLER ---
        if (provider === 'copilot') {
            const copilotKey = process.env.COPILOT_API_KEY;
            if (!copilotKey) return NextResponse.json({ message: "Copilot API Key is missing. Please configure COPILOT_API_KEY." });

            const response = await fetch("https://models.inference.ai.azure.com/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${copilotKey}`
                },
                body: JSON.stringify({
                    messages: [systemPrompt, ...messages],
                    model: "gpt-4o", // GitHub Models default flagship
                    temperature: 0.7,
                    max_tokens: 1024
                })
            });

            if (!response.ok) {
                const err = await response.text();
                console.error("Copilot API Error:", err);
                throw new Error(`Copilot API Error: ${response.statusText}`);
            }

            const data = await response.json();
            reply = data.choices[0]?.message?.content || "No response from Copilot.";
        }
        // --- OPENROUTER HANDLER ---
        else if (provider === 'openrouter') {
            const orKey = process.env.OPENROUTER_API_KEY;
            if (!orKey) return NextResponse.json({ message: "OpenRouter API Key is missing. Please configure OPENROUTER_API_KEY." });

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${orKey}`,
                    "HTTP-Referer": "https://curriculab.vercel.app", // Optional, for rankings
                    "X-Title": "CurricuLab" // Optional
                },
                body: JSON.stringify({
                    messages: [systemPrompt, ...messages],
                    model: model || "deepseek/deepseek-chat",
                    temperature: 0.7,
                    max_tokens: 1024
                })
            });

            if (!response.ok) {
                const err = await response.text();
                console.error("OpenRouter API Error:", err);
                throw new Error(`OpenRouter API Error: ${response.statusText}`);
            }

            const data = await response.json();
            reply = data.choices[0]?.message?.content || "No response from OpenRouter.";
        }
        // --- GROQ HANDLER (Default) ---
        else {
            if (!process.env.GROQ_API_KEY) {
                return NextResponse.json({
                    message: "I am currently running in **Demo Mode**. Please configure `GROQ_API_KEY`."
                });
            }

            const chatCompletion = await groq.chat.completions.create({
                messages: [systemPrompt, ...messages],
                model: model || 'llama-3.3-70b-versatile',
                temperature: 0.7,
                max_tokens: 1024,
                top_p: 1,
                stream: false,
                stop: null
            });

            reply = chatCompletion.choices[0]?.message?.content || "I apologize, I couldn't generate a response.";
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
