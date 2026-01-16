
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

// Initialize Gemini Client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const AiService = {
    async generateNoteContent(subject: string, unit: string, topic: string): Promise<string> {
        if (!GEMINI_API_KEY) {
            throw new Error("Gemini API Key is missing");
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

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

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("AI Generation Error:", error);
            return "Failed to generate content. Please try again later.";
        }
    }
};
