import { supabase } from '@/utils/supabase/client';
import { ChangelogService } from '@/lib/services/changelog.service';

export interface Person {
    id: number;
    name: string;
    status?: string;
    category: 'faculty' | 'fellows';
    email: string;
    subject?: string;
    gender: 'male' | 'female';
    contactNo: string;
    whatsappNo?: string;
    prn?: string;
    semesterId?: string;
}

export const FacultyService = {
    async getAll(semesterId?: string) {
        let query = supabase
            .from('faculty_members')
            .select('*')
            .order('id', { ascending: true });

        if (semesterId) {
            query = query.eq('semester_id', semesterId);
        }

        const { data, error } = await query;

        // If error or essentially empty, fall back to initial data
        if (error || !data || data.length === 0) {
            console.warn('Supabase fetch failed or empty, using mock data:', error);
            return INITIAL_DATA.map((item, index) => ({
                id: index + 1000,
                ...item
            })) as Person[];
        }

        // Map database columns (snake_case) to application model (camelCase)
        // Strictly return DB data as requested ("faculty is only this")
        return data.map((item: any) => ({
            id: item.id,
            name: item.name,
            status: item.status,
            category: item.category,
            email: item.email,
            subject: item.subject,
            gender: item.gender,
            contactNo: item.contact_no,
            whatsappNo: item.whatsapp_no,
            prn: item.prn,
            semesterId: item.semester_id
        })) as Person[];
    },

    async add(person: Omit<Person, 'id'>) {
        // ... (rest of add method)
        const payload = {
            name: person.name,
            status: person.status,
            category: person.category,
            email: person.email,
            subject: person.subject,
            gender: person.gender,
            contact_no: person.contactNo,
            whatsapp_no: person.whatsappNo,
            prn: person.prn,
            semester_id: person.semesterId
        };

        const { data, error } = await supabase
            .from('faculty_members')
            .insert([payload])
            .select()
            .single();

        if (error) throw error;

        // Log Change
        await ChangelogService.logChange({
            entity_type: 'Faculty',
            entity_id: String(data.id),
            action: 'CREATE',
            changes: { name: person.name, category: person.category }
        });

        // Return the new object with its ID
        return {
            ...person,
            id: data.id
        } as Person;
    },

    async update(person: Person) {
        const payload = {
            name: person.name,
            status: person.status,
            category: person.category,
            email: person.email,
            subject: person.subject,
            gender: person.gender,
            contact_no: person.contactNo,
            whatsapp_no: person.whatsappNo,
            prn: person.prn,
            semester_id: person.semesterId
        };

        const { error } = await supabase
            .from('faculty_members')
            .update(payload)
            .eq('id', person.id);

        if (error) throw error;

        // Log Change
        await ChangelogService.logChange({
            entity_type: 'Faculty',
            entity_id: String(person.id),
            action: 'UPDATE',
            changes: { name: person.name }
        });

        return person;
    },

    async delete(id: number) {
        const { error } = await supabase
            .from('faculty_members')
            .delete()
            .eq('id', id);

        if (error) throw error;

        // Log Change
        await ChangelogService.logChange({
            entity_type: 'Faculty',
            entity_id: String(id),
            action: 'DELETE'
        });

        return id;
    }
};

// Seed Data for initial population (Fallback only)
export const INITIAL_DATA: Omit<Person, 'id'>[] = [
    // Real App Faculty (For fallback if DB is empty)
    { name: "Dr. Shailendra Baraniya", status: "Professor", category: "faculty", email: "shailendra.baraniya@curriculab.edu", subject: "Production and Operations Management", gender: 'male', contactNo: "+91 9876543210" },
    { name: "Mr. Aniket Alvekar", status: "Assistant Professor", category: "faculty", email: "aniket.alvekar@curriculab.edu", subject: "Digital Transformation", gender: 'male', contactNo: "+91 9876543211" },
    { name: "Adv. Vishal Jadhav", status: "Professor", category: "faculty", email: "vishal.jadhav@curriculab.edu", subject: "Legal Aspects of Business", gender: 'male', contactNo: "+91 9876543212" },
    { name: "Dr. Zahir Shaikh", status: "Professor", category: "faculty", email: "zahir.shaikh@curriculab.edu", subject: "Business Research Methods", gender: 'male', contactNo: "+91 9876543213" },
    { name: "Mrs. Prachi Muskar", status: "Assistant Professor", category: "faculty", email: "prachi.muskar@curriculab.edu", subject: "Business Communication Skills-II", gender: 'female', contactNo: "+91 9876543214" },
    { name: "Dr. Samadhan Bundhe", status: "Coordinator", category: "faculty", email: "samadhan.bundhe@sandipuniversity.edu.in", subject: "Data Visualization", gender: 'male', contactNo: "99600 17348" },

    // MBA(BA) Students (Sample for fallback)
    { name: "Georgetta Diodae Wilson", status: "MBA Student", category: "fellows", email: "georgettawilson44@gmail.com", subject: "Business Administration", gender: 'female', contactNo: "7775066089", whatsappNo: "7775066089", prn: "250102041001", semesterId: "d4e5f6a7-0003-0000-0000-000000000003" }
];
