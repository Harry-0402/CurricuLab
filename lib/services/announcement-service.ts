import { supabase } from "@/utils/supabase/client";
import { Announcement } from "@/types";

const mapAnnouncement = (a: any): Announcement => ({
    id: a.id,
    title: a.title || a.headline,
    content: a.content || a.message,
    resourceLink: a.resource_link,
    date: a.date || (a.created_at ? new Date(a.created_at).toISOString().split('T')[0] : ''),
    type: a.type
});

export const getAnnouncements = async (): Promise<Announcement[]> => {
    const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

    if (error || !data) return [];
    // If is_active exists, filter by it; otherwise show all
    return data.filter((a: any) => a.is_active !== false).map(mapAnnouncement);
};

export const createAnnouncement = async (announcement: Partial<Announcement>): Promise<Announcement> => {
    // Generate a UUID if not already provided (fixes null ID constraint)
    const newId = crypto.randomUUID();

    // We try to use title/content as they were the original working columns
    const payload: any = {
        id: newId,
        type: announcement.type,
        title: announcement.title,
        content: announcement.content,
        resource_link: announcement.resourceLink,
        is_active: true
    };

    const { data, error } = await supabase.from('announcements').insert(payload).select().single();
    if (error) {
        // Fallback for headline/message if title/content fails
        if (error.message?.includes('column "title" does not exist')) {
            const fallbackPayload = {
                id: newId,
                type: announcement.type,
                headline: announcement.title,
                message: announcement.content,
                resource_link: announcement.resourceLink,
                is_active: true
            };
            const { data: fallbackData, error: fallbackError } = await supabase.from('announcements').insert(fallbackPayload).select().single();
            if (fallbackError) throw fallbackError;
            return mapAnnouncement(fallbackData);
        }
        throw error;
    }
    return mapAnnouncement(data);
};

export const updateAnnouncement = async (announcement: Announcement): Promise<Announcement> => {
    const payload: any = {
        type: announcement.type,
        title: announcement.title,
        content: announcement.content,
        resource_link: announcement.resourceLink
    };

    const { data, error } = await supabase
        .from('announcements')
        .update(payload)
        .eq('id', announcement.id)
        .select()
        .single();

    if (error) {
        if (error.message?.includes('column "title" does not exist')) {
            const fallbackPayload = {
                type: announcement.type,
                headline: announcement.title,
                message: announcement.content,
                resource_link: announcement.resourceLink
            };
            const { data: fallbackData, error: fallbackError } = await supabase
                .from('announcements')
                .update(fallbackPayload)
                .eq('id', announcement.id)
                .select()
                .single();
            if (fallbackError) throw fallbackError;
            return mapAnnouncement(fallbackData);
        }
        throw error;
    }
    return mapAnnouncement(data);
};

export const deleteAnnouncement = async (id: string): Promise<void> => {
    // Soft delete by setting is_active to false
    const { error } = await supabase
        .from('announcements')
        .update({ is_active: false })
        .eq('id', id);

    if (error) throw error;
};
