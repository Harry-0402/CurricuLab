import { supabase } from "@/utils/supabase/client";
import { Announcement } from "@/types";

const mapAnnouncement = (a: any): Announcement => ({
    id: a.id,
    title: a.title,
    content: a.content,
    date: a.date,
    type: a.type
});

export const getAnnouncements = async (): Promise<Announcement[]> => {
    const { data, error } = await supabase.from('announcements').select('*');
    if (error || !data) return [];
    return data.map(mapAnnouncement);
};

export const createAnnouncement = async (announcement: Announcement): Promise<Announcement> => {
    const payload = {
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        date: announcement.date,
        type: announcement.type
    };
    const { data, error } = await supabase.from('announcements').insert(payload).select().single();
    if (error) throw error;
    return mapAnnouncement(data);
};

export const deleteAnnouncement = async (id: string): Promise<void> => {
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (error) throw error;
};
