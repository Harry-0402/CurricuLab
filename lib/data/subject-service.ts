
import { supabaseData as supabase } from '@/utils/supabase/client';
import { Subject } from '@/types';
import { ChangelogService } from "@/lib/services/changelog.service";

// Static Subjects for Fallback/Init
export const INITIAL_SUBJECTS: Subject[] = [
    { id: "s1", code: "PBA204", title: "Production and Operations Management", icon: "Settings", color: "bg-blue-500", description: "Operations, Productivity, Layouts", progress: 0, unitCount: 5, lastStudied: undefined },
    { id: "s2", code: "PBA205", title: "Digital Transformation", icon: "Zap", color: "bg-purple-500", description: "Digital Tech, AI, Innovation", progress: 0, unitCount: 5, lastStudied: undefined },
    { id: "s3", code: "PBA206", title: "Legal Aspects of Business", icon: "Shield", color: "bg-emerald-500", description: "Contracts, Company Law", progress: 0, unitCount: 5, lastStudied: undefined },
    { id: "s4", code: "PBA207", title: "Data Visualization and Storytelling", icon: "BarChart3", color: "bg-amber-500", description: "Charts, Storytelling, Analysis", progress: 0, unitCount: 5, lastStudied: undefined },
    { id: "s5", code: "PBA208", title: "Business Research Methodology", icon: "Search", color: "bg-rose-500", description: "Research, Sampling, Hypothesis", progress: 0, unitCount: 5, lastStudied: undefined },
    { id: "s6", code: "PBA201", title: "Geopolitics & World Economic Systems", icon: "Globe", color: "bg-indigo-500", description: "Global Economics, Politics", progress: 0, unitCount: 5, lastStudied: undefined },
    { id: "s7", code: "PBA202", title: "Management Information Systems", icon: "Database", color: "bg-cyan-500", description: "IS, DBs, Enterprise Systems", progress: 0, unitCount: 5, lastStudied: undefined }
];

export const SubjectService = {
    async getAll(semesterId?: string): Promise<Subject[]> {
        const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
        const now = Date.now();
        const cacheKey = semesterId ?? '__all__';

        if (
            this.cache[cacheKey] &&
            (now - (this.cacheTimestamps[cacheKey] ?? 0) < CACHE_DURATION)
        ) {
            return this.cache[cacheKey];
        }

        let query = supabase
            .from('subjects')
            .select('*')
            .order('code', { ascending: true });

        if (semesterId) {
            query = query.eq('semester_id', semesterId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching subjects:', error);
            return [];
        }

        if (!data || data.length === 0) {
            return [];
        }

        const mapped = data.map((item: any) => ({
            id: item.id,
            code: item.code,
            title: item.title,
            icon: item.icon,
            color: item.color,
            description: item.description,
            progress: item.progress,
            unitCount: item.unit_count,
            lastStudied: item.last_studied,
            syllabusPdfUrl: item.syllabus_pdf_url,
            semesterId: item.semester_id,
            gcrKeyword: item.gcr_keyword,
        })) as Subject[];

        this.cache[cacheKey] = mapped;
        this.cacheTimestamps[cacheKey] = now;

        return mapped;
    },

    // Cache variables
    cache: {} as Record<string, Subject[]>,
    cacheTimestamps: {} as Record<string, number>,
    // legacy alias kept for backwards compat
    cachedSubjects: null as Subject[] | null,
    lastFetch: 0,

    invalidateCache() {
        this.cache = {};
        this.cacheTimestamps = {};
    },

    async update(subject: Subject): Promise<Subject | null> {
        const payload = {
            code: subject.code,
            title: subject.title,
            icon: subject.icon,
            color: subject.color,
            description: subject.description,
            progress: subject.progress,
            unit_count: subject.unitCount,
            gcr_keyword: subject.gcrKeyword,
            syllabus_pdf_url: subject.syllabusPdfUrl
        };

        console.log('Updating subject:', subject.id, 'with payload:', payload);

        const { error } = await supabase
            .from('subjects')
            .update(payload)
            .eq('id', subject.id);

        if (error) {
            console.error('Error updating subject:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code,
                error: error
            });
            throw new Error(`Failed to update subject: ${error.message || JSON.stringify(error)}`);
        }

        const updatedSubject = { ...subject, ...payload, semesterId: subject.semesterId, syllabusPdfUrl: subject.syllabusPdfUrl };

        // Log Change
        await ChangelogService.logChange({
            entity_type: 'Subject',
            entity_id: updatedSubject.id,
            action: 'UPDATE',
            changes: { title: updatedSubject.title, code: updatedSubject.code, progress: updatedSubject.progress }
        });

        return updatedSubject;
    },

    async getById(id: string): Promise<Subject | null> {
        const { data, error } = await supabase
            .from('subjects')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            console.error('Error or no data for subject:', id, error);
            return null;
        }

        return {
            id: data.id,
            code: data.code,
            title: data.title,
            icon: data.icon,
            color: data.color,
            description: data.description,
            progress: data.progress,
            unitCount: data.unit_count,
            lastStudied: data.last_studied,
            semesterId: data.semester_id,
            syllabusPdfUrl: data.syllabus_pdf_url,
            gcrKeyword: data.gcr_keyword
        } as Subject;
    },

    /**
     * Subscribe to real-time changes on the subjects table
     * @param onInsert - Callback when a new subject is inserted
     * @param onUpdate - Callback when a subject is updated
     * @param onDelete - Callback when a subject is deleted
     * @returns Subscription object that can be used to unsubscribe
     */
    subscribeToChanges(
        onInsert?: (subject: Subject) => void,
        onUpdate?: (subject: Subject) => void,
        onDelete?: (id: string) => void
    ) {
        const channel = supabase
            .channel('subjects-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'subjects'
                },
                (payload) => {
                    if (onInsert && payload.new) {
                        const newSubject = this.mapDbRecordToSubject(payload.new);
                        onInsert(newSubject);
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'subjects'
                },
                (payload) => {
                    if (onUpdate && payload.new) {
                        const updatedSubject = this.mapDbRecordToSubject(payload.new);
                        onUpdate(updatedSubject);
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'subjects'
                },
                (payload) => {
                    if (onDelete && payload.old) {
                        onDelete((payload.old as any).id);
                    }
                }
            )
            .subscribe();

        return channel;
    },

    /**
     * Helper method to map database record to Subject type with static syllabus URL
     */
    mapDbRecordToSubject(record: any): Subject {
        return {
            id: record.id,
            code: record.code,
            title: record.title,
            icon: record.icon,
            color: record.color,
            description: record.description,
            progress: record.progress,
            unitCount: record.unit_count,
            lastStudied: record.last_studied,
            syllabusPdfUrl: record.syllabus_pdf_url,
            semesterId: record.semester_id,
            gcrKeyword: record.gcr_keyword
        };
    }
};
