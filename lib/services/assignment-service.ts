import { supabase } from "@/utils/supabase/client";
import { Assignment } from "@/types";

const mapAssignment = (a: any): Assignment => ({
    id: a.id,
    subjectId: a.subject_id,
    unitId: a.unit_id,
    title: a.title,
    description: a.description,
    dueDate: a.due_date,
    platform: a.platform
});

export const getAssignments = async (subjectId?: string): Promise<Assignment[]> => {
    let query = supabase.from('assignments').select('*');
    if (subjectId) query = query.eq('subject_id', subjectId);

    const { data, error } = await query;
    if (error || !data) return [];
    return data.map(mapAssignment);
};

export const getUpcomingAssignments = async (days: number): Promise<Assignment[]> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString();

    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + days);
    // Set to end of day to be inclusive
    futureDate.setHours(23, 59, 59, 999);
    const futureDateStr = futureDate.toISOString();

    const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .gte('due_date', todayStr)
        .lte('due_date', futureDateStr);

    if (error || !data) return [];
    return data.map(mapAssignment);
};

export const createAssignment = async (assignment: Assignment): Promise<Assignment> => {
    const payload = {
        id: assignment.id,
        subject_id: assignment.subjectId,
        unit_id: assignment.unitId,
        title: assignment.title,
        description: assignment.description,
        due_date: assignment.dueDate,
        platform: assignment.platform
    };
    const { data, error } = await supabase.from('assignments').insert(payload).select().single();
    if (error) throw error;
    return mapAssignment(data);
};

export const updateAssignment = async (assignment: Assignment): Promise<Assignment> => {
    const payload = {
        subject_id: assignment.subjectId,
        unit_id: assignment.unitId,
        title: assignment.title,
        description: assignment.description,
        due_date: assignment.dueDate,
        platform: assignment.platform
    };
    const { data, error } = await supabase.from('assignments').update(payload).eq('id', assignment.id).select().single();
    if (error) throw error;
    return mapAssignment(data);
};

export const deleteAssignment = async (id: string): Promise<void> => {
    const { error } = await supabase.from('assignments').delete().eq('id', id);
    if (error) throw error;
};
