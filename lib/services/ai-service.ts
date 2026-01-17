
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
        You are an expert tutor creating a high-quality revision note for a student.
        
        Subject: ${subject}
        Unit: ${unit}
        Topic: ${topic}

        Please provide a structured, visually appealing revision note using proper Markdown formatting:
        
        IMPORTANT: Do NOT include the main topic title (I will display it separately). Start directly with the content.
        
        ## Overview (Use H2 for main sections)
        Provide a clear, concise explanation of the concept.
        
        ### Key Concepts (Use H3 for subsections)
        - Use **bold text** to highlight important terms and definitions.
        - Use bullet points for readability.
        
        ### Real-World Example
        Provide a practical example to illustrate the concept.

        ### Quick Summary
        A one-sentence takeaway.

        **Review:**
        - Ensure strictly hierarchical headings (#, ##, ###).
        - Highlight at least 3-5 keywords using **bold**.
        - Keep it professional yet easy to scan.
        `;

        let lastError: any = null;

        for (const modelConfig of FALLBACK_CHAIN) {
            try {
                console.log(`[Note] Attempting generation with ${modelConfig.name}...`);

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
                console.warn(`[Note] Failed with ${modelConfig.name}:`, error.message || error);
                lastError = error;
                // Continue to next model
            }
        }

        throw new Error(`All AI models failed. Last error: ${lastError?.message || "Unknown error"}`);
    },

    async generateAnswer(
        subject: string,
        unit: string,
        subtopics: string[],
        question: string,
        marks: number,
        difficulty: string
    ): Promise<string> {
        const prompt = `
        Act as an expert university professor. Write a precise exam answer for the following question.

        **Context:**
        - **Subject:** ${subject}
        - **Unit:** ${unit}
        - **Relevant Topics in Unit:** ${subtopics.length > 0 ? subtopics.join(', ') : 'General Unit Context'}
        - **Target Marks:** ${marks} Marks (Adjust length and depth accordingly)
        - **Difficulty:** ${difficulty}

        **Question:**
        "${question}"

        **Guidelines:**
        1. **Structure:** Start with a specific, direct answer using keywords. Then explain.
        2. **Format:** 
           - Use **Markdown Tables** for comparisons, differences, or structured lists (e.g., Pros/Cons).
           - Use **Bullet Points** for list items.
           - Use **Bold Keywords** for emphasis.
           - Use **Clear Titles (H2/H3)** for all sections.
        3. **Strict Length & Style Rules:**
           - **2 Marks:** Short theory. **4-9 lines.**
           - **7 Marks:** Medium analytical. **14-19 lines.**
           - **8 Marks:** Medium analytical. **16-21 lines.**
           - **10 Marks:** Long integrative. **20-25 lines.**
           - **15 Marks:** Long analytical. **30-35 lines.**
        4. **Tone:** Academic, clear, and authoritative. Do not preface with "Here is the answer".
        
        **Answer:**
        `;

        let lastError: any = null;

        for (const modelConfig of FALLBACK_CHAIN) {
            try {
                console.log(`[Answer] Attempting generation with ${modelConfig.name}...`);

                let content: string = "";

                if (modelConfig.provider === 'gemini') {
                    if (!GEMINI_API_KEY) throw new Error("Gemini API Key missing");
                    const model = genAI.getGenerativeModel({ model: modelConfig.id });
                    const result = await model.generateContent(prompt);
                    const response = await result.response;
                    content = response.text();
                } else {
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
                console.warn(`[Answer] Failed with ${modelConfig.name}:`, error.message || error);
                lastError = error;
            }
        }

        throw new Error(`All AI models failed. Last error: ${lastError?.message || "Unknown error"}`);
    },

    async generateContent(prompt: string): Promise<string> {
        let lastError: any = null;

        for (const modelConfig of FALLBACK_CHAIN) {
            try {
                console.log(`[Content] Attempting generation with ${modelConfig.name}...`);

                let content: string = "";

                if (modelConfig.provider === 'gemini') {
                    if (!GEMINI_API_KEY) throw new Error("Gemini API Key missing");
                    const model = genAI.getGenerativeModel({ model: modelConfig.id });
                    const result = await model.generateContent(prompt);
                    const response = await result.response;
                    content = response.text();
                } else {
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
                console.warn(`[Content] Failed with ${modelConfig.name}:`, error.message || error);
                lastError = error;
            }
        }

        throw new Error(`All AI models failed. Last error: ${lastError?.message || "Unknown error"}`);
    },

    async formatUserAnswer(question: string, userAnswer: string, marks: number): Promise<string> {
        const CHUNK_SIZE = 2500;
        const MAX_DIRECT_FORMAT = 3000;

        // If answer is short enough, format directly
        if (userAnswer.length <= MAX_DIRECT_FORMAT) {
            return this._formatAnswerChunk(question, userAnswer, marks, false);
        }

        // Smart chunking for large answers
        console.log(`[SmartChunk] Answer is ${userAnswer.length} chars, splitting into chunks...`);

        const chunks = this._splitIntoChunks(userAnswer, CHUNK_SIZE);
        console.log(`[SmartChunk] Split into ${chunks.length} chunks`);

        const formattedChunks: string[] = [];

        for (let i = 0; i < chunks.length; i++) {
            try {
                console.log(`[SmartChunk] Formatting answer chunk ${i + 1}/${chunks.length}...`);
                const formatted = await this._formatAnswerChunk(question, chunks[i], marks, i > 0);
                formattedChunks.push(formatted);
            } catch (error) {
                console.warn(`[SmartChunk] Chunk ${i + 1} failed, using raw content`);
                formattedChunks.push(chunks[i]);
            }
        }

        return formattedChunks.join('\n\n---\n\n');
    },

    async _formatAnswerChunk(question: string, userAnswer: string, marks: number, isContinuation: boolean): Promise<string> {
        const continuationNote = isContinuation
            ? `\n\n**IMPORTANT:** This is a CONTINUATION - format directly without introduction.`
            : '';

        const prompt = `You are a formatting assistant. Format this student answer with markdown.

**Question:** ${question}
**Marks:** ${marks}

**Raw Answer to Format:**
${userAnswer}

---

**CRITICAL RULES - MUST FOLLOW:**
1. PRESERVE 100% OF THE CONTENT - do NOT skip, summarize, or truncate
2. Keep ALL numbered points exactly as provided (if input has 1-10, output has 1-10)
3. Keep ALL sentences - every sentence from input must appear in output
4. DO NOT add new information
5. DO NOT remove any content

**Formatting:**
- Use ## for main headings
- Use **bold** for key terms
- Use bullet points (- ) for lists
- Use proper markdown tables (| col1 | col2 |) for tabular data${continuationNote}

Return the COMPLETE formatted answer. Do not truncate.`;

        return this.generateContent(prompt);
    },

    async formatVaultContent(title: string, content: string, type: 'study_note' | 'case_study' | 'project'): Promise<string> {
        const CHUNK_SIZE = 2500; // Characters per chunk
        const MAX_DIRECT_FORMAT = 3000; // Content under this is formatted directly

        // If content is short enough, format directly
        if (content.length <= MAX_DIRECT_FORMAT) {
            return this._formatVaultChunk(title, content, type, false);
        }

        // Smart chunking for large content
        console.log(`[SmartChunk] Content is ${content.length} chars, splitting into chunks...`);

        const chunks = this._splitIntoChunks(content, CHUNK_SIZE);
        console.log(`[SmartChunk] Split into ${chunks.length} chunks`);

        const formattedChunks: string[] = [];

        for (let i = 0; i < chunks.length; i++) {
            const isFirst = i === 0;
            const chunkTitle = isFirst ? title : `${title} (Part ${i + 1})`;

            try {
                console.log(`[SmartChunk] Formatting chunk ${i + 1}/${chunks.length}...`);
                const formatted = await this._formatVaultChunk(chunkTitle, chunks[i], type, !isFirst);
                formattedChunks.push(formatted);
            } catch (error) {
                console.warn(`[SmartChunk] Chunk ${i + 1} failed, using raw content`);
                formattedChunks.push(chunks[i]);
            }
        }

        // Combine all formatted chunks
        return formattedChunks.join('\n\n---\n\n');
    },

    _splitIntoChunks(content: string, chunkSize: number): string[] {
        const chunks: string[] = [];
        const paragraphs = content.split(/\n\n+/);

        let currentChunk = '';

        for (const para of paragraphs) {
            if (currentChunk.length + para.length > chunkSize && currentChunk.length > 0) {
                chunks.push(currentChunk.trim());
                currentChunk = para;
            } else {
                currentChunk += (currentChunk ? '\n\n' : '') + para;
            }
        }

        if (currentChunk.trim()) {
            chunks.push(currentChunk.trim());
        }

        // If no paragraphs found (single block), split by character count
        if (chunks.length === 0 && content.length > 0) {
            for (let i = 0; i < content.length; i += chunkSize) {
                chunks.push(content.slice(i, i + chunkSize));
            }
        }

        return chunks;
    },

    async _formatVaultChunk(title: string, content: string, type: 'study_note' | 'case_study' | 'project', isContinuation: boolean): Promise<string> {
        const continuationNote = isContinuation
            ? `\n\n**IMPORTANT:** This is a CONTINUATION - do NOT add any introduction. Just format this part directly.`
            : '';

        const prompt = `You are a formatting assistant. Format the raw content with proper markdown structure.

**Title:** ${title}
**Type:** ${type.replace('_', ' ')}

**Raw Content to Format:**
${content}

---

**CRITICAL RULES - MUST FOLLOW:**
1. PRESERVE 100% OF THE CONTENT - do NOT skip, summarize, or truncate anything
2. Keep ALL numbered points, ALL bullet points, ALL paragraphs exactly as provided
3. If content has numbers 1-10, your output MUST have numbers 1-10
4. DO NOT add new content or explanations
5. DO NOT remove any information

**Formatting Guidelines:**
- Use ## for main headings, ### for subheadings
- Use **bold** for key terms
- Use bullet points (- ) for lists
- Use proper markdown tables (| header | header |) when data is tabular
- Keep paragraph breaks${continuationNote}

Return the COMPLETE formatted content. Every sentence from the input must appear in the output.`;

        return this.generateContent(prompt);
    }
};

