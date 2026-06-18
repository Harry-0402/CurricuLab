const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const dataToInsert = [
  // PBA204
  { subject_id: 'pba204', unit_id: 'unit-1', type: 'case_study', title: 'Unit 1: Case Study', link: 'https://curriculab-resources.netlify.app/sem-2/pba204%20production%20and%20operations%20management/pba204%20unit-1%20case%20study.html' },
  { subject_id: 'pba204', unit_id: 'unit-2', type: 'case_study', title: 'Unit 2: Case Study', link: 'https://curriculab-resources.netlify.app/sem-2/pba204%20production%20and%20operations%20management/pba204%20unit-2%20case%20study.html' },
  { subject_id: 'pba204', unit_id: 'unit-3', type: 'case_study', title: 'Unit 3: Case Study', link: 'https://curriculab-resources.netlify.app/sem-2/pba204%20production%20and%20operations%20management/pba204%20unit-3%20case%20study.html' },
  { subject_id: 'pba204', unit_id: 'unit-4', type: 'case_study', title: 'Unit 4: Case Study', link: 'https://curriculab-resources.netlify.app/sem-2/pba204%20production%20and%20operations%20management/pba204%20unit-4%20case%20study.html' },
  { subject_id: 'pba204', unit_id: 'unit-5', type: 'case_study', title: 'Unit 5: Case Study', link: 'https://curriculab-resources.netlify.app/sem-2/pba204%20production%20and%20operations%20management/pba204%20unit-5%20case%20study.html' },
  // PBA205
  { subject_id: 'pba205', unit_id: 'unit-1', type: 'case_study', title: 'Unit 1: Case Study', link: 'https://curriculab-resources.netlify.app/sem-2/pba205%20digital%20transformation/pba205%20unit-1%20case%20study.html' },
  { subject_id: 'pba205', unit_id: 'unit-2', type: 'case_study', title: 'Unit 2: Case Study', link: 'https://curriculab-resources.netlify.app/sem-2/pba205%20digital%20transformation/pba205%20unit-2%20case%20study.html' },
  { subject_id: 'pba205', unit_id: 'unit-3', type: 'case_study', title: 'Unit 3: Case Study', link: 'https://curriculab-resources.netlify.app/sem-2/pba205%20digital%20transformation/pba205%20unit-3%20case%20study.html' },
  { subject_id: 'pba205', unit_id: 'unit-4', type: 'case_study', title: 'Unit 4: Case Study', link: 'https://curriculab-resources.netlify.app/sem-2/pba205%20digital%20transformation/pba205%20unit-4%20case%20study.html' },
  { subject_id: 'pba205', unit_id: 'unit-5', type: 'case_study', title: 'Unit 5: Case Study', link: 'https://curriculab-resources.netlify.app/sem-2/pba205%20digital%20transformation/pba205%20unit-5%20case%20study.html' },
  // PBA206
  { subject_id: 'pba206', unit_id: 'unit-1', type: 'case_study', title: 'Unit 1: Case Study', link: 'https://curriculab-resources.netlify.app/sem-2/pba206%20legal%20aspects%20of%20business/pba206%20unit-1%20case%20study.html' },
  { subject_id: 'pba206', unit_id: 'unit-2', type: 'case_study', title: 'Unit 2: Case Study', link: 'https://curriculab-resources.netlify.app/sem-2/pba206%20legal%20aspects%20of%20business/pba206%20unit-2%20case%20study.html' },
  { subject_id: 'pba206', unit_id: 'unit-3', type: 'case_study', title: 'Unit 3: Case Study', link: 'https://curriculab-resources.netlify.app/sem-2/pba206%20legal%20aspects%20of%20business/pba206%20unit-3%20case%20study.html' },
  { subject_id: 'pba206', unit_id: 'unit-4', type: 'case_study', title: 'Unit 4: Case Study', link: 'https://curriculab-resources.netlify.app/sem-2/pba206%20legal%20aspects%20of%20business/pba206%20unit-4%20case%20study.html' },
  { subject_id: 'pba206', unit_id: 'unit-5', type: 'case_study', title: 'Unit 5: Case Study', link: 'https://curriculab-resources.netlify.app/sem-2/pba206%20legal%20aspects%20of%20business/pba206%20unit-5%20case%20study.html' },
  // PBA207
  { subject_id: 'pba207', unit_id: 'unit-1', type: 'case_study', title: 'Unit 1: Case Study', link: 'https://curriculab-resources.netlify.app/sem-2/pba207%20visualization%20and%20storytelling/pba207%20unit-1%20case%20study.html' },
  { subject_id: 'pba207', unit_id: 'unit-2', type: 'case_study', title: 'Unit 2: Case Study', link: 'https://curriculab-resources.netlify.app/sem-2/pba207%20visualization%20and%20storytelling/pba207%20unit-2%20case%20study.html' },
  { subject_id: 'pba207', unit_id: 'unit-3', type: 'case_study', title: 'Unit 3: Case Study', link: 'https://curriculab-resources.netlify.app/sem-2/pba207%20visualization%20and%20storytelling/pba207%20unit-3%20case%20study.html' },
  { subject_id: 'pba207', unit_id: 'unit-4', type: 'case_study', title: 'Unit 4: Case Study', link: 'https://curriculab-resources.netlify.app/sem-2/pba207%20visualization%20and%20storytelling/pba207%20unit-4%20case%20study.html' },
  { subject_id: 'pba207', unit_id: 'unit-5', type: 'case_study', title: 'Unit 5: Case Study', link: 'https://curriculab-resources.netlify.app/sem-2/pba207%20visualization%20and%20storytelling/pba207%20unit-5%20case%20study.html' },
  // PBA208
  { subject_id: 'pba208', unit_id: 'unit-1', type: 'case_study', title: 'Unit 1: Case Study', link: 'https://curriculab-resources.netlify.app/sem-2/pba208%20business%20research%20methods/pba208%20unit-1%20case%20study.html' },
  { subject_id: 'pba208', unit_id: 'unit-2', type: 'case_study', title: 'Unit 2: Case Study', link: 'https://curriculab-resources.netlify.app/sem-2/pba208%20business%20research%20methods/pba208%20unit-2%20case%20study.html' },
  { subject_id: 'pba208', unit_id: 'unit-3', type: 'case_study', title: 'Unit 3: Case Study', link: 'https://curriculab-resources.netlify.app/sem-2/pba208%20business%20research%20methods/pba208%20unit-3%20case%20study.html' },
  { subject_id: 'pba208', unit_id: 'unit-4', type: 'case_study', title: 'Unit 4: Case Study', link: 'https://curriculab-resources.netlify.app/sem-2/pba208%20business%20research%20methods/pba208%20unit-4%20case%20study.html' },
  { subject_id: 'pba208', unit_id: 'unit-5', type: 'case_study', title: 'Unit 5: Case Study', link: 'https://curriculab-resources.netlify.app/sem-2/pba208%20business%20research%20methods/pba208%20unit-5%20case%20study.html' },
];

async function main() {
    for (const item of dataToInsert) {
        const { data: existing, error: fetchErr } = await supabase
            .from('vault_resources')
            .select('id')
            .eq('subject_id', item.subject_id)
            .eq('unit_id', item.unit_id)
            .eq('type', item.type);
            
        if (fetchErr) {
            console.error('Error fetching existing resource:', fetchErr);
            continue;
        }
        
        if (existing && existing.length > 0) {
            console.log(`Updating existing resource for ${item.subject_id} ${item.unit_id}`);
            const { error: updateErr } = await supabase
                .from('vault_resources')
                .update({ title: item.title, link: item.link })
                .eq('id', existing[0].id);
                
            if (updateErr) console.error('Error updating:', updateErr);
        } else {
            console.log(`Inserting new resource for ${item.subject_id} ${item.unit_id}`);
            const { error: insertErr } = await supabase
                .from('vault_resources')
                .insert([item]);
                
            if (insertErr) console.error('Error inserting:', insertErr);
        }
    }
    console.log('Finished inserting data into vault_resources');
}
main();
