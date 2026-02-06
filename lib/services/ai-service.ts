
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


    async polishResumeBullet(text: string, domain?: string): Promise<string> {
        const context = domain ? ` for the ${domain} industry` : '';
        const prompt = `Rewrite this resume bullet point to be more impact-oriented and ATS-friendly${context}. Start with a strong action verb${context ? ` relevant to ${domain}` : ''}. Use metrics if possible. Raw: ${text}`;
        return this.generateContent(prompt);
    },

    async analyzeResume(data: any, domain: string): Promise<{ keywords: string[], improvements: string[] }> {
        const prompt = `
        You are an expert ATS Resume Auditor for the ${domain} industry.
        Review the following resume data and provide:
        1. A list of 5-7 critical keywords/skills missing from this resume that are standard for ${domain}.
        2. 3 specific, high-impact improvements for the content (not generic advice).

        Resume Data:
        ${JSON.stringify({
            role: data.currentRole,
            summary: data.summary,
            skills: data.skills.map((s: any) => s.skills).flat(),
            experience: data.experience.map((e: any) => e.role + " at " + e.company + ": " + e.description).flat()
        })}

        Return ONLY raw JSON (no markdown formatting) with this structure:
        {
            "keywords": ["keyword1", "keyword2", ...],
            "improvements": ["improvement1", "improvement2", ...]
        }
        `;

        try {
            const result = await this.generateContent(prompt);
            const cleanJson = result.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanJson);
        } catch (e) {
            console.error("Failed to parse AI analysis", e);
            return { keywords: [], improvements: ["Could not generate detailed analysis. Please try again."] };
        }
    },

    async parseJobDescription(text: string): Promise<any> {
        const prompt = `
        You are an expert Job Description Parser.
        Extract the following details from the unstructured job post text below.

        Text:
        "${text}"

        Return ONLY raw JSON (no markdown formatting) with this exact structure:
        {
            "title": "Job Title (e.g. Senior Backend Engineer)",
            "company": "Company Name (e.g. Google)",
            "location": "City, Country or 'Remote' (e.g. Bangalore, India)",
            "type": "Remote | On-site | Hybrid" (Infer from text, default to On-site),
            "salary_range": "Salary string (e.g. 12-15 LPA, $100k-$120k) or null if not found",
            "url": "Application URL (https://...) or null if not found"
        }
        
        Rules:
        - If multiple URLs are found, prefer the one that looks like an application link.
        - If any field is missing, return null or an empty string.
        - Be smart about inferring the Company name if it's mentioned primarily.
        `;

        try {
            const result = await this.generateContent(prompt);
            const jsonMatch = result.match(/\{[\s\S]*\}/);
            const cleanJson = jsonMatch ? jsonMatch[0] : result.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanJson);
        } catch (e) {
            console.error("Failed to parse job description", e);
            throw new Error("Failed to extract job details. Please try again.");
        }
    },

    async parseJobFile(base64Data: string, mimeType: string): Promise<any> {
        const prompt = `
        You are an expert Job Description Parser.
        Extract the following details from the attached job posting (image or PDF).

        Return ONLY raw JSON (no markdown formatting) with this exact structure:
        {
            "title": "Job Title (e.g. Senior Backend Engineer)",
            "company": "Company Name (e.g. Google)",
            "location": "City, Country or 'Remote' (e.g. Bangalore, India)",
            "type": "Remote | On-site | Hybrid" (Infer from text, default to On-site),
            "salary_range": "Salary string (e.g. 12-15 LPA, $100k-$120k) or null if not found",
            "url": "Application URL (https://...) or null if not found"
        }
        
        Rules:
        - If multiple URLs are found, prefer the one that looks like an application link.
        - If any field is missing, return null or an empty string.
        - Be smart about inferring the Company name if it's mentioned primarily.
        `;

        try {
            if (!GEMINI_API_KEY) throw new Error("Gemini API Key missing");
            // Use Gemini 2.0 Flash for best multimodal performance
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

            const result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: mimeType
                    }
                }
            ]);

            const response = await result.response;
            const text = response.text();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            const cleanJson = jsonMatch ? jsonMatch[0] : text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanJson);
        } catch (e: any) {
            console.error("Failed to parse file", e);
            throw new Error(`Failed to extract job details from file: ${e.message}`);
        }
    },

    extractJson(text: string): any {
        try {
            // First, try to find a markdown code block with JSON
            const codeBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
            if (codeBlockMatch) {
                return JSON.parse(codeBlockMatch[1]);
            }

            // If no code block, try to find the first array or object
            const firstBracket = text.indexOf('[');
            const firstBrace = text.indexOf('{');

            let startIdx = -1;
            let endChar = '';

            // Determine if we are looking for array or object based on which comes first
            if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
                startIdx = firstBracket;
                endChar = ']';
            } else if (firstBrace !== -1) {
                startIdx = firstBrace;
                endChar = '}';
            }

            if (startIdx !== -1) {
                let balance = 0;
                let inString = false;
                let escape = false;

                for (let i = startIdx; i < text.length; i++) {
                    const char = text[i];

                    if (escape) {
                        escape = false;
                        continue;
                    }

                    if (char === '\\') {
                        escape = true;
                        continue;
                    }

                    if (char === '"') {
                        inString = !inString;
                        continue;
                    }

                    if (!inString) {
                        if (char === (endChar === ']' ? '[' : '{')) balance++;
                        else if (char === endChar) balance--;

                        if (balance === 0) {
                            // Found the end
                            const jsonStr = text.substring(startIdx, i + 1);
                            return JSON.parse(jsonStr);
                        }
                    }
                }
            }

            // Fallback: simple cleanup
            const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanJson);
        } catch (e) {
            console.error("JSON Extraction Failed:", e);
            throw e;
        }
    },

    async smartSearchJobs(query: string, jobs: any[]): Promise<string[]> {
        const prompt = `
        You are an intelligent Job Matcher.
        Filter the following list of jobs based on the user's search query.
        
        User Query: "${query}"

        Jobs List:
        ${JSON.stringify(jobs.map(j => ({
            id: j.id,
            title: j.title,
            company: j.company,
            location: j.location,
            type: j.type,
            salary: j.salary_range
        })))}

        Rules:
        - Understand semantic meaning (e.g. "Work from home" matches "Remote").
        - Handle currency matching (e.g. "6L" matches "6 LPA" or "₹6,00,000").
        - "High pay" implies looking at salary.
        - Return ONLY a raw JSON array of the matching Job IDs.
        - If no matches found, return empty array [].
        `;

        try {
            const result = await this.generateContent(prompt);
            return this.extractJson(result);
        } catch (e) {
            console.error("Failed to search jobs", e);
            return [];
        }
    },

    async generateCoverLetter(jobTitle: string, company: string, jobDescription: string | null, userContext: string, resumeBase64?: string): Promise<string> {
        const prompt = `
        You are an expert Career Coach. Write a professional, personalized cover letter.
        
        **Role:** ${jobTitle}
        **Company:** ${company}
        **Job Details:** ${jobDescription || "No specific details provided."}
        
        **Candidate Profile:**
        ${userContext ? `Bio/Summary: "${userContext}"` : ""}
        ${resumeBase64 ? "A resume PDF has been attached. Extract relevant skills and experience from it." : ""}
        
        **Rules:**
        - Tone: Professional, enthusiastic, yet authentic.
        - Structure:
            1. Hook: Why I'm interested in ${company}.
            2. Match: How my specific skills (from profile/resume) match the job requirements.
            3. Close: Call to action for an interview.
        - Length: Concise (approx 250-300 words).
        - Format: Standard Cover Letter format (Dear Hiring Manager...).
        - Do NOT include placeholders like [Date] or [Your Name] if not provided, just keep it ready to copy-paste.
        `;

        // If resume PDF is provided, use multimodal model
        if (resumeBase64) {
            try {
                if (!GEMINI_API_KEY) throw new Error("Gemini API Key missing");
                const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

                const result = await model.generateContent([
                    prompt,
                    {
                        inlineData: {
                            data: resumeBase64,
                            mimeType: "application/pdf"
                        }
                    }
                ]);
                const response = await result.response;
                return response.text();
            } catch (e: any) {
                console.error("Multimodal generation failed, falling back to text only", e);
                // Fallback or rethrow? Let's rethrow for now so UI knows it failed
                throw new Error(`Failed to process resume PDF: ${e.message}`);
            }
        }

        return this.generateContent(prompt);
    }
};
