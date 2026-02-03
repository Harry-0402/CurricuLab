import { supabase } from '@/utils/supabase/client';

export interface ClassroomMaterial {
    id: string;
    subject_id: string;
    unit_id: string | null;
    title: string;
    description: string | null;
    text_content: string | null;
    due_date: string | null;
    google_drive_file_id: string;
    google_drive_link: string;
    file_name: string | null;
    file_type: 'pdf' | 'doc' | 'ppt' | 'video' | 'image' | 'other';
    material_category: 'study_notes' | 'assignments' | 'announcements' | 'cia' | 'other';
    file_size_bytes: number | null;
    mime_type: string | null;
    uploaded_by: string | null;
    uploader_name: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateClassroomMaterialInput {
    subject_id: string;
    unit_id?: string;
    title: string;
    description?: string;
    text_content?: string;
    due_date?: string;
    google_drive_file_id: string;
    google_drive_link: string;
    file_name?: string;
    file_type?: 'pdf' | 'doc' | 'ppt' | 'video' | 'image' | 'other';
    material_category?: 'study_notes' | 'assignments' | 'announcements' | 'cia' | 'other';
    file_size_bytes?: number;
    mime_type?: string;
    uploaded_by?: string;
    uploader_name?: string;
}

export const ClassroomMaterialService = {
    /**
     * Get all materials for a specific subject
     */
    async getBySubject(subjectId: string): Promise<ClassroomMaterial[]> {
        const { data, error } = await supabase
            .from('classroom_materials')
            .select('*')
            .eq('subject_id', subjectId)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching classroom materials:', error);
            return [];
        }

        return data || [];
    },

    /**
     * Get all materials for a specific unit
     */
    async getByUnit(unitId: string): Promise<ClassroomMaterial[]> {
        const { data, error } = await supabase
            .from('classroom_materials')
            .select('*')
            .eq('unit_id', unitId)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching classroom materials:', error);
            return [];
        }

        return data || [];
    },

    /**
     * Get all active materials (optionally filtered by file type)
     */
    async getAll(fileType?: string): Promise<ClassroomMaterial[]> {
        let query = supabase
            .from('classroom_materials')
            .select('*')
            .eq('is_active', true);

        if (fileType && fileType !== 'all') {
            query = query.eq('file_type', fileType);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching all classroom materials:', error);
            return [];
        }

        return data || [];
    },

    /**
     * Get a single material by ID
     */
    async getById(id: string): Promise<ClassroomMaterial | null> {
        const { data, error } = await supabase
            .from('classroom_materials')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching classroom material:', error);
            return null;
        }

        return data;
    },

    /**
     * Create a new material
     */
    async create(input: CreateClassroomMaterialInput): Promise<ClassroomMaterial | null> {
        const { data, error } = await supabase
            .from('classroom_materials')
            .insert({
                subject_id: input.subject_id,
                unit_id: input.unit_id || null,
                title: input.title,
                description: input.description || null,
                text_content: input.text_content || null,
                due_date: input.due_date || null,
                google_drive_file_id: input.google_drive_file_id,
                google_drive_link: input.google_drive_link,
                file_name: input.file_name || null,
                file_type: input.file_type || 'other',
                material_category: input.material_category || 'other',
                file_size_bytes: input.file_size_bytes || null,
                mime_type: input.mime_type || null,
                uploaded_by: input.uploaded_by || null,
                uploader_name: input.uploader_name || null,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating classroom material:', error);
            throw error;
        }

        return data;
    },

    async update(id: string, input: Partial<CreateClassroomMaterialInput>): Promise<ClassroomMaterial | null> {
        const updateData: any = {
            updated_at: new Date().toISOString(),
        };

        if (input.subject_id) updateData.subject_id = input.subject_id;
        if (input.unit_id !== undefined) updateData.unit_id = input.unit_id || null;
        if (input.title) updateData.title = input.title;
        if (input.description !== undefined) updateData.description = input.description || null;
        if (input.text_content !== undefined) updateData.text_content = input.text_content || null;
        if (input.due_date !== undefined) updateData.due_date = input.due_date || null;
        if (input.material_category) updateData.material_category = input.material_category;

        const { data, error } = await supabase
            .from('classroom_materials')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating material:', error);
            throw error;
        }

        return data;
    },

    /**
     * Soft delete a material (set is_active to false)
     */
    async delete(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('classroom_materials')
            .update({ is_active: false })
            .eq('id', id);

        if (error) {
            console.error('Error deleting classroom material:', error);
            return false;
        }

        return true;
    },

    /**
     * Permanently delete a material
     */
    async hardDelete(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('classroom_materials')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error permanently deleting classroom material:', error);
            return false;
        }

        return true;
    },

    /**
     * Search materials by title or description
     */
    async search(query: string): Promise<ClassroomMaterial[]> {
        const { data, error } = await supabase
            .from('classroom_materials')
            .select('*')
            .eq('is_active', true)
            .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error searching classroom materials:', error);
            return [];
        }

        return data || [];
    },
};
