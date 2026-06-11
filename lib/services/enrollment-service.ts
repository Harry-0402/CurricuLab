import { supabase } from '@/utils/supabase/client';
import { UserEnrollment } from '@/types';
import { SEM2_ID } from './semester-service';

// ─────────────────────────────────────────────────────────────
// Get a user's current enrollment (class_id from profiles)
// ─────────────────────────────────────────────────────────────
export async function getUserEnrollment(userId: string): Promise<UserEnrollment> {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, class_id, semesters(name, programs(name))')
        .eq('id', userId)
        .single();

    if (error || !data) {
        return { userId, semesterId: SEM2_ID }; // fallback to Sem 2
    }

    const sem = (data as any).semesters;
    return {
        userId,
        semesterId: data.class_id ?? null,
        semesterName: sem?.name,
        programName: sem?.programs?.name,
    };
}

// ─────────────────────────────────────────────────────────────
// Update a user's enrollment
// ─────────────────────────────────────────────────────────────
export async function updateUserEnrollment(
    userId: string,
    semesterId: string
): Promise<boolean> {
    const { error } = await supabase
        .from('profiles')
        .update({ class_id: semesterId })
        .eq('id', userId);

    if (error) {
        console.error('Error updating enrollment:', error);
        return false;
    }
    return true;
}

// ─────────────────────────────────────────────────────────────
// Admin: List all students with their enrollment
// ─────────────────────────────────────────────────────────────
export async function getAllStudentEnrollments(): Promise<{
    userId: string;
    email: string;
    fullName: string;
    role: string;
    semesterId: string | null;
    semesterName: string | null;
}[]> {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, class_id, semesters(name)')
        .order('full_name', { ascending: true });

    if (error || !data) {
        console.error('Error fetching enrollments:', error);
        return [];
    }

    return data.map((row: any) => ({
        userId: row.id,
        email: row.email ?? '',
        fullName: row.full_name ?? '',
        role: row.role ?? 'student',
        semesterId: row.class_id ?? null,
        semesterName: row.semesters?.name ?? null,
    }));
}

// ─────────────────────────────────────────────────────────────
// Admin: Get students enrolled in a specific semester
// ─────────────────────────────────────────────────────────────
export async function getStudentsInSemester(semesterId: string): Promise<{
    userId: string;
    email: string;
    fullName: string;
}[]> {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .eq('class_id', semesterId);

    if (error || !data) return [];
    return data.map((row: any) => ({
        userId: row.id,
        email: row.email ?? '',
        fullName: row.full_name ?? '',
    }));
}

// ─────────────────────────────────────────────────────────────
// Admin: Add a user to the authorized_users whitelist
// ─────────────────────────────────────────────────────────────
export async function addAuthorizedUser(email: string): Promise<boolean> {
    const { error } = await supabase
        .from('authorized_users')
        .insert([{ email: email.trim().toLowerCase() }]);

    if (error) {
        console.error('Error adding authorized user:', error);
        return false;
    }
    return true;
}

// ─────────────────────────────────────────────────────────────
// Admin: Remove a user from the whitelist
// ─────────────────────────────────────────────────────────────
export async function removeAuthorizedUser(email: string): Promise<boolean> {
    const { error } = await supabase
        .from('authorized_users')
        .delete()
        .ilike('email', email);

    if (error) {
        console.error('Error removing authorized user:', error);
        return false;
    }
    return true;
}

// ─────────────────────────────────────────────────────────────
// Admin: Get all authorized users with their profiles
// ─────────────────────────────────────────────────────────────
export async function getAuthorizedUsers(): Promise<{
    email: string;
    userId: string | null;
    fullName: string | null;
    role: string | null;
    semesterId: string | null;
    semesterName: string | null;
}[]> {
    const { data, error } = await supabase
        .from('authorized_users')
        .select('email')
        .order('email', { ascending: true });

    if (error || !data) return [];

    // Join with profiles for extra info
    const emails = data.map(u => u.email);
    const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, class_id, semesters(name)')
        .in('email', emails);

    const profileMap = new Map((profiles ?? []).map((p: any) => [p.email?.toLowerCase(), p]));

    return data.map(u => {
        const profile = profileMap.get(u.email?.toLowerCase());
        return {
            email: u.email,
            userId: profile?.id ?? null,
            fullName: profile?.full_name ?? null,
            role: profile?.role ?? null,
            semesterId: profile?.class_id ?? null,
            semesterName: profile?.semesters?.name ?? null,
        };
    });
}
