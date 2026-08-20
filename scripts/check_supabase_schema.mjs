import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ymedoqaxvomzxndtwhbt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Vgl4UdSDSvAJJ8yyTY3gZQ_JjuOPNMv';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkSchema() {
  console.log('--- Checking Supabase words table schema ---');
  const { data, error } = await supabase.from('words').select('*').limit(1);
  if (error) {
    console.error('Error fetching words:', error.message);
    return;
  }

  if (data && data.length > 0) {
    const sample = data[0];
    console.log('Sample word keys in Supabase:', Object.keys(sample));
    console.log('srs_level exists:', 'srs_level' in sample);
    console.log('next_review_at exists:', 'next_review_at' in sample);
  } else {
    console.log('No words found in Supabase table to inspect keys.');
  }
}

checkSchema();
