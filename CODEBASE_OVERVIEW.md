# CurricuLab - Complete Codebase Overview

## 📋 Project Summary

**CurricuLab** is a production-ready study management platform built with **Next.js 16.1** and **React 19**, designed for students in MBA programs (specifically for Business Analytics/Postgraduate programs). It provides a comprehensive learning and study tracking system with:

- **Curriculum Management**: Organized subjects, units, and topics
- **Study Tools**: Notes, assignments, Q&A, revision materials
- **AI-Powered Features**: AI Tutor, Prompt Engineering Lab, Revision Generator
- **Performance Tracking**: KPI stats, attendance tracking, study sessions
- **Collaboration Tools**: Announcements, Faculty Fellows directory, Team workspace
- **Resource Library**: Digital vault for documents, videos, articles, and syllabus materials
- **Productivity Tools**: MarkWise (question analysis), PaperTrail (document tracking), Resume Builder

---

## 🏗️ Architecture & Tech Stack

### Frontend Framework
- **Framework**: Next.js 16.1 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19.2.3
- **Styling**: Tailwind CSS 4 + PostCSS
- **Icons**: Lucide React

### State Management & Persistence
- **State**: Zustand 5.0 (with localStorage persistence)
- **Storage**: Browser localStorage + Supabase

### Backend Services
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with multi-method support (email/password, OAuth, OTP)
- **Email**: SendGrid, Resend, Nodemailer
- **AI Services**: Groq SDK, Google Generative AI, OpenRouter API

### Additional Libraries
- **Markdown**: react-markdown, remark-gfm
- **Date Handling**: date-fns
- **Document Export**: docx, file-saver
- **UI Components**: Radix UI (dialog, label, slot)
- **Toast Notifications**: Sonner

---

## 📁 Project Structure

```
CurricuLab/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with global providers
│   ├── page.tsx             # Home page (redirects to web/mobile)
│   ├── globals.css          # Global Tailwind styles
│   ├── api/                 # API routes
│   │   ├── chat/route.ts    # AI chat endpoint (Groq/OpenRouter)
│   │   ├── health/          # Health check endpoint
│   │   └── notifications/   # Notification service
│   ├── auth/                # Authentication pages
│   │   ├── login/
│   │   ├── forgot-password/
│   │   ├── update-password/
│   │   └── callback/
│   ├── ai-tutor/            # AI Tutor feature
│   ├── assignments/         # Assignment management
│   ├── subjects/            # Subject listing and detail pages
│   ├── units/               # Unit detail pages
│   ├── notes/               # Notes viewer
│   ├── profile/             # User profile
│   ├── search/              # Global search
│   ├── tools/               # Productivity tools
│   │   ├── markwise/        # Question analysis tool
│   │   ├── papertrail/      # Document tracking
│   │   ├── prompts/         # Prompt engineering lab
│   │   ├── resume/          # Resume builder
│   │   └── revision/        # Revision generator
│   ├── faculty-fellows/     # Faculty directory
│   ├── team/                # Team workspace
│   ├── vault/               # Digital resource vault
│   ├── debug-email/         # Email template testing
│   └── unauthorized/        # Access denied page
│
├── lib/                      # Business logic and services
│   ├── auth-config.ts       # Session timeout configuration
│   ├── email-templates.ts   # Email HTML templates
│   ├── services/            # Core service layer
│   │   ├── app.service.ts         # Main app service (CRUD operations)
│   │   ├── auth.service.ts        # Supabase authentication
│   │   ├── announcement-service.ts
│   │   ├── assignment-service.ts
│   │   ├── attendance-service.ts
│   │   ├── note-service.ts
│   │   ├── timetable-service.ts
│   │   ├── reminder-service.ts
│   │   ├── changelog.service.ts
│   │   ├── ai-service.ts
│   │   └── export-service.ts
│   ├── data/               # Data layer and mock data
│   │   ├── course-data.ts       # Local fallback data
│   │   ├── subject-service.ts   # Subject operations
│   │   ├── unit-service.ts
│   │   ├── faculty-service.ts
│   │   ├── syllabus-links.ts
│   │   ├── video-library.ts
│   │   ├── article-links.ts
│   │   ├── interview-resources.ts
│   │   ├── gpt-resources.ts
│   │   └── revision-notes-service.ts
│   ├── store/              # Zustand state management
│   │   └── useAppStore.ts
│   └── utils/              # Utility functions
│       ├── index.ts        # className utility (cn)
│       └── supabase/
│           └── client.ts   # Supabase client instance
│
├── components/             # React components
│   ├── SessionManager.tsx   # Session timeout/auto-logout
│   ├── shared/             # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Dialog.tsx
│   │   ├── Label.tsx
│   │   ├── Switch.tsx
│   │   ├── Icons.tsx
│   │   ├── Toast.tsx
│   │   ├── TagBadge.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── SearchContent.tsx
│   │   ├── AutoLogout.tsx
│   │   └── KeepAlive.tsx
│   └── web/                # Web UI components
│       ├── WebAppShell.tsx
│       ├── WebHeader.tsx
│       ├── WebSidebar.tsx
│       ├── WebRightPanel.tsx
│       ├── page_content.tsx     # Home page
│       ├── subjects_content.tsx
│       ├── SubjectCard.tsx
│       ├── UnitCard.tsx
│       ├── NoteExplorer.tsx
│       ├── AiTutorContent.tsx
│       ├── AssignmentContent.tsx
│       ├── AnnouncementWidget.tsx
│       ├── TimetableWidget.tsx
│       ├── AttendanceWidget.tsx
│       ├── MarkWiseContent.tsx
│       ├── VaultContent.tsx
│       └── [other feature components]
│
├── types/                  # TypeScript type definitions
│   └── index.ts           # All domain models
│
├── sql-files/             # Database setup scripts
│   ├── database_setup.sql
│   ├── supabase_schema.sql
│   ├── seed_syllabus_*.sql
│   └── [various migration scripts]
│
├── public/                # Static assets
│   └── assets/
├── rag-system/           # RAG (Retrieval-Augmented Generation)
│   └── python-service/
│
├── Configuration Files
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── postcss.config.mjs
│   ├── eslint.config.mjs
│   └── middleware.ts
│
└── Documentation
    ├── README.md
    └── CODEBASE_OVERVIEW.md (this file)
```

