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

const rawWords = [
  { "jp": "おちゃ", "romaji": "ocha", "vi": "Trà" },
  { "jp": "じしょ", "romaji": "jisho", "vi": "Từ điển" },
  { "jp": "ひゃく", "romaji": "hyaku", "vi": "Một trăm (100)" },
  { "jp": "きょく", "romaji": "kyoku", "vi": "Bài hát, bản nhạc" },
  { "jp": "きしゃ", "romaji": "kisha", "vi": "Xe lửa / Nhà báo (phỏng vấn)" },
  { "jp": "きゃく", "romaji": "kyaku", "vi": "Khách" },
  { "jp": "しゃしん", "romaji": "shashin", "vi": "Ảnh chụp" },
  { "jp": "めんきょ", "romaji": "menkyo", "vi": "Bằng lái, giấy phép" },
  { "jp": "しょくじ", "romaji": "shokuji", "vi": "Bữa ăn" },
  { "jp": "しゅじん", "romaji": "shujin", "vi": "Chồng, chủ nhân" },
  { "jp": "りょこう", "romaji": "ryokou", "vi": "Du lịch" },
  { "jp": "しょくどう", "romaji": "shokudou", "vi": "Nhà ăn, quán ăn" },
  { "jp": "はっぴゃく", "romaji": "happyaku", "vi": "Tám trăm (800)" },
  { "jp": "しゅくだい", "romaji": "shukudai", "vi": "Bài tập về nhà" },
  { "jp": "びじゅつかん", "romaji": "bijutsukan", "vi": "Bảo tàng mỹ thuật" },
  { "jp": "さんびゃく", "romaji": "sanbyaku", "vi": "Ba trăm (300)" },
  { "jp": "ろっぴゃく", "romaji": "roppyaku", "vi": "Sáu trăm (600)" },
  { "jp": "びじゅつ", "romaji": "bijutsu", "vi": "Mỹ thuật" },
  { "jp": "でんしゃ", "romaji": "densha", "vi": "Tàu điện" }
];

async function seedYoon() {
  try {
    const FOLDER_NAME = 'Yōon';
    const seenJp = new Set();
    const formattedWords = [];

    for (const w of rawWords) {
      if (w.jp && !seenJp.has(w.jp)) {
        seenJp.add(w.jp);
        formattedWords.push({
          id: String(Date.now() + Math.random()),
          jp: w.jp,
          romaji: w.romaji,
          vi: w.vi,
          folder: FOLDER_NAME
        });
      }
    }

    console.log(`Đã gộp thành công ${formattedWords.length} từ Âm ghép Yōon.`);

    // 1. Create or get "Yōon" folder in Supabase
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

    // 2. Save to local JSON file src/data/n5_vocab.json
    const existingLocal = JSON.parse(fs.readFileSync('src/data/n5_vocab.json', 'utf-8'));
    const currentWords = existingLocal.words || [];

    const updatedLocalWords = [
      ...currentWords.filter(w => w.folder !== FOLDER_NAME),
      ...formattedWords
    ];

    fs.writeFileSync('src/data/n5_vocab.json', JSON.stringify({ words: updatedLocalWords }, null, 2));
    console.log('✓ Đã cập nhật file src/data/n5_vocab.json');

    // 3. Upload to Supabase
    const wordsToInsert = formattedWords.map(w => ({
      jp: w.jp,
      romaji: w.romaji,
      vi: w.vi,
      folder_id: folderId
    }));

    const { error: insErr } = await supabase.from('words').insert(wordsToInsert);
    if (insErr) {
      console.error('Lỗi insert Supabase:', insErr.message);
    } else {
      console.log(`===> HOÀN THÀNH: Đã thêm ${formattedWords.length} từ vào thư mục "${FOLDER_NAME}" trên Supabase!`);
    }
  } catch (err) {
    console.error('Lỗi nạp từ Âm ghép Yōon:', err);
  }
}

seedYoon();
