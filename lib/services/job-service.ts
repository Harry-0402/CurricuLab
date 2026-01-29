import { supabase } from '@/utils/supabase/client';

export interface JobListing {
    id: string;
    title: string;
    company: string;
    location: string;
    type: 'Remote' | 'On-site' | 'Hybrid';
    salary_range?: string;
    url: string;
    posted_at: string;
    is_active: boolean;
}

export const JobService = {
    async getAll(): Promise<JobListing[]> {
        const { data, error } = await supabase
            .from('job_listings')
            .select('*')
            .eq('is_active', true)
            .order('posted_at', { ascending: false });

        if (error) {
            console.error('Error fetching jobs:', error);
            return [];
        }

        return data as JobListing[];
    },

    async create(job: Partial<JobListing>): Promise<JobListing | null> {
        const { data, error } = await supabase
            .from('job_listings')
            .insert([job])
            .select()
            .single();

        if (error) {
            console.error('Error creating job listing:', error);
            throw error;
        }
        return data as JobListing;
    },

    async update(id: string, updates: Partial<JobListing>): Promise<void> {
        const { error } = await supabase
            .from('job_listings')
            .update(updates)
            .eq('id', id);

        if (error) {
            console.error('Error updating job listing:', error);
            throw error;
        }
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('job_listings')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting job listing:', error);
            throw error;
        }
    }
};
