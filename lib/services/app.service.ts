import { supabase } from "@/utils/supabase/client";
import { subjects, units, notes, questions, caseStudies, projects, timetable, announcements, assignments } from "@/lib/data/seed";
import { Subject, Unit, Note, Question, CaseStudy, Project, KPIStats, TimetableEntry, Announcement, Assignment } from "@/types";

// Helper to map DB snake_case to App camelCase
const mapSubject = (s: any): Subject => ({
    id: s.id,
    code: s.code,
    title: s.title,
    icon: s.icon,
    color: s.color,
    description: s.description,
    progress: s.progress,
    unitCount: s.unit_count,
    lastStudied: s.last_studied,
    syllabusPdfUrl: s.syllabus_pdf_url
});

const mapUnit = (u: any): Unit => ({
    id: u.id,
    subjectId: u.subject_id,
    title: u.title,
    description: u.description,
    order: u.order,
    isCompleted: u.is_completed,
    topics: u.topics || []
});

const mapNote = (n: any): Note => ({
    id: n.id,
    unitId: n.unit_id,
    title: n.title,
    content: n.content,
    isBookmarked: n.is_bookmarked,
    lastModified: n.last_modified
});

const mapQuestion = (q: any): Question => ({
    id: q.id,
    unitId: q.unit_id,
    subjectId: q.subject_id,
    question: q.question,
    answer: q.answer,
    marksType: q.marks_type,
    tags: q.tags || [],
    isBookmarked: q.is_bookmarked,
    difficulty: q.difficulty
});

const mapAssignment = (a: any): Assignment => ({
    id: a.id,
    subjectId: a.subject_id,
    title: a.title,
    description: a.description,
    dueDate: a.due_date
});

const mapTimetable = (t: any): TimetableEntry => ({
    id: t.id,
    day: t.day,
    subjectTitle: t.subject_title,
    subjectCode: t.subject_code,
    location: t.location,
    startTime: t.start_time,
    endTime: t.end_time,
    teacher: t.teacher,
    progress: t.progress
});

const mapAnnouncement = (a: any): Announcement => ({
    id: a.id,
    title: a.title,
    content: a.content,
    date: a.date,
    type: a.type
});

// --- Subjects ---

export const getSubjects = async (): Promise<Subject[]> => {
    const { data, error } = await supabase.from('subjects').select('*').order('code', { ascending: true });
    if (error || !data || data.length === 0) {
        console.warn('Supabase/Subjects: Fallback match.', error);
        return subjects;
    }
    return data.map(mapSubject);
};

export const getSubjectById = async (id: string): Promise<Subject | undefined> => {
    const { data, error } = await supabase.from('subjects').select('*').eq('id', id).single();
    if (error || !data) return subjects.find((s) => s.id === id);
    return mapSubject(data);
};

export const createSubject = async (subject: Subject): Promise<Subject> => {
    const payload = {
        id: subject.id,
        code: subject.code,
        title: subject.title,
        icon: subject.icon,
        color: subject.color,
        description: subject.description,
        progress: subject.progress,
        unit_count: subject.unitCount,
        last_studied: subject.lastStudied,
        syllabus_pdf_url: subject.syllabusPdfUrl
    };
    const { data, error } = await supabase.from('subjects').insert(payload).select().single();
    if (error) throw error;
    return mapSubject(data);
};

export const updateSubject = async (subject: Subject): Promise<Subject> => {
    const payload = {
        code: subject.code,
        title: subject.title,
        icon: subject.icon,
        color: subject.color,
        description: subject.description,
        progress: subject.progress,
        unit_count: subject.unitCount,
        last_studied: subject.lastStudied,
        syllabus_pdf_url: subject.syllabusPdfUrl
    };
    const { data, error } = await supabase.from('subjects').update(payload).eq('id', subject.id).select().single();
    if (error) throw error;
    return mapSubject(data);
};

export const deleteSubject = async (id: string): Promise<void> => {
    const { error } = await supabase.from('subjects').delete().eq('id', id);
    if (error) throw error;
};


// --- Units ---

export const getUnits = async (subjectId: string): Promise<Unit[]> => {
    const { data, error } = await supabase.from('units').select('*').eq('subject_id', subjectId).order('order', { ascending: true });
    if (error || !data || data.length === 0) return units.filter((u) => u.subjectId === subjectId);
    return data.map(mapUnit);
};

