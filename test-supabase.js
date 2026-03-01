const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
    const { data, error } = await supabase.from('mindgrid_agents').insert([{ user_id: '00000000-0000-0000-0000-000000000000', name: 'Test', description: 'Test', url: 'http://test.com', platform: 'openai', category: 'Writing' }]);
    console.log('Data:', data);
    console.log('Error:', JSON.stringify(error, null, 2));
}
test();
