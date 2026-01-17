
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
        const prompt = `You are a formatting assistant. Your job is to take a student's raw answer and format it beautifully with proper markdown structure.

**Question:** ${question}
**Marks:** ${marks}

**Student's Raw Answer:**
${userAnswer}

---

**Your Task:** Format the above answer with:
1. Clear section headings (use ## for main sections)
2. Bullet points or numbered lists where appropriate
3. Bold key terms and important concepts
4. Proper paragraph structure
5. Add emphasis where needed
6. Use markdown tables when comparing items or presenting structured data

**Important Rules:**
- DO NOT change the content or meaning of the answer
- DO NOT add new information the student didn't write
- ONLY format and structure what's already there
- Keep the academic tone
- Make it easy to read and scan

Return ONLY the formatted answer in markdown format.`;

        return this.generateContent(prompt);
    },

    async formatVaultContent(title: string, content: string, type: 'study_note' | 'case_study' | 'project'): Promise<string> {
        const typeGuidelines = {
            study_note: `Format as a well-structured study note with:
- Clear overview section
- Key concepts highlighted
- Important definitions bolded
- Summary points at the end`,
            case_study: `Format as a professional case study with:
- Background/Context section
- Problem statement
- Analysis section
- Key findings or lessons learned
- Conclusion`,
            project: `Format as a project documentation with:
- Project overview
- Objectives/Goals
- Implementation details
- Key features or deliverables
- Results or outcomes`
        };

        const prompt = `You are a formatting assistant. Your job is to take raw content and format it beautifully with proper markdown structure.

**Title:** ${title}
**Type:** ${type.replace('_', ' ')}

**Raw Content:**
${content}

---

**Your Task:** ${typeGuidelines[type]}

**General Formatting Rules:**
1. Use ## for main section headings
2. Use ### for subsections
3. Use bullet points or numbered lists where appropriate
4. Bold key terms and important concepts
5. Use markdown tables when comparing items
6. Keep proper paragraph structure

**CRITICAL RULES - MUST FOLLOW:**
- DO NOT truncate, shorten, or summarize ANY content
- DO NOT remove ANY information from the original content
- PRESERVE 100% of the original content - every single word and detail
- DO NOT add new information that wasn't provided
- ONLY add formatting (headings, bold, lists, etc.) to what's already there
- The formatted output should contain ALL the same information as the input
- Keep a professional academic tone

Return ONLY the formatted content in markdown format. Include ALL content from the original.`;

        return this.generateContent(prompt);
    }
};

