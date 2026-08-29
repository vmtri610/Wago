import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const USER_ID = '8dca5ab9-4972-4458-8664-cfc134c4f7c3';
const FOLDER_NAME = 'N5 - Giao tiếp';

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
  { "jp": "はじめまして", "romaji": "hajimemashite", "vi": "Chào bạn (lần đầu gặp)", "folder": FOLDER_NAME },
  { "jp": "おはようございます", "romaji": "ohayou gozaimasu", "vi": "Chào buổi sáng", "folder": FOLDER_NAME },
  { "jp": "こんにちは", "romaji": "konnichiwa", "vi": "Chào buổi trưa/chiều", "folder": FOLDER_NAME },
  { "jp": "こんばんは", "romaji": "konbanwa", "vi": "Chào buổi tối", "folder": FOLDER_NAME },
  { "jp": "すみません", "romaji": "sumimasen", "vi": "Xin lỗi", "folder": FOLDER_NAME },
  { "jp": "おねがいします", "romaji": "onegaishimasu", "vi": "Làm ơn, xin vui lòng", "folder": FOLDER_NAME },
  { "jp": "わかりますか", "romaji": "wakarimasu ka", "vi": "Bạn có hiểu không?", "folder": FOLDER_NAME },
  { "jp": "わかります", "romaji": "wakarimasu", "vi": "Tôi hiểu", "folder": FOLDER_NAME },
  { "jp": "わかりません", "romaji": "wakarimasen", "vi": "Tôi không hiểu", "folder": FOLDER_NAME },
  { "jp": "はい", "romaji": "hai", "vi": "Vâng, dạ", "folder": FOLDER_NAME },
  { "jp": "いいえ", "romaji": "iie", "vi": "Không", "folder": FOLDER_NAME },
  { "jp": "さようなら", "romaji": "sayounara", "vi": "Tạm biệt", "folder": FOLDER_NAME },
  { "jp": "ありがとうございます", "romaji": "arigatou gozaimasu", "vi": "Cảm ơn", "folder": FOLDER_NAME }
];

async function appendGiaoTiep() {
  try {
    console.log(`Bắt đầu xử lý cho Thư mục: "${FOLDER_NAME}" và User ID: "${USER_ID}"...`);

    // 1. Kiểm tra / Tạo folder trong Supabase
    let { data: existingFolder, error: fQueryErr } = await supabase
      .from('folders')
      .select('id, name, user_id')
      .eq('name', FOLDER_NAME)
      .or(`user_id.eq.${USER_ID},user_id.is.null`)
      .maybeSingle();

    if (fQueryErr) {
      console.warn('Lỗi query folder:', fQueryErr.message);
    }

    let folderId = existingFolder?.id;

    if (!folderId) {
      const { data: newFolder, error: fErr } = await supabase
        .from('folders')
        .insert([{ name: FOLDER_NAME, user_id: USER_ID }])
        .select()
        .single();

      if (fErr) {
        console.error(`Lỗi tạo folder "${FOLDER_NAME}":`, fErr.message);
        // Thử tìm bất kỳ folder trùng tên nào
        const { data: fallbackFolder } = await supabase
          .from('folders')
          .select('id')
          .eq('name', FOLDER_NAME)
          .limit(1)
          .maybeSingle();
        folderId = fallbackFolder?.id;
      } else {
        folderId = newFolder.id;
      }
    }

    console.log(`✓ Folder ID "${FOLDER_NAME}":`, folderId || 'Chưa có trên DB (sẽ chỉ lưu local JSON nếu lỗi DB)');

    // 2. Đọc file src/data/n5_vocab.json và cập nhật local nếu còn thiếu từ
    const localPath = 'src/data/n5_vocab.json';
    const localData = JSON.parse(fs.readFileSync(localPath, 'utf-8'));
    const currentWords = localData.words || [];
    const existingJpSet = new Set(currentWords.map(w => w.jp));

    let addedLocalCount = 0;
    for (const w of newWordsRaw) {
      if (!existingJpSet.has(w.jp)) {
        currentWords.push({
          id: String(Date.now() + Math.random()),
          jp: w.jp,
          romaji: w.romaji,
          vi: w.vi,
          folder: FOLDER_NAME
        });
        existingJpSet.add(w.jp);
        addedLocalCount++;
      }
    }

    if (addedLocalCount > 0) {
      fs.writeFileSync(localPath, JSON.stringify({ words: currentWords }, null, 2));
      console.log(`✓ Đã bổ sung ${addedLocalCount} từ mới vào file local ${localPath}`);
    } else {
      console.log(`✓ File local ${localPath} đã có đủ các từ vựng Giao tiếp.`);
    }

    // 3. Insert các từ vựng vào Supabase
    if (folderId) {
      // Kiểm tra các từ đã có trong bảng words của folder này
      const { data: existingDbWords } = await supabase
        .from('words')
        .select('jp')
        .eq('folder_id', folderId);

      const existingDbJpSet = new Set((existingDbWords || []).map(w => w.jp));

      const wordsToInsert = newWordsRaw
        .filter(w => !existingDbJpSet.has(w.jp))
        .map(w => ({
          jp: w.jp,
          romaji: w.romaji,
          vi: w.vi,
          folder_id: folderId,
          user_id: USER_ID
        }));

      if (wordsToInsert.length === 0) {
        console.log('✓ Tất cả từ vựng Giao tiếp đã tồn tại trên Supabase.');
      } else {
        const { data: insertedWords, error: insErr } = await supabase
          .from('words')
          .insert(wordsToInsert)
          .select();

        if (insErr) {
          console.error('Lỗi insert vào Supabase:', insErr.message);
        } else {
          console.log(`===> HOÀN THÀNH: Đã thêm thành công ${insertedWords?.length || wordsToInsert.length} từ vựng Giao tiếp vào Supabase cho user ${USER_ID}!`);
        }
      }
    }

  } catch (err) {
    console.error('Lỗi thực thi script:', err);
  }
}

appendGiaoTiep();
