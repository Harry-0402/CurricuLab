import { supabase } from '@/utils/supabase/client';

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
}

export const FacultyService = {
    async getAll() {
        // Fetch all records, order by created_at (or id)
        const { data, error } = await supabase
            .from('faculty_members')
            .select('*')
            .order('id', { ascending: true });

        if (error || !data) {
            console.warn('Supabase fetch failed or empty, falling back to mock data:', error);
            // Fallback to initial mock data if DB fails (e.g., missing keys on Render)
            return INITIAL_DATA.map((item, index) => ({
                id: index + 1000,
                ...item
            })) as Person[];
        }

        // Map database columns (snake_case) to application model (camelCase)
        return data.map((item: any) => ({
            id: item.id,
            name: item.name,
            status: item.status,
            category: item.category,
            email: item.email,
            subject: item.subject,
            gender: item.gender,
            contactNo: item.contact_no,
            whatsappNo: item.whatsapp_no
        })) as Person[];
    },

    async add(person: Omit<Person, 'id'>) {
        const payload = {
            name: person.name,
            status: person.status,
            category: person.category,
            email: person.email,
            subject: person.subject,
            gender: person.gender,
            contact_no: person.contactNo,
            whatsapp_no: person.whatsappNo
        };

        const { data, error } = await supabase
            .from('faculty_members')
            .insert([payload])
            .select()
            .single();

        if (error) throw error;

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
            whatsapp_no: person.whatsappNo
        };

        const { error } = await supabase
            .from('faculty_members')
            .update(payload)
            .eq('id', person.id);

        if (error) throw error;
        return person;
    },

    async delete(id: number) {
        const { error } = await supabase
            .from('faculty_members')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return id;
    }
};

// Seed Data for initial population
export const INITIAL_DATA: Omit<Person, 'id'>[] = [
    { name: "Dr. Albus Dumbledore", status: "Head of Department", category: "faculty", email: "headmaster@curriculab.edu", subject: "Leadership", gender: 'male', contactNo: "+1 (555) 010-1001" },
    { name: "Prof. Minerva McGonagall", status: "Senior Teacher", category: "faculty", email: "minerva@curriculab.edu", subject: "Transfiguration", gender: 'female', contactNo: "+1 (555) 010-1002", whatsappNo: "+1 (555) 010-9999" },
    { name: "Prof. Severus Snape", status: "Senior Teacher", category: "faculty", email: "severus@curriculab.edu", subject: "Potions", gender: 'male', contactNo: "+1 (555) 010-1003" },
    { name: "Prof. Filius Flitwick", status: "Assistant Teacher", category: "faculty", email: "filius@curriculab.edu", subject: "Charms", gender: 'male', contactNo: "+1 (555) 010-1004" },
    { name: "Prof. Pomona Sprout", status: "Senior Teacher", category: "faculty", email: "pomona@curriculab.edu", subject: "Herbology", gender: 'female', contactNo: "+1 (555) 010-1005" },
    { name: "Rubeus Hagrid", status: "Lab Instructor", category: "faculty", email: "hagrid@curriculab.edu", subject: "Zoology", gender: 'male', contactNo: "+1 (555) 010-1006" },
    { name: "Harry Potter", status: "Senior Scholar", category: "fellows", email: "harry.p@student.curriculab.edu", subject: "Defense Against Dark Arts", gender: 'male', contactNo: "+1 (555) 020-2001" },
    { name: "Hermione Granger", status: "Research Fellow", category: "fellows", email: "hermione.g@student.curriculab.edu", subject: "Arithmancy", gender: 'female', contactNo: "+1 (555) 020-2002" },
    { name: "Ron Weasley", status: "Junior Scholar", category: "fellows", email: "ron.w@student.curriculab.edu", subject: "Strategic Chess", gender: 'male', contactNo: "+1 (555) 020-2003" },
    { name: "Draco Malfoy", status: "Junior Scholar", category: "fellows", email: "draco.m@student.curriculab.edu", subject: "Potions", gender: 'male', contactNo: "+1 (555) 020-2004" },
    { name: "Luna Lovegood", status: "Research Fellow", category: "fellows", email: "luna.l@student.curriculab.edu", subject: "Cryptozoology", gender: 'female', contactNo: "+1 (555) 020-2005" },
    { name: "Cedric Diggory", status: "Senior Scholar", category: "fellows", email: "cedric.d@student.curriculab.edu", subject: "Sports Science", gender: 'male', contactNo: "+1 (555) 020-2006" }
];
