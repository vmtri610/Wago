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
  { "jp": "きょう", "romaji": "kyou", "vi": "Hôm nay" },
  { "jp": "こしょう", "romaji": "koshou", "vi": "Sự cố, hỏng hóc" },
  { "jp": "しゅうり", "romaji": "shuuri", "vi": "Sửa chữa" },
  { "jp": "びょういん", "romaji": "byouin", "vi": "Bệnh viện" },
  { "jp": "じゅぎょう", "romaji": "jugyou", "vi": "Giờ học, buổi học" },
  { "jp": "きゅうけい", "romaji": "kyuukei", "vi": "Nghỉ giải lao" },
  { "jp": "こうじょう", "romaji": "koujou", "vi": "Nhà máy" },
  { "jp": "りょうしん", "romaji": "ryoushin", "vi": "Cha mẹ" },
  { "jp": "れんしゅう", "romaji": "renshuu", "vi": "Luyện tập" },
  { "jp": "りゅうがく", "romaji": "ryuugaku", "vi": "Du học" },
  { "jp": "ぎゅうにゅう", "romaji": "gyuunyuu", "vi": "Sữa bò" },
  { "jp": "ちゅうごくご", "romaji": "chuugokugo", "vi": "Tiếng Trung" },
  { "jp": "きゅうきゅうしゃ", "romaji": "kyuukyuusha", "vi": "Xe cứu thương" },
  { "jp": "きょねん", "romaji": "kyonen", "vi": "Năm ngoái" },
  { "jp": "べんきょう", "romaji": "benkyou", "vi": "Học tập" },
  { "jp": "ゆうびんきょく", "romaji": "yuubinkyoku", "vi": "Bưu điện" },
  { "jp": "こうぎょう", "romaji": "kougyou", "vi": "Công nghiệp" },
  { "jp": "のうぎょう", "romaji": "nougyou", "vi": "Nông nghiệp" },
  { "jp": "かいしゃいん", "romaji": "kaishain", "vi": "Nhân viên công ty" },
  { "jp": "うんてんしゅ", "romaji": "untenshu", "vi": "Người lái xe" },
  { "jp": "じゅうにがつ", "romaji": "juunigatsu", "vi": "Tháng mười hai" },
  { "jp": "じゅうしょ", "romaji": "juusho", "vi": "Địa chỉ" },
  { "jp": "しょうがくきん", "romaji": "shougakukin", "vi": "Học bổng" },
  { "jp": "うちゅう", "romaji": "uchuu", "vi": "Vũ trụ" },
  { "jp": "こうちょう", "romaji": "kouchou", "vi": "Hiệu trưởng" },
  { "jp": "ゆにゅう", "romaji": "yunyuu", "vi": "Nhập khẩu" },
  { "jp": "にひゃく", "romaji": "nihyaku", "vi": "Hai trăm" },
  { "jp": "いちびょう", "romaji": "ichibyou", "vi": "Một giây" },
  { "jp": "びょうき", "romaji": "byouki", "vi": "Bệnh tật" },
  { "jp": "みょうじ", "romaji": "myouji", "vi": "Họ (tên)" },
  { "jp": "りょうしゅうしょ", "romaji": "ryoushuusho", "vi": "Biên lai" },
  { "jp": "りゅうがくせい", "romaji": "ryuugakusei", "vi": "Du học sinh" },
  { "jp": "だいとうりょう", "romaji": "daitouryou", "vi": "Tổng thống" },
  { "jp": "ちょうちん", "romaji": "chouchin", "vi": "Đèn lồng" },
  { "jp": "けんびきょう", "romaji": "kenbikyou", "vi": "Kính hiển vi" },
  { "jp": "はつでんしょ", "romaji": "hatsudensho", "vi": "Nhà máy điện" },
  { "jp": "みゃく", "romaji": "myaku", "vi": "Mạch" },
  { "jp": "りゅう", "romaji": "ryuu", "vi": "Con rồng" }
];

async function seedYoonChoon() {
  try {
    const FOLDER_NAME = 'Yōon & Chōon';
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

    console.log(`Đã gộp thành công ${formattedWords.length} từ Yōon & Chōon.`);

    // 1. Create or get "Yōon & Chōon" folder in Supabase
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
    console.error('Lỗi nạp từ Yōon & Chōon:', err);
  }
}

seedYoonChoon();
