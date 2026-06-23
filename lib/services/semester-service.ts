import { supabase } from '@/utils/supabase/client';
import { Program, Semester } from '@/types';

// ─── Fixed IDs (match the SQL migration) ───────────────────
export const SEM2_ID = 'c3d4e5f6-0002-0000-0000-000000000002';
export const SEM3_ID = 'd4e5f6a7-0003-0000-0000-000000000003';
export const MBA_BA_PROGRAM_ID = 'a1b2c3d4-0001-0000-0000-000000000001';

// ─── Helper: map DB row → Program ──────────────────────────
const mapProgram = (row: any): Program => ({
    id: row.id,
    name: row.name,
    code: row.code,
    description: row.description,
});

// ─── Helper: map DB row → Semester ─────────────────────────
const mapSemester = (row: any): Semester => ({
    id: row.id,
    programId: row.program_id,
    programName: row.programs?.name,
    programCode: row.programs?.code,
    name: row.name,
    shortName: row.short_name,
    number: row.number,
    academicYear: row.academic_year,
    isActive: row.is_active,
    subjectCount: row.subject_count,
});

// ─────────────────────────────────────────────────────────────
// Programs
// ─────────────────────────────────────────────────────────────

export async function getPrograms(): Promise<Program[]> {
    const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('name', { ascending: true });

    if (error || !data) {
        console.error('Error fetching programs:', error);
        return [];
    }
    return data.map(mapProgram);
}

export async function createProgram(program: Omit<Program, 'id'>): Promise<Program | null> {
    const { data, error } = await supabase
        .from('programs')
        .insert([{ name: program.name, code: program.code, description: program.description }])
        .select()
        .single();

    if (error || !data) {
        console.error('Error creating program:', error);
        return null;
    }
    return mapProgram(data);
}

export async function updateProgram(program: Program): Promise<Program | null> {
    const { data, error } = await supabase
        .from('programs')
        .update({ name: program.name, code: program.code, description: program.description })
        .eq('id', program.id)
        .select()
        .single();

    if (error || !data) {
        console.error('Error updating program:', error);
        return null;
    }
    return mapProgram(data);
}

export async function deleteProgram(id: string): Promise<boolean> {
    const { error } = await supabase.from('programs').delete().eq('id', id);
    if (error) { console.error('Error deleting program:', error); return false; }
    return true;
}

// ─────────────────────────────────────────────────────────────
// Semesters
// ─────────────────────────────────────────────────────────────

export async function getSemesters(programId?: string): Promise<Semester[]> {
    let query = supabase
        .from('semesters')
        .select('*, programs(name, code)')
        .order('number', { ascending: true });

    if (programId) query = query.eq('program_id', programId);

    const { data, error } = await query;
    if (error || !data) {
        console.error('Error fetching semesters:', error);
        return [];
    }
    return data.map(mapSemester);
}

export async function getSemesterById(id: string): Promise<Semester | null> {
    const { data, error } = await supabase
        .from('semesters')
        .select('*, programs(name, code)')
        .eq('id', id)
        .single();

    if (error || !data) return null;
    return mapSemester(data);
}

export async function getActiveSemesters(): Promise<Semester[]> {
    const { data, error } = await supabase
        .from('semesters')
        .select('*, programs(name, code)')
        .eq('is_active', true)
        .order('number', { ascending: true });

    if (error || !data) return [];
    return data.map(mapSemester);
}

export async function createSemester(
    semester: Omit<Semester, 'id' | 'programName' | 'subjectCount'>
): Promise<Semester | null> {
    const { data, error } = await supabase
        .from('semesters')
        .insert([{
            program_id: semester.programId,
            name: semester.name,
            short_name: semester.shortName,
            number: semester.number,
            academic_year: semester.academicYear,
            is_active: semester.isActive,
        }])
        .select('*, programs(name, code)')
        .single();

    if (error || !data) {
        console.error('Error creating semester:', error);
        return null;
    }
    return mapSemester(data);
}

export async function updateSemester(semester: Semester): Promise<Semester | null> {
    const { data, error } = await supabase
        .from('semesters')
        .update({
            program_id: semester.programId,
            name: semester.name,
            short_name: semester.shortName,
            number: semester.number,
            academic_year: semester.academicYear,
            is_active: semester.isActive,
        })
        .eq('id', semester.id)
        .select('*, programs(name, code)')
        .single();

    if (error || !data) {
        console.error('Error updating semester:', error);
        return null;
    }
    return mapSemester(data);
}

export async function deleteSemester(id: string): Promise<boolean> {
    const { error } = await supabase.from('semesters').delete().eq('id', id);
    if (error) { console.error('Error deleting semester:', error); return false; }
    return true;
}

export async function getSemesterSubjectCount(semesterId: string): Promise<number> {
    const { count, error } = await supabase
        .from('subjects')
        .select('id', { count: 'exact', head: true })
        .eq('semester_id', semesterId);

    return error ? 0 : (count ?? 0);
}
