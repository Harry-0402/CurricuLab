import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || '',
});

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        // 1. Check for API Key
        if (!process.env.GROQ_API_KEY) {
            console.warn("GROQ_API_KEY missing. Returning mock response.");
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            return NextResponse.json({
                message: "I am currently running in **Demo Mode** because the AI service is not configured. \n\n" +
                    "In a real environment, I would answer your question about: \"" +
                    (messages[messages.length - 1]?.content || "business") + "\".\n\n" +
                    "Please configure the `GROQ_API_KEY` to enable real-time AI responses."
            });
        }

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

        const chatCompletion = await groq.chat.completions.create({
            messages: [systemPrompt, ...messages],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1,
            stream: false,
            stop: null
        });

        const reply = chatCompletion.choices[0]?.message?.content || "I apologize, I couldn't generate a response.";

        return NextResponse.json({ message: reply });

    } catch (error: any) {
        console.error('Groq API Error:', error);
        return NextResponse.json(
            { error: 'Failed to process request', details: error.message },
            { status: 500 }
        );
    }
}
