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

const isYoon = (str) => /[ゃゅょャュョ]/.test(str);
const isDakuon = (str) => /[がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ]/.test(str);

async function splitFolders() {
  try {
    const rawData = JSON.parse(fs.readFileSync('src/data/n5_vocab.json', 'utf-8'));
    const words = rawData.words || [];

    const updatedWords = words.map(w => {
      let folderName = 'Chữ gốc';
      if (isYoon(w.jp)) {
        folderName = 'Âm ghép';
      } else if (isDakuon(w.jp)) {
        folderName = 'Âm đục';
      }
      return { ...w, folder: folderName };
    });

    // Save updated local n5_vocab.json
    fs.writeFileSync('src/data/n5_vocab.json', JSON.stringify({ words: updatedWords }, null, 2));
    console.log('✓ Đã cập nhật file local src/data/n5_vocab.json');

    // 1. Ensure Folders in Supabase
    const folderNames = ['Chữ gốc', 'Âm đục', 'Âm ghép'];
    const folderMap = new Map();

    for (const name of folderNames) {
      let { data: folder } = await supabase.from('folders').select('id, name').eq('name', name).maybeSingle();
      if (!folder) {
        const { data: newFolder, error } = await supabase.from('folders').insert([{ name }]).select().single();
        if (error) {
          console.error(`Lỗi tạo folder "${name}":`, error.message);
        } else {
          folder = newFolder;
        }
      }
      if (folder) {
        folderMap.set(name, folder.id);
      }
    }

    console.log('✓ Thư mục trong Supabase:', Array.from(folderMap.entries()));

    // Delete old N5 folder if exists
    await supabase.from('folders').delete().eq('name', 'N5');

    // Update words folder_id in Supabase concurrently
    const promises = updatedWords.map(w => {
      const targetFolderId = folderMap.get(w.folder);
      if (targetFolderId) {
        return supabase.from('words').update({ folder_id: targetFolderId }).eq('jp', w.jp);
      }
      return Promise.resolve();
    });

    await Promise.all(promises);
    console.log(`===> HOÀN THÀNH: Đã phân loại toàn bộ ${updatedWords.length} từ vựng vào 3 thư mục "Chữ gốc", "Âm đục" và "Âm ghép"!`);

  } catch (err) {
    console.error('Lỗi khi phân loại thư mục:', err);
  }
}

splitFolders();
