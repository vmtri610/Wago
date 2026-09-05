import { GrammarQuizQuestion } from '@/types/grammarQuiz';

// Helper shuffle function
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const PERSON_NAMES = [
  'わたし', 'あなた', 'あのひと', 'あのかた', 'かれ', 'かのじょ',
  'さとうさん', 'ハンさん', 'スミスさん', 'ワンさん', 'キムさん',
  'たなかさん', 'やまださん', 'ミラーさん', 'コナンくん'
];

const JOBS = [
  { jp: 'かいしゃいん', vi: 'nhân viên công ty' },
  { jp: 'ぎんこういん', vi: 'nhân viên ngân hàng' },
  { jp: 'きょうし', vi: 'giáo viên' },
  { jp: 'せんせい', vi: 'giáo viên/bác sĩ' },
  { jp: 'がくせい', vi: 'học sinh, sinh viên' },
  { jp: 'いしゃ', vi: 'bác sĩ' },
  { jp: 'エンジニア', vi: 'kỹ sư' },
  { jp: 'ナース', vi: 'y tá' },
  { jp: 'かしゅ', vi: 'ca sĩ' },
  { jp: 'はいゆう', vi: 'diễn viên' },
  { jp: 'エディター', vi: 'biên tập viên' }
];

const COUNTRIES = [
  { jp: 'ベトナム', person: 'ベトナムじん', lang: 'ベトナムご', vi: 'Việt Nam' },
  { jp: 'にほん', person: 'にほんじん', lang: 'にほんご', vi: 'Nhật Bản' },
  { jp: 'アメリカ', person: 'アメリカじん', lang: 'えいご', vi: 'Mỹ' },
  { jp: 'イギリス', person: 'イギリスじん', lang: 'えいご', vi: 'Anh' },
  { jp: 'ちゅうごく', person: 'ちゅうごくじん', lang: 'ちゅうごくご', vi: 'Trung Quốc' },
  { jp: 'かんこく', person: 'かんこくじん', lang: 'かんこくご', vi: 'Hàn Quốc' },
  { jp: 'ドイツ', person: 'ドイツじん', lang: 'ドイツご', vi: 'Đức' }
];

const ORGS = [
  { jp: 'かいしゃ', vi: 'công ty' },
  { jp: 'だいがく', vi: 'trường đại học' },
  { jp: 'ぎんこう', vi: 'ngân hàng' },
  { jp: 'Aクラス', vi: 'lớp A' },
  { jp: 'Bクラス', vi: 'lớp B' }
];

const ITEMS = [
  { jp: 'かさ', vi: 'cái ô' },
  { jp: 'かばん', vi: 'cái cặp/túi xách' },
  { jp: 'ノート', vi: 'quyển vở' },
  { jp: 'ほん', vi: 'quyển sách' },
  { jp: 'てちょう', vi: 'cuốn sổ tay' },
  { jp: 'えんぴつ', vi: 'cây bút chì' },
  { jp: 'ボールペン', vi: 'cây bút bi' },
  { jp: 'シャープペン', vi: 'cây bút chì kim' },
  { jp: 'カード', vi: 'thẻ' },
  { jp: 'めいし', vi: 'danh thiếp' },
  { jp: 'けいたいでんわ', vi: 'điện thoại di động' },
  { jp: 'じしょ', vi: 'quyển từ điển' },
  { jp: 'ざっし', vi: 'cuốn tạp chí' },
  { jp: 'しんぶん', vi: 'tờ báo' },
  { jp: 'つくえ', vi: 'cái bàn' },
  { jp: 'いす', vi: 'cái ghế' },
  { jp: 'テレビ', vi: 'cái ti vi' },
  { jp: 'コンピューター', vi: 'máy tính' },
  { jp: 'パソコン', vi: 'laptop' },
  { jp: 'ふでばこ', vi: 'hộp bút' },
  { jp: 'けしゴム', vi: 'cục tẩy' },
  { jp: 'かぎ', vi: 'chìa khóa' },
  { jp: 'おかね', vi: 'tiền' },
  { jp: 'カメラ', vi: 'máy ảnh' },
  { jp: 'くるま', vi: 'chiếc ô tô' },
  { jp: 'コーヒー', vi: 'cà phê' },
  { jp: 'とけい', vi: 'đồng hồ' },
  { jp: 'バイク', vi: 'xe máy' },
  { jp: 'スマホ', vi: 'điện thoại' },
  { jp: 'チョコレート', vi: 'hộp sô cô la' },
  { jp: 'おみやげ', vi: 'món quà đặc sản' },
  { jp: 'どらやき', vi: 'bánh Dorayaki' }
];