---

## 🔑 Core Data Types

### User & Authentication
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
```

### Academic Hierarchy
```typescript
interface Subject {
  id: string;
  code: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  progress: number;
  unitCount: number;
  lastStudied?: string;
  syllabusPdfUrl?: string;
}

interface Unit {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  order: number;
  isCompleted: boolean;
  topics?: string[];
}
```

### Study Materials
```typescript
interface Note {
  id: string;
  unitId: string;
  title: string;
  content: string; // Markdown
  isBookmarked: boolean;
  lastRead?: string;
  lastModified?: string;
}

interface Question {
  id: string;
  unitId: string;
  subjectId: string;
  question: string;
  answer: string;
  marksType: 2 | 7 | 8 | 10 | 15;
  tags: string[];
  isBookmarked: boolean;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  year?: string;
}

interface RevisionNote {
  id: string;
  unitId: string;
  title: string;
  content: string;
  generatedAt?: string;
}

interface CaseStudy & Project { /* ... */ }
```

### Tracking & Planning
```typescript
interface StudySession {
  id: string;
  subjectId: string;
  unitId?: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

interface Bookmark {
  id: string;
  itemId: string;
  type: 'note' | 'question' | 'project' | 'case-study';
  addedAt: string;
}

interface Assignment {
  id: string;
  subjectId: string;
  unitId?: string;
  title: string;
  description: string;
  dueDate: string;
  platform?: 'ERP' | 'GCR' | 'Other';
}

interface TimetableEntry {
  id: string;
  day: string;
  subjectTitle: string;
  subjectCode: string;
  location: string;
  startTime: string;
  endTime: string;
  teacher?: string;
  progress: number;
}

interface KPIStats {
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
}
```

### Announcements & Resources
```typescript
interface Announcement {
  id: string;
  title: string;
  content: string;
  resourceLink?: string;
  date: string;
  type: 'info' | 'warning' | 'success';
}

interface VaultResource {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  type: 'study_note' | 'case_study' | 'project';
  content?: string;
  createdAt?: string;
}
```

---

## 🔐 Authentication & Authorization

### Flow
1. **Supabase Auth** handles authentication with support for:
   - Email/Password login
   - Magic links (OTP via email)
   - OAuth (Google, GitHub)
   - Password reset

2. **Middleware Protection** ([middleware.ts](middleware.ts))
   - Protects routes requiring authentication
   - Enforces whitelist via `authorized_users` table
   - Redirects unauthorized users to `/unauthorized`
   - Auto-redirects logged-in users from `/login`

3. **Session Management** ([SessionManager.tsx](components/SessionManager.tsx))
   - Monitors user activity with 15-minute timeout
   - Shows warning 2 minutes before logout
   - Auto-logs out on inactivity

### Subjects (5 MBA Courses)
1. **PBA204** - Production and Operations Management (🏭)
2. **PBA205** - Digital Transformation (🚀)
3. **PBA206** - Legal Aspects of Business (⚖️)
4. **PBA207** - Data Visualization and Story Telling (📊)
5. **PBA208** - Business Research Methodology (🔍)
6. **PBA211** - Data Analysis using Python (🐍)
7. **PBA212** - Data Analysis using Power BI (📈)
8. **PBA213** - Business Communication Skills II (💬)

---

## 🗄️ Database Schema (Supabase)

### Core Tables
- **subjects** - Course information with progress tracking
- **units** - Course units/modules
- **notes** - Student notes with markdown support
- **questions** - Q&A with mark types and difficulty
- **case_studies** - Industry case studies
- **projects** - Learning projects
- **assignments** - Academic assignments with due dates
- **timetable** - Class schedule
- **announcements** - Faculty announcements
- **vault_resources** - Curated learning materials

### User Tables
- **faculty_members** - Faculty and fellows directory
- **authorized_users** - Whitelist of allowed users
- **attendance** - Attendance tracking per subject

### Audit & Config
- **changelog** - Track data modifications
- **reminders** - Study reminders and alerts
- **revision_notes** - AI-generated revision materials
- **markwise_questions** - Question analysis by marks

### Security
- **Row Level Security (RLS)** enabled on all tables
- Public read/write for initial development
- Can be restricted per-user in production

---

## 🚀 Key Features & Their Implementation

### 1. **AI Tutor** (`/ai-tutor`)
- **Component**: [AiTutorContent.tsx](components/web/AiTutorContent.tsx)
- **API**: `/api/chat` (Groq/OpenRouter)
- **Providers**: 
  - Groq (fast, free models)
  - OpenRouter (fallback with multiple models)
  - Google Generative AI
- **Features**:
  - Subject-specific tutoring
  - Context-aware explanations
  - Markdown-formatted responses

### 2. **Prompt Engineering Lab** (`/tools/prompts`)
- Uses OpenRouter competitive model racing
- Multiple prompt engineer models competing
- Returns fastest response
- Models: Gemini 2.0, DeepSeek, OpenAI

### 3. **Revision Generator** (`/tools/revision`)
- Auto-generates revision notes from units
- AI-powered content creation
- Markdown output

### 4. **MarkWise** (`/tools/markwise`)
- Organize questions by mark types (2, 7, 8, 10, 15 marks)
- Difficulty-based filtering
- Year-wise filtering
- Question bank management

### 5. **Study Analytics** (Dashboard)
- KPI metrics (study hours, streaks, completion %)
- Weekly goal tracking
- Subject-wise progress
- Unit completion tracking

### 6. **Attendance Tracking**
- Subject-wise attendance percentage
- Missing class detection
- Attendance alerts

### 7. **Vault** (`/vault`)
- Centralized resource repository
- Case studies, project templates, notes
- Categorized by subject and type
- Full-text searchable

### 8. **Team Workspace** (`/team`)
- Collaborative features
- Faculty-student interaction
- Announcements and updates

---

## 📡 API Routes

### `/api/chat` - AI Conversations
```typescript
POST /api/chat
Body: {
  messages: Array<{ role, content }>,
  provider: 'groq' | 'openrouter',
  model?: string,
  mode: 'tutor' | 'prompt_engineer'
}
Response: { message: string }
```

### `/api/health` - Health Check
```typescript
GET /api/health
Response: { status: 'ok' }
```

### `/api/notifications` - Notification Service
- Sends email notifications via SendGrid/Resend/Nodemailer

---

## 🎨 UI/UX Components

### Shared Components
- **Button.tsx** - Styled button with variants
- **Dialog.tsx** - Modal/dialog wrapper (Radix)
- **Toast.tsx** - Toast notifications (Sonner)
- **ProgressBar.tsx** - Visual progress indicator
- **SearchContent.tsx** - Global search interface
- **TagBadge.tsx** - Tag/label component
- **Switch.tsx** - Toggle switch (Radix)
- **Label.tsx** - Form label (Radix)
- **Icons.tsx** - Icon collection (Lucide)
- **KeepAlive.tsx** - Session keep-alive component
- **AutoLogout.tsx** - Auto-logout on inactivity

### Layout Components (Web)
- **WebAppShell** - Main container
- **WebHeader** - Top navigation bar
- **WebSidebar** - Left navigation
- **WebRightPanel** - Right sidebar (collapsible)

---

## 🗂️ State Management (Zustand)

### useAppStore
```typescript
{
  bookmarks: [],              // Bookmarked items
  weeklyGoalHours: number,   // Study goal
  studySessions: [],         // Study session history
  recentlyOpened: [],        // Recently viewed items
  unitProgress: {},          // Unit completion status
  timetable: [],             // Class schedule
  announcements: [],         // Faculty announcements
  isRightPanelMinimized: boolean,

  // Actions
  addBookmark(itemId, type)
  removeBookmark(itemId)
  setWeeklyGoal(hours)
  addStudySession(session)
  markUnitComplete(unitId, completed)
  addToRecent(id)
  // ... timetable and announcement actions
}
```

**Persistence**: Uses localStorage via Zustand middleware

---

## 📧 Email Templates

### Features
- Professional HTML emails with embedded logo
- Type-based templates (Assignment, Announcement, Notification)
- Responsive design
- Action buttons with links
- Support for batch notifications

### Providers
1. **SendGrid** - Primary email service
2. **Resend** - Backup/alternative
3. **Nodemailer** - Node.js SMTP

---

## 🔄 Service Layer Architecture

### Layered Design
```
UI Components (React)
        ↓
App Service (app.service.ts)
        ↓
Specialized Services (note, assignment, etc.)
        ↓
Data Layer (Supabase / Local Fallback)
```

### Services Overview
| Service | Responsibility |
|---------|-----------------|
| auth.service.ts | Authentication, session, OAuth |
| app.service.ts | CRUD for subjects, units, questions, vault |
| note-service.ts | Note management |
| assignment-service.ts | Assignment tracking |
| attendance-service.ts | Attendance recording |
| timetable-service.ts | Schedule management |
| announcement-service.ts | Faculty announcements |
| ai-service.ts | AI model integration |
| export-service.ts | Document export (DOCX, PDF) |
| reminder-service.ts | Reminder scheduling |
| changelog.service.ts | Audit logging |

---

## 🎯 Key Subjects & Curriculum

### Subjects with Units
Each subject has 5 units covering:
- Core concepts
- Case studies
- Practical applications
- Assessment questions
- Revision materials

### Example: PBA204 - Operations Management
- Unit 1: Fundamentals
- Unit 2: Process Optimization
- Unit 3: Supply Chain
- Unit 4: Quality Management
- Unit 5: Strategic Planning

---

## 🛡️ Security Features

1. **Authentication**
   - Supabase Auth with multiple providers
   - Session timeout (15 minutes)
   - Auto-logout on inactivity
   - Password reset via email

2. **Authorization**
   - Whitelist-based access control
   - Middleware route protection
   - RLS on database tables

3. **Data Protection**
   - Encrypted Supabase connections
   - Environment variables for API keys
   - CORS configuration
   - HTTPS enforcement (production)

---

## 📊 Search & Discovery

### Features
- Global full-text search across:
  - Subject titles and descriptions
  - Unit content
  - Notes
  - Questions
  - Announcements

### Implementation
- SearchContent.tsx component
- Query-based filtering
- Real-time results

---

## 🚀 Deployment

### Hosting
- **Frontend**: Vercel (configured in render.yaml)
- **Database**: Supabase
- **APIs**: Vercel Serverless Functions
- **AI APIs**: Groq, OpenRouter, Google

### Environment Variables Required
```env
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
GROQ_API_KEY=<groq_key>
OPENROUTER_API_KEY=<openrouter_key>
GOOGLE_AI_API_KEY=<google_ai_key>
SENDGRID_API_KEY=<sendgrid_key>
```

---

## 🔮 Future Enhancement Opportunities

1. **Real-time Collaboration**
   - WebSocket integration for live editing
   - Real-time study groups

2. **Advanced Analytics**
   - Learning path recommendations
   - Predictive analytics for exam performance
   - Peer benchmarking

3. **Offline Support**
   - Service Worker implementation
   - Offline note syncing

4. **Mobile App**
   - React Native version
   - Native notifications
   - Offline-first database (SQLite)

5. **AI Enhancements**
   - Document parsing (PDF/PPT)
   - Automatic question generation
   - Voice-based study sessions

6. **Social Features**
   - Study groups
   - Peer review system
   - Discussion forums

---

## 🧪 Testing & Quality

- **Linting**: ESLint with Next.js config
- **Type Safety**: TypeScript strict mode
- **Code Compilation**: TypeScript compilation in build

---

## 📚 Key Files to Understand

### Must-Read Files
1. [app/layout.tsx](app/layout.tsx) - App structure
2. [middleware.ts](middleware.ts) - Auth & routing
3. [lib/services/app.service.ts](lib/services/app.service.ts) - Core logic
4. [lib/store/useAppStore.ts](lib/store/useAppStore.ts) - State
5. [types/index.ts](types/index.ts) - Data models
6. [app/api/chat/route.ts](app/api/chat/route.ts) - AI integration
7. [lib/data/subject-service.ts](lib/data/subject-service.ts) - Subject ops

### Configuration Files
1. [next.config.ts](next.config.ts)
2. [tsconfig.json](tsconfig.json)
3. [package.json](package.json)
4. [middleware.ts](middleware.ts)

---

## 🎓 Learning Path for New Developers

1. **Understand the Domain** (5 min)
   - Read this overview
   - Check [README.md](README.md)

2. **Explore the Data Model** (15 min)
   - Read [types/index.ts](types/index.ts)
   - Understand Subject → Unit → Note hierarchy

3. **Study Core Services** (30 min)
   - [lib/services/app.service.ts](lib/services/app.service.ts)
   - [lib/data/subject-service.ts](lib/data/subject-service.ts)

4. **Examine State Management** (15 min)
   - [lib/store/useAppStore.ts](lib/store/useAppStore.ts)
   - Understand localStorage persistence

5. **Review Key Components** (30 min)
   - [components/web/page_content.tsx](components/web/page_content.tsx) - Dashboard
   - [components/web/WebAppShell.tsx](components/web/WebAppShell.tsx) - Layout
   - [components/web/subjects_content.tsx](components/web/subjects_content.tsx) - Subject view

6. **Explore APIs** (20 min)
   - [app/api/chat/route.ts](app/api/chat/route.ts)
   - [middleware.ts](middleware.ts)

7. **Database Schema** (20 min)
   - [sql-files/database_setup.sql](sql-files/database_setup.sql)

---

## 🤔 Common Questions

### Q: How do I add a new subject?
A: Use SubjectService in [lib/data/subject-service.ts](lib/data/subject-service.ts) or directly update database via Supabase console.

### Q: How do I customize the AI tutor?
A: Modify the system prompt in [app/api/chat/route.ts](app/api/chat/route.ts) and change the AI provider/model.

### Q: Where are the study materials stored?
A: In Supabase database (tables: notes, questions, vault_resources) with local fallback in [lib/data/course-data.ts](lib/data/course-data.ts).

### Q: How does session timeout work?
A: [SessionManager.tsx](components/SessionManager.tsx) tracks activity and logs out after 15 minutes of inactivity with a 2-minute warning.

### Q: How do I add email notifications?
A: Use the notification service in [app/api/notifications](app/api/notifications) with SendGrid/Resend/Nodemailer configuration.

---

## 📞 Support & Troubleshooting

- Check database RLS policies if queries fail
- Verify Supabase connection and API keys
- Monitor AI API rate limits
- Review browser console for client-side errors
- Check Vercel logs for server-side issues

---

**Last Updated**: January 2026
**Version**: 0.1.0
**Status**: Production-Ready MVP
