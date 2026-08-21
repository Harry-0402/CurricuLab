import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || '',
});

export async function POST(req: Request) {
    try {
        const { messages, provider, model, mode, systemOverride } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
        }

        // Filter out any leading assistant messages to prevent confusing the model
        const firstUserIdx = messages.findIndex((m: any) => m.role === 'user');
        const filteredMessages = firstUserIdx !== -1 ? messages.slice(firstUserIdx) : messages;

        // --- SYSTEM PROMPTS ---
        const DEFAULT_ANALYTICA_PROMPT = `You are Analytica, an AI study assistant for CurricuLab. 
You are helpful, concise, and friendly. 
You help students with their academic queries, summarize notes, and offer study tips. 

CRITICAL INSTRUCTIONS:
1. STRICTLY adhere to the user's explicit instructions (e.g., word limits, formatting, tone). If a user specifies a word limit, you MUST stay within it.
2. ALWAYS use rich Markdown to structure your responses. Use headings (###) for distinct sections, bold text (**) for key terms, and bullet points (-) or numbered lists (1.) for lists.
3. If the user provides a list of questions, always HIGHLIGHT the question in bold (e.g. **Question 1: ...**) before providing the answer.
4. If the user asks multiple questions or your response has distinct sections, separate them with a horizontal rule (---).
5. Separate paragraphs and list items with clear blank lines to ensure proper rendering.
6. Never use excessive punctuation or emojis. Be direct and professional.`;

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

        let selectedSystemPrompt = DEFAULT_ANALYTICA_PROMPT;
        if (systemOverride) {
            selectedSystemPrompt = systemOverride;
        } else if (mode === 'prompt_engineer') {
            selectedSystemPrompt = PROMPT_ENGINEER_PROMPT;
        } else if (mode === 'tutor') {
            selectedSystemPrompt = TUTOR_PROMPT;
        }

        const systemMessage = {
            role: 'system',
            content: selectedSystemPrompt
        };

        const apiMessages = [systemMessage, ...filteredMessages];

        let reply = "";
        let finishReason = null;

        // Determine which provider to use
        const targetProvider = provider || (mode === 'prompt_engineer' ? 'openrouter' : 'openrouter');

        if (targetProvider === 'openrouter') {
            const orKey = process.env.OPENROUTER_API_KEY;
            if (!orKey) {
                throw new Error("OpenRouter API Key is missing.");
            }

            const defaultModel = mode === 'prompt_engineer' ? 'google/gemini-2.0-flash-exp:free' : 'google/gemini-2.5-flash';
            const selectedModel = model || defaultModel;

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${orKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": selectedModel,
                    "messages": apiMessages,
                    "temperature": mode === 'prompt_engineer' ? 0.2 : 0.5,
                    "max_tokens": 2048
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            const choice = data.choices?.[0];
            reply = choice?.message?.content || "I'm sorry, I couldn't process that request.";
            finishReason = choice?.finish_reason || null;

        } else if (targetProvider === 'groq') {
            const groqKey = process.env.GROQ_API_KEY;
            if (!groqKey) {
                throw new Error("Groq API Key is missing.");
            }

            // Map model names if needed
            let selectedModel = model || 'llama-3.3-70b-versatile';
            if (selectedModel === 'llama-3.3-70b-versatile') {
                selectedModel = 'llama-3.3-70b-versatile';
            }

            const chatCompletion = await groq.chat.completions.create({
                messages: apiMessages as any,
                model: selectedModel,
                temperature: mode === 'prompt_engineer' ? 0.2 : 0.7,
                max_tokens: 1024,
            });

            const choice = chatCompletion.choices[0];
            reply = choice?.message?.content || "";
            finishReason = choice?.finish_reason || null;

        } else if (targetProvider === 'copilot') {
            const copilotKey = process.env.COPILOT_API_KEY;
            if (!copilotKey) {
                throw new Error("Copilot API Key is missing.");
            }

            const selectedModel = model || "gpt-4o";

            const response = await fetch("https://models.inference.ai.azure.com/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${copilotKey}`
                },
                body: JSON.stringify({
                    messages: apiMessages,
                    model: selectedModel,
                    temperature: mode === 'prompt_engineer' ? 0.2 : 0.7,
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Copilot API error: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            const choice = data.choices?.[0];
            reply = choice?.message?.content || "";
            finishReason = choice?.finish_reason || null;
        }

        if (!reply) {
            throw new Error("AI models returned no response content.");
        }

        // Return both 'reply' (for AnalyticaChat.tsx) and 'message' (for PromptLabContent, AIInterviewPrep, etc.)
        return NextResponse.json({ reply, message: reply, finishReason });

    } catch (error: any) {
        console.error('LLM API Error:', error);
        return NextResponse.json({ error: 'Failed to communicate with AI', details: error.message }, { status: 500 });
    }
}
