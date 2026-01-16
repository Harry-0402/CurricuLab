
import { supabase } from '@/utils/supabase/client';
import { Subject } from '@/types';

export const INITIAL_SUBJECTS: Subject[] = [
    {
        id: "s1",
        code: "PBA204",
        title: "Production and Operations Management",
        icon: "🏭",
        color: "#4f46e5",
        description: "Efficiency, process optimization, and value chain management.",
        progress: 45,
        unitCount: 5,
        lastStudied: "2024-01-12",
        syllabusPdfUrl: "/assets/syllabus/PBA204_Syllabus.docx",
    },
    {
        id: "s2",
        code: "PBA205",
        title: "Digital Transformation",
        icon: "🚀",
        color: "#059669",
        description: "Leveraging digital technologies to create or modify business processes.",
        progress: 30,
        unitCount: 5,
        lastStudied: "2024-01-11",
        syllabusPdfUrl: "/assets/syllabus/PBA205_Syllabus.doc",
    },
    {
        id: "s3",
        code: "PBA206",
        title: "Legal Aspects of Business",
        icon: "⚖️",
        color: "#f43f5e",
        description: "Commercial laws, contracts, and regulatory frameworks.",
        progress: 15,
        unitCount: 5,
        lastStudied: "2024-01-10",
        syllabusPdfUrl: "/assets/syllabus/PBA206_Syllabus.docx",
    },
    {
        id: "s4",
        code: "PBA207",
        title: "Data Visualization and Story Telling",
        icon: "📊",
        color: "#f59e0b",
        description: "Principles of visual perception and effective data narrative.",
        progress: 60,
        unitCount: 5,
        lastStudied: "2024-01-13",
        syllabusPdfUrl: "/assets/syllabus/PBA207_Syllabus.docx",
    },
    {
        id: "s5",
        code: "PBA208",
        title: "Business Research Methodology",
        icon: "🔍",
        color: "#0ea5e9",
        description: "Techniques for data collection and systematic investigation.",
        progress: 20,
        unitCount: 5,
        lastStudied: "2024-01-09",
        syllabusPdfUrl: "/assets/syllabus/PBA208_Syllabus.pdf",
    },
    {
        id: "s6",
        code: "PBA211",
        title: "Data Analysis using Python",
        icon: "🐍",
        color: "#6366f1",
        description: "Numerical analysis and statistical modeling using the Python ecosystem.",
        progress: 40,
        unitCount: 5,
        lastStudied: "2024-01-12",
        syllabusPdfUrl: "/assets/syllabus/PBA211_Syllabus.docx",
    },
    {
        id: "s7",
        code: "PBA212",
        title: "Data Analysis using Power BI",
        icon: "📈",
        color: "#10b981",
        description: "Interactive data visualization and business intelligence tools.",
        progress: 25,
        unitCount: 5,
        lastStudied: "2024-01-11",
        syllabusPdfUrl: "/assets/syllabus/PBA212_Syllabus.docx",
    },
    {
        id: "s8",
        code: "PBA213",
        title: "Business Communication Skills II",
        icon: "💬",
        color: "#64748b",
        description: "Advanced verbal and non-verbal communication for professionals.",
        progress: 50,
        unitCount: 5,
        lastStudied: "2024-01-13",
        syllabusPdfUrl: "/assets/syllabus/PBA213_Syllabus.docx",
    },
];

export const SubjectService = {
    async getAll(): Promise<Subject[]> {
        const { data, error } = await supabase
            .from('subjects')
            .select('*')
            .order('code', { ascending: true });

        if (error) {
            console.error('Error fetching subjects:', error);
            return INITIAL_SUBJECTS;
        }

        if (!data || data.length === 0) {
            return INITIAL_SUBJECTS;
        }

        return data.map((item: any) => {
            const staticMatch = INITIAL_SUBJECTS.find(s => s.code === item.code || s.id === item.id);
            return {
                id: item.id,
                code: item.code,
                title: item.title,
                icon: item.icon,
                color: item.color,
                description: item.description,
                progress: item.progress,
                unitCount: item.unit_count,
                lastStudied: item.last_studied,
                syllabusPdfUrl: staticMatch?.syllabusPdfUrl
            };
        }) as Subject[];
    },

    async update(subject: Subject): Promise<Subject | null> {
        const payload = {
            code: subject.code,
            title: subject.title,
            icon: subject.icon,
            color: subject.color,
            description: subject.description,
            progress: subject.progress,
            unit_count: subject.unitCount
            // We ignore units content as per request
        };

        const { data, error } = await supabase
            .from('subjects')
            .update(payload)
            .eq('id', subject.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating subject:', error);
            throw error;
        }

        return {
            id: data.id,
            code: data.code,
            title: data.title,
            icon: data.icon,
            color: data.color,
            description: data.description,
            progress: data.progress,
            unitCount: data.unit_count,
            lastStudied: data.last_studied
        } as Subject;
    },

    async getById(id: string): Promise<Subject | null> {
        const { data, error } = await supabase
            .from('subjects')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            // Fallback to initial data if not found in DB (for hybrid state)
            const fallback = INITIAL_SUBJECTS.find(s => s.id === id || s.code === id); // Also check code just in case
            return fallback || null;
        }

        const staticMatch = INITIAL_SUBJECTS.find(s => s.code === data.code || s.id === data.id);

        return {
            id: data.id,
            code: data.code,
            title: data.title,
            icon: data.icon,
            color: data.color,
            description: data.description,
            progress: data.progress,
            unitCount: data.unit_count,
            lastStudied: data.last_studied,
            syllabusPdfUrl: staticMatch?.syllabusPdfUrl
        } as Subject;
    }
};
