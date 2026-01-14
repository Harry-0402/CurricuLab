import { supabase } from '@/utils/supabase/client';
import { ChangelogService } from './changelog.service';

export interface Team {
    id: string;
    title: string;
    description: string;
    lead: string;
    color: string;
    icon: string;
    order: number;
}

export interface TeamMember {
    id: string;
    teamId: string; // Foreign Key to Team.id
    name: string;
    role: string;
    subject?: string;
    driveLink?: string;
    createdAt?: string;
}

export interface WorkflowStep {
    id: string;
    title: string;
    description: string;
    icon: string;
    order: number;
}

const INITIAL_TEAMS: Omit<Team, 'id'>[] = [
    { title: "Project Coordinators", description: "Strategic planning and overall project management", lead: "Anushka & Shreyanshi", color: "blue", icon: "Users", order: 1 },
    { title: "Technical Team", description: "Platform development and technical infrastructure", lead: "Harish & Kaif", color: "indigo", icon: "Code2", order: 2 },
    { title: "Data Acquisition Team", description: "Collecting and organizing study materials", lead: "Tanisha & Shubh", color: "orange", icon: "Database", order: 3 },
    { title: "Social Media Team", description: "Marketing and community engagement", lead: "Diya & Tanishq", color: "pink", icon: "Share2", order: 4 },
];

const INITIAL_MEMBERS: Omit<TeamMember, 'id' | 'teamId'>[] = [
    { name: "Anushka", role: "Co-Lead", subject: "Management" },
    { name: "Shreyanshi", role: "Co-Lead", subject: "General" },
    { name: "Harish", role: "Tech Lead", subject: "Development" },
    { name: "Kaif", role: "Developer", subject: "Frontend" },
    { name: "Tanisha", role: "Data Lead", subject: "Research" },
    { name: "Shubh", role: "Data Specialist", subject: "Analysis" },
    { name: "Diya", role: "Marketing Lead", subject: "Social" },
    { name: "Tanishq", role: "Community Manager", subject: "Engagement" }
];

const INITIAL_WORKFLOW: Omit<WorkflowStep, 'id'>[] = [
    { title: "Data Collection", description: "Gathering resources", icon: "Database", order: 1 },
    { title: "Digitization", description: "Scanning & Formatting", icon: "FileText", order: 2 },
    { title: "Review", description: "Quality Check", icon: "CheckCircle", order: 3 },
    { title: "Publication", description: "Live on Platform", icon: "Upload", order: 4 },
];


export const TeamService = {
    // --- TEAMS ---
    async getTeams() {
        const { data, error } = await supabase.from('teams').select('*').order('order');
        if (error) {
            console.error("Supabase Error (getTeams):", error);
            throw new Error(`Failed to fetch teams: ${error.message}`);
        }
        return data as Team[];
    },

    // --- MEMBERS ---
    async getMembers() {
        const { data, error } = await supabase.from('team_members').select('*');
        if (error) {
            console.error("Supabase Error (getMembers):", error);
            throw new Error(`Failed to fetch members: ${error.message}`);
        }
        return data.map(m => this._mapMember(m));
    },

    async addMember(member: Omit<TeamMember, 'id' | 'createdAt'>) {
        const dbMember = {
            team_id: member.teamId,
            name: member.name,
            role: member.role,
            subject: member.subject,
            drive_link: member.driveLink
        };

        const { data, error } = await supabase
            .from('team_members')
            .insert(dbMember)
            .select()
            .single();

        if (error) throw error;

        await ChangelogService.logChange('Team Member', data.id, 'CREATE', { name: member.name });
        return this._mapMember(data);
    },

    async updateMember(id: string, updates: Partial<TeamMember>) {
        const dbUpdates: any = {};
        if (updates.teamId) dbUpdates.team_id = updates.teamId;
        if (updates.name) dbUpdates.name = updates.name;
        if (updates.role) dbUpdates.role = updates.role;
        if (updates.subject) dbUpdates.subject = updates.subject;
        if (updates.driveLink) dbUpdates.drive_link = updates.driveLink;

        const { data, error } = await supabase
            .from('team_members')
            .update(dbUpdates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        await ChangelogService.logChange('Team Member', id, 'UPDATE', updates);
        return this._mapMember(data);
    },

    async deleteMember(id: string) {
        // Get member name before delete for log
        const { data: member } = await supabase.from('team_members').select('name').eq('id', id).single();

        const { error } = await supabase
            .from('team_members')
            .delete()
            .eq('id', id);

        if (error) throw error;

        await ChangelogService.logChange('Team Member', id, 'DELETE', { name: member?.name || id });
    },

    // --- WORKFLOW ---
    async getWorkflow() {
        const { data, error } = await supabase.from('workflow_steps').select('*').order('order');
        if (error) {
            console.error("Supabase Error (getWorkflow):", error);
            throw new Error(`Failed to fetch workflow: ${error.message}`);
        }
        return data as WorkflowStep[];
    },

    // --- UTILS ---
    _mapMember(dbMember: any): TeamMember {
        return {
            id: dbMember.id,
            teamId: dbMember.team_id,
            name: dbMember.name,
            role: dbMember.role,
            subject: dbMember.subject,
            driveLink: dbMember.drive_link,
            createdAt: dbMember.created_at
        };
    },

    // --- SEEDING ---
    async seed() {
        // Clear existing
        await supabase.from('team_members').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('teams').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('workflow_steps').delete().neq('id', '00000000-0000-0000-0000-000000000000');

        // Insert Teams
        const { data: teams, error: teamError } = await supabase.from('teams').insert(INITIAL_TEAMS).select();
        if (teamError) throw teamError;

        // Map Members to Teams dynamically
        const projectTeam = teams.find(t => t.title.includes("Coordinates"));
        const techTeam = teams.find(t => t.title.includes("Technical"));
        const dataTeam = teams.find(t => t.title.includes("Acquisition"));
        const socialTeam = teams.find(t => t.title.includes("Social"));

        const membersWithTeams = INITIAL_MEMBERS.map(m => {
            let teamId = projectTeam?.id;
            if (['Harish', 'Kaif'].includes(m.name)) teamId = techTeam?.id;
            else if (['Tanisha', 'Shubh'].includes(m.name)) teamId = dataTeam?.id;
            else if (['Diya', 'Tanishq'].includes(m.name)) teamId = socialTeam?.id;

            return {
                team_id: teamId,
                name: m.name,
                role: m.role,
                subject: m.subject
            };
        }).filter(m => m.team_id); // Safety filter

        if (membersWithTeams.length > 0) {
            const { error: memberError } = await supabase.from('team_members').insert(membersWithTeams);
            if (memberError) console.error("Member Seed Error:", memberError);
        }

        // Insert Workflow
        await supabase.from('workflow_steps').insert(INITIAL_WORKFLOW);

        console.log("Seeded Teams, Members, and Workflow!");
    }
};