export const getUnitById = async (id: string): Promise<Unit | undefined> => {
    const { data, error } = await supabase.from('units').select('*').eq('id', id).single();
    if (error || !data) return units.find((u) => u.id === id);
    return mapUnit(data);
};

export const createUnit = async (unit: Unit): Promise<Unit> => {
    const payload = {
        id: unit.id,
        subject_id: unit.subjectId,
        title: unit.title,
        description: unit.description,
        order: unit.order,
        is_completed: unit.isCompleted,
        topics: unit.topics
    };
    const { data, error } = await supabase.from('units').insert(payload).select().single();
    if (error) throw error;
    return mapUnit(data);
};

export const updateUnit = async (unit: Unit): Promise<Unit> => {
    const payload = {
        subject_id: unit.subjectId,
        title: unit.title,
        description: unit.description,
        order: unit.order,
        is_completed: unit.isCompleted,
        topics: unit.topics
    };
    const { data, error } = await supabase.from('units').update(payload).eq('id', unit.id).select().single();
    if (error) throw error;
    return mapUnit(data);
};

export const deleteUnit = async (id: string): Promise<void> => {
    const { error } = await supabase.from('units').delete().eq('id', id);
    if (error) throw error;
};


// --- Notes ---

export const getNotesByUnit = async (unitId: string): Promise<Note[]> => {
    const { data, error } = await supabase.from('notes').select('*').eq('unit_id', unitId);
    if (error || !data || data.length === 0) return notes.filter((n) => n.unitId === unitId);
    return data.map(mapNote);
};

export const getNoteById = async (id: string): Promise<Note | undefined> => {
    const { data, error } = await supabase.from('notes').select('*').eq('id', id).single();
    if (error || !data) return notes.find((n) => n.id === id);
    return mapNote(data);
};

export const createNote = async (note: Note): Promise<Note> => {
    const payload = {
        id: note.id,
        unit_id: note.unitId,
        title: note.title,
        content: note.content,
        is_bookmarked: note.isBookmarked,
        last_modified: note.lastModified
    };
    const { data, error } = await supabase.from('notes').insert(payload).select().single();
    if (error) throw error;
    return mapNote(data);
};

export const updateNote = async (note: Note): Promise<Note> => {
    const payload = {
        unit_id: note.unitId,
        title: note.title,
        content: note.content,
        is_bookmarked: note.isBookmarked,
        last_modified: note.lastModified
    };
    const { data, error } = await supabase.from('notes').update(payload).eq('id', note.id).select().single();
    if (error) throw error;
    return mapNote(data);
};

export const deleteNote = async (id: string): Promise<void> => {
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) throw error;
};


// --- Questions ---

export const getQuestions = async (filters: { subjectId?: string; unitId?: string; marksType?: number }): Promise<Question[]> => {
    let query = supabase.from('questions').select('*');
    if (filters.subjectId) query = query.eq('subject_id', filters.subjectId);
    if (filters.unitId) query = query.eq('unit_id', filters.unitId);
    if (filters.marksType) query = query.eq('marks_type', filters.marksType);

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
        // Fallback filtering logic
        let filtered = questions;
        if (filters.subjectId) filtered = filtered.filter((q) => q.subjectId === filters.subjectId);
        if (filters.unitId) filtered = filtered.filter((q) => q.unitId === filters.unitId);
        if (filters.marksType) filtered = filtered.filter((q) => q.marksType === filters.marksType);
        return filtered;
    }
    return data.map(mapQuestion);
};

export const createQuestion = async (question: Question): Promise<Question> => {
    const payload = {
        id: question.id,
        unit_id: question.unitId,
        subject_id: question.subjectId,
        question: question.question,
        answer: question.answer,
        marks_type: question.marksType,
        tags: question.tags,
        is_bookmarked: question.isBookmarked,
        difficulty: question.difficulty
    };
    const { data, error } = await supabase.from('questions').insert(payload).select().single();
    if (error) throw error;
    return mapQuestion(data);
};

export const updateQuestion = async (question: Question): Promise<Question> => {
    const payload = {
        unit_id: question.unitId,
        subject_id: question.subjectId,
        question: question.question,
        answer: question.answer,
        marks_type: question.marksType,
        tags: question.tags,
        is_bookmarked: question.isBookmarked,
        difficulty: question.difficulty
    };
    const { data, error } = await supabase.from('questions').update(payload).eq('id', question.id).select().single();
    if (error) throw error;
    return mapQuestion(data);
};

export const deleteQuestion = async (id: string): Promise<void> => {
    const { error } = await supabase.from('questions').delete().eq('id', id);
    if (error) throw error;
};


