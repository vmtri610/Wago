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

const files = [
  '/Users/vominhtri/Downloads/japanese_n5_vocabulary.json',
  '/Users/vominhtri/Downloads/japanese_n5_vocab_part2.json',
  '/Users/vominhtri/Downloads/japanese_n5_vocab_part3.json'
];

async function seed() {
  try {
    let allWords = [];
    for (const file of files) {
      if (fs.existsSync(file)) {
        const raw = fs.readFileSync(file, 'utf-8');
        const data = JSON.parse(raw);
        if (data.words && Array.isArray(data.words)) {
          allWords.push(...data.words);
        }
      }
    }

    // Deduplicate by `jp` word
    const uniqueWords = [];
    const seenJp = new Set();
    for (const w of allWords) {
      if (w.jp && !seenJp.has(w.jp)) {
        seenJp.add(w.jp);
        uniqueWords.push(w);
      }
    }

    console.log(`Đã gộp và loại trùng: Tổng cộng ${uniqueWords.length} từ vựng N5 từ 3 file JSON.`);

    // Save to local src/data/n5_vocab.json
    fs.writeFileSync('src/data/n5_vocab.json', JSON.stringify({ words: uniqueWords }, null, 2));

    const folderNames = [...new Set(uniqueWords.map(w => w.folder).filter(Boolean))];
    console.log('Danh sách thư mục:', folderNames);

    const folderMap = new Map();
    for (const fName of folderNames) {
      const { data: existing } = await supabase.from('folders').select('id, name').eq('name', fName).single();
      if (existing) {
        folderMap.set(fName, existing.id);
      } else {
        const { data: inserted, error } = await supabase.from('folders').insert([{ name: fName }]).select().single();
        if (error) {
          console.error(`Lỗi tạo folder "${fName}":`, error.message);
        } else if (inserted) {
          folderMap.set(fName, inserted.id);
        }
      }
    }

    // Check existing words in Supabase to prevent duplicates
    const { data: existingWords } = await supabase.from('words').select('jp');
    const existingJpSet = new Set((existingWords || []).map(w => w.jp));

    const newWordsToInsert = uniqueWords.filter(w => !existingJpSet.has(w.jp)).map(w => ({
      jp: w.jp,
      romaji: w.romaji,
      vi: w.vi,
      folder_id: w.folder ? folderMap.get(w.folder) || null : null
    }));

    console.log(`Số từ vựng mới cần nạp vào Supabase: ${newWordsToInsert.length}`);

    const BATCH_SIZE = 50;
    let successCount = 0;
    for (let i = 0; i < newWordsToInsert.length; i += BATCH_SIZE) {
      const batch = newWordsToInsert.slice(i, i + BATCH_SIZE);
      const { data: inserted, error } = await supabase.from('words').insert(batch).select();
      if (error) {
        console.error(`Lỗi insert batch ${i}:`, error.message);
      } else {
        successCount += (inserted ? inserted.length : batch.length);
      }
    }

    console.log(`===> Đã thêm thành công ${successCount} từ vựng mới vào Supabase (Tổng trong DB: ${existingJpSet.size + successCount})!`);
  } catch (err) {
    console.error('Lỗi trong quá trình nạp dữ liệu:', err);
  }
}

seed();
