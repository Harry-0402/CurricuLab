import { supabase } from '@/utils/supabase/client';

export interface Application {
    id: string;
    company: string;
    role: string;
    status: 'Applied' | 'Interviewing' | 'Offer' | 'Rejected' | 'Wishlist';
    date: string;
    notes?: string;
    user_id?: string;
}

export const CareerService = {
    async getAll(): Promise<Application[]> {
        const { data, error } = await supabase
            .from('career_applications')
            .select('*')
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching applications:', error);
            return [];
        }

        return data as Application[];
    },

    async create(app: Partial<Application>): Promise<Application | null> {
        const { data, error } = await supabase
            .from('career_applications')
            .insert([app])
            .select()
            .single();

        if (error) {
            console.error('Error creating application:', error);
            throw error;
        }
        return data as Application;
    },

    async update(id: string, updates: Partial<Application>): Promise<void> {
        const { error } = await supabase
            .from('career_applications')
            .update(updates)
            .eq('id', id);

        if (error) {
            console.error('Error updating application:', error);
            throw error;
        }
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('career_applications')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting application:', error);
            throw error;
        }
    }
};
