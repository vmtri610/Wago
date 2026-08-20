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
  { "jp": "メモ", "romaji": "memo", "vi": "Giấy nhớ / Ghi chú" },
  { "jp": "タワー", "romaji": "tawaa", "vi": "Tháp" },
  { "jp": "ミルク", "romaji": "miruku", "vi": "Sữa" },
  { "jp": "カラオケ", "romaji": "karaoke", "vi": "Karaoke" },
  { "jp": "フルーツ", "romaji": "furuutsu", "vi": "Trái cây" },
  { "jp": "ノート", "romaji": "nooto", "vi": "Quyển vở" },
  { "jp": "コーラ", "romaji": "koora", "vi": "Nước Cola" },
  { "jp": "スープ", "romaji": "suupu", "vi": "Súp" },
  { "jp": "テープ", "romaji": "teepu", "vi": "Băng cassette/băng dính" },
  { "jp": "プール", "romaji": "puuru", "vi": "Hồ bơi" },
  { "jp": "ケーキ", "romaji": "keeki", "vi": "Bánh kem/bánh ngọt" },
  { "jp": "デパート", "romaji": "depaato", "vi": "Trung tâm thương mại" },
  { "jp": "レシート", "romaji": "reshiito", "vi": "Hóa đơn, biên lai" },
  { "jp": "アイスクリーム", "romaji": "aisukuriimu", "vi": "Kem (ăn)" },
  { "jp": "オーストラリア", "romaji": "oosutoraria", "vi": "Nước Úc" },
  { "jp": "アイス", "romaji": "aisu", "vi": "Kem (dạng que/ốc quế)" },
  { "jp": "ソース", "romaji": "soosu", "vi": "Sốt (gia vị)" },
  { "jp": "スキー", "romaji": "sukii", "vi": "Trượt tuyết" },
  { "jp": "コース", "romaji": "koosu", "vi": "Đường đua, lộ trình" },
  { "jp": "テニス", "romaji": "tenisu", "vi": "Quần vợt (tennis)" },
  { "jp": "カヌー", "romaji": "kanuu", "vi": "Xuồng, ca-nô (canoe)" },
  { "jp": "テスト", "romaji": "tesuto", "vi": "Bài kiểm tra" },
  { "jp": "ツアー", "romaji": "tsuaa", "vi": "Tour du lịch" },
  { "jp": "タクシー", "romaji": "takushii", "vi": "Xe taxi" },
  { "jp": "ネクタイ", "romaji": "nekutai", "vi": "Cà vạt" },
  { "jp": "セーター", "romaji": "seetaa", "vi": "Áo len (sweater)" },
  { "jp": "コーヒー", "romaji": "koohii", "vi": "Cà phê" }
];

async function seedKatakana() {
  try {
    const FOLDER_NAME = 'Katakana';
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

    console.log(`Đã gộp thành công ${formattedWords.length} từ Katakana.`);

    // 1. Create or get "Katakana" folder in Supabase
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
    console.error('Lỗi nạp từ Katakana:', err);
  }
}

seedKatakana();
