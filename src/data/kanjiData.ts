import { KanjiCard, RecurringCounter } from '@/types/kanji';

export const KANJI_LIST: KanjiCard[] = [
  {
    id: 1,
    code: '01',
    character: '一',
    hanViet: 'NHẤT',
    meaning: 'Số một',
    strokeCount: 1,
    mnemonic: '1 que diêm, 1 ngón tay',
    onReading: 'いち・いっ',
    kunReading: 'ひと',
    tags: ['Số đếm', 'Bài 1', 'N5'],
    notes: ['(*) 一日: còn có cách đọc khác là ついたち: ngày mồng 1'],
    onVocab: [
      { kanji: '一', furigana: 'いち', romaji: 'ichi', vi: 'Số một', tag: 'số' },
      { kanji: '一時', furigana: 'いちじ', romaji: 'ichiji', vi: 'Một giờ', tag: 'giờ' },
      { kanji: '一日', furigana: 'いちにち', romaji: 'ichinichi', vi: 'Một ngày (*)', note: 'Đọc là ついたち khi chỉ ngày mồng 1', tag: 'ngày' },
      { kanji: '一月', furigana: 'いちがつ', romaji: 'ichigatsu', vi: 'Tháng 1', tag: 'tháng' },
      { kanji: '一歳', furigana: 'いっさい', romaji: 'issai', vi: 'Một tuổi', tag: 'tuổi' },
      { kanji: '一度', furigana: 'いちど', romaji: 'ichido', vi: 'Một lần', tag: 'lần' }
    ],
    kunVocab: [
      { kanji: '一つ', furigana: 'ひとつ', romaji: 'hitotsu', vi: 'Một cái', tag: 'cái' },
      { kanji: '一人', furigana: 'ひとり', romaji: 'hitori', vi: 'Một người, một mình', tag: 'người' }
    ],
    onExamples: [
      {
        jp: 'いま、おとうとは 一歳 です。',
        romaji: 'Ima, otouto wa issai desu.',
        vi: 'Bây giờ em trai tôi 1 tuổi.',
        highlightWords: ['一歳']
      }
    ],
    kunExamples: [
      {
        jp: 'コーヒー 一つ おねがいします。',
        romaji: 'Koohii hitotsu onegaishimasu.',
        vi: 'Cho tôi xin một ly cà phê.',
        highlightWords: ['一つ']
      }
    ]
  },
  {
    id: 2,
    code: '02',
    character: '二',
    hanViet: 'NHỊ',
    meaning: 'Số hai',
    strokeCount: 2,
    mnemonic: '2 que diêm, 2 ngón tay',
    onReading: 'に',
    kunReading: 'ふた、ふつ',
    tags: ['Số đếm', 'Bài 1', 'N5'],
    onVocab: [
      { kanji: '二', furigana: 'に', romaji: 'ni', vi: 'Số hai', tag: 'số' },
      { kanji: '二時', furigana: 'にじ', romaji: 'niji', vi: '2 giờ', tag: 'giờ' },
      { kanji: '二階', furigana: 'にかい', romaji: 'nikai', vi: 'Tầng 2', tag: 'tầng' }
    ],
    kunVocab: [
      { kanji: '二人', furigana: 'ふたり', romaji: 'futari', vi: '2 người', tag: 'người' },
      { kanji: '二日', furigana: 'ふつか', romaji: 'futsuka', vi: 'Ngày mùng 2, 2 ngày', tag: 'ngày' }
    ],
    onExamples: [
      {
        speaker: 'A',
        jp: 'A: トイレは どこ ですか？',
        romaji: 'Toire wa doko desu ka?',
        vi: 'Nhà vệ sinh ở đâu vậy?'
      },
      {
        speaker: 'B',
        jp: 'B: 二階 です。',
        romaji: 'Nikai desu.',
        vi: 'Ở tầng 2 ạ.',
        highlightWords: ['二階']
      }
    ],
    kunExamples: [
      {
        jp: 'きょうは 一月 二日 です。',
        romaji: 'Kyou wa ichigatsu futsuka desu.',
        vi: 'Hôm nay là ngày 2 tháng 1.',
        highlightWords: ['二日', '一月']
      }
    ]
  },
  {
    id: 3,
    code: '03',
    character: '三',
    hanViet: 'TAM',
    meaning: 'Số ba',
    strokeCount: 3,
    mnemonic: '3 que diêm, 3 ngón tay',
    onReading: 'さん',
    kunReading: 'みっ',
    tags: ['Số đếm', 'Bài 1', 'N5'],
    onVocab: [
      { kanji: '三', furigana: 'さん', romaji: 'san', vi: 'Số ba', tag: 'số' },
      { kanji: '三月', furigana: 'さんがつ', romaji: 'sangatsu', vi: 'Tháng 3', tag: 'tháng' },
      { kanji: '三枚', furigana: 'さんまい', romaji: 'sanmai', vi: '3 tờ, tấm (vật mỏng)', tag: 'tờ/tấm' }
    ],
    kunVocab: [
      { kanji: '三日', furigana: 'みっか', romaji: 'mikka', vi: 'Ngày mùng 3, 3 ngày', tag: 'ngày' },
      { kanji: '三つ', furigana: 'みっつ', romaji: 'mittsu', vi: '3 cái', tag: 'cái' }
    ],
    onExamples: [
      {
        speaker: 'A',
        jp: 'A: 今月は 何月 ですか。',
        romaji: 'Kongetsu wa nangatsu desu ka.',
        vi: 'Tháng này là tháng mấy?'
      },
      {
        speaker: 'B',
        jp: 'B: 三月 です。',
        romaji: 'Sangatsu desu.',
        vi: 'Là tháng 3.',
        highlightWords: ['三月']
      }
    ],
    kunExamples: [
      {
        jp: 'あしたは 三日 じゃありません。',
        romaji: 'Ashita wa mikka ja arimasen.',
        vi: 'Ngày mai không phải là ngày mùng 3.',
        highlightWords: ['三日']
      }
    ]
  },
  {
    id: 4,
    code: '04',
    character: '四',
    hanViet: 'TỨ',
    meaning: 'Số bốn',
    strokeCount: 5,
    mnemonic: 'Hình ảnh cửa sổ, có rèm cửa',
    onReading: 'し',
    kunReading: 'よん、よっ、よ',
    tags: ['Số đếm', 'Bài 1', 'N5'],
    onVocab: [
      { kanji: '四月', furigana: 'しがつ', romaji: 'shigatsu', vi: 'Tháng 4 (đặc biệt đọc là し)', tag: 'tháng' }
    ],
    kunVocab: [
      { kanji: '四', furigana: 'よん', romaji: 'yon', vi: 'Số 4', tag: 'số' },
      { kanji: '四時', furigana: 'よじ', romaji: 'yoji', vi: '4 giờ (đặc biệt đọc là よ)', tag: 'giờ' },
      { kanji: '四つ', furigana: 'よっつ', romaji: 'yottsu', vi: '4 cái', tag: 'cái' },
      { kanji: '四台', furigana: 'よんだい', romaji: 'yondai', vi: '4 cái (máy móc hoặc phương tiện)', tag: 'máy móc' }
    ],
    onExamples: [
      {
        jp: 'こんげつは 四月 じゃありません。',
        romaji: 'Kongetsu wa shigatsu ja arimasen.',
        vi: 'Tháng này không phải là tháng 4.',
        highlightWords: ['四月']
      }
    ],
    kunExamples: [
      {
        speaker: 'A',
        jp: 'A: いま なんじですか？',
        romaji: 'Ima nanji desu ka?',
        vi: 'Bây giờ là mấy giờ?'
      },
      {
        speaker: 'B',
        jp: 'B: 四時 です。',
        romaji: 'Yoji desu.',
        vi: 'Bây giờ là 4 giờ.',
        highlightWords: ['四時']
      }
    ]
  },
  {
    id: 5,
    code: '05',
    character: '五',
    hanViet: 'NGŨ',
    meaning: 'Số năm',
    strokeCount: 4,
    mnemonic: 'Chữ (T) và chữ YU (ユ) đan xen với nhau tạo thành chữ NGŨ (五)',
    onReading: 'ご',
    kunReading: 'いつ',
    tags: ['Số đếm', 'Bài 1', 'N5'],
    onVocab: [
      { kanji: '五', furigana: 'ご', romaji: 'go', vi: 'Số 5', tag: 'số' },
      { kanji: '五月', furigana: 'ごがつ', romaji: 'gogatsu', vi: 'Tháng 5', tag: 'tháng' },
      { kanji: '五本', furigana: 'ごほん', romaji: 'gohon', vi: '5 cái (vật dài)', tag: 'vật dài' }
    ],
    kunVocab: [
      { kanji: '五つ', furigana: 'いつつ', romaji: 'itsutsu', vi: '5 cái', tag: 'cái' },
      { kanji: '五日', furigana: 'いつか', romaji: 'itsuka', vi: 'Ngày mùng 5, 5 ngày', tag: 'ngày' }
    ],
    onExamples: [
      {
        speaker: 'A',
        jp: 'A: これは「三」ですか。「五」ですか。',
        romaji: 'Kore wa "san" desu ka. "go" desu ka.',
        vi: 'Cái này là "3" hay là "5"?'
      },
      {
        speaker: 'B',
        jp: 'B: これは「五」です。',
        romaji: 'Kore wa "go" desu.',
        vi: 'Đây là số "5".',
        highlightWords: ['五', '三']
      }
    ],
    kunExamples: [
      {
        jp: 'みかん 五つ ください。',
        romaji: 'Mikan itsutsu kudasai.',
        vi: 'Cho tôi xin 5 quả quýt.',
        highlightWords: ['五つ']
      }
    ]
  }
];

