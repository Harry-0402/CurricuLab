import { supabase } from '@/utils/supabase/client';
import {
    subjects, units, notes, questions,
    assignments, timetable, announcements
} from './seed';

export const SeedService = {
    async seedAll() {
        const results = {
            subjects: 0,
            units: 0,
            notes: 0,
            questions: 0,
            assignments: 0,
            timetable: 0,
            announcements: 0,
            errors: [] as string[]
        };

        try {
            // 1. Subjects
            console.log("Seeding Subjects...");
            for (const item of subjects) {
                const { error } = await supabase.from('subjects').upsert({
                    id: item.id,
                    code: item.code,
                    title: item.title,
                    icon: item.icon,
                    color: item.color,
                    description: item.description,
                    progress: item.progress,
                    unit_count: item.unitCount,
                    last_studied: item.lastStudied,
                    syllabus_pdf_url: item.syllabusPdfUrl
                });
                if (error) throw new Error(`Subject ${item.code}: ${error.message}`);
                results.subjects++;
            }

            // 2. Units (Depend on Subjects)
            console.log("Seeding Units...");
            for (const item of units) {
                const { error } = await supabase.from('units').upsert({
                    id: item.id,
                    subject_id: item.subjectId,
                    title: item.title,
                    description: item.description,
                    "order": item.order,
                    is_completed: item.isCompleted,
                    topics: item.topics
                });
                if (error) throw new Error(`Unit ${item.id}: ${error.message}`);
                results.units++;
            }

            // 3. Notes (Depend on Units)
            console.log("Seeding Notes...");
            for (const item of notes) {
                const { error } = await supabase.from('notes').upsert({
                    id: item.id,
                    unit_id: item.unitId,
                    title: item.title,
                    content: item.content,
                    is_bookmarked: item.isBookmarked,
                    last_modified: item.lastModified,
                    // last_read not in seed, defaulting null
                });
                if (error) throw new Error(`Note ${item.id}: ${error.message}`);
                results.notes++;
            }

            // 4. Questions (Depend on Units/Subjects)
            console.log("Seeding Questions...");
            for (const item of questions) {
                const { error } = await supabase.from('questions').upsert({
                    id: item.id,
                    unit_id: item.unitId,
                    subject_id: item.subjectId,
                    question: item.question,
                    answer: item.answer,
                    marks_type: item.marksType,
                    tags: item.tags,
                    is_bookmarked: item.isBookmarked,
                    difficulty: item.difficulty
                });
                if (error) throw new Error(`Question ${item.id}: ${error.message}`);
                results.questions++;
            }

            // 5. Assignments (Depend on Subjects)
            console.log("Seeding Assignments...");
            for (const item of assignments) {
                const { error } = await supabase.from('assignments').upsert({
                    id: item.id,
                    subject_id: item.subjectId,
                    title: item.title,
                    description: item.description,
                    due_date: item.dueDate
                });
                if (error) throw new Error(`Assignment ${item.id}: ${error.message}`);
                results.assignments++;
            }

            // 6. Timetable (Independent-ish)
            console.log("Seeding Timetable...");
            for (const item of timetable) {
                const { error } = await supabase.from('timetable').upsert({
                    id: item.id,
                    day: item.day,
                    subject_title: item.subjectTitle,
                    subject_code: item.subjectCode,
                    location: item.location,
                    start_time: item.startTime,
                    end_time: item.endTime,
                    teacher: item.teacher,
                    progress: item.progress
                });
                if (error) throw new Error(`Timetable ${item.id}: ${error.message}`);
                results.timetable++;
            }

            // 7. Announcements (Independent)
            console.log("Seeding Announcements...");
            for (const item of announcements) {
                const { error } = await supabase.from('announcements').upsert({
                    id: item.id,
                    title: item.title,
                    content: item.content,
                    date: item.date,
                    type: item.type
                });
                if (error) throw new Error(`Announcement ${item.id}: ${error.message}`);
                results.announcements++;
            }

        } catch (error: any) {
            console.error("Seeding Error:", error);
            results.errors.push(error.message || "Unknown error");
        }

        return results;
    }
};
