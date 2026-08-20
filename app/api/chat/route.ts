import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
        }

        const systemMessage = {
            role: 'system',
            content: `You are Analytica, an AI study assistant for CurricuLab. 
You are helpful, concise, and friendly. 
You help students with their academic queries, summarize notes, and offer study tips. 

CRITICAL INSTRUCTIONS:
1. STRICTLY adhere to the user's explicit instructions (e.g., word limits, formatting, tone). If a user specifies a word limit, you MUST stay within it.
2. ALWAYS use rich Markdown to structure your responses. Use headings (###) for distinct sections, bold text (**) for key terms, and bullet points (-) or numbered lists (1.) for lists.
3. If the user provides a list of questions, always HIGHLIGHT the question in bold (e.g. **Question 1: ...**) before providing the answer.
4. If the user asks multiple questions or your response has distinct sections, separate them with a horizontal rule (---).
5. Separate paragraphs and list items with clear blank lines to ensure proper rendering.
6. Never use excessive punctuation or emojis. Be direct and professional.`
        };

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "google/gemini-2.5-flash",
                "messages": [systemMessage, ...messages],
                "temperature": 0.5,
                "max_tokens": 2048
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that request.";
        const finishReason = data.choices?.[0]?.finish_reason;

        return NextResponse.json({ reply, finishReason });
    } catch (error: any) {
        console.error('LLM API Error:', error);
        return NextResponse.json({ error: 'Failed to communicate with AI', details: error.message }, { status: 500 });
    }
}
