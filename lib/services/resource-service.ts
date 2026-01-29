import { supabase } from '@/utils/supabase/client';
import { Resource } from '@/lib/data/course-data';

export const ResourceService = {
    async getAll(): Promise<Resource[]> {
        const { data, error } = await supabase
            .from('resources')
            .select('*')
            .eq('is_active', true);

        if (error) {
            console.error('Error fetching resources:', error);
            return [];
        }

        return data as Resource[];
    },

    async getByCategory(category: string): Promise<Resource[]> {
        const { data, error } = await supabase
            .from('resources')
            .select('*')
            .eq('category', category)
            .eq('is_active', true);

        if (error) {
            console.error('Error fetching resources by category:', error);
            return [];
        }

        return data as Resource[];
    },

    async getVideoLibrary(): Promise<Resource[]> {
        // In the old system, video library was a specific subset.
        // We can fetch everything or filter by type 'Video' if that matches the old logic.
        // Based on the old file, it seems 'Video' type is the key.
        const { data, error } = await supabase
            .from('resources')
            .select('*')
            .eq('type', 'Video')
            .eq('is_active', true);

        if (error) {
            console.error('Error fetching video library:', error);
            return [];
        }
        return data as Resource[];
    },

    async create(resource: Partial<Resource>): Promise<Resource | null> {
        const { data, error } = await supabase
            .from('resources')
            .insert([resource])
            .select()
            .single();

        if (error) {
            console.error('Error creating resource:', error);
            throw error;
        }
        return data as Resource;
    },

    async uploadFile(file: File): Promise<string> {
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`; // Simple sanitize

        const { data, error } = await supabase.storage
            .from('library-assets')
            .upload(fileName, file);

        if (error) {
            console.error('Error uploading file:', error);
            throw error;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('library-assets')
            .getPublicUrl(fileName);

        return publicUrl;
    }
};
