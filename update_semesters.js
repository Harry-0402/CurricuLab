const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function updateSemesters() {
    const { data, error } = await supabase.from('semesters').select('*');
    if (error) {
        console.error("Error fetching", error);
        return;
    }

    for (const sem of data) {
        // e.g. "Semester 1 (Jul-Nov 2024)" -> replace " \d{4}\)" with ")"
        let newName = sem.name.replace(/ \d{4}\)/, ')');
        
        console.log(`Updating: ${sem.name} -> ${newName}`);
        
        if (newName !== sem.name) {
            const { error: updateError } = await supabase.from('semesters').update({ name: newName }).eq('id', sem.id);
            if (updateError) {
                console.error(`Error updating ${sem.id}`, updateError);
            }
        }
    }
    console.log("Done");
}

updateSemesters();
