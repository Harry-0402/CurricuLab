import { supabase } from '@/utils/supabase/client';
import { RevisionNote } from '@/types';

// Map database row to RevisionNote type
function mapRevisionNote(row: any): RevisionNote {
    return {
        id: row.id,
        unitId: row.unit_id,
        title: row.title,
        content: row.content || '',
        generatedAt: row.generated_at,
    };
}

// Map RevisionNote to database row
function mapToDbRow(note: RevisionNote): any {
    return {
        id: note.id,
        unit_id: note.unitId,
        title: note.title,
        content: note.content,
        generated_at: note.generatedAt || new Date().toISOString(),
    };
}

export async function getRevisionNotesByUnit(unitId: string): Promise<RevisionNote[]> {
    const { data, error } = await supabase
        .from('revision_notes')
        .select('*')
        .eq('unit_id', unitId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching revision notes:', error);
        return [];
    }

    return (data || []).map(mapRevisionNote);
}

export async function createRevisionNote(note: RevisionNote): Promise<RevisionNote> {
    const dbRow = mapToDbRow(note);
    const { data, error } = await supabase
        .from('revision_notes')
        .insert(dbRow)
        .select()
        .single();

    if (error) {
        console.error('Error creating revision note:', error);
        throw error;
    }

    return mapRevisionNote(data);
}

export async function deleteRevisionNotesByUnit(unitId: string): Promise<void> {
    const { error } = await supabase
        .from('revision_notes')
        .delete()
        .eq('unit_id', unitId);

    if (error) {
        console.error('Error deleting revision notes:', error);
        throw error;
    }
}
