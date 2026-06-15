export type MarksType = 2 | 7 | 8 | 10 | 15;

// ============================================
// PROGRAM & SEMESTER TYPES
// ============================================

export interface Program {
  id: string;
  name: string;          // "MBA Business Analytics"
  code: string;          // "MBA-BA"
  description?: string;
}

export interface Semester {
  id: string;
  programId: string;
  programName?: string;  // joined for display
  name: string;          // "Semester 2 (Jan–May 2025)"
  shortName: string;     // "Sem 2"
  number: number;
  academicYear?: string; // "2024-25"
  isActive: boolean;
  subjectCount?: number; // computed
}

export interface UserEnrollment {
  userId: string;
  semesterId: string | null;
  semesterName?: string;
  programName?: string;
}

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
  semesterId?: string;   // which semester this subject belongs to
  gcrKeyword?: string; // keyword to match with Google Classroom courses
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
  year?: string;
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
  resourceLink?: string;
  date: string;
  type: 'info' | 'warning' | 'success';
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: string;
  semesterId?: string;
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
  semesterId?: string; // which semester this slot belongs to
}

export interface AssignmentQuestion {
  id: string;
  text: string;
  answer?: string;
}

export interface Assignment {
  id: string;
  subjectId: string;
  unitId?: string;
  title: string;
  description?: string;
  questions: AssignmentQuestion[];
  dueDate: string;
  platform?: 'ERP' | 'GCR' | 'Other';
  gcrId?: string;
  externalLink?: string;
}

export type VaultResourceType = 'study_note' | 'question_bank' | 'case_study' | 'project' | 'revision_note' | 'youtube_video' | 'flashcard' | 'other_resources';

export interface VaultResource {
  id: string;
  subjectId: string;
  unitId?: string;
  type: VaultResourceType;
  title: string;
  link?: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Flashcard {
  id: string;
  vaultResourceId: string;
  frontContent: string;
  backContent: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FlashcardReview {
  id: string;
  flashcardId: string;
  userId: string;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReviewDate: string;
  lastReviewedAt?: string;
}

export interface VaultEmbedding {
  id: string;
  vaultResourceId: string;
  contentChunk: string;
  embedding: number[]; // Array of floats
}

export interface ResumeExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  period: string; // e.g., "Feb 2024 - Present"
  description: string[];
  link?: string;
}

export interface ResumeProject {
  id: string;
  title: string;
  description: string[];
  techStack: string[];
  link?: string;
}

export interface ResumeEducation {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  score?: string; // GPA or percentage
  relevantCoursework?: string[];
}

export interface ResumeSkillCategory {
  id: string;
  category: string;
  skills: string[];
}

export interface ResumeData {
  fullName: string;
  targetDomain?: string;
  currentRole: string;
  summary: string;
  photoUrl?: string;
  contact: {
    email: string;
    phone: string;
    linkedin?: string;
    github?: string;
    location?: string;
  };
  skills: ResumeSkillCategory[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  education: ResumeEducation[];
  certifications?: string[];
  awards?: string[];
  activities?: string[];
  hobbies?: string[];
}

// ============================================
// SKILLFORGE TYPES - Personal Studies Management
// ============================================

export type SkillForgeTrackStatus = 'active' | 'paused' | 'completed' | 'wishlist';
export type SkillForgeResourceStatus = 'not_started' | 'in_progress' | 'completed' | 'wishlist';
export type SkillForgeResourceType = 'course' | 'video' | 'article' | 'book' | 'podcast' | 'tutorial' | 'other';
export type SkillForgeProficiency = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type SkillForgeMood = 'excited' | 'focused' | 'confused' | 'tired' | 'motivated';

export interface SkillForgeTrack {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  targetDate?: string;
  status: SkillForgeTrackStatus;
  progress: number;
  color: string;
  icon: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SkillForgeResource {
  id: string;
  userId: string;
  trackId?: string;
  title: string;
  url?: string;
  platform: string;
  type: SkillForgeResourceType;
  status: SkillForgeResourceStatus;
  notes?: string;
  priority: number;
  createdAt: string;
  updatedAt?: string;
}

export interface SkillForgeJournalEntry {
  id: string;
  userId: string;
  trackId?: string;
  title: string;
  content: string;
  keyLearnings: string[];
  mood?: SkillForgeMood;
  createdAt: string;
  updatedAt?: string;
}

export interface SkillForgeSkill {
  id: string;
  userId: string;
  name: string;
  category: string;
  proficiencyLevel: SkillForgeProficiency;
  trackIds: string[];
  notes?: string;
  lastPracticed?: string;
  createdAt: string;
  updatedAt?: string;
}
