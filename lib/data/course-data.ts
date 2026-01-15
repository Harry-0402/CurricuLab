import { Subject, Unit, Note, Question } from "@/types";

/**
 * BRIDGE FILE: The user will populate these arrays with their own mock data.
 * The app.service.ts has been refactored to read from here instead of Supabase
 * for Subjects, Units, Notes, and Questions.
 */

export interface Resource {
    id: string;
    title: string;
    description: string;
    type: 'Video' | 'PDF' | 'Link' | 'Template';
    url: string;
    category: string;
}

export interface Prompt {
    id: string;
    title: string;
    prompt: string;
    description: string;
    category: string;
}

export const LOCAL_SUBJECTS: Subject[] = [];
export const LOCAL_UNITS: Unit[] = [];
export const LOCAL_NOTES: Note[] = [];
export const LOCAL_QUESTIONS: Question[] = [];
export const LOCAL_RESOURCES: Resource[] = [
    {
        id: '1',
        title: 'Mastering Business Analysis',
        description: 'A comprehensive guide to modern BA techniques and tools.',
        type: 'PDF',
        url: '#',
        category: 'Business Analysis'
    },
    {
        id: '2',
        title: 'SDLC Life Cycle Explained',
        description: 'Video tutorial covering all phases of the Software Development Life Cycle.',
        type: 'Video',
        url: '#',
        category: 'Development'
    }
];

export const LOCAL_PROMPTS: Prompt[] = [
    {
        id: '1',
        title: 'Socratic Tutor',
        prompt: 'You are a Socratic tutor. Instead of giving me the answer, ask me a question that helps me think through the problem myself. The topic is: [TOPIC]',
        description: 'Ideal for deep learning and critical thinking.',
        category: 'Learning'
    },
    {
        id: '2',
        title: 'Expert Summarizer',
        prompt: 'Summarize the following notes into 5 key takeaways and 3 actionable insights. Use bullet points and bold text for emphasis. Notes: [NOTES]',
        description: 'Perfect for quick revision sheets.',
        category: 'Revision'
    }
];
