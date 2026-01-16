
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

// Initialize Gemini Client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

interface ModelConfig {
    id: string;
    provider: 'gemini' | 'groq' | 'openrouter' | 'copilot';
    name: string;
}

// Priority Queue for Auto-Switching
const FALLBACK_CHAIN: ModelConfig[] = [
    { id: "gemini-2.0-flash-exp", provider: 'gemini', name: "Gemini 2.0 Flash (Client)" },
    { id: "llama-3.3-70b-versatile", provider: 'groq', name: "Llama 3.3 (Groq)" },
    { id: "deepseek/deepseek-r1:free", provider: 'openrouter', name: "DeepSeek R1 (OpenRouter)" },
    { id: "copilot-gpt-4o", provider: 'copilot', name: "GPT-4o (Copilot)" },
    { id: "gemini-pro", provider: 'gemini', name: "Gemini Pro (Fallback)" }
];

export const AiService = {
    async generateNoteContent(subject: string, unit: string, topic: string): Promise<string> {
        const prompt = `
        You are an expert tutor creating a revision note for a student.
        
        Subject: ${subject}
        Unit: ${unit}
        Topic: ${topic}

        Please provide a concise, easy-to-understand revision note for this topic using Markdown.
        - Include a brief definition/explanation.
        - Key points or bullet points.
        - An example if applicable.
        - Keep it structured and clearly formatted.
        - Do not include the title (I will add it separately).
        `;

        let lastError: any = null;

        for (const modelConfig of FALLBACK_CHAIN) {
            try {
                console.log(`Attempting generation with ${modelConfig.name}...`);

                let content: string = "";

                if (modelConfig.provider === 'gemini') {
                    // client-side Gemini
                    if (!GEMINI_API_KEY) throw new Error("Gemini API Key missing");
                    const model = genAI.getGenerativeModel({ model: modelConfig.id });
                    const result = await model.generateContent(prompt);
                    const response = await result.response;
                    content = response.text();
                } else {
                    // Server-side Route (Groq, OpenRouter, Copilot)
                    // Note: We're reusing the chat API which expects a 'messages' array
                    const response = await fetch('/api/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            messages: [{ role: 'user', content: prompt }],
                            provider: modelConfig.provider,
                            model: modelConfig.id,
                            mode: 'tutor'
                        })
                    });

                    if (!response.ok) {
                        const err = await response.text();
                        throw new Error(`API Error ${response.status}: ${err}`);
                    }

                    const data = await response.json();
                    if (data.error) throw new Error(data.error);
                    content = data.message;
                }

                if (content) return content;

            } catch (error: any) {
                console.warn(`Failed with ${modelConfig.name}:`, error.message || error);
                lastError = error;
                // Continue to next model
            }
        }

        throw new Error(`All AI models failed. Last error: ${lastError?.message || "Unknown error"}`);
    }
};
