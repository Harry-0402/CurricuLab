import { supabase } from "@/utils/supabase/client";
import { Subject, Unit, Note, Question, Assignment, TimetableEntry, Announcement } from "@/types";

export const SeedService = {
    async seedAll() {
        const results = {
            errors: [] as string[],
            subjects: 0,
            units: 0,
            notes: 0,
            questions: 0,
            assignments: 0,
            timetable: 0,
            announcements: 0
        };

        try {
            // 1. Clear existing data (in reverse order of dependencies)
            const tables = ['announcements', 'timetable', 'assignments', 'questions', 'notes', 'units', 'subjects'];
            for (const table of tables) {
                const { error } = await supabase.from(table).delete().neq('id', '0');
                if (error) {
                    results.errors.push(`Error clearing ${table}: ${error.message}`);
                }
            }

            // 2. Seed Subjects
            const mockSubjects: Subject[] = [
                { id: 'sub-pba204', code: 'PBA204', title: 'Curriculum & Pedagogy', icon: 'BookOpen', color: '#6366f1', description: 'Advanced pedagogical frameworks and curriculum design.', progress: 45, unitCount: 5 },
                { id: 'sub-pba205', code: 'PBA205', title: 'Educational Leadership', icon: 'Shield', color: '#10b981', description: 'Principles of effective leadership in educational institutions.', progress: 30, unitCount: 4 },
                { id: 'sub-pba206', code: 'PBA206', title: 'Research Methodology', icon: 'Search', color: '#f59e0b', description: 'Quantitative and qualitative research techniques.', progress: 15, unitCount: 6 },
                { id: 'sub-pba207', code: 'PBA207', title: 'Digital Literacy', icon: 'Cpu', color: '#ef4444', description: 'Integrating technology into the modern classroom.', progress: 60, unitCount: 5 },
                { id: 'sub-pba208', code: 'PBA208', title: 'Psychology of Learning', icon: 'Brain', color: '#8b5cf6', description: 'Cognitive and behavioral theories in education.', progress: 10, unitCount: 4 }
            ];

            for (const s of mockSubjects) {
                const { error } = await supabase.from('subjects').insert({
                    id: s.id,
                    code: s.code,
                    title: s.title,
                    icon: s.icon,
                    color: s.color,
                    description: s.description,
                    progress: s.progress,
                    unit_count: s.unitCount,
                    last_studied: new Date().toISOString()
                });
                if (error) results.errors.push(`Subject ${s.code}: ${error.message}`);
                else results.subjects++;
            }

            // 3. Seed Units for PBA204 as a sample
            const mockUnits: Unit[] = [
                { id: 'unit-u1', subjectId: 'sub-pba204', title: 'Introduction to Pedagogy', description: 'Core concepts of teaching methods.', order: 1, isCompleted: true, topics: ['Theories', 'History', 'Modern Approach'] },
                { id: 'unit-u2', subjectId: 'sub-pba204', title: 'Curriculum Design', description: 'Structural frameworks for education.', order: 2, isCompleted: false, topics: ['Frameworks', 'Assessment', 'Feedback'] }
            ];

            for (const u of mockUnits) {
                const { error } = await supabase.from('units').insert({
                    id: u.id,
                    subject_id: u.subjectId,
                    title: u.title,
                    description: u.description,
                    order: u.order,
                    is_completed: u.isCompleted,
                    topics: u.topics
                });
                if (error) results.errors.push(`Unit ${u.id}: ${error.message}`);
                else results.units++;
            }

            // 4. Seed Notes for Unit 1
            const mockNotes: Note[] = [
                { id: 'note-n1', unitId: 'unit-u1', title: 'Bloom\'s Taxonomy', content: '### Bloom\'s Taxonomy\n\n1. Remember\n2. Understand\n3. Apply\n4. Analyze\n5. Evaluate\n6. Create', isBookmarked: true, lastModified: new Date().toISOString() }
            ];

            for (const n of mockNotes) {
                const { error } = await supabase.from('notes').insert({
                    id: n.id,
                    unit_id: n.unitId,
                    title: n.title,
                    content: n.content,
                    is_bookmarked: n.isBookmarked,
                    last_modified: n.lastModified
                });
                if (error) results.errors.push(`Note ${n.id}: ${error.message}`);
                else results.notes++;
            }

            // 5. Seed Questions
            const mockQuestions: Question[] = [
                { id: 'q-1', unitId: 'unit-u1', subjectId: 'sub-pba204', question: 'Define "Pedagogy".', answer: 'The method and practice of teaching.', marksType: 2, tags: ['Theory'], isBookmarked: false, difficulty: 'Medium' }
            ];

            for (const q of mockQuestions) {
                const { error } = await supabase.from('questions').insert({
                    id: q.id,
                    unit_id: q.unitId,
                    subject_id: q.subjectId,
                    question: q.question,
                    answer: q.answer,
                    marks_type: q.marksType,
                    tags: q.tags,
                    is_bookmarked: q.isBookmarked,
                    difficulty: q.difficulty
                });
                if (error) results.errors.push(`Question ${q.id}: ${error.message}`);
                else results.questions++;
            }

            // 6. Seed Timetable
            const mockTimetable: TimetableEntry[] = [
                { id: 'tt-1', day: 'Monday', subjectTitle: 'Digital Literacy', subjectCode: 'PBA207', location: 'Lab 4', startTime: '09:00 AM', endTime: '10:30 AM', teacher: 'Prof. McGonagall', progress: 0 }
            ];

            for (const t of mockTimetable) {
                const { error } = await supabase.from('timetable').insert({
                    id: t.id,
                    day: t.day,
                    subject_title: t.subjectTitle,
                    subject_code: t.subjectCode,
                    location: t.location,
                    start_time: t.startTime,
                    end_time: t.endTime,
                    teacher: t.teacher,
                    progress: t.progress
                });
                if (error) results.errors.push(`Timetable ${t.id}: ${error.message}`);
                else results.timetable++;
            }

            // 7. Seed Announcements
            const mockAnnouncements: Announcement[] = [
                { id: 'ann-1', title: 'System Update', content: 'New features added to the AI Tutor.', date: new Date().toISOString(), type: 'info' }
            ];

            for (const a of mockAnnouncements) {
                const { error } = await supabase.from('announcements').insert({
                    id: a.id,
                    title: a.title,
                    content: a.content,
                    date: a.date,
                    type: a.type
                });
                if (error) results.errors.push(`Announcement ${a.id}: ${error.message}`);
                else results.announcements++;
            }

        } catch (fatalError: any) {
            results.errors.push(`Fatal Seeding Error: ${fatalError.message}`);
        }

        return results;
    }
};
