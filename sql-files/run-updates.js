const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let keyToUse = supabaseServiceKey || supabaseKey;

const supabase = createClient(supabaseUrl, keyToUse);

async function run() {
    const updates = [
        { code: 'PBA211', url: '/syllabuses/PBA211_Data_Analysis_Using_Python.pdf' },
        { code: 'PBA212', url: '/syllabuses/PBA212_Data_Analysis_using_Power_BI.pdf' },
        { code: 'PBA213', url: '/syllabuses/PBA213_Business_Communication_II.pdf' }
    ];

    for (const update of updates) {
        const { error } = await supabase
            .from('subjects')
            .update({ syllabus_pdf_url: update.url })
            .eq('code', update.code);

        if (error) {
            console.error(`Error updating ${update.code}:`, error);
        } else {
            console.log(`Successfully updated ${update.code}`);
        }
    }
}

run();
