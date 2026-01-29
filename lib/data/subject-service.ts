
import { supabase } from '@/utils/supabase/client';
import { Subject } from '@/types';
import { ChangelogService } from "@/lib/services/changelog.service";

export const SubjectService = {
    async getAll(): Promise<Subject[]> {
        const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
        const now = Date.now();

        if (this.cachedSubjects && (now - this.lastFetch < CACHE_DURATION)) {
            return this.cachedSubjects;
        }

        const { data, error } = await supabase
            .from('subjects')
            .select('*')
            .order('code', { ascending: true });

        if (error) {
            console.error('Error fetching subjects:', error);
            // Return empty array instead of hardcoded fallback
            return [];
        }

        if (!data || data.length === 0) {
            return [];
        }

        this.cachedSubjects = data.map((item: any) => {
            return {
                id: item.id,
                code: item.code,
                title: item.title,
                icon: item.icon,
                color: item.color,
                description: item.description,
                progress: item.progress,
                unitCount: item.unit_count,
                lastStudied: item.last_studied,
                syllabusPdfUrl: item.syllabus_pdf_url
            };
        }) as Subject[];
        this.lastFetch = now;

        return this.cachedSubjects;
    },

    // Cache variables attached to the object
    cachedSubjects: null as Subject[] | null,
    lastFetch: 0,

    async update(subject: Subject): Promise<Subject | null> {
        const payload = {
            code: subject.code,
            title: subject.title,
            icon: subject.icon,
            color: subject.color,
            description: subject.description,
            progress: subject.progress,
            unit_count: subject.unitCount
        };

        console.log('Updating subject:', subject.id, 'with payload:', payload);

        const { data, error } = await supabase
            .from('subjects')
            .update(payload)
            .eq('id', subject.id)
            .select()
            .single();

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

        if (!data) {
            console.error('No data returned after update for subject:', subject.id);
            throw new Error('Update succeeded but no data was returned');
        }

        const updatedSubject = {
            id: data.id,
            code: data.code,
            title: data.title,
            icon: data.icon,
            color: data.color,
            description: data.description,
            progress: data.progress,
            unitCount: data.unit_count,
            lastStudied: data.last_studied
        } as Subject;

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
            syllabusPdfUrl: data.syllabus_pdf_url
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
            syllabusPdfUrl: record.syllabus_pdf_url
        };
    }
};
