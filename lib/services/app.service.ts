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

// --- Subjects (Local Static Data) ---

export const getSubjects = async (): Promise<Subject[]> => {
    return LOCAL_SUBJECTS;
};

export const getSubjectById = async (id: string): Promise<Subject | undefined> => {
    return LOCAL_SUBJECTS.find(s => s.id === id);
};

export const createSubject = async (subject: Subject): Promise<Subject> => {
    console.warn("createSubject is disabled in local mode");
    return subject;
};

export const updateSubject = async (subject: Subject): Promise<Subject> => {
    console.warn("updateSubject is disabled in local mode");
    return subject;
};

export const deleteSubject = async (id: string): Promise<void> => {
    console.warn("deleteSubject is disabled in local mode");
};


// --- Units (Local Static Data) ---

export const getUnits = async (subjectId: string): Promise<Unit[]> => {
    return LOCAL_UNITS.filter(u => u.subjectId === subjectId).sort((a, b) => a.order - b.order);
};

export const getUnitById = async (id: string): Promise<Unit | undefined> => {
    return LOCAL_UNITS.find(u => u.id === id);
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


// --- Notes (Local Static Data) ---

export const getNotesByUnit = async (unitId: string): Promise<Note[]> => {
    return LOCAL_NOTES.filter(n => n.unitId === unitId);
};

export const getNoteById = async (id: string): Promise<Note | undefined> => {
    return LOCAL_NOTES.find(n => n.id === id);
};

export const createNote = async (note: Note): Promise<Note> => {
    console.warn("createNote is disabled in local mode");
    return note;
};

export const updateNote = async (note: Note): Promise<Note> => {
    console.warn("updateNote is disabled in local mode");
    return note;
};

export const deleteNote = async (id: string): Promise<void> => {
    console.warn("deleteNote is disabled in local mode");
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
