import { GrammarQuizQuestion } from '@/types/grammarQuiz';

export const CURATED_LESSON_QUESTIONS: Record<number, GrammarQuizQuestion[]> = {
  // ==========================================
  // BÀI 1: Danh từ, Trợ từ & Mẫu câu cơ bản
  // ==========================================
  1: [
    {
      id: 'b1-q1',
      lessonId: 1,
      type: 'fill_in_blank',
      grammarTopic: 'Trợ từ は & Khẳng định です',
      question: 'わたし [ ? ] かいしゃいんです。',
      translation: 'Tôi là nhân viên công ty.',
      options: ['は', 'の', 'も', 'か'],
      correctAnswer: 'は',
      explanation: 'Trợ từ 「は」(đọc là wa) đứng sau chủ ngữ / chủ đề 「わたし」 trong câu khẳng định 「N1 は N2 です」.',
      audioJp: 'わたしは かいしゃいんです。'
    },
    {
      id: 'b1-q2',
      lessonId: 1,
      type: 'fill_in_blank',
      grammarTopic: 'Phủ định じゃ ありません',
      question: 'わたしは きょうし [ ? ]。がくせいです。',
      translation: 'Tôi không phải là giáo viên. Tôi là học sinh.',
      options: ['じゃ ありません', 'です', 'ですか', 'の です'],
      correctAnswer: 'じゃ ありません',
      explanation: 'Để phủ định 「N1 không phải là N2」, ta dùng đuôi câu 「じゃ ありません」(hoặc lịch sự hơn là 「では ありません」).',
      audioJp: 'わたしは きょうしじゃ ありません。がくせいです。'
    },
    {
      id: 'b1-q3',
      lessonId: 1,
      type: 'qa_matching',
      grammarTopic: 'Câu hỏi xác nhận N1 は N2 ですか',
      question: 'A: リサさんは かんこくじんですか。',
      translation: 'A hỏi: "Bạn Lisa là người Hàn Quốc phải không?"',
      options: [
        'いいえ、ちがいます。タイじんです。',
        'はい、かんこくじんは ありません。',
        'わたしは リサです。',
        'いいえ、そうです。'
      ],
      correctAnswer: 'いいえ、ちがいます。タイじんです。',
      explanation: 'Khi phủ định câu hỏi xác nhận, dùng: 「いいえ、ちがいます」 hoặc 「いいえ、[N2] じゃ ありません」 kèm thông tin đúng.',
      audioJp: 'いいえ、ちがいます。タイじんです。'
    },
    {
      id: 'b1-q4',
      lessonId: 1,
      type: 'fill_in_blank',
      grammarTopic: 'Trợ từ の (Thuộc về / Nơi làm việc)',
      question: 'あの ひとは ベトナム [ ? ] かしゅです。',
      translation: 'Người kia là ca sĩ của Việt Nam.',
      options: ['の', 'は', 'も', 'と'],
      correctAnswer: 'の',
      explanation: 'Trợ từ 「の」 mang nghĩa "của/thuộc", biểu thị danh từ N2 thuộc tổ chức, quốc gia hoặc nơi chốn N1.',
      audioJp: 'あのひとは ベトナムの かしゅです。'
    },
    {
      id: 'b1-q5',
      lessonId: 1,
      type: 'fill_in_blank',
      grammarTopic: 'Trợ từ も (Cũng)',
      question: 'しんいちくんは がくせいです。ランさん [ ? ] がくせいです。',
      translation: 'Bạn Shinichi là học sinh. Bạn Ran cũng là học sinh.',
      options: ['も', 'は', 'の', 'か'],
      correctAnswer: 'も',
      explanation: 'Trợ từ 「も」 mang nghĩa là "cũng", dùng khi thông tin về chủ ngữ tương đồng với thông tin đã nói phía trước.',
      audioJp: 'しんいちくんは がくせいです。ランさんも がくせいです。'
    },
    {
      id: 'b1-q6',
      lessonId: 1,
      type: 'qa_matching',
      grammarTopic: 'Hỏi người (だれ / どなた)',
      question: 'A: あの ひとは だれですか。',
      translation: 'A hỏi: "Người kia là ai vậy?"',
      options: [
        'さとうさんです。',
        'はい、だれです。',
        'ベトナムじんじゃ ありません。',
        'かいしゃいんですか。'
      ],
      correctAnswer: 'さとうさんです。',
      explanation: 'Câu hỏi có từ để hỏi 「だれ」(ai?) thì trả lời trực tiếp tên hoặc danh tính 「[Người] です」, không dùng はい/いいえ.',
      audioJp: 'さとうさんです。'
    },
    {
      id: 'b1-q7',
      lessonId: 1,
      type: 'qa_matching',
      grammarTopic: 'Mở rộng 1: Hỏi tên',
      question: 'A: おなまえは？',
      translation: 'A hỏi lịch sự: "Tên của bạn là gì?"',
      options: [
        'ハンです。',
        'ベトナムの ハノイです。',
        'かいしゃいんです。',
        '20さいです。'
      ],
      correctAnswer: 'ハンです。',
      explanation: '「おなまえは？」 là cách hỏi tên ngắn gọn, lịch sự. Trả lời: 「[Tên] です。」',
      audioJp: 'ハンです。'
    },
    {
      id: 'b1-q8',
      lessonId: 1,
      type: 'word_scramble',
      grammarTopic: 'Sắp xếp câu: Giới thiệu bản thân',
      question: 'Sắp xếp các từ sau thành câu: "Tôi là kỹ sư người Việt Nam."',
      translation: 'Tôi là kỹ sư người Việt Nam.',
      scrambleTokens: ['ベトナムの', 'わたしは', 'エンジニアです。'],
      correctTokens: ['わたしは', 'ベトナムの', 'エンジニアです。'],
      correctAnswer: 'わたしは ベトナムの エンジニアです。',
      explanation: 'Cấu trúc câu: Chủ ngữ + は + Bổ ngữ (ベトナムの) + Vị ngữ (エンジニアです).',
      audioJp: 'わたしは ベトナムの エンジニアです。'
    },
    {
      id: 'b1-q9',
      lessonId: 1,
      type: 'qa_matching',
      grammarTopic: 'Mở rộng 3: Hỏi xuất thân',
      question: 'A: ごしゅっしんは？',
      translation: 'A hỏi: "Quê quán / Nơi xuất thân của bạn ở đâu?"',
      options: [
        'ベトナムの ハノイです。',
        'きょうしです。',
        'いいえ、タイじんです。',
        'あのかたです。'
      ],
      correctAnswer: 'ベトナムの ハノイです。',
      explanation: '「ごしゅっしんは？」 dùng để hỏi quê quán/nơi sinh sống. Trả lời: 「[Địa danh] です。」',
      audioJp: 'ベトナムの ハノイです。'
    },
    {
      id: 'b1-q10',
      lessonId: 1,
      type: 'fill_in_blank',
      grammarTopic: 'Từ để hỏi tuổi',
      question: 'コナンくんは [ ? ] ですか。',
      translation: 'Bạn Conan bao nhiêu tuổi?',
      options: ['なんさい', 'だれ', 'どなた', 'なん'],
      correctAnswer: 'なんさい',
      explanation: '「なんさい」(hoặc lịch sự là 「おいくつ」) là từ để hỏi tuổi.',
      audioJp: 'コナンくんは なんさいですか。'
    }
  ],

  // ==========================================
  // BÀI 2: Chỉ thị từ, Đồ vật & Quyền sở hữu
  // ==========================================
  2: [
    {
      id: 'b2-q1',
      lessonId: 2,
      type: 'fill_in_blank',
      grammarTopic: 'Chỉ thị từ これ / それ / あれ',
      question: 'Người nói đang cầm quyển sách trên tay và nói: "[ ? ] は ほんです。"',
      translation: 'Người nói cầm sách trên tay: "(Cái này) là quyển sách."',
      options: ['これ', 'それ', 'あれ', 'この'],
      correctAnswer: 'これ',
      explanation: '「これ」 dùng để chỉ vật ở gần người nói. (Lưu ý: 「この」 phải đi kèm danh từ, không đứng trước trợ từ は).',
      audioJp: 'これは ほんです。'
    },
    {
      id: 'b2-q2',
      lessonId: 2,
      type: 'fill_in_blank',
      grammarTopic: 'Phân biệt これ/それ/あれ vs この/その/あの',
      question: '[ ? ] ほんは わたしのです。',
      translation: 'Quyển sách này là của tôi.',
      options: ['この', 'これ', 'それ', 'あれ'],
      correctAnswer: 'この',
      explanation: 'Cấu trúc 「この／その／あの + Danh từ」 dùng để chỉ định đồ vật cụ thể. Không dùng 「これは ほん」 trong trường hợp này.',
      audioJp: 'この ほんは わたしのです。'
    },
    {
      id: 'b2-q3',
      lessonId: 2,
      type: 'qa_matching',
      grammarTopic: 'Câu hỏi tên đồ vật: なんですか',
      question: 'A: これは なんですか。',
      translation: 'A chỉ vào đồ vật gần mình và hỏi: "Đây là cái gì?"',
      options: [
        'それは スマホです。',
        'はい、スマホです。',
        'いいえ、ちがいます。',
        'わたしの スマホですか。'
      ],
      correctAnswer: 'それは スマホです。',
      explanation: 'Khi người A hỏi đồ ở gần A (「これは...」), người B trả lời phải dùng 「それは...」(vì vật đó ở gần người nghe A). Không trả lời はい/いいえ.',
      audioJp: 'それは スマホです。'
    },
    {
      id: 'b2-q4',
      lessonId: 2,
      type: 'fill_in_blank',
      grammarTopic: 'N1 の N2 (Nội dung sách, báo, từ điển)',
      question: 'これは にほんご [ ? ] じしょです。',
      translation: 'Đây là quyển từ điển về tiếng Nhật.',
      options: ['の', 'は', 'も', 'か'],
      correctAnswer: 'の',
      explanation: 'Cấu trúc 「N1 の N2」(Cách 2): N1 là nội dung, N2 là đồ vật (sách, báo, từ điển).',
      audioJp: 'これは にほんごの じしょです。'
    },
    {
      id: 'b2-q5',
      lessonId: 2,
      type: 'qa_matching',
      grammarTopic: 'Câu hỏi nội dung: なんの N ですか',
      question: 'A: これは なんの ざっしですか。',
      translation: 'A hỏi: "Đây là tạp chí về cái gì?"',
      options: [
        'くるまの ざっしです。',
        'わたしの ざっしです。',
        'はい、くるまです。',
        'いいえ、ざっしじゃ ありません。'
      ],
      correctAnswer: 'くるまの ざっしです。',
      explanation: '「なんの N ですか」 hỏi về chủ đề/nội dung của đồ vật N. Trả lời: 「[Chủ đề] の [N] です。」 (Tạp chí về ô tô).',
      audioJp: 'くるまの ざっしです。'
    },
    {
      id: 'b2-q6',
      lessonId: 2,
      type: 'qa_matching',
      grammarTopic: 'Câu hỏi sở hữu: だれの N ですか',
      question: 'A: それは だれの スマホですか。',
      translation: 'A hỏi: "Đó là điện thoại của ai?"',
      options: [
        'わたしの [スマホ] です。',
        'にほんごの スマホです。',
        'はい、スマホです。',
        'だれの です。'
      ],
      correctAnswer: 'わたしの [スマホ] です。',
      explanation: '「だれの N ですか」 hỏi về người sở hữu đồ vật. Trả lời: 「[Người] の [N] です。」',
      audioJp: 'わたしの スマホです。'
    },
    {
      id: 'b2-q7',
      lessonId: 2,
      type: 'qa_matching',
      grammarTopic: 'Câu hỏi lựa chọn: N1ですか、N2ですか',
      question: 'A: これは ボールペンですか、シャープペンですか。',
      translation: 'A hỏi: "Đây là bút bi hay bút chì kim?"',
      options: [
        'ボールペンです。',
        'はい、ボールペンです。',
        'いいえ、シャープペンです。',
        'そうです。'
      ],
      correctAnswer: 'ボールペンです。',
      explanation: 'Câu hỏi lựa chọn 「〜 N1 ですか、N2 ですか」 KHÔNG được dùng はい hoặc いいえ khi trả lời, mà chọn trực tiếp 1 trong 2 đáp án.',
      audioJp: 'ボールペンです。'
    },
    {
      id: 'b2-q8',
      lessonId: 2,
      type: 'word_scramble',
      grammarTopic: 'Sắp xếp câu: Hỏi lựa chọn sở hữu',
      question: 'Sắp xếp các từ sau thành câu: "Cái bánh Dorayaki này là của Nobita hay Doraemon?"',
      translation: 'Cái bánh Dorayaki này là của Nobita hay Doraemon?',
      scrambleTokens: [
        'のびたさんのですか、',
        'この どらやきは',
        'ドラえもんさんのですか。'
      ],
      correctTokens: [
        'この どらやきは',
        'のびたさんのですか、',
        'ドラえもんさんのですか。'
      ],
      correctAnswer: 'この どらやきは のびたさんのですか、ドラえもんさんのですか。',
      explanation: 'Cấu trúc: [Chủ ngữ chỉ định: この どらやきは] + [Lựa chọn 1: のびたさんのですか、] + [Lựa chọn 2: ドラえもんさんのですか。]',
      audioJp: 'この どらやきは のびたさんのですか、ドラえもんさんのですか。'
    },
    {
      id: 'b2-q9',
      lessonId: 2,
      type: 'fill_in_blank',
      grammarTopic: 'Chỉ thị từ ở xa: あれ / あの',
      question: 'Vật ở xa cả người nói và người nghe: "[ ? ] は なんですか。"',
      translation: 'Vật ở xa cả 2 người: "(Cái kia) là cái gì?"',
      options: ['あれ', 'これ', 'それ', 'あの'],
      correctAnswer: 'あれ',
      explanation: '「あれ」 dùng khi đồ vật ở xa cả người nói và người nghe.',
      audioJp: 'あれは なんですか。'
    },
    {
      id: 'b2-q10',
      lessonId: 2,
      type: 'fill_in_blank',
      grammarTopic: 'Câu hỏi xác nhận đồ vật',
      question: 'A: あれは ねこですか。\nB: いいえ、ちがいます。[ ? ] です。',
      translation: 'A: "Kia là con mèo phải không?" - B: "Không, không phải. Là cái túi."',
      options: ['ふくろ', 'ねこ', 'かさ', 'じしょ'],
      correctAnswer: 'ふくろ',
      explanation: '「いいえ、ちがいます。[N2] です。」 dùng khi đính chính lại thông tin đúng (ở đây là cái túi - ふくろ).',
      audioJp: 'いいえ、ちがいます。ふくろです。'
    }
  ]
};

