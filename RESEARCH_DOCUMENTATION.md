# CurricuLab: A Next-Generation AI-Integrated Learning Management System for Post-Graduate Education

**Date:** January 2026  
**Project Status:** Production-Ready MVP  
**Version:** 0.1.0

---

## 1. Abstract

CurricuLab represents a paradigm shift in personalized education management for post-graduate (MBA) students. By integrating advanced Large Language Models (LLMs) deeply into the curriculum workflow, CurricuLab moves beyond static learning management systems (LMS) to create an active, adaptive study partner. This document details the research, architectural decisions, and technical implementation of the platform, highlighting its novel approach to study tracking, content retrieval (RAG), and personalized AI tutoring.

## 2. Problem Statement

### 2.1 The Challenge of Post-Graduate Education
Post-graduate programs, particularly Master of Business Administration (MBA) courses, are characterized by:
*   **High Volume of Information**: Students must synthesize data from diverse sources (lectures, case studies, textbooks, industry reports).
*   **Disparate Resource Management**: Study materials are often scattered across various platforms (Google Classroom, ERPs, physical notes, WhatsApp groups).
*   **Lack of Personalized Feedback**: Traditional LMS platforms deliver content but fail to provide real-time, context-aware remediation or explanations suited to an individual's specific curriculum.
*   **Tracking Complexity**: Students struggle to manually track attendance KPIs, assignment deadlines, and exam preparedness across multiple concurrent subjects.

### 2.2 The CurricuLab Solution
CurricuLab addresses these challenges by centralizing the academic lifecycle into a cohesive "Operating System for Study." It solves the fragmentation problem by unifying:
1.  **Curriculum Tracking**: Granular tracking down to the unit and topic level.
2.  **Resource Aggregation**: A unified "Vault" for all media and document types.
3.  **Intelligent Assistance**: An AI Tutor aware of the specific syllabus (PBA204, PBA205, etc.), capable of generating revision notes and explaining concepts in the context of the course.

---

## 3. System Architecture

CurricuLab employs a modern, serverless architecture designed for scalability, performance, and developer experience.

### 3.1 High-Level Architecture
The system follows a typical client-server model but leverages "Edge" capabilities for improved latency.

*   **Frontend**: Next.js 16.1 (App Router) executing React 19 Client/Server Components.
*   **Backend/API**: Next.js Serverless Functions (`/api/*`) handling business logic and mediating communication with AI providers.
*   **Data Persistence**: Supabase (PostgreSQL) for relational data; LocalStorage for transient UX state (Zustand).
*   **AI Layer**: A multi-provider gateway connecting to Groq, OpenRouter, and Google Gemini.

### 3.2 Key Design Patterns
*   **Service-Repository Pattern**: Business logic is abstracted into `lib/services/*.service.ts`, decoupling the UI from data access (Supabase/Mock Data).
*   **Optimistic UI & Hydration**: Critical user interactions (bookmarking, checking off units) feel instant due to optimistic state updates via Zustand.
*   **RAG (Retrieval-Augmented Generation)**: The AI Tutor is not generic; it is primed with syllabus-specific data, ensuring answers are relevant to the specific MBA modules rather than general knowledge.

---

## 4. Technical Implementation

### 4.1 Technology Stack Selection
*   **Framework**: **Next.js 16.1** was chosen for its unified full-stack capabilities, particularly Server Actions and the App Router which simplify data fetching.
*   **Styling Engine**: **Tailwind CSS 4** provides a design-token-driven approach, ensuring visual consistency (fonts, spacing, colors) across the Web and Mobile interfaces.
*   **Database**: **Supabase** offers a robust PostgreSQL backend with built-in Auth (RLS) and real-time capabilities, accelerating the development of secure, multi-user features.
*   **State Management**: **Zustand** allows for profound simplicity in managing global client state (sidebar preferences, active session timers) compared to Redux.

### 4.2 AI Integration Strategy
CurricuLab implements a "Model Agnostic" approach:
1.  **Groq**: Primary provider for low-latency chat interactions (e.g., Llama 3 70B).
2.  **OpenRouter**: Fallback and "Prompt Engineering Lab" access to competitive models (Claude 3.5, DeepSeek).
3.  **Google Gemini**: Used for specialized reasoning tasks or high-context window requirements.

The `/api/chat` endpoint acts as a proxy, injecting a `SYSTEM_PROMPT` that defines the AI's persona as a "Senior MBA Faculty Mentor," enforcing pedagogical standards in responses.

---

## 5. Core Operational Modules

### 5.1 The "MarkWise" Engine
A specialized tool for exam preparation that restructures the traditional "Question Bank":
*   **Taxonomy**: Categorizes questions by difficulty (Easy/Medium/Hard) and Marks (2, 7, 8, 10, 15).
*   **Utility**: Allows students to simulate exam conditions by filtering questions that match specific exam patterns.

### 5.2 PaperTrail (PYQ Manager) & Vault
A specialized archive system for academic resources:
*   **PaperTrail**: Dedicated module for **Previous Year Questions (PYQs)**. It tracks which questions from past exams (2020-2025) have been solved, tagging them by year, difficulty, and repeated frequency.
*   **Vault**: A searchable repository using fuzzy search to locate Case Studies, Projects, and Notes instantly.

### 5.3 AI Tutor & Revision Generator
*   **Contextual Tutoring**: The AI is aware of the specific units (e.g., "PBA204 Unit 3: Supply Chain").
*   **Dynamic Revision**: Generates concise bullet-point summaries for rapid review before exams, converting unstructured unit content into structured markdown notes.

### 5.4 Prompt Engineering Lab
A competitive environment for testing and optimizing LLM prompts:
*   **Model Racing**: Simulates parallel requests to multiple providers (OpenAI, Anthropic at OpenRouter, Google Gemini) to identify the optimal model for specific reasoning tasks.
*   **Latency vs. Quality**: Allows students and developers to benchmark response times against answer quality for specific MBA-related queries.

### 5.5 Resume Builder & Career Tools
A structured interface for career advancement:
*   **ATS Optimization**: specialized templates designed to pass Application Tracking Systems.
*   **AI Enhancement**: (Planned) Utilizes the student's tracked projects and case studies from the "Vault" to automatically populate and bullet-point professional experiences.

---

## 6. Future Scope & Research Directions

### 6.1 Adaptive Learning Paths
Using the collected data on "Time Spent per Unit" and "Quiz Accuracy," future iterations will employ Machine Learning to recommend personalized study schedules (e.g., "You are weak in Operations Management; spend 2 extra hours this week").

### 6.2 Collaborative Knowledge Graph
Transitioning from a single-player mode to a multi-player "Study Group" architecture, where notes and flashcards can shared within a trusted circle of peers, utilizing WebSockets for real-time collaboration.

### 6.3 Advanced RAG with Vector Embeddings
Implementing `pgvector` in Supabase to embed the full library of syllabus PDFs. This would allow the AI to cite specific page numbers from course textbooks when answering student queries.

---

## 7. Conclusion

CurricuLab demonstrates that the application of Generative AI in education goes beyond simple chatbots. By embedding AI into the structural fabric of the curriculum—aware of subjects, units, and assessment criteria—the platform creates a symbiotic relationship between the student and the software. It transforms the LMS from a passive repository into an active engine for academic success.
