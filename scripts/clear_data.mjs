import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('.env.local', 'utf-8');
const envVars = Object.fromEntries(
  envText.split('\n').filter(line => line.includes('=')).map(line => {
    const [k, ...v] = line.split('=');
    return [k.trim(), v.join('=').trim()];
  })
);

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function clearAllData() {
  try {
    console.log('Đang xóa toàn bộ dữ liệu từ vựng và thư mục...');

    // 1. Delete all words in Supabase
    const { error: wErr } = await supabase.from('words').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (wErr) {
      console.error('Lỗi xóa words Supabase:', wErr.message);
    } else {
      console.log('✓ Đã xóa sạch tất cả từ vựng trong Supabase');
    }

    // 2. Delete all folders in Supabase
    const { error: fErr } = await supabase.from('folders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (fErr) {
      console.error('Lỗi xóa folders Supabase:', fErr.message);
    } else {
      console.log('✓ Đã xóa sạch tất cả thư mục trong Supabase');
    }

    // 3. Clear local JSON src/data/n5_vocab.json
    fs.writeFileSync('src/data/n5_vocab.json', JSON.stringify({ words: [] }, null, 2));
    console.log('✓ Đã xóa sạch file dữ liệu local src/data/n5_vocab.json');

    console.log('===> HOÀN THÀNH: Đã xóa toàn bộ dữ liệu thành công!');
  } catch (err) {
    console.error('Lỗi khi xóa dữ liệu:', err);
  }
}

clearAllData();