/**
 * Thuật toán sinh câu hỏi ĐỘNG (Dynamic Generator)
 * Ghép ngẫu nhiên kho từ vựng của bài vào các cấu trúc ngữ pháp
 * để tạo ra vô số biến thể câu hỏi khác nhau mỗi lần làm bài.
 */
function generateDynamicLesson1Questions(count = 5): GrammarQuizQuestion[] {
  const people = ['わたし', 'さとうさん', 'ハンさん', 'コナンくん', 'リサさん', 'あのひと'];
  const jobs = [
    { jp: 'かいしゃいん', vi: 'nhân viên công ty' },
    { jp: 'きょうし', vi: 'giáo viên' },
    { jp: 'がくせい', vi: 'học sinh' },
    { jp: 'いしゃ', vi: 'bác sĩ' },
    { jp: 'エンジニア', vi: 'kỹ sư' },
    { jp: 'かしゅ', vi: 'ca sĩ' }
  ];
  const countries = [
    { jp: 'ベトナム', person: 'ベトナムじん', vi: 'Việt Nam' },
    { jp: 'にほん', person: 'にほんじん', vi: 'Nhật Bản' },
    { jp: 'アメリカ', person: 'アメリカじん', vi: 'Mỹ' },
    { jp: 'かんこく', person: 'かんこくじん', vi: 'Hàn Quốc' },
    { jp: 'イギリス', person: 'イギリスじん', vi: 'Anh' }
  ];

  const generated: GrammarQuizQuestion[] = [];

  // 1. Sinh câu hỏi trợ từ は / も
  const p1 = people[Math.floor(Math.random() * people.length)];
  const j1 = jobs[Math.floor(Math.random() * jobs.length)];
  generated.push({
    id: `dyn-b1-wa-${Math.random().toString(36).substring(2, 7)}`,
    lessonId: 1,
    type: 'fill_in_blank',
    grammarTopic: 'Trợ từ は (Chủ ngữ)',
    question: `${p1} [ ? ] ${j1.jp}です。`,
    translation: `${p1} là ${j1.vi}.`,
    options: ['は', 'の', 'も', 'か'],
    correctAnswer: 'は',
    explanation: `Trợ từ 「は」 đứng sau chủ ngữ/chủ đề 「${p1}」 để giới thiệu nghề nghiệp/thông tin.`,
    audioJp: `${p1}は ${j1.jp}です。`
  });

  // 2. Sinh câu hỏi phủ định じゃ ありません
  const p2 = people[Math.floor(Math.random() * people.length)];
  const c2 = countries[Math.floor(Math.random() * countries.length)];
  generated.push({
    id: `dyn-b1-neg-${Math.random().toString(36).substring(2, 7)}`,
    lessonId: 1,
    type: 'fill_in_blank',
    grammarTopic: 'Phủ định じゃ ありません',
    question: `${p2}は ${c2.person} [ ? ]。`,
    translation: `${p2} không phải là người ${c2.vi}.`,
    options: ['じゃ ありません', 'です', 'ですか', 'の です'],
    correctAnswer: 'じゃ ありません',
    explanation: `Để phủ định 「không phải là người ${c2.vi}」, dùng đuôi câu 「じゃ ありません」 hoặc 「では ありません」.`,
    audioJp: `${p2}は ${c2.person}じゃ ありません。`
  });

  // 3. Sinh câu hỏi xác nhận Q&A
  const p3 = people[Math.floor(Math.random() * people.length)];
  const j3 = jobs[Math.floor(Math.random() * jobs.length)];
  const j3Other = jobs.filter(j => j.jp !== j3.jp)[Math.floor(Math.random() * (jobs.length - 1))];
  generated.push({
    id: `dyn-b1-qa-${Math.random().toString(36).substring(2, 7)}`,
    lessonId: 1,
    type: 'qa_matching',
    grammarTopic: 'Câu hỏi xác nhận & Trả lời',
    question: `A: ${p3}は ${j3.jp}ですか。\nB: [ ? ]`,
    translation: `A: "${p3} là ${j3.vi} phải không?"`,
    options: [
      `いいえ、ちがいます。${j3Other.jp}です。`,
      `はい、${j3.jp}じゃ ありません。`,
      `わたしは ${j3.jp}です。`,
      `いいえ、そうです。`
    ],
    correctAnswer: `いいえ、ちがいます。${j3Other.jp}です。`,
    explanation: `Khi phủ định câu hỏi xác nhận, dùng 「いいえ、ちがいます」 kết hợp với thông tin đúng.`,
    audioJp: `いいえ、ちがいます。${j3Other.jp}です。`
  });

  return generated.slice(0, count);
}

