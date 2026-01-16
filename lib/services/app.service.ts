import { supabase } from "@/utils/supabase/client";
import { Subject, Unit, Question, KPIStats, TimetableEntry, Announcement, Assignment } from "@/types";
import { LOCAL_SUBJECTS, LOCAL_UNITS, LOCAL_NOTES, LOCAL_QUESTIONS } from "@/lib/data/course-data";
import { SubjectService } from '@/lib/data/subject-service';

// Re-export services
export * from './assignment-service';
export * from './timetable-service';
export * from './announcement-service';
export * from './note-service';

// --- Subjects (Supabase) ---

export const getSubjects = async (): Promise<Subject[]> => {
    return await SubjectService.getAll();
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
        unit_id: question.unitId,
        subject_id: question.subjectId,
        question: question.question,
        answer: question.answer,
        marks_type: question.marksType,
        tags: question.tags,
        difficulty: question.difficulty,
        year: question.year,
        is_bookmarked: question.isBookmarked
    }]).select().single();

    if (error) {
        console.error("Failed to create question:", error);
        return null;
    }

    return mapSupabaseQuestion(data);
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

    return mapSupabaseQuestion(data);
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
