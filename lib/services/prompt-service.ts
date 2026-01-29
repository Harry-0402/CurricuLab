import { supabase } from '@/utils/supabase/client';
import { Prompt } from '@/lib/data/course-data';

export const PromptService = {
    async getAll(): Promise<Prompt[]> {
        const { data, error } = await supabase
            .from('prompts')
            .select('*')
            .order('title', { ascending: true });

        if (error) {
            console.error('Error fetching prompts:', error);
            return [];
        }

        return data as Prompt[];
    },

    async create(prompt: Omit<Prompt, 'id'>): Promise<Prompt | null> {
        const { data, error } = await supabase
            .from('prompts')
            .insert([prompt])
            .select()
            .single();

        if (error) {
            console.error('Error creating prompt:', error);
            throw error;
        }

        return data as Prompt;
    },

    async update(id: string, updates: Partial<Prompt>): Promise<Prompt | null> {
        const { data, error } = await supabase
            .from('prompts')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating prompt:', error);
            throw error;
        }

        return data as Prompt;
    },

    async delete(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('prompts')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting prompt:', error);
            throw error;
        }

        return true;
    }
};
