import { supabase } from "@/utils/supabase/client";
import { Subject, Unit, Note, Question, KPIStats, TimetableEntry, Announcement, Assignment } from "@/types";
import { LOCAL_SUBJECTS, LOCAL_UNITS, LOCAL_NOTES, LOCAL_QUESTIONS } from "@/lib/data/course-data";

// Helper to map DB snake_case to App camelCase (Still used for Supabase tables)
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

import { SubjectService } from '@/lib/data/subject-service';

// --- Subjects (Supabase) ---

export const getSubjects = async (): Promise<Subject[]> => {
    return await SubjectService.getAll();
};

export const getSubjectById = async (id: string): Promise<Subject | undefined> => {
    const subject = await SubjectService.getById(id);
    return subject || undefined;
};

export const createSubject = async (subject: Subject): Promise<Subject> => {
    const updated = await SubjectService.update(subject); // Using update as strict create might not be in service yet
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


// --- Notes (Supabase) ---

export const getNotesByUnit = async (unitId: string): Promise<Note[]> => {
    const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('unit_id', unitId)
        .order('created_at', { ascending: false });

    if (error || !data) {
        console.warn('Error fetching notes:', error);
        return LOCAL_NOTES.filter(n => n.unitId === unitId);
    }

    return data.map((n: any) => ({
        id: n.id,
        unitId: n.unit_id,
        title: n.title,
        content: n.content,
        isBookmarked: n.is_bookmarked,
        lastRead: n.last_read,
        lastModified: n.last_modified
    }));
};

export const getNoteById = async (id: string): Promise<Note | undefined> => {
    const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) return LOCAL_NOTES.find(n => n.id === id);

    return {
        id: data.id,
        unitId: data.unit_id,
        title: data.title,
        content: data.content,
        isBookmarked: data.is_bookmarked,
        lastRead: data.last_read,
        lastModified: data.last_modified
    };
};

export const createNote = async (note: Note): Promise<Note> => {
    const payload = {
        title: note.title,
        content: note.content,
        unit_id: note.unitId,
        is_bookmarked: note.isBookmarked
    };
    const { data, error } = await supabase.from('notes').insert(payload).select().single();
    if (error) console.error(error);
    return note;
};

export const updateNote = async (note: Note): Promise<Note> => {
    const payload = {
        title: note.title,
        content: note.content,
        is_bookmarked: note.isBookmarked,
        last_modified: new Date().toISOString()
    };
    const { data, error } = await supabase.from('notes').update(payload).eq('id', note.id).select().single();
    if (error) console.error(error);
    return note;
};

export const deleteNote = async (id: string): Promise<void> => {
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) console.error(error);
};


// --- Questions (Local Static Data) ---

export const getQuestions = async (filters: { subjectId?: string; unitId?: string; marksType?: number }): Promise<Question[]> => {
    let filtered = [...LOCAL_QUESTIONS];
    if (filters.subjectId) filtered = filtered.filter(q => q.subjectId === filters.subjectId);
    if (filters.unitId) filtered = filtered.filter(q => q.unitId === filters.unitId);
    if (filters.marksType) filtered = filtered.filter(q => q.marksType === filters.marksType);
    return filtered;
};

export const createQuestion = async (question: Question): Promise<Question> => {
    console.warn("createQuestion is disabled in local mode");
    return question;
};

export const updateQuestion = async (question: Question): Promise<Question> => {
    console.warn("updateQuestion is disabled in local mode");
    return question;
};

export const deleteQuestion = async (id: string): Promise<void> => {
    console.warn("deleteQuestion is disabled in local mode");
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


// --- Timetable (Supabase) ---

export const getTimetable = async (): Promise<TimetableEntry[]> => {
    const { data, error } = await supabase.from('timetable').select('*');
    if (error || !data) return [];
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


// --- Announcements (Supabase) ---

export const getAnnouncements = async (): Promise<Announcement[]> => {
    const { data, error } = await supabase.from('announcements').select('*');
    if (error || !data) return [];
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


// --- Assignments (Supabase) ---

export const getAssignments = async (subjectId?: string): Promise<Assignment[]> => {
    let query = supabase.from('assignments').select('*');
    if (subjectId) query = query.eq('subject_id', subjectId);

    const { data, error } = await query;
    if (error || !data) return [];
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
