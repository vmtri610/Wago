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
const serviceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceKey) {
  console.error('Thiếu SUPABASE_SERVICE_ROLE_KEY trong .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const TARGET_FOLDER_NAME = 'Từ vựng giao tiếp';

async function resetToGiaoTiep() {
  try {
    console.log('--- 1. Đảm bảo folder "Từ vựng giao tiếp" trong Supabase ---');
    let { data: giaoTiepFolder } = await supabase
      .from('folders')
      .select('id, name')
      .or(`name.eq."N5 - Giao tiếp",name.eq."Từ vựng giao tiếp"`)
      .maybeSingle();

    if (!giaoTiepFolder) {
      const { data: newF, error: fErr } = await supabase
        .from('folders')
        .insert([{ name: TARGET_FOLDER_NAME }])
        .select()
        .single();
      if (fErr) throw new Error(`Lỗi tạo folder "${TARGET_FOLDER_NAME}": ${fErr.message}`);
      giaoTiepFolder = newF;
    } else if (giaoTiepFolder.name !== TARGET_FOLDER_NAME) {
      await supabase.from('folders').update({ name: TARGET_FOLDER_NAME }).eq('id', giaoTiepFolder.id);
      giaoTiepFolder.name = TARGET_FOLDER_NAME;
    }

    console.log(`✓ Folder Giao Tiếp ID: "${giaoTiepFolder.id}" (${giaoTiepFolder.name})`);

    console.log('--- 2. Xóa tất cả các folder khác khỏi Supabase ---');
    const { data: otherFolders } = await supabase
      .from('folders')
      .select('id, name')
      .neq('id', giaoTiepFolder.id);

    const otherFolderIds = (otherFolders || []).map(f => f.id);
    if (otherFolderIds.length > 0) {
      // Delete words in other folders first
      await supabase.from('words').delete().in('folder_id', otherFolderIds);
      // Delete other folders
      await supabase.from('folders').delete().in('id', otherFolderIds);
      console.log(`✓ Đã xóa ${otherFolderIds.length} folder khác cùng toàn bộ từ vựng thuộc về chúng.`);
    }

    // Delete any orphan words not in Giao tiếp folder
    await supabase.from('words').delete().neq('folder_id', giaoTiepFolder.id);

    // Get count of remaining words
    const { count: remainingCount } = await supabase
      .from('words')
      .select('*', { count: 'exact', head: true })
      .eq('folder_id', giaoTiepFolder.id);

    console.log(`✓ Số lượng từ vựng giao tiếp còn lại trong Supabase DB: ${remainingCount}`);

    console.log('--- 3. Cập nhật dữ liệu local file src/data/n5_vocab.json ---');
    const localPath = 'src/data/n5_vocab.json';
    const { data: dbWords } = await supabase
      .from('words')
      .select('*')
      .eq('folder_id', giaoTiepFolder.id);

    const cleanLocalWords = (dbWords || []).map(w => ({
      id: w.id,
      jp: w.jp,
      romaji: w.romaji,
      vi: w.vi,
      folder: TARGET_FOLDER_NAME,
      folder_id: giaoTiepFolder.id
    }));

    fs.writeFileSync(localPath, JSON.stringify({ words: cleanLocalWords }, null, 2));
    console.log(`✓ Đã cập nhật file local ${localPath} với ${cleanLocalWords.length} từ giao tiếp.`);

    console.log('\n====> HOÀN THÀNH RESET DỮ LIỆU CHỈ GIỮ LẠI TỪ VỰNG GIAO TIẾP! <====');

  } catch (err) {
    console.error('❌ Lỗi khi reset dữ liệu:', err.message || err);
  }
}

resetToGiaoTiep();
