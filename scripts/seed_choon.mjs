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
  { "jp": "くうき", "romaji": "kuuki", "vi": "Không khí" },
  { "jp": "すうじ", "romaji": "suuji", "vi": "Con số" },
  { "jp": "せんぷうき", "romaji": "senpuuki", "vi": "Quạt máy" },
  { "jp": "おかあさん", "romaji": "okaasan", "vi": "Mẹ" },
  { "jp": "おばあさん", "romaji": "obaasan", "vi": "Bà" },
  { "jp": "おじいさん", "romaji": "ojiisan", "vi": "Ông" },
  { "jp": "おにいさん", "romaji": "oniisan", "vi": "Anh trai" },
  { "jp": "れい", "romaji": "rei", "vi": "Ví dụ / số 0" },
  { "jp": "えいが", "romaji": "eiga", "vi": "Phim điện ảnh" },
  { "jp": "がくせい", "romaji": "gakusei", "vi": "Học sinh, sinh viên" },
  { "jp": "ぼうし", "romaji": "boushi", "vi": "Mũ, nón" },
  { "jp": "ひこうき", "romaji": "hikouki", "vi": "Máy bay" },
  { "jp": "いもうと", "romaji": "imouto", "vi": "Em gái" },
  { "jp": "ごうかく", "romaji": "goukaku", "vi": "Đỗ, đậu (thi)" },
  { "jp": "おとうさん", "romaji": "otousan", "vi": "Bố" },
  { "jp": "れいぞうこ", "romaji": "reizouko", "vi": "Tủ lạnh" },
  { "jp": "おねえさん", "romaji": "oneesan", "vi": "Chị gái" },
  { "jp": "こうつう", "romaji": "koutsuu", "vi": "Giao thông" },
  { "jp": "にんずう", "romaji": "ninzuu", "vi": "Số người" },
  { "jp": "ふうとう", "romaji": "fuutou", "vi": "Phong bì" },
  { "jp": "こおり", "romaji": "koori", "vi": "Nước đá" },
  { "jp": "おおかみ", "romaji": "ookami", "vi": "Con sói" },
  { "jp": "ぶんぽう", "romaji": "bunpou", "vi": "Ngữ pháp" },
  { "jp": "めいれい", "romaji": "meirei", "vi": "Mệnh lệnh" },
  { "jp": "けいざい", "romaji": "keizai", "vi": "Kinh tế" },
  { "jp": "ないよう", "romaji": "naiyou", "vi": "Nội dung" }
];

async function seedChoon() {
  try {
    const FOLDER_NAME = 'Chōon';
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

    console.log(`Đã gộp thành công ${formattedWords.length} từ Trường âm Chōon.`);

    // 1. Create or get "Chōon" folder in Supabase
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
    console.error('Lỗi nạp từ Trường âm Chōon:', err);
  }
}

seedChoon();
