import { supabase } from '@/utils/supabase/client';

export interface Submission {
    id: string;
    material_id: string;
    student_id: string;
    student_name: string | null;
    google_drive_file_id: string | null;
    google_drive_link: string | null;
    submission_text: string | null;
    file_name: string | null;
    file_size_bytes: number | null;
    mime_type: string | null;
    status: 'submitted' | 'graded' | 'returned';
    grade: string | null;
    feedback: string | null;
    submitted_at: string;
    graded_at: string | null;
    graded_by: string | null;
    created_at: string;
    updated_at: string;
}

export interface MaterialComment {
    id: string;
    material_id: string;
    user_id: string;
    user_name: string;
    comment_text: string;
    created_at: string;
    updated_at: string;
}

export const SubmissionService = {
    async getByMaterial(materialId: string): Promise<Submission[]> {
        const { data, error } = await supabase
            .from('assignment_submissions')
            .select('*')
            .eq('material_id', materialId)
            .order('submitted_at', { ascending: false });

        if (error) {
            console.error('Error fetching submissions:', error);
            return [];
        }

        return data || [];
    },

    async getByStudent(materialId: string, studentId: string): Promise<Submission | null> {
        const { data, error } = await supabase
            .from('assignment_submissions')
            .select('*')
            .eq('material_id', materialId)
            .eq('student_id', studentId)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching submission:', error);
        }

        return data;
    },

    async create(input: {
        material_id: string;
        student_id: string;
        student_name?: string;
        google_drive_file_id?: string;
        google_drive_link?: string;
        submission_text?: string;
        file_name?: string;
        file_size_bytes?: number;
        mime_type?: string;
    }): Promise<Submission | null> {
        const { data, error } = await supabase
            .from('assignment_submissions')
            .insert({
                material_id: input.material_id,
                student_id: input.student_id,
                student_name: input.student_name || null,
                google_drive_file_id: input.google_drive_file_id || null,
                google_drive_link: input.google_drive_link || null,
                submission_text: input.submission_text || null,
                file_name: input.file_name || null,
                file_size_bytes: input.file_size_bytes || null,
                mime_type: input.mime_type || null,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating submission:', error);
            throw error;
        }

        return data;
    },
    async delete(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('assignment_submissions')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting submission:', error);
            return false;
        }

        return true;
    },

    async getAllMySubmissions(studentId: string): Promise<{ material_id: string; status: string; id: string }[]> {
        const { data, error } = await supabase
            .from('assignment_submissions')
            .select('material_id, status, id')
            .eq('student_id', studentId);

        if (error) {
            console.error('Error fetching my submissions:', error);
            return [];
        }

        return data || [];
    },
};

export const CommentService = {
    async getByMaterial(materialId: string): Promise<MaterialComment[]> {
        const { data, error } = await supabase
            .from('material_comments')
            .select('*')
            .eq('material_id', materialId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching comments:', error);
            return [];
        }

        return data || [];
    },

    async create(input: {
        material_id: string;
        user_id: string;
        user_name: string;
        comment_text: string;
    }): Promise<MaterialComment | null> {
        const { data, error } = await supabase
            .from('material_comments')
            .insert({
                material_id: input.material_id,
                user_id: input.user_id,
                user_name: input.user_name,
                comment_text: input.comment_text,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating comment:', error);
            throw error;
        }

        return data;
    },

    async delete(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('material_comments')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting comment:', error);
            return false;
        }

        return true;
    },
};
