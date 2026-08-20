import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ymedoqaxvomzxndtwhbt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Vgl4UdSDSvAJJ8yyTY3gZQ_JjuOPNMv';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkWordCount() {
  const { count, error } = await supabase.from('words').select('*', { count: 'exact', head: true });
  console.log('Total words in Supabase DB:', count, 'Error:', error?.message);
}

checkWordCount();
