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

async function renameFolder() {
  try {
    const OLD_NAME = 'Dakuon';
    const NEW_NAME = 'Dakuon & Handakuon';

    // 1. Rename folder in Supabase
    const { error: fErr } = await supabase.from('folders').update({ name: NEW_NAME }).eq('name', OLD_NAME);
    if (fErr) {
      console.error('Lỗi đổi tên folder Supabase:', fErr.message);
    } else {
      console.log(`✓ Đã đổi tên thư mục Supabase từ "${OLD_NAME}" thành "${NEW_NAME}"`);
    }

    // 2. Update local JSON src/data/n5_vocab.json
    const existingLocal = JSON.parse(fs.readFileSync('src/data/n5_vocab.json', 'utf-8'));
    const currentWords = existingLocal.words || [];

    const updatedWords = currentWords.map(w => {
      if (w.folder === OLD_NAME || w.folder === 'Âm đục') {
        return { ...w, folder: NEW_NAME };
      }
      return w;
    });

    fs.writeFileSync('src/data/n5_vocab.json', JSON.stringify({ words: updatedWords }, null, 2));
    console.log(`✓ Đã cập nhật tên thư mục trong src/data/n5_vocab.json thành "${NEW_NAME}"`);

    console.log('===> HOÀN THÀNH: Đã chuyển thành "Dakuon & Handakuon"!');
  } catch (err) {
    console.error('Lỗi khi đổi tên thư mục:', err);
  }
}

renameFolder();
