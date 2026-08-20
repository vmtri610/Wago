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

const newWordsRaw = [
  { "jp": "がく", "romaji": "gaku", "vi": "Học vấn / môn học" },
  { "jp": "わなげ", "romaji": "wanage", "vi": "Trò chơi ném vòng" },
  { "jp": "はいざら", "romaji": "haizara", "vi": "Cái gạt tàn" },
  { "jp": "ふじさん", "romaji": "fujisan", "vi": "Núi Phú Sĩ" },
  { "jp": "かぜ", "romaji": "kaze", "vi": "Gió" },
  { "jp": "ぐんじん", "romaji": "gunjin", "vi": "Quân nhân" },
  { "jp": "まど", "romaji": "mado", "vi": "Cửa sổ" },
  { "jp": "すいぞくかん", "romaji": "suizokukan", "vi": "Thủy cung" },
  { "jp": "くだもの", "romaji": "kudamono", "vi": "Hoa quả, trái cây" },
  { "jp": "りんご", "romaji": "ringo", "vi": "Quả táo" }
];

async function appendDakuon() {
  try {
    const FOLDER_NAME = 'Dakuon & Handakuon';

    // 1. Get folder_id from Supabase
    let { data: existingFolder } = await supabase.from('folders').select('id, name').eq('name', FOLDER_NAME).maybeSingle();
    let folderId = existingFolder?.id;

    if (!folderId) {
      const { data: newFolder, error: fErr } = await supabase.from('folders').insert([{ name: FOLDER_NAME }]).select().single();
      if (fErr) {
        console.error(`Lỗi tạo folder ${FOLDER_NAME}:`, fErr.message);
        return;
      }
      folderId = newFolder.id;
    }

    console.log(`✓ ID thư mục "${FOLDER_NAME}" trong Supabase:`, folderId);

    // 2. Read local JSON and check duplicates
    const localData = JSON.parse(fs.readFileSync('src/data/n5_vocab.json', 'utf-8'));
    const currentWords = localData.words || [];
    const existingJpSet = new Set(currentWords.map(w => w.jp));

    const wordsToAdd = [];
    for (const w of newWordsRaw) {
      if (!existingJpSet.has(w.jp)) {
        wordsToAdd.push({
          id: String(Date.now() + Math.random()),
          jp: w.jp,
          romaji: w.romaji,
          vi: w.vi,
          folder: FOLDER_NAME
        });
      }
    }

    if (wordsToAdd.length === 0) {
      console.log('Tất cả 10 từ đã tồn tại, không cần thêm.');
      return;
    }

    // 3. Update local JSON file
    const updatedLocalWords = [...currentWords, ...wordsToAdd];
    fs.writeFileSync('src/data/n5_vocab.json', JSON.stringify({ words: updatedLocalWords }, null, 2));
    console.log(`✓ Đã thêm ${wordsToAdd.length} từ mới vào src/data/n5_vocab.json`);

    // 4. Upload new words to Supabase
    const wordsToInsert = wordsToAdd.map(w => ({
      jp: w.jp,
      romaji: w.romaji,
      vi: w.vi,
      folder_id: folderId
    }));

    const { error: insErr } = await supabase.from('words').insert(wordsToInsert);
    if (insErr) {
      console.error('Lỗi insert Supabase:', insErr.message);
    } else {
      console.log(`===> HOÀN THÀNH: Đã thêm thành công ${wordsToAdd.length} từ vào thư mục "${FOLDER_NAME}" trên Supabase!`);
    }
  } catch (err) {
    console.error('Lỗi thêm từ Dakuon:', err);
  }
}

appendDakuon();
