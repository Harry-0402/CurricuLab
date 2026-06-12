import { supabase } from "@/utils/supabase/client";
import { Subject, Unit, Question, KPIStats, TimetableEntry, Announcement, Assignment } from "@/types";
import { LOCAL_SUBJECTS, LOCAL_UNITS, LOCAL_NOTES, LOCAL_QUESTIONS } from "@/lib/data/course-data";
import { SubjectService } from '@/lib/data/subject-service';
import { ChangelogService } from '@/lib/services/changelog.service';

// Helper to prevent infinite hangs on Supabase calls
const withTimeout = (promise: PromiseLike<any>, ms: number = 10000): Promise<any> => {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error(`Database request timed out after ${ms}ms`));
        }, ms);
        promise.then(
            (res) => {
                clearTimeout(timeoutId);
                resolve(res);
            },
            (err) => {
                clearTimeout(timeoutId);
                reject(err);
            }
        );
    });
};

const getAuthToken = async () => {
    let token = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    try {
        const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const projectRef = projectUrl.match(/https:\/\/(.*?)\.supabase\.co/)?.[1];
        if (projectRef && typeof window !== 'undefined') {
            const storageKey = `sb-${projectRef}-auth-token`;
            const storedSessionStr = localStorage.getItem(storageKey);
            if (storedSessionStr) {
                const storedSession = JSON.parse(storedSessionStr);
                if (storedSession?.access_token) {
                    return storedSession.access_token;
                }
            }
        }
    } catch (e) {
        console.error('Error reading token from local storage', e);
    }
    
    // Fallback to getSession with a short timeout
    const sessionRes = await withTimeout(supabase.auth.getSession(), 2000).catch(() => ({ data: { session: null } }));
    return sessionRes?.data?.session?.access_token || token;
};

// Re-export services
export * from './assignment-service';
export * from './timetable-service';
export * from './announcement-service';
export * from './note-service';

// --- Subjects (Supabase) ---

export const getSubjects = async (semesterId?: string): Promise<Subject[]> => {
    return await SubjectService.getAll(semesterId);
};

export const getSubjectById = async (id: string): Promise<Subject | undefined> => {
    const subject = await SubjectService.getById(id);
    return subject || undefined;
};

export const createSubject = async (subject: Subject): Promise<Subject> => {
    const updated = await SubjectService.update(subject);
    return updated || subject;
};

export const updateSubject = async (subject: Subject): Promise<Subject> => {
    const updated = await SubjectService.update(subject);
    return updated || subject;
};

export const deleteSubject = async (id: string): Promise<void> => {
    console.warn("deleteSubject is not fully implemented in service yet");
};


// --- Units (Supabase) ---

export const getUnits = async (subjectId: string): Promise<Unit[]> => {
    const { data, error } = await supabase
        .from('units')
        .select('*')
        .eq('subject_id', subjectId)
        .order('order', { ascending: true });

    if (error || !data) {
        console.warn('Error fetching units:', error);
        return LOCAL_UNITS.filter(u => u.subjectId === subjectId).sort((a, b) => a.order - b.order);
    }

    return data.map((u: any) => ({
        id: u.id,
        subjectId: u.subject_id,
        title: u.title,
        description: u.description || '',
        order: u.order,
        isCompleted: u.is_completed,
        topics: u.topics
    }));
};

export const getUnitById = async (id: string): Promise<Unit | undefined> => {
    const { data, error } = await supabase
        .from('units')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) return LOCAL_UNITS.find(u => u.id === id);

    return {
        id: data.id,
        subjectId: data.subject_id,
        title: data.title,
        description: data.description || '',
        order: data.order,
        isCompleted: data.is_completed,
        topics: data.topics
    };
};

export const createUnit = async (unit: Unit): Promise<Unit> => {
    console.warn("createUnit is disabled in local mode");
    return unit;
};

export const updateUnit = async (unit: Unit): Promise<Unit> => {
    console.warn("updateUnit is disabled in local mode");
    return unit;
};

export const deleteUnit = async (id: string): Promise<void> => {
    console.warn("deleteUnit is disabled in local mode");
};


// --- Questions (Supabase with Fallback) ---

const mapSupabaseQuestion = (data: any): Question => ({
    id: data.id,
    unitId: data.unit_id,
    subjectId: data.subject_id,
    question: data.question,
    answer: data.answer,
    marksType: data.marks_type,
    tags: data.tags || [],
    isBookmarked: data.is_bookmarked || false,
    difficulty: data.difficulty,
    year: data.year
});

