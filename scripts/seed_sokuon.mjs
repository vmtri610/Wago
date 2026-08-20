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
  { "jp": "にっき", "romaji": "nikki", "vi": "Nhật ký" },
  { "jp": "きって", "romaji": "kitte", "vi": "Tem thư" },
  { "jp": "きっぷ", "romaji": "kippu", "vi": "Vé (tàu, xe)" },
  { "jp": "ざっし", "romaji": "zasshi", "vi": "Tạp chí" },
  { "jp": "おっと", "romaji": "otto", "vi": "Chồng" },
  { "jp": "みっか", "romaji": "mikka", "vi": "Ngày mùng 3" },
  { "jp": "にっし", "romaji": "nisshi", "vi": "Nhật chí, sổ nhật ký công tác" },
  { "jp": "けっか", "romaji": "kekka", "vi": "Kết quả" },
  { "jp": "せっけん", "romaji": "sekken", "vi": "Xà phòng" },
  { "jp": "けっこん", "romaji": "kekkon", "vi": "Kết hôn" },
  { "jp": "しっぱい", "romaji": "shippai", "vi": "Thất bại" },
  { "jp": "いっぽん", "romaji": "ippon", "vi": "Một cây (que, bút...)" },
  { "jp": "けっせき", "romaji": "kesseki", "vi": "Vắng mặt" },
  { "jp": "あさって", "romaji": "asatte", "vi": "Ngày mốt (ngày kia)" },
  { "jp": "きっさてん", "romaji": "kissaten", "vi": "Quán cà phê" },
  { "jp": "らっかさん", "romaji": "rakkasan", "vi": "Cái dù (nhảy dù)" },
  { "jp": "がっき", "romaji": "gakki", "vi": "Nhạc cụ" },
  { "jp": "かっちり", "romaji": "kacchiri", "vi": "Chắc chắn, khít khao" },
  { "jp": "こぎって", "romaji": "kogitte", "vi": "Séc (ngân hàng)" },
  { "jp": "おっとせい", "romaji": "ottosei", "vi": "Hải cẩu lông mao" },
  { "jp": "ろっこつ", "romaji": "rokkotsu", "vi": "Xương sườn" },
  { "jp": "たったいま", "romaji": "tattaima", "vi": "Vừa mới đây" },
  { "jp": "ねったい", "romaji": "nettai", "vi": "Nhiệt đới" },
  { "jp": "ほっぺた", "romaji": "hoppeta", "vi": "Má (gò má)" },
  { "jp": "れっしゃ", "romaji": "ressha", "vi": "Đoàn tàu hỏa" },
  { "jp": "さっかく", "romaji": "sakkaku", "vi": "Ảo giác, nhầm lẫn" },
  { "jp": "ひっかく", "romaji": "hikkaku", "vi": "Cào, gãi" }
];

async function seedSokuon() {
  try {
    const FOLDER_NAME = 'Sokuon';
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

    console.log(`Đã gộp thành công ${formattedWords.length} từ Âm ngắt Sokuon.`);

    // 1. Create or get "Sokuon" folder in Supabase
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
    console.error('Lỗi nạp từ Sokuon:', err);
  }
}

seedSokuon();
