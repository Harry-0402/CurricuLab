import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || '',
});

export async function POST(req: Request) {
    try {
        const { messages, provider = 'groq', model } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
        }

        // Add a system prompt to guide the AI's behavior
        const systemPrompt = {
            role: 'system',
            content: `You are an expert AI Tutor for a Business Analytics MBA program. 
            Your role is to help students understand complex concepts in Operations Management, Digital Transformation, Business Law, Data Visualization, and Research Methodology.
            
            Guidelines:
            - Be encouraging, professional, and concise.
            - Use markdown for formatting (bold key terms, lists for steps).
            - If a student asks about a specific topic (e.g., "Six Sigma"), explain it simply first, then provide a business context example.
            - If you don't know the answer, admit it and suggest where they might find the info in their syllabus.
            
            Current Context: The user is a student in the "CurricuLab" platform.`
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
