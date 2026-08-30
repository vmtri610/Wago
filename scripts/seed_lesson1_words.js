const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ymedoqaxvomzxndtwhbt.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltZWRvcWF4dm9tenhuZHR3aGJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzA2MTU3NSwiZXhwIjoyMTAyNjM3NTc1fQ.XoRqaTKl1YxwJ7ZmiKfHqDzXYsnEEmlcmMpzjZoFy3c';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const words = [
  { jp: 'わたし', romaji: 'watashi', vi: 'Tôi (ngôi thứ nhất)' },
  { jp: 'あなた', romaji: 'anata', vi: 'Bạn, anh, chị (ngôi thứ hai)' },
  { jp: 'あのひと', romaji: 'ano hito', vi: 'Người đó, anh kia, chị kia' },
  { jp: 'あのかた', romaji: 'ano kata', vi: 'Cách nói lịch sự của あの人' },
  { jp: 'かれ', romaji: 'kare', vi: 'Anh ấy' },
  { jp: 'かのじょ', romaji: 'kanojo', vi: 'Cô ấy' },
  { jp: 'なまえ', romaji: 'namae', vi: 'Tên' },
  { jp: '～さん', romaji: '~san', vi: 'Hậu tố thêm sau tên người (lịch sự)' },
  { jp: '～ちゃん', romaji: '~chan', vi: 'Hậu tố thêm sau tên trẻ em (thân mật)' },
  { jp: 'だれ', romaji: 'dare', vi: 'Ai đó?' },
  { jp: 'どなた', romaji: 'donata', vi: 'Cách nói lịch sự của だれ' },
  { jp: 'しごと', romaji: 'shigoto', vi: 'Công việc' },
  { jp: 'きょうし', romaji: 'kyoushi', vi: 'Giáo viên (nghề nghiệp)' },
  { jp: 'せんせい', romaji: 'sensei', vi: 'Giáo viên, bác sĩ (xưng hô thể hiện sự tôn trọng)' },
  { jp: 'かいしゃいん', romaji: 'kaishain', vi: 'Nhân viên công ty' },
  { jp: 'ぎんこういん', romaji: 'ginkouin', vi: 'Nhân viên ngân hàng' },
  { jp: 'がくせい', romaji: 'gakusei', vi: 'Học sinh' },
  { jp: 'しゅっしん', romaji: 'shusshin', vi: 'Xuất thân, quê quán' },
  { jp: 'いしゃ', romaji: 'isha', vi: 'Bác sĩ' },
  { jp: 'エンジニア', romaji: 'enjinia', vi: 'Kỹ sư' },
  { jp: 'ナース', romaji: 'naasu', vi: 'Y tá' },
  { jp: 'かしゅ', romaji: 'kashu', vi: 'Ca sĩ' },
  { jp: 'はいゆう', romaji: 'haiyuu', vi: 'Diễn viên' },
  { jp: 'エディター', romaji: 'editaa', vi: 'Biên tập viên, người chỉnh sửa' }
];

async function run() {
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
    console.error('Insert error:', error);
  } else {
    console.log('Successfully inserted', data?.length, 'words for lesson 1');
  }
}

run();
