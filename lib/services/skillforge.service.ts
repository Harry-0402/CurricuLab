import { supabase } from "@/utils/supabase/client";
import {
    SkillForgeTrack,
    SkillForgeResource,
    SkillForgeJournalEntry,
    SkillForgeSkill,
    SkillForgeTrackStatus,
    SkillForgeResourceStatus,
    SkillForgeResourceType,
    SkillForgeProficiency
} from "@/types";

// ============================================
// SKILLFORGE SERVICE - Personal Studies Management
// ============================================

// --- Mappers ---

const mapTrack = (data: any): SkillForgeTrack => ({
    id: data.id,
    userId: data.user_id,
    title: data.title,
    description: data.description || '',
    category: data.category,
    targetDate: data.target_date,
    status: data.status,
    progress: data.progress,
    color: data.color,
    icon: data.icon,
    createdAt: data.created_at,
    updatedAt: data.updated_at
});

const mapResource = (data: any): SkillForgeResource => ({
    id: data.id,
    userId: data.user_id,
    trackId: data.track_id,
    title: data.title,
    url: data.url,
    platform: data.platform,
    type: data.type,
    status: data.status,
    notes: data.notes,
    priority: data.priority,
    createdAt: data.created_at,
    updatedAt: data.updated_at
});

const mapJournalEntry = (data: any): SkillForgeJournalEntry => ({
    id: data.id,
    userId: data.user_id,
    trackId: data.track_id,
    title: data.title,
    content: data.content || '',
    keyLearnings: data.key_learnings || [],
    mood: data.mood,
    createdAt: data.created_at,
    updatedAt: data.updated_at
});

const mapSkill = (data: any): SkillForgeSkill => ({
    id: data.id,
    userId: data.user_id,
    name: data.name,
    category: data.category,
    proficiencyLevel: data.proficiency_level,
    trackIds: data.track_ids || [],
    notes: data.notes,
    lastPracticed: data.last_practiced,
    createdAt: data.created_at,
    updatedAt: data.updated_at
});

// ============================================
// TRACKS CRUD
// ============================================

export const getTracks = async (filters?: { status?: SkillForgeTrackStatus }): Promise<SkillForgeTrack[]> => {
    let query = supabase.from('skillforge_tracks').select('*');

    if (filters?.status) {
        query = query.eq('status', filters.status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
        console.error("Failed to fetch tracks:", error);
        return [];
    }

    return data.map(mapTrack);
};

export const getTrackById = async (id: string): Promise<SkillForgeTrack | null> => {
    const { data, error } = await supabase
        .from('skillforge_tracks')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error("Failed to fetch track:", error);
        return null;
    }

    return mapTrack(data);
};

export const createTrack = async (track: Omit<SkillForgeTrack, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<SkillForgeTrack | null> => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const { data, error } = await supabase.from('skillforge_tracks').insert([{
        user_id: userData.user.id,
        title: track.title,
        description: track.description || '',
        category: track.category,
        target_date: track.targetDate || null,
        status: track.status || 'active',
        progress: track.progress || 0,
        color: track.color || '#3B82F6',
        icon: track.icon || '🎯'
    }]).select().single();

    if (error) {
        console.error("Failed to create track:", error.message);
        return null;
    }

    return mapTrack(data);
};

export const updateTrack = async (track: SkillForgeTrack): Promise<SkillForgeTrack | null> => {
    const { data, error } = await supabase
        .from('skillforge_tracks')
        .update({
            title: track.title,
            description: track.description,
            category: track.category,
            target_date: track.targetDate || null,
            status: track.status,
            progress: track.progress,
            color: track.color,
            icon: track.icon
        })
        .eq('id', track.id)
        .select()
        .single();

    if (error) {
        console.error("Failed to update track:", error.message);
        return null;
    }

    return mapTrack(data);
};

export const deleteTrack = async (id: string): Promise<boolean> => {
    const { error } = await supabase
        .from('skillforge_tracks')
        .delete()
        .eq('id', id);

    if (error) {
        console.error("Failed to delete track:", error);
        return false;
    }

    return true;
};

// ============================================
// RESOURCES CRUD
// ============================================

export const getResources = async (filters?: {
    trackId?: string;
    status?: SkillForgeResourceStatus;
    type?: SkillForgeResourceType;
}): Promise<SkillForgeResource[]> => {
    let query = supabase.from('skillforge_resources').select('*');

    if (filters?.trackId) query = query.eq('track_id', filters.trackId);
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.type) query = query.eq('type', filters.type);

    const { data, error } = await query.order('priority', { ascending: false }).order('created_at', { ascending: false });

    if (error) {
        console.error("Failed to fetch resources:", error);
        return [];
    }

    return data.map(mapResource);
};

export const createResource = async (resource: Omit<SkillForgeResource, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<SkillForgeResource | null> => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const { data, error } = await supabase.from('skillforge_resources').insert([{
        user_id: userData.user.id,
        track_id: resource.trackId || null,
        title: resource.title,
        url: resource.url || null,
        platform: resource.platform || 'other',
        type: resource.type || 'course',
        status: resource.status || 'not_started',
        notes: resource.notes || null,
        priority: resource.priority || 3
    }]).select().single();

    if (error) {
        console.error("Failed to create resource:", error.message);
        return null;
    }

    return mapResource(data);
};

export const updateResource = async (resource: SkillForgeResource): Promise<SkillForgeResource | null> => {
    const { data, error } = await supabase
        .from('skillforge_resources')
        .update({
            track_id: resource.trackId || null,
            title: resource.title,
            url: resource.url || null,
            platform: resource.platform,
            type: resource.type,
            status: resource.status,
            notes: resource.notes || null,
            priority: resource.priority
        })
        .eq('id', resource.id)
        .select()
        .single();

    if (error) {
        console.error("Failed to update resource:", error.message);
        return null;
    }

    return mapResource(data);
};

