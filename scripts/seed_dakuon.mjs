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
  { "jp": "みず", "romaji": "mizu", "vi": "Nước" },
  { "jp": "かばん", "romaji": "kaban", "vi": "Cái cặp/túi xách" },
  { "jp": "でんわ", "romaji": "denwa", "vi": "Điện thoại" },
  { "jp": "めがね", "romaji": "megane", "vi": "Kính mắt" },
  { "jp": "たべる", "romaji": "taberu", "vi": "Ăn" },
  { "jp": "かんじ", "romaji": "kanji", "vi": "Chữ Hán" },
  { "jp": "かぞく", "romaji": "kazoku", "vi": "Gia đình" },
  { "jp": "ごぜん", "romaji": "gozen", "vi": "Sáng" },
  { "jp": "げんき", "romaji": "genki", "vi": "Khỏe mạnh, tràn đầy năng lượng" },
  { "jp": "しんぶん", "romaji": "shinbun", "vi": "Báo (tin tức)" },
  { "jp": "おみやげ", "romaji": "omiyage", "vi": "Quà lưu niệm" },
  { "jp": "ともだち", "romaji": "tomodachi", "vi": "Bạn bè" },
  { "jp": "えんぴつ", "romaji": "enpitsu", "vi": "Bút chì" },
  { "jp": "にほんご", "romaji": "nihongo", "vi": "Tiếng Nhật" },
  { "jp": "せんぱい", "romaji": "senpai", "vi": "Tiền bối, đàn anh/chị" },
  { "jp": "がいこくじん", "romaji": "gaikokujin", "vi": "Người nước ngoài" },
  { "jp": "かがく", "romaji": "kagaku", "vi": "Khoa học" },
  { "jp": "ぎんこう", "romaji": "ginkou", "vi": "Ngân hàng" },
  { "jp": "みぎ", "romaji": "migi", "vi": "Bên phải" },
  { "jp": "めぐすり", "romaji": "megusuri", "vi": "Thuốc nhỏ mắt" },
  { "jp": "げんいん", "romaji": "genin", "vi": "Nguyên nhân" },
  { "jp": "ひげ", "romaji": "hige", "vi": "Râu ria" },
  { "jp": "ごご", "romaji": "gogo", "vi": "Chiều" },
  { "jp": "かざん", "romaji": "kazan", "vi": "Núi lửa" },
  { "jp": "ひだり", "romaji": "hidari", "vi": "Bên trái" },
  { "jp": "えだ", "romaji": "eda", "vi": "Cành cây" },
  { "jp": "でんき", "romaji": "denki", "vi": "Điện, đèn điện" },
  { "jp": "おどり", "romaji": "odori", "vi": "Khiêu vũ" },
  { "jp": "こども", "romaji": "kodomo", "vi": "Trẻ con" },
  { "jp": "たばこ", "romaji": "tabako", "vi": "Thuốc lá" },
  { "jp": "ゆび", "romaji": "yubi", "vi": "Ngón tay" },
  { "jp": "へび", "romaji": "hebi", "vi": "Con rắn" },
  { "jp": "ぶんか", "romaji": "bunka", "vi": "Văn hóa" },
  { "jp": "なべ", "romaji": "nabe", "vi": "Cái nồi" },
  { "jp": "ぼいん", "romaji": "boin", "vi": "Nguyên âm" },
  { "jp": "うで", "romaji": "ude", "vi": "Cánh tay" }
];

async function seedDakuon() {
  try {
    const FOLDER_NAME = 'Âm đục';
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

    console.log(`Đã gộp thành công ${formattedWords.length} từ Âm đục.`);

    // 1. Create or get "Âm đục" folder in Supabase
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
    console.error('Lỗi nạp từ Âm đục:', err);
  }
}

seedDakuon();
