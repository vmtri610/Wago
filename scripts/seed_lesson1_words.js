const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ymedoqaxvomzxndtwhbt.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltZWRvcWF4dm9tenhuZHR3aGJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzA2MTU3NSwiZXhwIjoyMTAyNjM3NTc1fQ.XoRqaTKl1YxwJ7ZmiKfHqDzXYsnEEmlcmMpzjZoFy3c';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const words = [
  // 1. Đại từ nhân xưng & Danh xưng
  { jp: 'わたし', romaji: 'watashi', vi: 'Tôi (ngôi thứ nhất)' },
  { jp: 'あなた', romaji: 'anata', vi: 'Bạn, anh, chị (ngôi thứ hai)' },
  { jp: 'あのひと', romaji: 'ano hito', vi: 'Người đó, anh kia, chị kia' },
  { jp: 'あのかた', romaji: 'ano kata', vi: 'Vị kia (cách nói lịch sự của あのひと)' },
  { jp: 'かれ', romaji: 'kare', vi: 'Anh ấy' },
  { jp: 'かのじょ', romaji: 'kanojo', vi: 'Cô ấy' },
  { jp: 'なまえ', romaji: 'namae', vi: 'Tên' },
  { jp: '～さん', romaji: '~san', vi: 'Hậu tố thêm sau tên người (lịch sự)' },
  { jp: '～ちゃん', romaji: '~chan', vi: 'Hậu tố thêm sau tên trẻ em (thân mật)' },
  { jp: 'だれ', romaji: 'dare', vi: 'Ai đó?' },
  { jp: 'どなた', romaji: 'donata', vi: 'Vị nào? (cách nói lịch sự của だれ)' },

  // 2. Nghề nghiệp & Cơ quan, Trường học
  { jp: 'しごと', romaji: 'shigoto', vi: 'Công việc' },
  { jp: 'きょうし', romaji: 'kyoushi', vi: 'Giáo viên (nghề nghiệp)' },
  { jp: 'せんせい', romaji: 'sensei', vi: 'Giáo viên, bác sĩ (xưng hô thể hiện sự tôn trọng)' },
  { jp: 'かいしゃいん', romaji: 'kaishain', vi: 'Nhân viên công ty' },
  { jp: 'ぎんこういん', romaji: 'ginkouin', vi: 'Nhân viên ngân hàng' },
  { jp: 'がくせい', romaji: 'gakusei', vi: 'Học sinh, sinh viên' },
  { jp: 'しゅっしん', romaji: 'shusshin', vi: 'Xuất thân, quê quán' },
  { jp: 'いしゃ', romaji: 'isha', vi: 'Bác sĩ' },
  { jp: 'エンジニア', romaji: 'enjinia', vi: 'Kỹ sư' },
  { jp: 'ナース', romaji: 'naasu', vi: 'Y tá' },
  { jp: 'かしゅ', romaji: 'kashu', vi: 'Ca sĩ' },
  { jp: 'はいゆう', romaji: 'haiyuu', vi: 'Diễn viên' },
  { jp: 'エディター', romaji: 'editaa', vi: 'Biên tập viên, người chỉnh sửa' },
  { jp: 'かいしゃ', romaji: 'kaisha', vi: 'Công ty' },
  { jp: 'だいがく', romaji: 'daigaku', vi: 'Đại học' },
  { jp: 'ぎんこう', romaji: 'ginkou', vi: 'Ngân hàng' },

  // 3. Quốc gia, Người nước, Ngôn ngữ (Từ ảnh bổ sung - toàn bộ Hiragana/Katakana)
  { jp: 'ベトナム', romaji: 'betonamu', vi: 'Việt Nam' },
  { jp: 'ベトナムじん', romaji: 'betonamujin', vi: 'Người Việt' },
  { jp: 'ベトナムご', romaji: 'betonamugo', vi: 'Tiếng Việt' },
  { jp: 'イギリス', romaji: 'igirisu', vi: 'Anh' },
  { jp: 'イギリスじん', romaji: 'igirisujin', vi: 'Người Anh' },
  { jp: 'えいご', romaji: 'eigo', vi: 'Tiếng Anh' },
  { jp: 'ちゅうごく', romaji: 'chuugoku', vi: 'Trung Quốc' },
  { jp: 'ちゅうごくじん', romaji: 'chuugokujin', vi: 'Người Trung' },
  { jp: 'ちゅうごくご', romaji: 'chuugokugo', vi: 'Tiếng Trung' },
  { jp: 'アメリカ', romaji: 'amerika', vi: 'Mỹ' },
  { jp: 'アメリカじん', romaji: 'amerikajin', vi: 'Người Mỹ' },
  { jp: 'かんこく', romaji: 'kankoku', vi: 'Hàn Quốc' },
  { jp: 'かんこくじん', romaji: 'kankokujin', vi: 'Người Hàn' },
  { jp: 'かんこくご', romaji: 'kankokugo', vi: 'Tiếng Hàn' },
  { jp: 'にほん', romaji: 'nihon', vi: 'Nhật Bản' },
  { jp: 'にほんじん', romaji: 'nihonjin', vi: 'Người Nhật' },
  { jp: 'にほんご', romaji: 'nihongo', vi: 'Tiếng Nhật' },
  { jp: 'ドイツ', romaji: 'doitsu', vi: 'Đức' },
  { jp: 'ドイツじん', romaji: 'doitsujin', vi: 'Người Đức' },
  { jp: 'ドイツご', romaji: 'doitsugo', vi: 'Tiếng Đức' }
];

async function run() {
  console.log('--- 1. Xóa bài Số Đếm (lesson_id = 2) ---');
  // Cascade delete handles words, grammar, expansions, user_lesson_progress
  const { error: delL2Err } = await supabase.from('lessons').delete().eq('id', 2);
  if (delL2Err) {
    console.error('Lỗi khi xóa bài 2 từ bảng lessons:', delL2Err);
  } else {
    console.log('Đã xóa thành công bài Số Đếm (id: 2) khỏi bảng lessons');
  }

  // Double check deletion of any leftover words with lesson_id = 2
  await supabase.from('words').delete().eq('lesson_id', 2);
  await supabase.from('lesson_grammar').delete().eq('lesson_id', 2);
  await supabase.from('lesson_expansions').delete().eq('lesson_id', 2);
  await supabase.from('user_lesson_progress').delete().eq('lesson_id', 2);

  console.log('--- 2. Cập nhật từ vựng Bài 1 (toàn bộ Hiragana/Katakana) ---');
  await supabase.from('words').delete().eq('lesson_id', 1);

  const rows = words.map((w, idx) => ({
    lesson_id: 1,
    jp: w.jp,
    romaji: w.romaji,
    vi: w.vi,
    order_index: idx + 1
  }));

  const { data, error } = await supabase.from('words').insert(rows).select();
  if (error) {
    console.error('Insert error for Lesson 1:', error);
  } else {
    console.log(`Đã nạp thành công ${data?.length} từ vựng kana cho Bài 1!`);
  }
}

run();
