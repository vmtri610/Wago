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

const rawBlocks = [
  {
    "words": [
      { "jp": "い", "romaji": "i", "vi": "Dạ dày / Bao tử" },
      { "jp": "え", "romaji": "e", "vi": "Bức tranh" },
      { "jp": "あい", "romaji": "ai", "vi": "Tình yêu" },
      { "jp": "いえ", "romaji": "ie", "vi": "Nhà" },
      { "jp": "うえ", "romaji": "ue", "vi": "Trên, phía trên" },
      { "jp": "いう", "romaji": "iu", "vi": "Nói" },
      { "jp": "おい", "romaji": "oi", "vi": "Cháu trai" },
      { "jp": "あう", "romaji": "au", "vi": "Gặp gỡ" },
      { "jp": "あお", "romaji": "ao", "vi": "Màu xanh dương" },
      { "jp": "いいえ", "romaji": "iie", "vi": "Không (phủ định)" },
      { "jp": "いけ", "romaji": "ike", "vi": "Cái ao" },
      { "jp": "こい", "romaji": "koi", "vi": "Cá chép" },
      { "jp": "かお", "romaji": "kao", "vi": "Khuôn mặt" },
      { "jp": "かき", "romaji": "kaki", "vi": "Quả hồng" },
      { "jp": "えき", "romaji": "eki", "vi": "Nhà ga" },
      { "jp": "かい", "romaji": "kai", "vi": "Vỏ sò" },
      { "jp": "かく", "romaji": "kaku", "vi": "Viết" },
      { "jp": "あき", "romaji": "aki", "vi": "Mùa thu" },
      { "jp": "こえ", "romaji": "koe", "vi": "Giọng nói" },
      { "jp": "きかい", "romaji": "kikai", "vi": "Máy móc" },
      { "jp": "かさ", "romaji": "kasa", "vi": "Cái ô, cái dù" },
      { "jp": "すし", "romaji": "sushi", "vi": "Sushi" },
      { "jp": "あせ", "romaji": "ase", "vi": "Mồ hôi" },
      { "jp": "うし", "romaji": "ushi", "vi": "Con bò" },
      { "jp": "しお", "romaji": "shio", "vi": "Muối" },
      { "jp": "そこ", "romaji": "soko", "vi": "Chỗ đó, nơi đó" },
      { "jp": "すき", "romaji": "suki", "vi": "Thích" },
      { "jp": "しか", "romaji": "shika", "vi": "Con nai" },
      { "jp": "すいか", "romaji": "suika", "vi": "Dưa hấu" },
      { "jp": "せかい", "romaji": "sekai", "vi": "Thế giới" }
    ]
  },
  {
    "words": [
      { "jp": "あかい", "romaji": "akai", "vi": "Màu đỏ" },
      { "jp": "あおい", "romaji": "aoi", "vi": "Màu xanh" },
      { "jp": "さか", "romaji": "saka", "vi": "Con dốc" },
      { "jp": "しかく", "romaji": "shikaku", "vi": "Hình vuông" },
      { "jp": "さけ", "romaji": "sake", "vi": "Rượu" },
      { "jp": "いす", "romaji": "isu", "vi": "Cái ghế" },
      { "jp": "きそく", "romaji": "kisoku", "vi": "Quy định" },
      { "jp": "うそ", "romaji": "uso", "vi": "Dối trá" }
    ]
  },
  {
    "words": [
      { "jp": "て", "romaji": "te", "vi": "Bàn tay" },
      { "jp": "つき", "romaji": "tsuki", "vi": "Mặt trăng" },
      { "jp": "くち", "romaji": "kuchi", "vi": "Miệng" },
      { "jp": "おと", "romaji": "oto", "vi": "Âm thanh" },
      { "jp": "そと", "romaji": "soto", "vi": "Bên ngoài" },
      { "jp": "たつ", "romaji": "tatsu", "vi": "Đứng" },
      { "jp": "たいこ", "romaji": "taiko", "vi": "Trống" },
      { "jp": "つくえ", "romaji": "tsukue", "vi": "Cái bàn" },
      { "jp": "おとこ", "romaji": "otoko", "vi": "Con trai / Đàn ông" },
      { "jp": "ちかてつ", "romaji": "chikatetsu", "vi": "Tàu điện ngầm" },
      { "jp": "いぬ", "romaji": "inu", "vi": "Con chó" },
      { "jp": "ねこ", "romaji": "neko", "vi": "Con mèo" },
      { "jp": "にく", "romaji": "niku", "vi": "Thịt" },
      { "jp": "ぬの", "romaji": "nuno", "vi": "Vải" },
      { "jp": "なつ", "romaji": "natsu", "vi": "Mùa hè" },
      { "jp": "きつね", "romaji": "kitsune", "vi": "Con cáo" },
      { "jp": "さかな", "romaji": "sakana", "vi": "Con cá" },
      { "jp": "きのこ", "romaji": "kinoko", "vi": "Nấm" },
      { "jp": "おかね", "romaji": "okane", "vi": "Tiền" },
      { "jp": "にかい", "romaji": "nikai", "vi": "Tầng 2" },
      { "jp": "はな", "romaji": "hana", "vi": "Hoa" },
      { "jp": "ふえ", "romaji": "fue", "vi": "Cái sáo" },
      { "jp": "はこ", "romaji": "hako", "vi": "Cái hộp" },
      { "jp": "ふね", "romaji": "fune", "vi": "Tàu thủy" },
      { "jp": "ほし", "romaji": "hoshi", "vi": "Ngôi sao" },
      { "jp": "ひと", "romaji": "hito", "vi": "Người" },
      { "jp": "へそ", "romaji": "heso", "vi": "Rốn" },
      { "jp": "ほね", "romaji": "hone", "vi": "Xương" },
      { "jp": "ふく", "romaji": "fuku", "vi": "Quần áo" },
      { "jp": "ひなた", "romaji": "hinata", "vi": "Chỗ có nắng" },
      { "jp": "あした", "romaji": "ashita", "vi": "Ngày mai" },
      { "jp": "きせつ", "romaji": "kisetsu", "vi": "Mùa" },
      { "jp": "おととい", "romaji": "ototoi", "vi": "Ngày hôm kia" },
      { "jp": "くに", "romaji": "kuni", "vi": "Đất nước" },
      { "jp": "はた", "romaji": "hata", "vi": "Lá cờ" }
    ]
  },
  {
    "words": [
      { "jp": "うま", "romaji": "uma", "vi": "Con ngựa" },
      { "jp": "むし", "romaji": "mushi", "vi": "Côn trùng" },
      { "jp": "かめ", "romaji": "kame", "vi": "Con rùa" },
      { "jp": "こま", "romaji": "koma", "vi": "Con quay" },
      { "jp": "みみ", "romaji": "mimi", "vi": "Cái tai" },
      { "jp": "あめ", "romaji": "ame", "vi": "Mưa" },
      { "jp": "くも", "romaji": "kumo", "vi": "Đám mây" },
      { "jp": "にもつ", "romaji": "nimotsu", "vi": "Hành lý" },
      { "jp": "はさみ", "romaji": "hasami", "vi": "Cái kéo" },
      { "jp": "むすめ", "romaji": "musume", "vi": "Con gái" },
      { "jp": "やま", "romaji": "yama", "vi": "Núi" },
      { "jp": "よむ", "romaji": "yomu", "vi": "Đọc" },
      { "jp": "ゆめ", "romaji": "yume", "vi": "Giấc mơ" },
      { "jp": "やね", "romaji": "yane", "vi": "Mái nhà" },
      { "jp": "ゆき", "romaji": "yuki", "vi": "Tuyết" },
      { "jp": "ふゆ", "romaji": "fuyu", "vi": "Mùa đông" },
      { "jp": "おゆ", "romaji": "oyu", "vi": "Nước nóng" },
      { "jp": "よこ", "romaji": "yoko", "vi": "Bên cạnh" },
      { "jp": "やすむ", "romaji": "yasumu", "vi": "Nghỉ ngơi" },
      { "jp": "ゆかた", "romaji": "yukata", "vi": "Áo yukata" },
      { "jp": "さる", "romaji": "saru", "vi": "Con khỉ" },
      { "jp": "くり", "romaji": "kuri", "vi": "Hạt dẻ" },
      { "jp": "はれ", "romaji": "hare", "vi": "Trời nắng, quang đãng" },
      { "jp": "そら", "romaji": "sora", "vi": "Bầu trời" },
      { "jp": "みる", "romaji": "miru", "vi": "Nhìn, xem" },
      { "jp": "これ", "romaji": "kore", "vi": "Cái này" },
      { "jp": "しろ", "romaji": "shiro", "vi": "Màu trắng" },
      { "jp": "りか", "romaji": "rika", "vi": "Khoa học" },
      { "jp": "さくら", "romaji": "sakura", "vi": "Hoa anh đào" },
      { "jp": "ふくろ", "romaji": "fukuro", "vi": "Cái túi" },
      { "jp": "かわ", "romaji": "kawa", "vi": "Sông" },
      { "jp": "わに", "romaji": "wani", "vi": "Cá sấu" },
      { "jp": "わたし", "romaji": "watashi", "vi": "Tôi" },
      { "jp": "わらう", "romaji": "warau", "vi": "Cười" },
      { "jp": "わすれる", "romaji": "wasureru", "vi": "Quên" },
      { "jp": "あたま", "romaji": "atama", "vi": "Cái đầu" },
      { "jp": "うみ", "romaji": "umi", "vi": "Biển" },
      { "jp": "かいもの", "romaji": "kaimono", "vi": "Mua sắm" },
      { "jp": "まくら", "romaji": "makura", "vi": "Cái gối" },
      { "jp": "おつり", "romaji": "otsuri", "vi": "Tiền thối" },
      { "jp": "こころ", "romaji": "kokoro", "vi": "Trái tim" },
      { "jp": "にわ", "romaji": "niwa", "vi": "Vườn" },
      { "jp": "らいねん", "romaji": "rainen", "vi": "Năm sau" },
      { "jp": "ほんや", "romaji": "honya", "vi": "Hiệu sách" }
    ]
  }
];

