import { supabase } from "@/utils/supabase/client";
import { TimetableEntry } from "@/types";
import { ChangelogService } from "@/lib/services/changelog.service";

const mapTimetable = (t: any): TimetableEntry => ({
    id: t.id,
    day: t.day,
    subjectTitle: t.subject_title,
    subjectCode: t.subject_code,
    location: t.location,
    startTime: t.start_time,
    endTime: t.end_time,
    teacher: t.teacher,
    progress: t.progress
});

export const getTimetable = async (): Promise<TimetableEntry[]> => {
    const { data, error } = await supabase.from('timetable').select('*');
    if (error || !data) return [];
    return data.map(mapTimetable);
};

export const updateTimetableEntry = async (entry: TimetableEntry): Promise<TimetableEntry> => {
    const payload = {
        day: entry.day,
        subject_title: entry.subjectTitle,
        subject_code: entry.subjectCode,
        location: entry.location,
        start_time: entry.startTime,
        end_time: entry.endTime,
        teacher: entry.teacher,
        progress: entry.progress
    };
    const { data, error } = await supabase.from('timetable').update(payload).eq('id', entry.id).select().single();
    if (error) throw error;

    // Log Change
    await ChangelogService.logChange({
        entity_type: 'Timetable',
        entity_id: entry.id,
        action: 'UPDATE',
        changes: { subjectCode: entry.subjectCode, day: entry.day }
    });

    return mapTimetable(data);
};