const MEDIA_ITEMS = [
  { jp: 'じしょ', vi: 'từ điển' },
  { jp: 'ざっし', vi: 'tạp chí' },
  { jp: 'ほん', vi: 'sách' },
  { jp: 'しんぶん', vi: 'báo' }
];

const THEMES = [
  { jp: 'にほんご', vi: 'tiếng Nhật' },
  { jp: 'えいご', vi: 'tiếng Anh' },
  { jp: 'ベトナムご', vi: 'tiếng Việt' },
  { jp: 'ちゅうごくご', vi: 'tiếng Trung' },
  { jp: 'くるま', vi: 'ô tô' },
  { jp: 'カメラ', vi: 'máy ảnh' },
  { jp: 'コンピューター', vi: 'máy tính' },
  { jp: 'バイク', vi: 'xe máy' }
];

/**
 * GENERATOR BÀI 1:
 * Cấu trúc:
 * 1. N1 は N2 です
 * 2. N1 は N2 じゃ ありません (hoặc では ありません)
 * 3. N1 は N2 ですか (Trả lời: はい、そうです / いいえ、ちがいます。N3です)
 * 4. N1 は だれ／どなた ですか
 * 5. N1 は なんさい／おいくつ ですか
 * 6. N1 の N2 (Tổ chức / Nơi chốn: だいがくの がくせい, ベトナムの かしゅ, ...)
 * 7. Mở rộng: おなまえは？, おしごとは？, ごしゅっしんは？
 * (Đã bỏ Trợ từ も)
 */
