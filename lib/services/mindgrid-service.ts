import { supabase } from '@/utils/supabase/client';
import { Agent } from '@/components/web/MindGridContent';

export const MindGridService = {
    async getAll(): Promise<Agent[]> {
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('mindgrid_agents')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching agents:', error);
            return [];
        }

        return data as Agent[];
    },

    async create(agent: Omit<Agent, 'id'>): Promise<Agent | null> {
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('mindgrid_agents')
            .insert([{ ...agent, user_id: user?.id }])
            .select()
            .single();

        if (error) {
            console.error('Error creating agent:', error);
            throw error;
        }

        return data as Agent;
    },

    async delete(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('mindgrid_agents')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting agent:', error);
            throw error;
        }

        return true;
    }
};