export const getQuestions = async (filters: { subjectId?: string; unitId?: string; marksType?: number; year?: string }): Promise<Question[]> => {
    let query = supabase.from('questions').select('*');

    if (filters.subjectId) query = query.eq('subject_id', filters.subjectId);
    if (filters.unitId) query = query.eq('unit_id', filters.unitId);
    if (filters.marksType) query = query.eq('marks_type', filters.marksType);
    if (filters.year) query = query.eq('year', filters.year);

    const { data, error } = await query;

    if (error || !data) {
        console.warn('Error fetching questions from Supabase, using local fallback:', error);
        let filtered = [...LOCAL_QUESTIONS];
        if (filters.subjectId) filtered = filtered.filter(q => q.subjectId === filters.subjectId);
        if (filters.unitId) filtered = filtered.filter(q => q.unitId === filters.unitId);
        if (filters.marksType) filtered = filtered.filter(q => q.marksType === filters.marksType);
        if (filters.year) filtered = filtered.filter(q => q.year === filters.year);
        return filtered;
    }

    return data.map(mapSupabaseQuestion);
};

export const createQuestion = async (question: Omit<Question, 'id'>): Promise<Question | null> => {
    const { data, error } = await supabase.from('questions').insert([{
        id: crypto.randomUUID(),
        unit_id: question.unitId || null,
        subject_id: question.subjectId,
        question: question.question,
        answer: question.answer || '',
        marks_type: question.marksType,
        tags: question.tags || [],
        difficulty: question.difficulty || 'Medium',
        year: question.year || null,
        is_bookmarked: question.isBookmarked || false
    }]).select().single();

    if (error) {
        console.error("Failed to create question:", error.message, error.details, error.hint);
        return null;
    }

    const newQuestion = mapSupabaseQuestion(data);

    // Log Change
    await ChangelogService.logChange({
        entity_type: 'Question',
        entity_id: newQuestion.id,
        action: 'CREATE',
        changes: { question: newQuestion.question, subjectId: newQuestion.subjectId }
    });

    return newQuestion;
};

export const updateQuestion = async (question: Question): Promise<Question | null> => {
    const { data, error } = await supabase
        .from('questions')
        .update({
            unit_id: question.unitId,
            subject_id: question.subjectId,
            question: question.question,
            answer: question.answer,
            marks_type: question.marksType,
            tags: question.tags,
            difficulty: question.difficulty,
            year: question.year,
            is_bookmarked: question.isBookmarked
        })
        .eq('id', question.id)
        .select()
        .single();

    if (error) {
        console.error("Failed to update question:", error);
        return null;
    }

    const updatedQuestion = mapSupabaseQuestion(data);

    // Log Change
    await ChangelogService.logChange({
        entity_type: 'Question',
        entity_id: updatedQuestion.id,
        action: 'UPDATE',
        changes: { question: updatedQuestion.question }
    });

    return updatedQuestion;
};

export const deleteQuestion = async (id: string): Promise<boolean> => {
    const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);

    if (error) {
        console.error("Failed to delete question:", error);
        return false;
    }

    // Log Change
    await ChangelogService.logChange({
        entity_type: 'Question',
        entity_id: id,
        action: 'DELETE'
    });

    return true;
};


// --- Others (Still Supabase or Mock) ---

export const getCaseStudiesByUnit = async (unitId: string): Promise<any[]> => {
    return [];
};

export const getProjectsByUnit = async (unitId: string): Promise<any[]> => {
    return [];
};

export const searchAll = async (query: string) => {
    const q = query.toLowerCase();
    return {
        notes: LOCAL_NOTES.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)),
        questions: LOCAL_QUESTIONS.filter(q_obj => q_obj.question.toLowerCase().includes(q)),
        subjects: LOCAL_SUBJECTS.filter(s => s.title.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)),
    };
};

export const getKPIStats = async (): Promise<KPIStats> => {
    // Return static default or 0's
    return {
        totalStudyHours: 0,
        todayStudyTimeMinutes: 0,
        studyStreakDays: 0,
        weeklyGoalHours: 20,
        unitsCompleted: 0,
        totalUnits: LOCAL_UNITS.length,
        pendingTopicsCount: 0,
        totalQuestionsPracticed: 0,
        accuracyPercent: 0,
        revisionDueTodayCount: 0,
        lastStudiedSubjectId: "",
    };
};


// --- MarkWise Questions (Separate Table) ---

export interface MarkWiseQuestion {
    id: string;
    subjectId: string;
    unitId: string;
    question: string;
    answer: string;
    formattedAnswer: string;
    marksType: number;
    tags: string[];
    isBookmarked: boolean;
}

