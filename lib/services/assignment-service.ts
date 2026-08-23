import { supabase } from "@/utils/supabase/client";
import { Assignment } from "@/types";
import { ChangelogService } from "@/lib/services/changelog.service";
import { AuthService } from "@/lib/services/auth.service";
import { getStudentsInSemester } from "@/lib/services/enrollment-service";

const mapAssignment = (a: any): Assignment => ({
    id: a.id,
    subjectId: a.subject_id,
    unitId: a.unit_id,
    title: a.title,
    description: a.description,
    questions: a.questions || [],
    dueDate: a.due_date,
    platform: a.platform,
    gcrId: a.gcr_id,
    externalLink: a.external_link
});

export const getAssignments = async (subjectId?: string): Promise<Assignment[]> => {
    let query = supabase.from('assignments').select('*');
    if (subjectId) query = query.eq('subject_id', subjectId);

    const { data, error } = await query;
    if (error || !data) return [];
    return data.map(mapAssignment);
};

export const getSemesterAssignments = async (semesterId: string): Promise<Assignment[]> => {
    const { data, error } = await supabase
        .from('assignments')
        .select('*, subjects!inner(semester_id)')
        .eq('subjects.semester_id', semesterId);

    if (error || !data) return [];
    return data.map(mapAssignment);
};

export const getUpcomingAssignments = async (days: number, semesterId?: string | null): Promise<Assignment[]> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString();

    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + days);
    // Set to end of day to be inclusive
    futureDate.setHours(23, 59, 59, 999);
    const futureDateStr = futureDate.toISOString();

    let query = supabase
        .from('assignments')
        .select('*, subjects!inner(semester_id)')
        .gte('due_date', todayStr)
        .lte('due_date', futureDateStr);

    if (semesterId) {
        query = query.eq('subjects.semester_id', semesterId);
    }

    const { data, error } = await query;

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
        questions: assignment.questions || [],
        due_date: assignment.dueDate,
        platform: assignment.platform,
        gcr_id: assignment.gcrId,
        external_link: assignment.externalLink
    };
    const { data, error } = await supabase.from('assignments').insert(payload).select().single();
    if (error) throw error;

    // Log Change
    await ChangelogService.logChange({
        entity_type: 'Assignment',
        entity_id: assignment.id,
        action: 'CREATE',
        changes: { title: assignment.title, subjectId: assignment.subjectId }
    });

    // Send Email Notification (Async/Non-blocking)
    (async () => {
        try {
            // Get the semester ID for the assignment's subject
            const { data: subjectData } = await supabase
                .from('subjects')
                .select('semester_id')
                .eq('id', assignment.subjectId)
                .single();
                
            let recipients: string[] = [];
            
            if (subjectData?.semester_id) {
                // Fetch only students enrolled in this specific semester
                const students = await getStudentsInSemester(subjectData.semester_id);
                recipients = students.map(s => s.email).filter(Boolean);
            } else {
                // Fallback if semester not found
                recipients = await AuthService.getSubscribers();
            }
            
            // Fetch current user for author name
            const user = await AuthService.getCurrentUser();
            let authorName = 'A Student';
            if (user) {
                const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
                if (profile?.full_name) {
                    authorName = profile.full_name;
                } else if (user.email) {
                    authorName = user.email.split('@')[0];
                }
            }

            if (recipients.length === 0) return;

            await fetch('/api/notifications/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'Assignment',
                    title: assignment.title,
                    content: `A new assignment "${assignment.title}" has been posted. Due date: ${assignment.dueDate || 'No due date'}.`,
                    link: 'https://curriculab-sj6g.onrender.com/assignments',
                    linkText: 'View Assignment',
                    recipients: recipients,
                    authorName: authorName,
                    dueDate: assignment.dueDate
                })
            });
        } catch (err) {
            console.error("Failed to send notification:", err);
        }
    })();

    return mapAssignment(data);
};

export const updateAssignment = async (assignment: Assignment): Promise<Assignment> => {
    const payload = {
        subject_id: assignment.subjectId,
        unit_id: assignment.unitId,
        title: assignment.title,
        description: assignment.description,
        questions: assignment.questions || [],
        due_date: assignment.dueDate,
        platform: assignment.platform,
        gcr_id: assignment.gcrId,
        external_link: assignment.externalLink
    };
    const { data, error } = await supabase.from('assignments').update(payload).eq('id', assignment.id).select().single();
    if (error) throw error;

    // Log Change
    await ChangelogService.logChange({
        entity_type: 'Assignment',
        entity_id: assignment.id,
        action: 'UPDATE',
        changes: { title: assignment.title }
    });

    return mapAssignment(data);
};

export const deleteAssignment = async (id: string): Promise<void> => {
    const { error } = await supabase.from('assignments').delete().eq('id', id);
    if (error) throw error;

    // Log Change
    await ChangelogService.logChange({
        entity_type: 'Assignment',
        entity_id: id,
        action: 'DELETE'
    });
};
