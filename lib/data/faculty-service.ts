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
}

export const FacultyService = {
    async getAll() {
        // Fetch all records, order by created_at (or id)
        const { data, error } = await supabase
            .from('faculty_members')
            .select('*')
            .order('id', { ascending: true });

        if (error || !data || data.length === 0) {
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
            whatsappNo: item.whatsapp_no,
            prn: item.prn
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
            whatsapp_no: person.whatsappNo,
            prn: person.prn
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
            prn: person.prn
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

// Seed Data for initial population
export const INITIAL_DATA: Omit<Person, 'id'>[] = [
    { name: "Dr. Albus Dumbledore", status: "Head of Department", category: "faculty", email: "headmaster@curriculab.edu", subject: "Leadership", gender: 'male', contactNo: "+1 (555) 010-1001" },
    { name: "Prof. Minerva McGonagall", status: "Senior Teacher", category: "faculty", email: "minerva@curriculab.edu", subject: "Transfiguration", gender: 'female', contactNo: "+1 (555) 010-1002", whatsappNo: "+1 (555) 010-9999" },
    { name: "Prof. Severus Snape", status: "Senior Teacher", category: "faculty", email: "severus@curriculab.edu", subject: "Potions", gender: 'male', contactNo: "+1 (555) 010-1003" },
    { name: "Prof. Filius Flitwick", status: "Assistant Teacher", category: "faculty", email: "filius@curriculab.edu", subject: "Charms", gender: 'male', contactNo: "+1 (555) 010-1004" },
    { name: "Prof. Pomona Sprout", status: "Senior Teacher", category: "faculty", email: "pomona@curriculab.edu", subject: "Herbology", gender: 'female', contactNo: "+1 (555) 010-1005" },
    { name: "Rubeus Hagrid", status: "Lab Instructor", category: "faculty", email: "hagrid@curriculab.edu", subject: "Zoology", gender: 'male', contactNo: "+1 (555) 010-1006" },

    // MBA(BA) Students
    { name: "Georgetta Diodae Wilson", status: "MBA Student", category: "fellows", email: "georgettawilson44@gmail.com", subject: "Business Administration", gender: 'female', contactNo: "7775066089", whatsappNo: "7775066089", prn: "250102041001" },
    { name: "Akash Jayaprakash Mangalamthodi", status: "MBA Student", category: "fellows", email: "akashmangalam73857@gmail.com", subject: "Business Administration", gender: 'male', contactNo: "9420475026", whatsappNo: "9420475026", prn: "250102041002" },
    { name: "Tanu Chaudhary", status: "MBA Student", category: "fellows", email: "ctanu608@gmail.com", subject: "Business Administration", gender: 'female', contactNo: "8931075330", whatsappNo: "8931075330", prn: "250102041003" },
    { name: "Kaustubh Khushal Nandurkar", status: "MBA Student", category: "fellows", email: "kaustubh21112002@gmail.com", subject: "Business Administration", gender: 'male', contactNo: "8080001550", whatsappNo: "8080001550", prn: "250102041004" },
    { name: "Veeramalla Mani Shankar", status: "MBA Student", category: "fellows", email: "veeramallamani7@gmail.com", subject: "Business Administration", gender: 'male', contactNo: "8688426036", whatsappNo: "8688426036", prn: "250102041005" },
    { name: "Shah Kaif Javed", status: "MBA Student", category: "fellows", email: "kaifjshah@gmail.com", subject: "Business Administration", gender: 'male', contactNo: "7666150737", whatsappNo: "7666150737", prn: "250102041006" },
    { name: "Chavan Harish Ravindra", status: "MBA Student", category: "fellows", email: "hrchavan0402@gmail.com", subject: "Business Administration", gender: 'male', contactNo: "7030430756", whatsappNo: "7030430756", prn: "250102041007" },
    { name: "Anukriti Srivastava", status: "MBA Student", category: "fellows", email: "anukritisrivastava04@gmail.com", subject: "Business Administration", gender: 'female', contactNo: "7007334139", whatsappNo: "7007334139", prn: "250102041008" },
    { name: "Divya Shahi", status: "MBA Student", category: "fellows", email: "shahidivya38@gamil.com", subject: "Business Administration", gender: 'female', contactNo: "9214867985", whatsappNo: "9214867985", prn: "25SUN0446" },
    { name: "Tejas Sanjay Patil", status: "MBA Student", category: "fellows", email: "tejaspatil78787@gmail.com", subject: "Business Administration", gender: 'male', contactNo: "9673662750", whatsappNo: "9673662750", prn: "25SUN0970" }
];
