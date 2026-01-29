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
    }
};