async function seedHiragana() {
  try {
    // 1. Merge & deduplicate words
    const allWords = [];
    const seenJp = new Set();

    for (const block of rawBlocks) {
      for (const w of block.words) {
        if (w.jp && !seenJp.has(w.jp)) {
          seenJp.add(w.jp);
          allWords.push({
            id: String(Date.now() + Math.random()),
            jp: w.jp,
            romaji: w.romaji,
            vi: w.vi,
            folder: 'Hiragana'
          });
        }
      }
    }

    console.log(`Đã gộp thành công ${allWords.length} từ Hiragana.`);

    // 2. Create/get "Hiragana" folder in Supabase
    const { data: existingFolder } = await supabase.from('folders').select('id, name').eq('name', 'Hiragana').maybeSingle();
    let folderId = existingFolder?.id;

    if (!folderId) {
      const { data: newFolder, error: fErr } = await supabase.from('folders').insert([{ name: 'Hiragana' }]).select().single();
      if (fErr) {
        console.error('Lỗi tạo folder Hiragana:', fErr.message);
        return;
      }
      folderId = newFolder.id;
    }

    console.log('✓ ID thư mục Hiragana trong Supabase:', folderId);

    // 3. Save to local JSON file src/data/n5_vocab.json
    const existingLocal = JSON.parse(fs.readFileSync('src/data/n5_vocab.json', 'utf-8'));
    const currentWords = existingLocal.words || [];

    // Filter out old hiragana words if any, append new ones
    const updatedLocalWords = [
      ...currentWords.filter(w => w.folder !== 'Hiragana'),
      ...allWords
    ];

    fs.writeFileSync('src/data/n5_vocab.json', JSON.stringify({ words: updatedLocalWords }, null, 2));
    console.log('✓ Đã cập nhật file src/data/n5_vocab.json');

    // 4. Upload to Supabase
    const wordsToInsert = allWords.map(w => ({
      jp: w.jp,
      romaji: w.romaji,
      vi: w.vi,
      folder_id: folderId
    }));

    const BATCH_SIZE = 50;
    for (let i = 0; i < wordsToInsert.length; i += BATCH_SIZE) {
      const batch = wordsToInsert.slice(i, i + BATCH_SIZE);
      const { error: insErr } = await supabase.from('words').insert(batch);
      if (insErr) {
        console.error(`Lỗi insert batch ${i}:`, insErr.message);
      }
    }

    console.log(`===> HOÀN THÀNH: Đã thêm ${allWords.length} từ Hiragana vào thư mục "Hiragana" trên Supabase!`);
  } catch (err) {
    console.error('Lỗi nạp từ Hiragana:', err);
  }
}

seedHiragana();
