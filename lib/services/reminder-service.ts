import { supabase } from "@/utils/supabase/client";
import { AuthService } from "./auth.service";

export interface Reminder {
    id: string;
    userId: string;
    title: string;
    description?: string;
    reminderDate: string;
    isCompleted: boolean;
    createdAt: string;
}

export const ReminderService = {
    async getAllReminders(): Promise<Reminder[]> {
        const user = await AuthService.getCurrentUser();
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
            .from('reminders')
            .select('*')
            .eq('user_id', user.id)
            .order('reminder_date', { ascending: true });

        if (error) throw error;

        return (data || []).map(r => ({
            id: r.id,
            userId: r.user_id,
            title: r.title,
            description: r.description,
            reminderDate: r.reminder_date,
            isCompleted: r.is_completed,
            createdAt: r.created_at
        }));
    },

    async createReminder(title: string, reminderDate: string, description?: string): Promise<Reminder> {
        const user = await AuthService.getCurrentUser();
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
            .from('reminders')
            .insert({
                user_id: user.id,
                title,
                description,
                reminder_date: reminderDate
            })
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.id,
            userId: data.user_id,
            title: data.title,
            description: data.description,
            reminderDate: data.reminder_date,
            isCompleted: data.is_completed,
            createdAt: data.created_at
        };
    },

    async toggleComplete(reminderId: string): Promise<void> {
        const { data: current } = await supabase
            .from('reminders')
            .select('is_completed')
            .eq('id', reminderId)
            .single();

        if (!current) throw new Error("Reminder not found");

        const { error } = await supabase
            .from('reminders')
            .update({ is_completed: !current.is_completed })
            .eq('id', reminderId);

        if (error) throw error;
    },

    async deleteReminder(reminderId: string): Promise<void> {
        const { error } = await supabase
            .from('reminders')
            .delete()
            .eq('id', reminderId);

        if (error) throw error;
    }
};