/**
 * BẢNG TỔNG HỢP CÁC TỪ & ĐƠN VỊ ĐẾM LẶP LẠI (THÁNG, TẦNG, GIỜ, NGÀY, NGƯỜI, CÁI...)
 * Giúp người học củng cố quy tắc đọc và ghi nhớ từ vựng lặp lại nhanh chóng.
 */
export const RECURRING_COUNTERS: RecurringCounter[] = [
  {
    id: 'month',
    name: 'Đếm Tháng (Tháng 1 -> 5)',
    suffix: '〜月',
    reading: '〜がつ',
    description: 'Ghép Số + 月 (がつ). Chú ý riêng Tháng 4 đọc là しがつ (không đọc là よんがつ).',
    items: [
      { num: 1, kanji: '一月', furigana: 'いちがつ', vi: 'Tháng 1' },
      { num: 2, kanji: '二月', furigana: 'にがつ', vi: 'Tháng 2' },
      { num: 3, kanji: '三月', furigana: 'さんがつ', vi: 'Tháng 3' },
      { num: 4, kanji: '四月', furigana: 'しがつ', vi: 'Tháng 4 (Âm On: し)', isSpecial: true },
      { num: 5, kanji: '五月', furigana: 'ごがつ', vi: 'Tháng 5' }
    ]
  },
  {
    id: 'day',
    name: 'Đếm Ngày (Mùng 1 -> 5)',
    suffix: '〜日',
    reading: '〜にち / 〜か',
    description: 'Từ mùng 1 đến mùng 10 dùng âm thuần Nhật (Kun) đặc biệt.',
    items: [
      { num: 1, kanji: '一日', furigana: 'ついたち', vi: 'Mùng 1 (Khoảng 1 ngày: いちにち)', isSpecial: true },
      { num: 2, kanji: '二日', furigana: 'ふつか', vi: 'Mùng 2, 2 ngày', isSpecial: true },
      { num: 3, kanji: '三日', furigana: 'みっか', vi: 'Mùng 3, 3 ngày', isSpecial: true },
      { num: 4, kanji: '四日', furigana: 'よっか', vi: 'Mùng 4, 4 ngày', isSpecial: true },
      { num: 5, kanji: '五日', furigana: 'いつか', vi: 'Mùng 5, 5 ngày', isSpecial: true }
    ]
  },
  {
    id: 'hour',
    name: 'Đếm Giờ (1 giờ -> 5 giờ)',
    suffix: '〜時',
    reading: '〜じ',
    description: 'Ghép Số + 時 (じ). Chú ý riêng 4 giờ đọc là よじ (bỏ ん).',
    items: [
      { num: 1, kanji: '一時', furigana: 'いちじ', vi: '1 giờ' },
      { num: 2, kanji: '二時', furigana: 'にじ', vi: '2 giờ' },
      { num: 3, kanji: '三時', furigana: 'さんじ', vi: '3 giờ' },
      { num: 4, kanji: '四時', furigana: 'よじ', vi: '4 giờ (Âm Kun: よ)', isSpecial: true },
      { num: 5, kanji: '五時', furigana: 'ごじ', vi: '5 giờ' }
    ]
  },
  {
    id: 'items',
    name: 'Đếm Đồ Vật Nhỏ (1 cái -> 5 cái)',
    suffix: '〜つ',
    reading: '〜つ',
    description: 'Đếm số lượng đồ vật chung thuần Nhật (Kunyomi).',
    items: [
      { num: 1, kanji: '一つ', furigana: 'ひとつ', vi: '1 cái' },
      { num: 2, kanji: '二つ', furigana: 'ふたつ', vi: '2 cái' },
      { num: 3, kanji: '三つ', furigana: 'みっつ', vi: '3 cái' },
      { num: 4, kanji: '四つ', furigana: 'よっつ', vi: '4 cái' },
      { num: 5, kanji: '五つ', furigana: 'いつつ', vi: '5 cái' }
    ]
  },
  {
    id: 'people',
    name: 'Đếm Người (1 người -> 5 người)',
    suffix: '〜人',
    reading: '〜にん',
    description: '1 người (ひとり) và 2 người (ふたり) đọc đặc biệt, từ 3 người đọc 〜にん.',
    items: [
      { num: 1, kanji: '一人', furigana: 'ひとり', vi: '1 người, một mình', isSpecial: true },
      { num: 2, kanji: '二人', furigana: 'ふたり', vi: '2 người', isSpecial: true },
      { num: 3, kanji: '三人', furigana: 'さんにん', vi: '3 người' },
      { num: 4, kanji: '四人', furigana: 'よにん', vi: '4 người (đọc là よにん)', isSpecial: true },
      { num: 5, kanji: '五人', furigana: 'ごにん', vi: '5 người' }
    ]
  },
  {
    id: 'floor',
    name: 'Đếm Tầng (Tầng 1 -> 5)',
    suffix: '〜階',
    reading: '〜かい / 〜がい',
    description: 'Đếm số tầng của tòa nhà.',
    items: [
      { num: 1, kanji: '一階', furigana: 'いっかい', vi: 'Tầng 1 (biến âm いっ)', isSpecial: true },
      { num: 2, kanji: '二階', furigana: 'にかい', vi: 'Tầng 2' },
      { num: 3, kanji: '三階', furigana: 'さんがい / さんかい', vi: 'Tầng 3 (biến âm がい)', isSpecial: true },
      { num: 4, kanji: '四階', furigana: 'よんかい', vi: 'Tầng 4' },
      { num: 5, kanji: '五階', furigana: 'ごかい', vi: 'Tầng 5' }
    ]
  },
  {
    id: 'age',
    name: 'Đếm Tuổi (1 tuổi -> 5 tuổi)',
    suffix: '〜歳',
    reading: '〜さい',
    description: '1 tuổi biến âm thành いっさい.',
    items: [
      { num: 1, kanji: '一歳', furigana: 'いっさい', vi: '1 tuổi', isSpecial: true },
      { num: 2, kanji: '二歳', furigana: 'にさい', vi: '2 tuổi' },
      { num: 3, kanji: '三歳', furigana: 'さんさい', vi: '3 tuổi' },
      { num: 4, kanji: '四歳', furigana: 'よんさい', vi: '4 tuổi' },
      { num: 5, kanji: '五歳', furigana: 'ごさい', vi: '5 tuổi' }
    ]
  },
  {
    id: 'other_counters',
    name: 'Các Hậu Tố / Đơn Vị Đếm Khác',
    suffix: '〜枚, 〜台, 〜本, 〜度',
    reading: '〜まい, 〜だい, 〜ほん, 〜ど',
    description: 'Đếm tờ/tấm mỏng (枚), máy móc phương tiện (台), đồ vật dài hình trụ (本), số lần (度).',
    items: [
      { num: 1, kanji: '一度', furigana: 'いちど', vi: '1 lần (度 = lần)' },
      { num: 3, kanji: '三枚', furigana: 'さんまい', vi: '3 tờ/tấm (枚 = giấy, áo, vé...)' },
      { num: 4, kanji: '四台', furigana: 'よんだい', vi: '4 chiếc/cái (台 = xe, máy tính, TV...)' },
      { num: 5, kanji: '五本', furigana: 'ごほん', vi: '5 cái/cây (本 = bút, chai, cây...)' }
    ]
  }
];