export const deleteResource = async (id: string): Promise<boolean> => {
    const { error } = await supabase
        .from('skillforge_resources')
        .delete()
        .eq('id', id);

    if (error) {
        console.error("Failed to delete resource:", error);
        return false;
    }

    return true;
};

// ============================================
// JOURNAL CRUD
// ============================================

export const getJournalEntries = async (filters?: { trackId?: string }): Promise<SkillForgeJournalEntry[]> => {
    let query = supabase.from('skillforge_journal').select('*');

    if (filters?.trackId) query = query.eq('track_id', filters.trackId);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
        console.error("Failed to fetch journal entries:", error);
        return [];
    }

    return data.map(mapJournalEntry);
};

export const createJournalEntry = async (entry: Omit<SkillForgeJournalEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<SkillForgeJournalEntry | null> => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const { data, error } = await supabase.from('skillforge_journal').insert([{
        user_id: userData.user.id,
        track_id: entry.trackId || null,
        title: entry.title,
        content: entry.content || '',
        key_learnings: entry.keyLearnings || [],
        mood: entry.mood || null
    }]).select().single();

    if (error) {
        console.error("Failed to create journal entry:", error.message);
        return null;
    }

    return mapJournalEntry(data);
};

export const updateJournalEntry = async (entry: SkillForgeJournalEntry): Promise<SkillForgeJournalEntry | null> => {
    const { data, error } = await supabase
        .from('skillforge_journal')
        .update({
            track_id: entry.trackId || null,
            title: entry.title,
            content: entry.content,
            key_learnings: entry.keyLearnings,
            mood: entry.mood || null
        })
        .eq('id', entry.id)
        .select()
        .single();

    if (error) {
        console.error("Failed to update journal entry:", error.message);
        return null;
    }

    return mapJournalEntry(data);
};

export const deleteJournalEntry = async (id: string): Promise<boolean> => {
    const { error } = await supabase
        .from('skillforge_journal')
        .delete()
        .eq('id', id);

    if (error) {
        console.error("Failed to delete journal entry:", error);
        return false;
    }

    return true;
};

// ============================================
// SKILLS CRUD
// ============================================

export const getSkills = async (filters?: { category?: string; proficiency?: SkillForgeProficiency }): Promise<SkillForgeSkill[]> => {
    let query = supabase.from('skillforge_skills').select('*');

    if (filters?.category) query = query.eq('category', filters.category);
    if (filters?.proficiency) query = query.eq('proficiency_level', filters.proficiency);

    const { data, error } = await query.order('name', { ascending: true });

    if (error) {
        console.error("Failed to fetch skills:", error);
        return [];
    }

    return data.map(mapSkill);
};

export const createSkill = async (skill: Omit<SkillForgeSkill, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<SkillForgeSkill | null> => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const { data, error } = await supabase.from('skillforge_skills').insert([{
        user_id: userData.user.id,
        name: skill.name,
        category: skill.category || 'technical',
        proficiency_level: skill.proficiencyLevel || 'beginner',
        track_ids: skill.trackIds || [],
        notes: skill.notes || null,
        last_practiced: skill.lastPracticed || null
    }]).select().single();

    if (error) {
        console.error("Failed to create skill:", error.message);
        return null;
    }

    return mapSkill(data);
};

export const updateSkill = async (skill: SkillForgeSkill): Promise<SkillForgeSkill | null> => {
    const { data, error } = await supabase
        .from('skillforge_skills')
        .update({
            name: skill.name,
            category: skill.category,
            proficiency_level: skill.proficiencyLevel,
            track_ids: skill.trackIds,
            notes: skill.notes || null,
            last_practiced: skill.lastPracticed || null
        })
        .eq('id', skill.id)
        .select()
        .single();

    if (error) {
        console.error("Failed to update skill:", error.message);
        return null;
    }

    return mapSkill(data);
};

export const deleteSkill = async (id: string): Promise<boolean> => {
    const { error } = await supabase
        .from('skillforge_skills')
        .delete()
        .eq('id', id);

    if (error) {
        console.error("Failed to delete skill:", error);
        return false;
    }

    return true;
};

// ============================================
// STATISTICS
// ============================================

export interface SkillForgeStats {
    totalTracks: number;
    activeTracks: number;
    completedTracks: number;
    totalResources: number;
    completedResources: number;
    totalJournalEntries: number;
    totalSkills: number;
    skillsByProficiency: Record<SkillForgeProficiency, number>;
}

export const getSkillForgeStats = async (): Promise<SkillForgeStats> => {
    const [tracks, resources, journal, skills] = await Promise.all([
        getTracks(),
        getResources(),
        getJournalEntries(),
        getSkills()
    ]);

    const skillsByProficiency: Record<SkillForgeProficiency, number> = {
        beginner: 0,
        intermediate: 0,
        advanced: 0,
        expert: 0
    };

    skills.forEach(skill => {
        skillsByProficiency[skill.proficiencyLevel]++;
    });

    return {
        totalTracks: tracks.length,
        activeTracks: tracks.filter(t => t.status === 'active').length,
        completedTracks: tracks.filter(t => t.status === 'completed').length,
        totalResources: resources.length,
        completedResources: resources.filter(r => r.status === 'completed').length,
        totalJournalEntries: journal.length,
        totalSkills: skills.length,
        skillsByProficiency
    };
};
