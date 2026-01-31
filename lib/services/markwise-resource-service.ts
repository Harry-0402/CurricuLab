import { supabase } from '@/utils/supabase/client';

export interface MarkWiseResource {
    id: string;
    subject_id: string;
    unit_id: string | null;
    title: string | null;
    google_drive_link: string;
    resource_type: 'html' | 'pdf' | 'doc' | 'other';
    description: string | null;
    is_active: boolean;
    created_by: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateMarkWiseResourceInput {
    subject_id: string;
    unit_id?: string;
    title?: string;
    google_drive_link: string;
    resource_type?: 'html' | 'pdf' | 'doc' | 'other';
    description?: string;
}

export const MarkWiseResourceService = {
    /**
     * Get all resources for a specific subject
     */
    async getBySubject(subjectId: string): Promise<MarkWiseResource[]> {
        const { data, error } = await supabase
            .from('markwise_resources')
            .select('*')
            .eq('subject_id', subjectId)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching markwise resources:', error);
            return [];
        }

        return data || [];
    },

    /**
     * Get all resources for a specific unit
     */
    async getByUnit(unitId: string): Promise<MarkWiseResource[]> {
        const { data, error } = await supabase
            .from('markwise_resources')
            .select('*')
            .eq('unit_id', unitId)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching markwise resources:', error);
            return [];
        }

        return data || [];
    },

    /**
     * Get a single resource by ID
     */
    async getById(id: string): Promise<MarkWiseResource | null> {
        const { data, error } = await supabase
            .from('markwise_resources')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching markwise resource:', error);
            return null;
        }

        return data;
    },

    /**
     * Create a new resource
     */
    async create(input: CreateMarkWiseResourceInput): Promise<MarkWiseResource | null> {
        const { data, error } = await supabase
            .from('markwise_resources')
            .insert({
                subject_id: input.subject_id,
                unit_id: input.unit_id || null,
                google_drive_link: input.google_drive_link,
                resource_type: input.resource_type || 'html',
                description: input.description || null,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating markwise resource:');
            console.error('Message:', error.message);
            console.error('Details:', error.details);
            console.error('Hint:', error.hint);
            console.error('Code:', error.code);
            console.error('Full error:', JSON.stringify(error, null, 2));
            throw error; // Throw so we can see it in the component
        }

        return data;
    },

    /**
     * Update an existing resource
     */
    async update(id: string, updates: Partial<CreateMarkWiseResourceInput>): Promise<MarkWiseResource | null> {
        const { data, error } = await supabase
            .from('markwise_resources')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating markwise resource:', error);
            return null;
        }

        return data;
    },

    /**
     * Soft delete a resource (set is_active to false)
     */
    async delete(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('markwise_resources')
            .update({ is_active: false })
            .eq('id', id);

        if (error) {
            console.error('Error deleting markwise resource:', error);
            return false;
        }

        return true;
    },

    /**
     * Permanently delete a resource
     */
    async hardDelete(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('markwise_resources')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error permanently deleting markwise resource:', error);
            return false;
        }

        return true;
    },
};