const mapMarkWiseQuestion = (data: any): MarkWiseQuestion => ({
    id: data.id,
    subjectId: data.subject_id,
    unitId: data.unit_id || '',
    question: data.question,
    answer: data.answer || '',
    formattedAnswer: data.formatted_answer || '',
    marksType: data.marks_type,
    tags: data.tags || [],
    isBookmarked: data.is_bookmarked || false
});

export const getMarkWiseQuestions = async (filters: { subjectId?: string; unitId?: string; marksType?: number }): Promise<MarkWiseQuestion[]> => {
    let query = supabase.from('markwise_questions').select('*');

    if (filters.subjectId) query = query.eq('subject_id', filters.subjectId);
    if (filters.unitId) query = query.eq('unit_id', filters.unitId);
    if (filters.marksType) query = query.eq('marks_type', filters.marksType);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
        console.error("Failed to fetch MarkWise questions:", error);
        return [];
    }

    return data.map(mapMarkWiseQuestion);
};

export const createMarkWiseQuestion = async (question: Omit<MarkWiseQuestion, 'id'>): Promise<MarkWiseQuestion | null> => {
    const { data, error } = await supabase.from('markwise_questions').insert([{
        id: crypto.randomUUID(),
        subject_id: question.subjectId,
        unit_id: question.unitId || null,
        question: question.question,
        answer: question.answer || '',
        formatted_answer: question.formattedAnswer || '',
        marks_type: question.marksType,
        tags: question.tags || [],
        is_bookmarked: question.isBookmarked || false
    }]).select().single();

    if (error) {
        console.error("Failed to create MarkWise question:", error.message);
        return null;
    }

    const newQuestion = mapMarkWiseQuestion(data);
    // Log Change
    await ChangelogService.logChange({
        entity_type: 'MarkWise Question',
        entity_id: newQuestion.id,
        action: 'CREATE',
        changes: { question: newQuestion.question, marks: newQuestion.marksType }
    });

    return newQuestion;
};

export const updateMarkWiseQuestion = async (question: MarkWiseQuestion): Promise<MarkWiseQuestion | null> => {
    const { data, error } = await supabase
        .from('markwise_questions')
        .update({
            subject_id: question.subjectId,
            unit_id: question.unitId || null,
            question: question.question,
            answer: question.answer,
            formatted_answer: question.formattedAnswer,
            marks_type: question.marksType,
            tags: question.tags,
            is_bookmarked: question.isBookmarked
        })
        .eq('id', question.id)
        .select()
        .single();

    if (error) {
        console.error("Failed to update MarkWise question:", error.message);
        return null;
    }

    const updatedQuestion = mapMarkWiseQuestion(data);
    // Log Change
    await ChangelogService.logChange({
        entity_type: 'MarkWise Question',
        entity_id: updatedQuestion.id,
        action: 'UPDATE',
        changes: { question: updatedQuestion.question }
    });

    return updatedQuestion;
};

export const deleteMarkWiseQuestion = async (id: string): Promise<boolean> => {
    const { error } = await supabase
        .from('markwise_questions')
        .delete()
        .eq('id', id);

    if (error) {
        console.error("Failed to delete MarkWise question:", error);
        return false;
    }

    // Log Change
    await ChangelogService.logChange({
        entity_type: 'MarkWise Question',
        entity_id: id,
        action: 'DELETE'
    });

    return true;
};


// --- Vault Resources (Study Notes, Case Studies, Projects) ---

import { VaultResource, VaultResourceType } from '@/types';

const mapVaultResource = (data: any): VaultResource => ({
    id: data.id,
    subjectId: data.subject_id,
    unitId: data.unit_id || '',
    type: data.type,
    title: data.title,
    link: data.link || '',
    tags: data.tags || [],
    createdAt: data.created_at,
    updatedAt: data.updated_at
});

export const getVaultResources = async (filters: { subjectId?: string; unitId?: string; type?: VaultResourceType }): Promise<VaultResource[]> => {
    let query = supabase.from('vault_resources').select('*');

    if (filters.subjectId) query = query.eq('subject_id', filters.subjectId);
    if (filters.unitId) query = query.eq('unit_id', filters.unitId);
    if (filters.type) query = query.eq('type', filters.type);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
        console.error("Failed to fetch vault resources:", error);
        return [];
    }

    return data.map(mapVaultResource);
};

