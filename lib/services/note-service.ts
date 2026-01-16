import { supabase } from "@/utils/supabase/client";
import { Note } from "@/types";
import { LOCAL_NOTES } from "@/lib/data/course-data";

export const getNotesByUnit = async (unitId: string): Promise<Note[]> => {
    const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('unit_id', unitId)
        .order('created_at', { ascending: true });

    if (error || !data) {
        console.warn('Error fetching notes:', error);
        return LOCAL_NOTES.filter(n => n.unitId === unitId);
    }

    return data.map((n: any) => ({
        id: n.id,
        unitId: n.unit_id,
        title: n.title,
        content: n.content,
        isBookmarked: n.is_bookmarked,
        lastRead: n.last_read,
        lastModified: n.last_modified
    }));
};

export const getNoteById = async (id: string): Promise<Note | undefined> => {
    const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) return LOCAL_NOTES.find(n => n.id === id);

    return {
        id: data.id,
        unitId: data.unit_id,
        title: data.title,
        content: data.content,
        isBookmarked: data.is_bookmarked,
        lastRead: data.last_read,
        lastModified: data.last_modified
    };
};

export const createNote = async (note: Note): Promise<Note> => {
    const payload = {
        id: note.id,
        title: note.title,
        content: note.content,
        unit_id: note.unitId,
        is_bookmarked: note.isBookmarked
    };
    const { data, error } = await supabase.from('notes').insert(payload).select().single();
    if (error) {
        console.error("Error creating note:", error);
        throw error;
    }

    return {
        id: data.id,
        unitId: data.unit_id,
        title: data.title,
        content: data.content,
        isBookmarked: data.is_bookmarked,
        lastRead: data.last_read,
        lastModified: data.last_modified
    };
};

export const updateNote = async (note: Note): Promise<Note> => {
    const payload = {
        title: note.title,
        content: note.content,
        is_bookmarked: note.isBookmarked,
        last_modified: new Date().toISOString()
    };
    const { data, error } = await supabase.from('notes').update(payload).eq('id', note.id).select().single();
    if (error) console.error(error);
    return note;
};

export const deleteNote = async (id: string): Promise<void> => {
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) console.error(error);
};