function generateDynamicLesson2Questions(count = 5): GrammarQuizQuestion[] {
  const items = [
    { jp: 'ほん', vi: 'quyển sách' },
    { jp: 'かさ', vi: 'cái ô' },
    { jp: 'かばん', vi: 'cái túi' },
    { jp: 'ノート', vi: 'quyển vở' },
    { jp: 'ボールペン', vi: 'bút bi' },
    { jp: 'シャープペン', vi: 'bút chì kim' },
    { jp: 'スマホ', vi: 'điện thoại' },
    { jp: 'とけい', vi: 'đồng hồ' },
    { jp: 'くるま', vi: 'ô tô' },
    { jp: 'じしょ', vi: 'từ điển' },
    { jp: 'ざっし', vi: 'tạp chí' }
  ];

  const contentThemes = [
    { jp: 'にほんご', vi: 'tiếng Nhật' },
    { jp: 'えいご', vi: 'tiếng Anh' },
    { jp: 'くるま', vi: 'ô tô' },
    { jp: 'カメラ', vi: 'máy ảnh' },
    { jp: 'コンピューター', vi: 'máy tính' }
  ];

  const owners = [
    { jp: 'わたし', vi: 'tôi' },
    { jp: 'さとうさん', vi: 'anh/chị Satou' },
    { jp: 'のびたさん', vi: 'Nobita' },
    { jp: 'ドラえもんさん', vi: 'Doraemon' },
    { jp: 'かのじょ', vi: 'cô ấy' }
  ];

  const generated: GrammarQuizQuestion[] = [];

  // 1. Phân biệt これ/それ/あれ vs この/その/あの
  const item1 = items[Math.floor(Math.random() * items.length)];
  const owner1 = owners[Math.floor(Math.random() * owners.length)];
  const demonstratives = ['この', 'その', 'あの'];
  const chosenDemo = demonstratives[Math.floor(Math.random() * demonstratives.length)];
  const demoVi = chosenDemo === 'この' ? 'này' : chosenDemo === 'その' ? 'đó' : 'kia';

  generated.push({
    id: `dyn-b2-kono-${Math.random().toString(36).substring(2, 7)}`,
    lessonId: 2,
    type: 'fill_in_blank',
    grammarTopic: 'Cấu trúc この／その／あの + N',
    question: `[ ? ] ${item1.jp}は ${owner1.jp}のです。`,
    translation: `${item1.vi[0].toUpperCase() + item1.vi.slice(1)} ${demoVi} là của ${owner1.vi}.`,
    options: [chosenDemo, 'これ', 'それ', 'あれ'],
    correctAnswer: chosenDemo,
    explanation: `Vì phía sau có danh từ 「${item1.jp}」 đứng trực tiếp, ta bắt buộc phải dùng 「${chosenDemo}」 (chứ không dùng これ/それ/あれ đứng trước danh từ).`,
    audioJp: `${chosenDemo} ${item1.jp}は ${owner1.jp}のです。`
  });

  // 2. Sinh câu hỏi nội dung sách/báo: なんの N ですか
  const mediaItems = [
    { jp: 'じしょ', vi: 'từ điển' },
    { jp: 'ざっし', vi: 'tạp chí' },
    { jp: 'ほん', vi: 'sách' }
  ];
  const media = mediaItems[Math.floor(Math.random() * mediaItems.length)];
  const theme = contentThemes[Math.floor(Math.random() * contentThemes.length)];

  generated.push({
    id: `dyn-b2-content-${Math.random().toString(36).substring(2, 7)}`,
    lessonId: 2,
    type: 'qa_matching',
    grammarTopic: 'Câu hỏi nội dung: なんの N ですか',
    question: `A: これは なんの ${media.jp}ですか。\nB: [ ? ]`,
    translation: `A: "Đây là ${media.vi} về cái gì?"`,
    options: [
      `${theme.jp}の ${media.jp}です。`,
      `わたしの ${media.jp}です。`,
      `はい、そうです。`,
      `いいえ、${media.jp}じゃ ありません。`
    ],
    correctAnswer: `${theme.jp}の ${media.jp}です。`,
    explanation: `Câu hỏi 「なんの ${media.jp}ですか」 hỏi về chủ đề nội dung, trả lời: 「[Chủ đề: ${theme.jp}] の ${media.jp}です。」 (${media.vi[0].toUpperCase() + media.vi.slice(1)} về ${theme.vi}).`,
    audioJp: `${theme.jp}の ${media.jp}です。`
  });

  // 3. Sinh câu hỏi lựa chọn: N1ですか、N2ですか
  const itemA = items[Math.floor(Math.random() * items.length)];
  const itemB = items.filter(it => it.jp !== itemA.jp)[Math.floor(Math.random() * (items.length - 1))];
  const choice = Math.random() > 0.5 ? itemA : itemB;

  generated.push({
    id: `dyn-b2-choice-${Math.random().toString(36).substring(2, 7)}`,
    lessonId: 2,
    type: 'qa_matching',
    grammarTopic: 'Câu hỏi lựa chọn (〜ですか、〜ですか)',
    question: `A: これは ${itemA.jp}ですか、${itemB.jp}ですか。\nB: [ ? ]`,
    translation: `A: "Đây là ${itemA.vi} hay ${itemB.vi}?"`,
    options: [
      `${choice.jp}です。`,
      `はい、${choice.jp}です。`,
      `いいえ、ちがいます。`,
      `そうです。`
    ],
    correctAnswer: `${choice.jp}です。`,
    explanation: `Câu hỏi lựa chọn không dùng はい / いいえ mà chọn trực tiếp 1 trong 2 đáp án: 「${choice.jp}です。」`,
    audioJp: `${choice.jp}です。`
  });

  // 4. Sinh câu hỏi sở hữu: だれの N ですか
  const itemPoss = items[Math.floor(Math.random() * items.length)];
  const ownerPoss = owners[Math.floor(Math.random() * owners.length)];

  generated.push({
    id: `dyn-b2-dare-${Math.random().toString(36).substring(2, 7)}`,
    lessonId: 2,
    type: 'fill_in_blank',
    grammarTopic: 'Câu hỏi sở hữu (だれの N)',
    question: `それは [ ? ] の ${itemPoss.jp}ですか。`,
    translation: `Đó là ${itemPoss.vi} của ai?`,
    options: ['だれ', 'なん', 'どれ', 'どこ'],
    correctAnswer: 'だれ',
    explanation: `Từ để hỏi người sở hữu là 「だれ」(ai) ➔ 「だれの N ですか」(N của ai?).`,
    audioJp: `それは だれの ${itemPoss.jp}ですか。`
  });

  return generated.slice(0, count);
}

/**
 * Trả về danh sách câu hỏi cho một bài học (kết hợp câu hỏi tuyển chọn + sinh ngẫu nhiên)
 */
export function getQuestionsForLesson(lessonId: number, count = 10): GrammarQuizQuestion[] {
  const curated = CURATED_LESSON_QUESTIONS[lessonId] || [];
  
  // Sinh thêm câu hỏi động
  let dynamicList: GrammarQuizQuestion[] = [];
  if (lessonId === 1) {
    dynamicList = generateDynamicLesson1Questions(5);
  } else if (lessonId === 2) {
    dynamicList = generateDynamicLesson2Questions(5);
  }

  // Gộp cả câu hỏi tuyển chọn và câu hỏi động
  const combined = [...curated, ...dynamicList];
  if (combined.length === 0) return [];

  // Shuffle ngẫu nhiên
  const shuffled = combined.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

