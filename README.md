# CurricuLab

A production-ready study management platform built with Next.js, featuring distinct high-end Web and Mobile UIs sharing a common data and services layer.

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### Accessing the UI
- **Auto-detection**: The root `/` route detects your screen size and redirects to either the Web or Mobile experience.
- **Web UI**: Access directly at `/web`
- **Mobile UI**: Access directly at `/mobile`

## 🛠 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand (with localStorage persistence)
- **Icons**: Lucide React
- **Typography**: Inter (Google Fonts)

## 📁 Architecture
- `/app/(web)`: Desktop-first dashboard with grid layouts.
- `/app/(mobile)`: Mobile-first feed with bottom navigation.
- `/lib/services`: Abstracted data access layer (Mock DB).
- `/lib/store`: Global state for bookmarks, goals, and progress.
- `/components/shared`: Reusable UI primitives.

## 🔮 Future Enhancements
- Replace `app.service.ts` mock data with Supabase/Firebase.
- Add real PDF/PPT file parsing.
- Implement real-time study groups using WebSockets.
