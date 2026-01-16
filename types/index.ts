export type MarksType = 2 | 7 | 8 | 10 | 15;

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Subject {
  id: string;
  code: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  lastStudied?: string;
  progress: number;
  unitCount: number;
  syllabusPdfUrl?: string;
}

export interface Unit {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  order: number;
  isCompleted: boolean;
  topics?: string[];
}

export interface Note {
  id: string;
  unitId: string;
  title: string;
  content: string; // Markdown
  isBookmarked: boolean;
  lastRead?: string;
  lastModified?: string;
}

export interface RevisionNote {
  id: string;
  unitId: string;
  title: string;
  content: string;
  generatedAt?: string;
}

export interface Question {
  id: string;
  unitId: string;
  subjectId: string;
  question: string;
  answer: string;
  marksType: MarksType;
  tags: string[];
  isBookmarked: boolean;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface CaseStudy {
  id: string;
  unitId: string;
  title: string;
  industry: string;
  difficulty: string;
  problem: string;
  analysis: string;
  solution: string;
  tags: string[];
}

export interface Project {
  id: string;
  unitId: string;
  title: string;
  description: string;
  tools: string[];
  status: 'Draft' | 'In Progress' | 'Completed';
  repoLink?: string;
  docLink?: string;
}

export interface StudySession {
  id: string;
  subjectId: string;
  unitId?: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

export interface Bookmark {
  id: string;
  itemId: string;
  type: 'note' | 'question' | 'project' | 'case-study';
  addedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'info' | 'warning' | 'success';
}

export interface KPIStats {
  totalStudyHours: number;
  todayStudyTimeMinutes: number;
  studyStreakDays: number;
  weeklyGoalHours: number;
  unitsCompleted: number;
  totalUnits: number;
  pendingTopicsCount: number;
  totalQuestionsPracticed: number;
  accuracyPercent?: number;
  revisionDueTodayCount: number;
  lastStudiedSubjectId?: string;
}

export interface TimetableEntry {
  id: string;
  day: string; // "Monday", "Tuesday", etc.
  subjectTitle: string;
  subjectCode: string;
  location: string;
  startTime: string; // "08:00 AM"
  endTime: string;
  teacher?: string;
  progress: number;
}

export interface Assignment {
  id: string;
  subjectId: string;
  unitId?: string;
  title: string;
  description: string;
  dueDate: string;
  platform?: 'ERP' | 'GCR' | 'Other';
}
