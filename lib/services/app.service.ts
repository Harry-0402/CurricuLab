import { subjects, units, notes, questions, caseStudies, projects, timetable, announcements, assignments } from "@/lib/data/seed";
import { Subject, Unit, Note, Question, CaseStudy, Project, KPIStats, TimetableEntry, Announcement, Assignment } from "@/types";

export const getSubjects = async (): Promise<Subject[]> => {
    return subjects;
};

export const getSubjectById = async (id: string): Promise<Subject | undefined> => {
    return subjects.find((s) => s.id === id);
};

export const getUnits = async (subjectId: string): Promise<Unit[]> => {
    return units.filter((u) => u.subjectId === subjectId);
};

export const getUnitById = async (id: string): Promise<Unit | undefined> => {
    return units.find((u) => u.id === id);
};

export const getNotesByUnit = async (unitId: string): Promise<Note[]> => {
    return notes.filter((n) => n.unitId === unitId);
};

export const getNoteById = async (id: string): Promise<Note | undefined> => {
    return notes.find((n) => n.id === id);
};

export const getQuestions = async (filters: { subjectId?: string; unitId?: string; marksType?: number }): Promise<Question[]> => {
    let filtered = questions;
    if (filters.subjectId) filtered = filtered.filter((q) => q.subjectId === filters.subjectId);
    if (filters.unitId) filtered = filtered.filter((q) => q.unitId === filters.unitId);
    if (filters.marksType) filtered = filtered.filter((q) => q.marksType === filters.marksType);
    return filtered;
};

export const getCaseStudiesByUnit = async (unitId: string): Promise<CaseStudy[]> => {
    return caseStudies.filter((cs) => cs.unitId === unitId);
};

export const getProjectsByUnit = async (unitId: string): Promise<Project[]> => {
    return projects.filter((p) => p.unitId === unitId);
};

export const searchAll = async (query: string) => {
    const q = query.toLowerCase();
    return {
        notes: notes.filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)),
        questions: questions.filter((qu) => qu.question.toLowerCase().includes(q)),
        subjects: subjects.filter((s) => s.title.toLowerCase().includes(q)),
    };
};

export const getTimetable = async (): Promise<TimetableEntry[]> => {
    return timetable;
};

export const getAnnouncements = async (): Promise<Announcement[]> => {
    return announcements;
};

export const getAssignments = async (subjectId?: string): Promise<Assignment[]> => {
    if (subjectId) return assignments.filter(a => a.subjectId === subjectId);
    return assignments;
};

export const getKPIStats = async (): Promise<KPIStats> => {
    return {
        totalStudyHours: 42,
        todayStudyTimeMinutes: 125,
        studyStreakDays: 14,
        weeklyGoalHours: 20,
        unitsCompleted: 8,
        totalUnits: 50,
        pendingTopicsCount: 12,
        totalQuestionsPracticed: 156,
        accuracyPercent: 88,
        revisionDueTodayCount: 5,
        lastStudiedSubjectId: "s1",
    };
};