export const createVaultResource = async (resource: Omit<VaultResource, 'id'>): Promise<VaultResource | null> => {
    try {
        const token = await getAuthToken();
        const apiUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/vault_resources`;
        
        const payload = {
            subject_id: resource.subjectId,
            unit_id: resource.unitId || null,
            type: resource.type,
            title: resource.title,
            link: resource.link || '',
            tags: resource.tags || []
        };

        const response = await withTimeout(fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(payload)
        }));

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error creating vault resource via fetch:', errorText);
            throw new Error(`Create failed: ${response.status} ${response.statusText}`);
        }

        const dataArray = await response.json();
        const data = dataArray[0];
        const error = null;

    const newResource = mapVaultResource(data);
    // Log Change - Fire and forget
    ChangelogService.logChange({
        entity_type: 'Vault Resource',
        entity_id: newResource.id,
        action: 'CREATE',
        changes: { title: newResource.title, type: newResource.type }
    }).catch(console.error);

        return newResource;
    } catch (error) {
        console.error("createVaultResource timed out or failed:", error);
        throw error;
    }
};

export const uploadVaultFile = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
        const fileBuffer = await file.arrayBuffer();
        
        // Use raw fetch to bypass any Supabase JS client deadlocks
        const sessionRes = await withTimeout(supabase.auth.getSession(), 5000).catch(() => ({ data: { session: null } }));
        const token = sessionRes?.data?.session?.access_token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const uploadUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/vault/${filePath}`;
        
        const response = await withTimeout(fetch(uploadUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                'Content-Type': file.type || 'application/octet-stream',
            },
            body: fileBuffer
        }));

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error uploading file via fetch:', errorText);
            throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
        }

        const { data } = supabase.storage
            .from('vault')
            .getPublicUrl(filePath);

        return data.publicUrl;
    } catch (error) {
        console.error("uploadVaultFile timed out or failed:", error);
        return null;
    }
};

export const updateVaultResource = async (resource: VaultResource): Promise<VaultResource | null> => {
    try {
        // Clean up old storage file if replacing it
        const { data: oldRes } = await withTimeout(supabase.from('vault_resources').select('link').eq('id', resource.id).single());
        if (oldRes?.link && oldRes.link !== resource.link && oldRes.link.includes('/storage/v1/object/public/vault/')) {
            const urlParts = oldRes.link.split('/storage/v1/object/public/vault/');
            if (urlParts.length > 1) {
                const filePath = urlParts[1];
                await withTimeout(supabase.storage.from('vault').remove([filePath]));
            }
        }

        const token = await getAuthToken();
        const apiUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/vault_resources?id=eq.${resource.id}`;
        
        const payload = {
            subject_id: resource.subjectId,
            unit_id: resource.unitId || null,
            type: resource.type,
            title: resource.title,
            link: resource.link || '',
            tags: resource.tags || []
        };

        const response = await withTimeout(fetch(apiUrl, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(payload)
        }));

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error updating vault resource via fetch:', errorText);
            throw new Error(`Update failed: ${response.status} ${response.statusText}`);
        }

        const dataArray = await response.json();
        const data = dataArray[0];

        const updatedResource = mapVaultResource(data);
        // Log Change - Fire and forget
        ChangelogService.logChange({
            entity_type: 'Vault Resource',
            entity_id: updatedResource.id,
            action: 'UPDATE',
            changes: { title: updatedResource.title }
        }).catch(console.error);

        return updatedResource;
    } catch (error) {
        console.error("updateVaultResource timed out or failed:", error);
        throw error;
    }
};

export const deleteVaultResource = async (id: string): Promise<boolean> => {
    try {
        // First get the link to see if it's a stored file
        const { data: res } = await withTimeout(supabase.from('vault_resources').select('link').eq('id', id).single());
        if (res?.link?.includes('/storage/v1/object/public/vault/')) {
            const urlParts = res.link.split('/storage/v1/object/public/vault/');
            if (urlParts.length > 1) {
                const filePath = urlParts[1];
                await withTimeout(supabase.storage.from('vault').remove([filePath]));
            }
        }

        const token = await getAuthToken();
        const apiUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/vault_resources?id=eq.${id}`;
        
        const response = await withTimeout(fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            }
        }));

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error deleting vault resource via fetch:', errorText);
            throw new Error(`Delete failed: ${response.status} ${response.statusText}`);
        }

        // Log Change - Fire and forget
        ChangelogService.logChange({
            entity_type: 'Vault Resource',
            entity_id: id,
            action: 'DELETE'
        }).catch(console.error);

        return true;
    } catch (error) {
        console.error("deleteVaultResource timed out or failed:", error);
        throw error;
    }
};

