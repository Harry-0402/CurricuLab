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

    // MBA(BA) Students
    { name: "Georgetta Diodae Wilson", status: "MBA Student", category: "fellows", email: "georgettawilson44@gmail.com", subject: "Business Administration", gender: 'female', contactNo: "7775066089", whatsappNo: "7775066089" },
    { name: "Akash Jayaprakash Mangalamthodi", status: "MBA Student", category: "fellows", email: "akashmangalam73857@gmail.com", subject: "Business Administration", gender: 'male', contactNo: "9420475026", whatsappNo: "7709777025" },
    { name: "Tanu Chaudhary", status: "MBA Student", category: "fellows", email: "ctanu608@gmail.com", subject: "Business Administration", gender: 'female', contactNo: "8931075330", whatsappNo: "7905077690" },
    { name: "Kaustubh Khushal Nandurkar", status: "MBA Student", category: "fellows", email: "kaustubh21112002@gmail.com", subject: "Business Administration", gender: 'male', contactNo: "8080001550", whatsappNo: "7397836550" },
    { name: "Veeramalla Mani Shankar", status: "MBA Student", category: "fellows", email: "veeramallamani7@gmail.com", subject: "Business Administration", gender: 'male', contactNo: "8688426036", whatsappNo: "9441327721" },
    { name: "Shah Kaif Javed", status: "MBA Student", category: "fellows", email: "kaifjshah@gmail.com", subject: "Business Administration", gender: 'male', contactNo: "7666150737", whatsappNo: "9822080013" },
    { name: "Chavan Harish Ravindra", status: "MBA Student", category: "fellows", email: "hrchavan0402@gmail.com", subject: "Business Administration", gender: 'male', contactNo: "7030430756", whatsappNo: "7796123947" },
    { name: "Anukriti Srivastava", status: "MBA Student", category: "fellows", email: "anukritisrivastava04@gmail.com", subject: "Business Administration", gender: 'female', contactNo: "7007334139", whatsappNo: "9151317648" },
    { name: "Divya Shahi", status: "MBA Student", category: "fellows", email: "shahidivya38@gamil.com", subject: "Business Administration", gender: 'female', contactNo: "9214867985", whatsappNo: "8429085044" },
    { name: "Tejas Sanjay Patil", status: "MBA Student", category: "fellows", email: "tejaspatil78787@gmail.com", subject: "Business Administration", gender: 'male', contactNo: "9673662750", whatsappNo: "9529883139" }
];
