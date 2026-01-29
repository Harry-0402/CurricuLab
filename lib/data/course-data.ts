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
    type: 'Video' | 'PDF' | 'Link' | 'Template' | 'Article';
    url: string;
    category: 'Learning' | 'Technical Skills' | 'Business Strategy' | 'Career & Soft Skills' | 'Roadmap' | 'Cheat Sheet' | 'YouTube' | 'Coding' | 'Academic' | string;
    topic?: string;
    content?: string;
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
export const LOCAL_RESOURCES: Resource[] = [];