function generateLesson1Pool(): GrammarQuizQuestion[] {
  const pool: GrammarQuizQuestion[] = [];

  // Mẫu 1: Trợ từ は
  for (let i = 0; i < 4; i++) {
    const p = PERSON_NAMES[Math.floor(Math.random() * PERSON_NAMES.length)];
    const j = JOBS[Math.floor(Math.random() * JOBS.length)];
    pool.push({
      id: `l1-wa-${i}-${Math.random()}`,
      lessonId: 1,
      type: 'fill_in_blank',
      grammarTopic: 'Trợ từ は (Chủ đề / Chủ ngữ)',
      question: `${p} [ ? ] ${j.jp}です。`,
      translation: `${p} là ${j.vi}.`,
      options: shuffleArray(['は', 'の', 'か', 'と']),
      correctAnswer: 'は',
      explanation: `Trợ từ 「は」(đọc là wa) đứng sau chủ ngữ/chủ đề 「${p}」.`,
      audioJp: `${p}は ${j.jp}です。`
    });
  }

  // Mẫu: Trợ từ も (Cũng)
  for (let i = 0; i < 4; i++) {
    const p1 = PERSON_NAMES[Math.floor(Math.random() * PERSON_NAMES.length)];
    const p2 = PERSON_NAMES.filter(p => p !== p1)[Math.floor(Math.random() * (PERSON_NAMES.length - 1))];
    const j = JOBS[Math.floor(Math.random() * JOBS.length)];

    pool.push({
      id: `l1-mo-${i}-${Math.random()}`,
      lessonId: 1,
      type: 'fill_in_blank',
      grammarTopic: 'Trợ từ も (Cũng)',
      question: `${p1}は ${j.jp}です。${p2} [ ? ] ${j.jp}です。`,
      translation: `${p1} là ${j.vi}. ${p2} cũng là ${j.vi}.`,
      options: shuffleArray(['も', 'は', 'の', 'か']),
      correctAnswer: 'も',
      explanation: `Trợ từ 「も」 mang nghĩa là "cũng", dùng khi chủ ngữ thứ hai (${p2}) có thông tin tương đồng với câu phía trước.`,
      audioJp: `${p1}は ${j.jp}です。${p2}も ${j.jp}です。`
    });
  }

  // Mẫu 2: Phủ định じゃ ありません / では ありません
  for (let i = 0; i < 4; i++) {
    const p = PERSON_NAMES[Math.floor(Math.random() * PERSON_NAMES.length)];
    const c = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    const j = JOBS[Math.floor(Math.random() * JOBS.length)];
    const isCountry = Math.random() > 0.5;
    const target = isCountry ? c.person : j.jp;
    const targetVi = isCountry ? `người ${c.vi}` : j.vi;

    pool.push({
      id: `l1-neg-${i}-${Math.random()}`,
      lessonId: 1,
      type: 'fill_in_blank',
      grammarTopic: 'Phủ định じゃ ありません',
      question: `${p}は ${target} [ ? ]。`,
      translation: `${p} không phải là ${targetVi}.`,
      options: shuffleArray(['じゃ ありません', 'です', 'ですか', 'の です']),
      correctAnswer: 'じゃ ありません',
      explanation: `Để phủ định 「không phải là ${targetVi}」, dùng đuôi câu 「じゃ ありません」 hoặc 「では ありません」.`,
      audioJp: `${p}は ${target}じゃ ありません。`
    });
  }

  // Mẫu 3: Câu hỏi xác nhận & Trả lời (はい、そうです / いいえ、ちがいます)
  for (let i = 0; i < 4; i++) {
    const p = PERSON_NAMES[Math.floor(Math.random() * PERSON_NAMES.length)];
    const j1 = JOBS[Math.floor(Math.random() * JOBS.length)];
    const j2 = JOBS.filter(job => job.jp !== j1.jp)[Math.floor(Math.random() * (JOBS.length - 1))];

    pool.push({
      id: `l1-qa-${i}-${Math.random()}`,
      lessonId: 1,
      type: 'qa_matching',
      grammarTopic: 'Câu hỏi xác nhận N1 は N2 ですか',
      question: `A: ${p}は ${j1.jp}ですか。\nB: [ ? ]`,
      translation: `A hỏi: "${p} là ${j1.vi} phải không?"`,
      options: shuffleArray([
        `いいえ、ちがいます。${j2.jp}です。`,
        `はい、${j1.jp}じゃ ありません。`,
        `わたしは ${j1.jp}です。`,
        `いいえ、そうです。`
      ]),
      correctAnswer: `いいえ、ちがいます。${j2.jp}です。`,
      explanation: `Khi phủ định câu hỏi xác nhận, dùng 「いいえ、ちがいます」 kết hợp với thông tin đúng.`,
      audioJp: `いいえ、ちがいます。${j2.jp}です。`
    });
  }

  // Mẫu 4: N1 の N2 (Thuộc về tổ chức / quốc gia)
  for (let i = 0; i < 4; i++) {
    const p = PERSON_NAMES[Math.floor(Math.random() * PERSON_NAMES.length)];
    const org = ORGS[Math.floor(Math.random() * ORGS.length)];
    const c = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    const j = JOBS[Math.floor(Math.random() * JOBS.length)];
    const firstNoun = Math.random() > 0.5 ? org.jp : c.jp;

    pool.push({
      id: `l1-no-${i}-${Math.random()}`,
      lessonId: 1,
      type: 'fill_in_blank',
      grammarTopic: 'Trợ từ の (Thuộc về tổ chức / nơi chốn)',
      question: `${p}は ${firstNoun} [ ? ] ${j.jp}です。`,
      translation: `${p} là ${j.vi} của ${firstNoun}.`,
      options: shuffleArray(['の', 'は', 'か', 'と']),
      correctAnswer: 'の',
      explanation: `Trợ từ 「の」 nối 2 danh từ biểu thị danh từ đứng sau (${j.jp}) thuộc danh từ đứng trước (${firstNoun}).`,
      audioJp: `${p}は ${firstNoun}の ${j.jp}です。`
    });
  }

  // Mẫu 5: Từ để hỏi người (だれ / どなた)
  for (let i = 0; i < 3; i++) {
    const p = PERSON_NAMES[Math.floor(Math.random() * PERSON_NAMES.length)];
    const isPolite = Math.random() > 0.5;
    const subject = isPolite ? 'あのかた' : 'あのひと';
    const questionWord = isPolite ? 'どなた' : 'だれ';

    pool.push({
      id: `l1-dare-${i}-${Math.random()}`,
      lessonId: 1,
      type: 'fill_in_blank',
      grammarTopic: `Từ để hỏi người (${questionWord})`,
      question: `${subject}は [ ? ] ですか。`,
      translation: `${isPolite ? 'Vị kia' : 'Người kia'} là ai?`,
      options: shuffleArray([questionWord, 'なんさい', 'なん', 'どれ']),
      correctAnswer: questionWord,
      explanation: `「${questionWord}」 là từ để hỏi danh tính người (${isPolite ? 'lịch sự của だれ' : 'ai'}).`,
      audioJp: `${subject}は ${questionWord}ですか。`
    });
  }

  // Mẫu 6: Từ để hỏi tuổi (なんさい / おいくつ)
  for (let i = 0; i < 3; i++) {
    const p = PERSON_NAMES[Math.floor(Math.random() * PERSON_NAMES.length)];
    const age = Math.floor(Math.random() * 20) + 10;

    pool.push({
      id: `l1-age-${i}-${Math.random()}`,
      lessonId: 1,
      type: 'qa_matching',
      grammarTopic: 'Hỏi tuổi (なんさいですか)',
      question: `A: ${p}は なんさいですか。\nB: [ ? ]`,
      translation: `A hỏi: "${p} bao nhiêu tuổi?"`,
      options: shuffleArray([
        `${age}さいです。`,
        `かいしゃいんです。`,
        `はい、${p}です。`,
        `ベトナムの ハノイです。`
      ]),
      correctAnswer: `${age}さいです。`,
      explanation: `Câu hỏi tuổi 「なんさいですか」 trả lời bằng số tuổi: 「[Số tuổi] さいです。」`,
      audioJp: `${age}さいです。`
    });
  }

  // Mẫu 7: Mở rộng (おなまえは？, おしごとは？, ごしゅっしんは？)
  pool.push({
    id: `l1-exp-name-${Math.random()}`,
    lessonId: 1,
    type: 'qa_matching',
    grammarTopic: 'Mở rộng: Cách hỏi tên',
    question: `A: おなまえは？\nB: [ ? ]`,
    translation: `A hỏi lịch sự: "Tên của bạn là gì?"`,
    options: shuffleArray(['ハンです。', '20さいです。', 'がくせいです。', 'ベトナムです。']),
    correctAnswer: 'ハンです。',
    explanation: `「おなまえは？」 là cách hỏi tên ngắn gọn, trả lời bằng tên: 「[Tên] です。」`,
    audioJp: 'ハンです。'
  });

  pool.push({
    id: `l1-exp-job-${Math.random()}`,
    lessonId: 1,
    type: 'qa_matching',
    grammarTopic: 'Mở rộng: Cách hỏi nghề nghiệp',
    question: `A: おしごとは？\nB: [ ? ]`,
    translation: `A hỏi lịch sự: "Nghề nghiệp của bạn là gì?"`,
    options: shuffleArray(['エンジニアです。', 'さとうです。', 'ベトナムの ハノイです。', 'はい、そうです。']),
    correctAnswer: 'エンジニアです。',
    explanation: `「おしごとは？」 hỏi nghề nghiệp, trả lời: 「[Nghề nghiệp] です。」`,
    audioJp: 'エンジニアです。'
  });

  pool.push({
    id: `l1-exp-shusshin-${Math.random()}`,
    lessonId: 1,
    type: 'qa_matching',
    grammarTopic: 'Mở rộng: Cách hỏi xuất thân',
    question: `A: ごしゅっしんは？\nB: [ ? ]`,
    translation: `A hỏi: "Nơi xuất thân / Quê quán của bạn ở đâu?"`,
    options: shuffleArray(['ベトナムの ハノイです。', 'きょうしです。', 'いいえ、ちがいます。', 'たなかです。']),
    correctAnswer: 'ベトナムの ハノイです。',
    explanation: `「ごしゅっしんは？」 hỏi nơi xuất thân/quê quán, trả lời: 「[Địa danh] です。」`,
    audioJp: 'ベトナムの ハノイです。'
  });

  return shuffleArray(pool);
}

