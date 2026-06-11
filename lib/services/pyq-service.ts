import { supabase } from "@/utils/supabase/client";

export interface PYQFile {
    id: string;
    subjectId: string;
    title: string;
    year: string;
    type: 'pdf' | 'word';
    url: string;
    createdAt?: string;
    subjectCode?: string;
    subjectTitle?: string;
}

export const PYQService = {
    async getAll(searchQuery?: string): Promise<PYQFile[]> {
        let query = supabase.from('pyqs').select('*, subjects(code, title)');

        if (searchQuery) {
            query = query.or(`title.ilike.%${searchQuery}%,year.ilike.%${searchQuery}%,subjects.code.ilike.%${searchQuery}%,subjects.title.ilike.%${searchQuery}%`);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching PYQs:", error);
            return [];
        }

        return data.map(item => ({
            id: item.id,
            subjectId: item.subject_id,
            title: item.title,
            year: item.year,
            type: item.file_type as 'pdf' | 'word',
            url: item.file_url,
            createdAt: item.created_at,
            subjectCode: item.subjects?.code,
            subjectTitle: item.subjects?.title
        }));
    },

    async create(pyq: Omit<PYQFile, 'id' | 'createdAt' | 'subjectCode' | 'subjectTitle'>): Promise<PYQFile | null> {
        const { data, error } = await supabase.from('pyqs').insert({
            subject_id: pyq.subjectId,
            title: pyq.title,
            year: pyq.year,
            file_type: pyq.type,
            file_url: pyq.url
        }).select('*, subjects(code, title)').single();

        if (error) {
            console.error("Error creating PYQ:", error);
            return null;
        }

        return {
            id: data.id,
            subjectId: data.subject_id,
            title: data.title,
            year: data.year,
            type: data.file_type as 'pdf' | 'word',
            url: data.file_url,
            createdAt: data.created_at,
            subjectCode: data.subjects?.code,
            subjectTitle: data.subjects?.title
        };
    },

    async update(id: string, updates: Partial<Omit<PYQFile, 'id' | 'createdAt' | 'subjectCode' | 'subjectTitle'>>): Promise<boolean> {
        const payload: any = {};
        if (updates.subjectId) payload.subject_id = updates.subjectId;
        if (updates.title) payload.title = updates.title;
        if (updates.year) payload.year = updates.year;
        if (updates.type) payload.file_type = updates.type;
        
        if (updates.url) {
            payload.file_url = updates.url;
            
            // Check if we are replacing an existing storage file
            const { data: oldPyq } = await supabase.from('pyqs').select('file_url').eq('id', id).single();
            if (oldPyq?.file_url && oldPyq.file_url !== updates.url && oldPyq.file_url.includes('/storage/v1/object/public/pyqs/')) {
                const urlParts = oldPyq.file_url.split('/storage/v1/object/public/pyqs/');
                if (urlParts.length > 1) {
                    const filePath = urlParts[1];
                    await supabase.storage.from('pyqs').remove([filePath]);
                }
            }
        }

        const { error } = await supabase.from('pyqs').update(payload).eq('id', id);
        if (error) {
            console.error("Error updating PYQ:", error);
            return false;
        }
        return true;
    },

    async delete(id: string): Promise<boolean> {
        // First get the URL to see if it's a stored file
        const { data: pyq } = await supabase.from('pyqs').select('file_url').eq('id', id).single();
        
        if (pyq?.file_url?.includes('/storage/v1/object/public/pyqs/')) {
            const urlParts = pyq.file_url.split('/storage/v1/object/public/pyqs/');
            if (urlParts.length > 1) {
                const filePath = urlParts[1];
                await supabase.storage.from('pyqs').remove([filePath]);
            }
        }

        const { error } = await supabase.from('pyqs').delete().eq('id', id);
        if (error) {
            console.error("Error deleting PYQ:", error);
            return false;
        }
        return true;
    },

    async uploadFile(file: File): Promise<string | null> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('pyqs')
            .upload(filePath, file);

        if (uploadError) {
            console.error('Error uploading file:', uploadError);
            return null;
        }

        const { data } = supabase.storage
            .from('pyqs')
            .getPublicUrl(filePath);

        return data.publicUrl;
    }
};
