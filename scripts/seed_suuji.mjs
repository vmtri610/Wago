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

const onesJp = ["", "いち", "に", "さん", "よん", "ご", "ろく", "なな", "はち", "きゅう"];
const onesRoma = ["", "ichi", "ni", "san", "yon", "go", "roku", "nana", "hachi", "kyuu"];

function getNumberData(n) {
  if (n === 100) return { jp: "ひゃく", romaji: "hyaku", vi: "Số 100" };
  if (n <= 9) return { jp: onesJp[n], romaji: onesRoma[n], vi: `Số ${n}` };
  if (n === 10) return { jp: "じゅう", romaji: "juu", vi: "Số 10" };

  const tens = Math.floor(n / 10);
  const ones = n % 10;

  let tensJp = tens === 1 ? "じゅう" : onesJp[tens] + "じゅう";
  let tensRoma = tens === 1 ? "juu" : onesRoma[tens] + "juu";

  let jp = tensJp + onesJp[ones];
  let romaji = tensRoma + onesRoma[ones];
  return { jp, romaji, vi: `Số ${n}` };
}

async function seedSuuji() {
  try {
    const FOLDER_NAME = 'Sūji';
    const numbersList = [];

    for (let i = 1; i <= 100; i++) {
      const data = getNumberData(i);
      numbersList.push({
        id: String(Date.now() + Math.random()),
        jp: data.jp,
        romaji: data.romaji,
        vi: data.vi,
        folder: FOLDER_NAME
      });
    }

    console.log(`Đã tạo thành công danh sách ${numbersList.length} số đếm từ 1 đến 100.`);

    // 1. Create or get "Sūji" folder in Supabase
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
      ...numbersList
    ];

    fs.writeFileSync('src/data/n5_vocab.json', JSON.stringify({ words: updatedLocalWords }, null, 2));
    console.log('✓ Đã cập nhật file src/data/n5_vocab.json');

    // 3. Upload to Supabase in batches
    const wordsToInsert = numbersList.map(w => ({
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

    console.log(`===> HOÀN THÀNH: Đã thêm ${numbersList.length} số đếm (1-100) vào thư mục "${FOLDER_NAME}" trên Supabase!`);
  } catch (err) {
    console.error('Lỗi nạp từ Sūji:', err);
  }
}

seedSuuji();
