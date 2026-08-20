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

// Block 1: Âm ghép (Yōon)
const block1Words = [
  { "jp": "けっか", "romaji": "kekka", "vi": "Kết quả" },
  { "jp": "はつおん", "romaji": "hatsuon", "vi": "Phát âm" },
  { "jp": "あつい", "romaji": "atsui", "vi": "Nóng" },
  { "jp": "ろくさつ", "romaji": "rokusatsu", "vi": "Sáu quyển (sách)" },
  { "jp": "ろくせんえん", "romaji": "rokusen en", "vi": "Sáu nghìn yên" },
  { "jp": "ろくおん", "romaji": "rokuon", "vi": "Ghi âm" },
  { "jp": "さとう", "romaji": "satou", "vi": "Đường (gia vị)" },
  { "jp": "うんどう", "romaji": "undou", "vi": "Vận động" },
  { "jp": "ばんごう", "romaji": "bangou", "vi": "Số, con số" },
  { "jp": "ぼうえき", "romaji": "boueki", "vi": "Thương mại" }
];

// Block 2: Âm ghép + Trường âm (Yōon & Chōon)
const block2Words = [
  { "jp": "せきどう", "romaji": "sekidou", "vi": "Xích đạo" },
  { "jp": "ようちえん", "romaji": "youchien", "vi": "Nhà trẻ, mẫu giáo" },
  { "jp": "てんきよほう", "romaji": "tenkiyohou", "vi": "Dự báo thời tiết" },
  { "jp": "けいさつ", "romaji": "keisatsu", "vi": "Cảnh sát" },
  { "jp": "ぎゅうにく", "romaji": "gyuuniku", "vi": "Thịt bò" },
  { "jp": "げっきゅう", "romaji": "gekkyuu", "vi": "Lương tháng" },
  { "jp": "きゅうこう", "romaji": "kyuukou", "vi": "Cấp tốc, tốc hành" },
  { "jp": "きんぎょ", "romaji": "kingyo", "vi": "Cá vàng" },
  { "jp": "じどうしゃ", "romaji": "jidousha", "vi": "Xe ô tô" },
  { "jp": "きょうしつ", "romaji": "kyoushitsu", "vi": "Lớp học, phòng học" },
  { "jp": "しょうぼうしゃ", "romaji": "shoubousha", "vi": "Xe cứu hỏa" }
];

async function appendTwoFolders() {
  try {
    const FOLDER_YOON = 'Yōon';
    const FOLDER_YOON_CHOON = 'Yōon & Chōon';

    // 1. Get folder IDs
    let { data: folderYoon } = await supabase.from('folders').select('id, name').eq('name', FOLDER_YOON).maybeSingle();
    let { data: folderYoonChoon } = await supabase.from('folders').select('id, name').eq('name', FOLDER_YOON_CHOON).maybeSingle();

    if (!folderYoon) {
      const { data: newF } = await supabase.from('folders').insert([{ name: FOLDER_YOON }]).select().single();
      folderYoon = newF;
    }
    if (!folderYoonChoon) {
      const { data: newF } = await supabase.from('folders').insert([{ name: FOLDER_YOON_CHOON }]).select().single();
      folderYoonChoon = newF;
    }

    const localData = JSON.parse(fs.readFileSync('src/data/n5_vocab.json', 'utf-8'));
    let currentWords = localData.words || [];
    const existingJpSet = new Set(currentWords.map(w => w.jp));

    // Process Block 1 -> Yōon
    const b1ToAdd = [];
    for (const w of block1Words) {
      if (!existingJpSet.has(w.jp)) {
        b1ToAdd.push({
          id: String(Date.now() + Math.random()),
          jp: w.jp,
          romaji: w.romaji,
          vi: w.vi,
          folder: FOLDER_YOON
        });
        existingJpSet.add(w.jp);
      }
    }

    // Process Block 2 -> Yōon & Chōon
    const b2ToAdd = [];
    for (const w of block2Words) {
      if (!existingJpSet.has(w.jp)) {
        b2ToAdd.push({
          id: String(Date.now() + Math.random()),
          jp: w.jp,
          romaji: w.romaji,
          vi: w.vi,
          folder: FOLDER_YOON_CHOON
        });
        existingJpSet.add(w.jp);
      }
    }

    // Update local JSON file
    currentWords = [...currentWords, ...b1ToAdd, ...b2ToAdd];
    fs.writeFileSync('src/data/n5_vocab.json', JSON.stringify({ words: currentWords }, null, 2));
    console.log(`✓ Đã thêm ${b1ToAdd.length} từ vào Yōon và ${b2ToAdd.length} từ vào Yōon & Chōon trong local JSON.`);

    // Insert to Supabase
    if (b1ToAdd.length > 0) {
      await supabase.from('words').insert(b1ToAdd.map(w => ({
        jp: w.jp, romaji: w.romaji, vi: w.vi, folder_id: folderYoon.id
      })));
    }

    if (b2ToAdd.length > 0) {
      await supabase.from('words').insert(b2ToAdd.map(w => ({
        jp: w.jp, romaji: w.romaji, vi: w.vi, folder_id: folderYoonChoon.id
      })));
    }

    console.log('===> HOÀN THÀNH: Đã thêm từ vựng thành công vào 2 thư mục!');
  } catch (err) {
    console.error('Lỗi thêm từ vựng:', err);
  }
}

appendTwoFolders();
