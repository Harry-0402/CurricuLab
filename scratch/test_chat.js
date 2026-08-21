const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function runTest(messages, label) {
    const apiKey = process.env.OPENROUTER_API_KEY;
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

    // Filter out leading assistant messages
    const firstUserIdx = messages.findIndex(m => m.role === 'user');
    const filteredMessages = firstUserIdx !== -1 ? messages.slice(firstUserIdx) : messages;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "google/gemini-2.5-flash",
                "messages": [systemMessage, ...filteredMessages],
                "temperature": 0.5,
                "max_tokens": 2048
            })
        });

        const data = await response.json();
        console.log(`--- Test: ${label} ---`);
        console.log("Response:", data.choices?.[0]?.message?.content);
    } catch (e) {
        console.error("Error:", e);
    }
}

async function main() {
    const messages = [
        { role: 'assistant', content: "Hi there! I'm Analytica, your AI study assistant. How can I help you today?" },
        { role: 'user', content: "ai for manager" }
    ];

    await runTest(messages, "Filtered Leading Assistant");
}

main();
