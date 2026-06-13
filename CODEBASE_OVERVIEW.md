# CurricuLab - Complete Codebase Overview

## 📋 Project Summary

**CurricuLab** is a lean, production-ready study management platform built with **Next.js 16.1** and **React 19**. It provides a comprehensive learning and study tracking system focused on core academic features:

- **Curriculum Management**: Organized subjects, units, and topics
- **Study Tools**: Notes, assignments, Q&A
- **Performance Tracking**: Study progress and metrics
- **Unified UI**: Responsive layout serving both desktop and mobile efficiently

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
- **Authentication**: Supabase Auth

---

## 📁 Project Structure

```
CurricuLab/
├── app/                      # Next.js App Router (Unified UI)
│   ├── layout.tsx           # Root layout with global providers
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global Tailwind styles
│   ├── api/                 # API routes
│   ├── auth/                # Authentication pages
│   ├── assignments/         # Assignment management
│   ├── community/           # Community features
│   ├── faculty-fellows/     # Faculty directory
│   ├── faculty-lineup/      # Faculty roster
│   ├── subjects/            # Subject listing and detail pages
│   ├── unit/                # Unit detail pages
│   ├── notes/               # Notes viewer
│   ├── tools/               # Productivity tools (mindgrid, papertrail, etc.)
│   ├── vault/               # Digital resource vault
│   ├── profile/             # User profile
│   └── search/              # Global search
│
├── lib/                      # Business logic and services
│   ├── services/            # Core service layer
│   │   ├── auth.service.ts  # Supabase authentication
│   │   ├── assignment-service.ts
│   │   ├── note-service.ts
│   │   └── ...
│   └── data/                # Data layer
│
└── components/               # React components
    ├── shared/              # Reusable UI primitives
    └── web/                 # Desktop-specific components (if any)
```

## 🚀 Development Workflow

1. `npm install` - Install dependencies
2. `npm run dev` - Start development server
3. `npm run build` - Build for production
