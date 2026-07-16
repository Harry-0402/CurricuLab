import { supabase, supabaseData } from "@/utils/supabase/client";
import { Announcement } from "@/types";
import { ChangelogService } from "@/lib/services/changelog.service";
import { AuthService } from "@/lib/services/auth.service";

const mapAnnouncement = (a: any): Announcement => ({
    id: a.id,
    title: a.title || a.headline,
    content: a.content || a.message,
    resourceLink: a.resource_link,
    date: a.date || (a.created_at ? new Date(a.created_at).toISOString().split('T')[0] : ''),
    type: a.type,
    attachmentUrl: a.attachment_url,
    attachmentName: a.attachment_name,
    attachmentType: a.attachment_type,
    semesterId: a.semester_id
});

export const uploadAnnouncementAttachment = async (file: File): Promise<{ url: string; name: string; type: string }> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('announcement-attachments')
        .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
        .from('announcement-attachments')
        .getPublicUrl(filePath);

    return {
        url: publicUrl,
        name: file.name,
        type: file.type
    };
};

export const getAnnouncements = async (semesterId?: string): Promise<Announcement[]> => {
    let query = supabaseData
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

    if (semesterId) {
        query = query.eq('semester_id', semesterId);
    }

    const { data, error } = await query;

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
        attachment_url: announcement.attachmentUrl,
        attachment_name: announcement.attachmentName,
        attachment_type: announcement.attachmentType,
        semester_id: announcement.semesterId,
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
                attachment_url: announcement.attachmentUrl,
                attachment_name: announcement.attachmentName,
                attachment_type: announcement.attachmentType,
                semester_id: announcement.semesterId,
                is_active: true
            };
            const { data: fallbackData, error: fallbackError } = await supabase.from('announcements').insert(fallbackPayload).select().single();
            if (fallbackError) throw fallbackError;

            const newAnnouncement = mapAnnouncement(fallbackData);
            // Log Change
            await ChangelogService.logChange({
                entity_type: 'Announcement',
                entity_id: newAnnouncement.id,
                action: 'CREATE',
                changes: { title: newAnnouncement.title }
            });
            return newAnnouncement;
        }
        throw error;
    }

    const newAnnouncement = mapAnnouncement(data);
    // Log Change
    await ChangelogService.logChange({
        entity_type: 'Announcement',
        entity_id: newAnnouncement.id,
        action: 'CREATE',
        changes: { title: newAnnouncement.title }
    });

    // Send Email Notification (Async/Non-blocking)
    (async () => {
        const recipients = await AuthService.getSubscribers();
        await fetch('/api/notifications/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'Announcement',
                title: newAnnouncement.title || 'New Announcement',
                content: newAnnouncement.content || 'Check the dashboard for details.',
                link: 'https://curriculab-sj6g.onrender.com/announcements',
                linkText: 'View Announcement',
                recipients: recipients
            })
        });
    })().catch(err => console.error("Failed to send notification:", err));

    return newAnnouncement;
};

export const updateAnnouncement = async (announcement: Announcement): Promise<Announcement> => {
    const payload: any = {
        type: announcement.type,
        title: announcement.title,
        content: announcement.content,
        resource_link: announcement.resourceLink,
        attachment_url: announcement.attachmentUrl,
        attachment_name: announcement.attachmentName,
        attachment_type: announcement.attachmentType,
        semester_id: announcement.semesterId
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
                resource_link: announcement.resourceLink,
                attachment_url: announcement.attachmentUrl,
                attachment_name: announcement.attachmentName,
                attachment_type: announcement.attachmentType,
                semester_id: announcement.semesterId
            };
            const { data: fallbackData, error: fallbackError } = await supabase
                .from('announcements')
                .update(fallbackPayload)
                .eq('id', announcement.id)
                .select()
                .single();
            if (fallbackError) throw fallbackError;

            const updatedAnnouncement = mapAnnouncement(fallbackData);
            // Log Change
            await ChangelogService.logChange({
                entity_type: 'Announcement',
                entity_id: updatedAnnouncement.id,
                action: 'UPDATE',
                changes: { title: updatedAnnouncement.title }
            });

            return updatedAnnouncement;
        }
        throw error;
    }

    const updatedAnnouncement = mapAnnouncement(data);
    // Log Change
    await ChangelogService.logChange({
        entity_type: 'Announcement',
        entity_id: updatedAnnouncement.id,
        action: 'UPDATE',
        changes: { title: updatedAnnouncement.title }
    });

    return updatedAnnouncement;
};

export const deleteAnnouncement = async (id: string): Promise<void> => {
    // Soft delete by setting is_active to false
    const { error } = await supabase
        .from('announcements')
        .update({ is_active: false })
        .eq('id', id);

    if (error) throw error;

    // Log Change
    await ChangelogService.logChange({
        entity_type: 'Announcement',
        entity_id: id,
        action: 'DELETE'
    });
};