// --- Others ---

export const getCaseStudiesByUnit = async (unitId: string): Promise<CaseStudy[]> => {
    // Current Schema does not have Case Studies table, use Fallback
    return caseStudies.filter((cs) => cs.unitId === unitId);
};

export const getProjectsByUnit = async (unitId: string): Promise<Project[]> => {
    // Current Schema does not have Projects table, use Fallback
    return projects.filter((p) => p.unitId === unitId);
};

export const searchAll = async (query: string) => {
    const q = query.toLowerCase();
    // For search, we might want to do a combined search or just stick to local for speed/simplicity if backend search isn't optimized
    // For now, let's keep local fallback for search or implement simple LIKE queries if needed. 
    // Given the complexity of multi-table text search, keeping local fallback for now is safer unless requested.
    return {
        notes: notes.filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)),
        questions: questions.filter((qu) => qu.question.toLowerCase().includes(q)),
        subjects: subjects.filter((s) => s.title.toLowerCase().includes(q)),
    };
};


// --- Timetable ---

export const getTimetable = async (): Promise<TimetableEntry[]> => {
    const { data, error } = await supabase.from('timetable').select('*');
    if (error || !data || data.length === 0) return timetable;
    return data.map(mapTimetable);
};

export const updateTimetableEntry = async (entry: TimetableEntry): Promise<TimetableEntry> => {
    const payload = {
        day: entry.day,
        subject_title: entry.subjectTitle,
        subject_code: entry.subjectCode,
        location: entry.location,
        start_time: entry.startTime,
        end_time: entry.endTime,
        teacher: entry.teacher,
        progress: entry.progress
    };
    const { data, error } = await supabase.from('timetable').update(payload).eq('id', entry.id).select().single();
    if (error) throw error;
    return mapTimetable(data);
};


// --- Announcements ---

export const getAnnouncements = async (): Promise<Announcement[]> => {
    const { data, error } = await supabase.from('announcements').select('*');
    if (error || !data || data.length === 0) return announcements;
    return data.map(mapAnnouncement);
};

export const createAnnouncement = async (announcement: Announcement): Promise<Announcement> => {
    const payload = {
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        date: announcement.date,
        type: announcement.type
    };
    const { data, error } = await supabase.from('announcements').insert(payload).select().single();
    if (error) throw error;
    return mapAnnouncement(data);
};

export const deleteAnnouncement = async (id: string): Promise<void> => {
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (error) throw error;
};


// --- Assignments ---

export const getAssignments = async (subjectId?: string): Promise<Assignment[]> => {
    let query = supabase.from('assignments').select('*');
    if (subjectId) query = query.eq('subject_id', subjectId);

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
        if (subjectId) return assignments.filter(a => a.subjectId === subjectId);
        return assignments;
    }
    return data.map(mapAssignment);
};

export const createAssignment = async (assignment: Assignment): Promise<Assignment> => {
    const payload = {
        id: assignment.id,
        subject_id: assignment.subjectId,
        title: assignment.title,
        description: assignment.description,
        due_date: assignment.dueDate
    };
    const { data, error } = await supabase.from('assignments').insert(payload).select().single();
    if (error) throw error;
    return mapAssignment(data);
};

export const updateAssignment = async (assignment: Assignment): Promise<Assignment> => {
    const payload = {
        subject_id: assignment.subjectId,
        title: assignment.title,
        description: assignment.description,
        due_date: assignment.dueDate
    };
    const { data, error } = await supabase.from('assignments').update(payload).eq('id', assignment.id).select().single();
    if (error) throw error;
    return mapAssignment(data);
};

export const deleteAssignment = async (id: string): Promise<void> => {
    const { error } = await supabase.from('assignments').delete().eq('id', id);
    if (error) throw error;
};

export const getKPIStats = async (): Promise<KPIStats> => {
    // KPIs are usually aggregations. For now, return static or calculate if possible.
    // Calculating this dynamically is expensive, keeping static for now.
    return {
        totalStudyHours: 42,
        todayStudyTimeMinutes: 125,
        studyStreakDays: 14,
        weeklyGoalHours: 20,
        unitsCompleted: 8, // Could fetch count from units where is_completed = true
        totalUnits: 50,
        pendingTopicsCount: 12,
        totalQuestionsPracticed: 156,
        accuracyPercent: 88,
        revisionDueTodayCount: 5,
        lastStudiedSubjectId: "s1", // Could fetch from user_progress table if exists
    };
};
