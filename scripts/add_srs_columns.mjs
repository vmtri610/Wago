import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ymedoqaxvomzxndtwhbt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Vgl4UdSDSvAJJ8yyTY3gZQ_JjuOPNMv';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function addColumns() {
  console.log('Attempting to test inserting srs_level to Supabase...');
  const { data, error } = await supabase.from('words').update({
    srs_level: 1,
    next_review_at: new Date().toISOString()
  }).eq('id', 'non-existent-id');

  if (error) {
    console.log('Supabase DB error response:', error.message);
  } else {
    console.log('Supabase accepted columns!');
  }
}

addColumns();