/**
 * GENERATOR BÀI 2:
 * Cấu trúc:
 * 1. これ／それ／あれ は N です
 * 2. これ／それ／あれ は なんですか
 * 3. これ／それ／あれ は N ですか (Xác nhận đồ vật)
 * 4. この／その／あの + N
 * 5. N1 の N2 (Sở hữu: わたし／さとうさん の N)
 * 6. N1 の N2 (Nội dung: にほんご／くるま の ざっし／じしょ)
 * 7. だれの N ですか
 * 8. なんの N ですか
 * 9. 〜 N1 ですか、N2 ですか (Câu hỏi lựa chọn)
 */
function generateLesson2Pool(): GrammarQuizQuestion[] {
  const pool: GrammarQuizQuestion[] = [];

  // Mẫu 1: Chỉ thị từ これ / それ / あれ (dựa theo vị trí người nói / người nghe / ở xa)
  for (let i = 0; i < 4; i++) {
    const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    const scenarios = [
      { demo: 'これ', desc: 'gần người nói', vi: 'Cái này' },
      { demo: 'それ', desc: 'gần người nghe', vi: 'Cái đó' },
      { demo: 'あれ', desc: 'xa cả hai người', vi: 'Cái kia' }
    ];
    const sc = scenarios[Math.floor(Math.random() * scenarios.length)];

    pool.push({
      id: `l2-demo-${i}-${Math.random()}`,
      lessonId: 2,
      type: 'fill_in_blank',
      grammarTopic: `Chỉ thị từ (${sc.demo})`,
      question: `Chỉ đồ vật ở ${sc.desc}: "[ ? ] は ${item.jp}です。"`,
      translation: `Chỉ vật ở ${sc.desc}: "(${sc.vi}) là ${item.vi}."`,
      options: shuffleArray(['これ', 'それ', 'あれ', 'この']),
      correctAnswer: sc.demo,
      explanation: `「${sc.demo}」 dùng để chỉ đồ vật ở ${sc.desc}. (Lưu ý: 「この」 bắt buộc phải đi kèm danh từ, không đứng trước trợ từ は).`,
      audioJp: `${sc.demo}は ${item.jp}です。`
    });
  }

  // Mẫu 2: Phân biệt これ/それ/あれ vs この/その/あの + N
  for (let i = 0; i < 4; i++) {
    const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    const owner = PERSON_NAMES[Math.floor(Math.random() * PERSON_NAMES.length)];
    const demos = [
      { kono: 'この', vi: 'này' },
      { kono: 'その', vi: 'đó' },
      { kono: 'あの', vi: 'kia' }
    ];
    const chosen = demos[Math.floor(Math.random() * demos.length)];

    pool.push({
      id: `l2-kono-${i}-${Math.random()}`,
      lessonId: 2,
      type: 'fill_in_blank',
      grammarTopic: `Cấu trúc ${chosen.kono} + Danh từ`,
      question: `[ ? ] ${item.jp}は ${owner}のです。`,
      translation: `${item.vi[0].toUpperCase() + item.vi.slice(1)} ${chosen.vi} là của ${owner}.`,
      options: shuffleArray([chosen.kono, 'これ', 'それ', 'あれ']),
      correctAnswer: chosen.kono,
      explanation: `Vì phía sau có danh từ 「${item.jp}」 đứng trực tiếp, ta bắt buộc phải dùng 「${chosen.kono}」 (chứ không dùng これ/それ/あれ).`,
      audioJp: `${chosen.kono} ${item.jp}は ${owner}のです。`
    });
  }

  // Mẫu 3: Câu hỏi tên đồ vật: これ／それ／あれ は なんですか
  for (let i = 0; i < 3; i++) {
    const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];

    pool.push({
      id: `l2-nan-${i}-${Math.random()}`,
      lessonId: 2,
      type: 'qa_matching',
      grammarTopic: 'Hỏi tên đồ vật (なんですか)',
      question: `A: それは なんですか。\nB: [ ? ]`,
      translation: `A hỏi về đồ vật gần B: "Đó là cái gì?"`,
      options: shuffleArray([
        `[これは] ${item.jp}です。`,
        `はい、${item.jp}です。`,
        `いいえ、${item.jp}じゃ ありません。`,
        `だれの ${item.jp}ですか。`
      ]),
      correctAnswer: `[これは] ${item.jp}です。`,
      explanation: `Khi A hỏi 「それは なんですか」 (vật ở gần B), B trả lời dùng 「[これは] ${item.jp}です。」 Không trả lời bằng はい/いいえ.`,
      audioJp: `これは ${item.jp}です。`
    });
  }

  // Mẫu 4: N1 の N2 (Nội dung: sách, báo, từ điển)
  for (let i = 0; i < 4; i++) {
    const media = MEDIA_ITEMS[Math.floor(Math.random() * MEDIA_ITEMS.length)];
    const theme = THEMES[Math.floor(Math.random() * THEMES.length)];

    pool.push({
      id: `l2-content-no-${i}-${Math.random()}`,
      lessonId: 2,
      type: 'fill_in_blank',
      grammarTopic: 'N1 の N2 (Nội dung của đồ vật)',
      question: `これは ${theme.jp} [ ? ] ${media.jp}です。`,
      translation: `Đây là ${media.vi} về ${theme.vi}.`,
      options: shuffleArray(['の', 'は', 'か', 'と']),
      correctAnswer: 'の',
      explanation: `Cấu trúc 「N1 の N2」(Cách 2): N1 là nội dung chủ đề (${theme.jp}), N2 là ấn phẩm đồ vật (${media.jp}).`,
      audioJp: `これは ${theme.jp}の ${media.jp}です。`
    });
  }

  // Mẫu 5: Câu hỏi nội dung: なんの N ですか
  for (let i = 0; i < 4; i++) {
    const media = MEDIA_ITEMS[Math.floor(Math.random() * MEDIA_ITEMS.length)];
    const theme = THEMES[Math.floor(Math.random() * THEMES.length)];

    pool.push({
      id: `l2-nan-no-${i}-${Math.random()}`,
      lessonId: 2,
      type: 'qa_matching',
      grammarTopic: 'Hỏi nội dung: なんの N ですか',
      question: `A: これは なんの ${media.jp}ですか。\nB: [ ? ]`,
      translation: `A hỏi: "Đây là ${media.vi} về cái gì?"`,
      options: shuffleArray([
        `${theme.jp}の ${media.jp}です。`,
        `わたしの ${media.jp}です。`,
        `はい、そうです。`,
        `いいえ、${media.jp}じゃ ありません。`
      ]),
      correctAnswer: `${theme.jp}の ${media.jp}です。`,
      explanation: `「なんの ${media.jp}ですか」 hỏi về chủ đề nội dung, trả lời: 「[Chủ đề: ${theme.jp}] の ${media.jp}です。」`,
      audioJp: `${theme.jp}の ${media.jp}です。`
    });
  }

  // Mẫu 6: Câu hỏi sở hữu: だれの N ですか
  for (let i = 0; i < 4; i++) {
    const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    const owner = PERSON_NAMES[Math.floor(Math.random() * PERSON_NAMES.length)];

    pool.push({
      id: `l2-dare-no-${i}-${Math.random()}`,
      lessonId: 2,
      type: 'qa_matching',
      grammarTopic: 'Hỏi sở hữu: だれの N ですか',
      question: `A: それは だれの ${item.jp}ですか。\nB: [ ? ]`,
      translation: `A hỏi: "Đó là ${item.vi} của ai?"`,
      options: shuffleArray([
        `${owner}の [${item.jp}] です。`,
        `にほんごの ${item.jp}です。`,
        `はい、${item.jp}です。`,
        `だれの です。`
      ]),
      correctAnswer: `${owner}の [${item.jp}] です。`,
      explanation: `「だれの ${item.jp}ですか」 hỏi về chủ sở hữu, trả lời: 「[Người: ${owner}] の [${item.jp}] です。」`,
      audioJp: `${owner}の ${item.jp}です。`
    });
  }

  // Mẫu 7: Câu hỏi lựa chọn: 〜 N1 ですか、N2 ですか
  for (let i = 0; i < 4; i++) {
    const itemA = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    const itemB = ITEMS.filter(it => it.jp !== itemA.jp)[Math.floor(Math.random() * (ITEMS.length - 1))];
    const choice = Math.random() > 0.5 ? itemA : itemB;

    pool.push({
      id: `l2-choice-${i}-${Math.random()}`,
      lessonId: 2,
      type: 'qa_matching',
      grammarTopic: 'Câu hỏi lựa chọn (〜ですか、〜ですか)',
      question: `A: これは ${itemA.jp}ですか、${itemB.jp}ですか。\nB: [ ? ]`,
      translation: `A hỏi: "Đây là ${itemA.vi} hay ${itemB.vi}?"`,
      options: shuffleArray([
        `${choice.jp}です。`,
        `はい、${choice.jp}です。`,
        `いいえ、${choice.jp}じゃ ありません。`,
        `そうです。`
      ]),
      correctAnswer: `${choice.jp}です。`,
      explanation: `Câu hỏi lựa chọn KHÔNG dùng はい / いいえ mà chọn trực tiếp 1 trong 2 đối tượng: 「${choice.jp}です。」`,
      audioJp: `${choice.jp}です。`
    });
  }

  // Mẫu 8: Câu hỏi xác nhận đồ vật: それは N ですか
  for (let i = 0; i < 3; i++) {
    const item1 = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    const item2 = ITEMS.filter(it => it.jp !== item1.jp)[Math.floor(Math.random() * (ITEMS.length - 1))];

    pool.push({
      id: `l2-confirm-${i}-${Math.random()}`,
      lessonId: 2,
      type: 'qa_matching',
      grammarTopic: 'Xác nhận đồ vật (〜ですか)',
      question: `A: あれは ${item1.jp}ですか。\nB: いいえ、ちがいます。[ ? ] です。`,
      translation: `A: "Kia là ${item1.vi} phải không?" - B: "Không, không phải. Là ${item2.vi}."`,
      options: shuffleArray([item2.jp, item1.jp, 'はい', 'だれ']),
      correctAnswer: item2.jp,
      explanation: `Khi phủ định câu hỏi xác nhận, dùng 「いいえ、ちがいます。[Đồ vật đúng: ${item2.jp}] です。」`,
      audioJp: `いいえ、ちがいます。${item2.jp}です。`
    });
  }

  return shuffleArray(pool);
}

/**
 * Trả về danh sách câu hỏi phong phú, đa dạng cho một bài học (đã shuffle ngẫu nhiên đáp án)
 */
export function getQuestionsForLesson(lessonId: number, count = 10): GrammarQuizQuestion[] {
  let pool: GrammarQuizQuestion[] = [];
  if (lessonId === 1) {
    pool = generateLesson1Pool();
  } else if (lessonId === 2) {
    pool = generateLesson2Pool();
  }

  if (pool.length === 0) return [];

  // Shuffle questions and ensure options inside each question are also shuffled
  const selected = shuffleArray(pool).slice(0, count);
  return selected.map(q => ({
    ...q,
    options: q.options ? shuffleArray(q.options) : undefined
  }));
}
