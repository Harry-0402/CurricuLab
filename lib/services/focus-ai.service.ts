
/**
 * focus-ai.service.ts
 * Service to handle AI interactions for the Focus Zone
 */

export async function generateFocusQuote(topic: string = 'productivity'): Promise<{ text: string; author: string }> {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'system',
                        content: `You are a motivational coach. Generate a short, powerful, and unique motivational quote about ${topic}. 
                        Return ONLY a JSON object with this format: { "text": "The quote text", "author": "Author Name or Anonymous" }. 
                        Do not include markdown formatting or any other text.`
                    },
                    {
                        role: 'user',
                        content: `Give me a quote about ${topic}`
                    }
                ],
                mode: 'quote_generator'
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch quote');
        }

        const data = await response.json();

        // Parse the JSON from the AI response message
        // The AI might wrap it in markdown code blocks, so we clean it
        let content = data.message || '{}';
        content = content.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            return JSON.parse(content);
        } catch (e) {
            // Fallback if parsing fails
            return {
                text: "Focus is the key to unlocking your potential.",
                author: "Anonymous"
            };
        }
    } catch (error) {
        console.error('Error generating quote:', error);
        return {
            text: "The secret of getting ahead is getting started.",
            author: "Mark Twain"
        };
    }
}
