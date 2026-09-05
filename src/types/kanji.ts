export interface KanjiVocabItem {
  kanji: string;
  furigana: string;
  romaji: string;
  vi: string;
  note?: string;
  tag?: string; // e.g. 'tháng', 'ngày', 'giờ', 'tầng', 'người', 'cái', 'tuổi', 'lần'
}

export interface KanjiExampleItem {
  speaker?: 'A' | 'B';
  jp: string;
  romaji?: string;
  vi: string;
  highlightWords?: string[]; // Từ cần gạch chân / đổi màu đỏ như trong sách
}

export interface KanjiCard {
  id: number; // 1, 2, 3, 4, 5
  code: string; // '01', '02', '03', '04', '05'
  character: string; // 一, 二, 三, 四, 五
  hanViet: string; // NHẤT, NHỊ, TAM, TỨ, NGŨ
  meaning: string; // Số một, Số hai...
  strokeCount: number;
  mnemonic: string; // Mẹo nhớ: 1 que diêm, 1 ngón tay...
  onReading: string; // いち・いっ
  kunReading: string; // ひと
  onVocab: KanjiVocabItem[];
  kunVocab: KanjiVocabItem[];
  onExamples: KanjiExampleItem[];
  kunExamples: KanjiExampleItem[];
  notes?: string[];
  tags: string[]; // ['Số đếm', 'Bài 1']
}

export interface RecurringCounter {
  id: string;
  name: string; // "Tháng", "Tầng", "Giờ", "Ngày", "Đếm người", "Đếm đồ vật nhỏ"
  suffix: string; // 〜月, 〜階, 〜時, 〜日, 〜人, 〜つ, 〜歳, 〜枚, 〜台, 〜本, 〜度
  reading: string; // 〜がつ, 〜かい, 〜じ, 〜にち/〜か, 〜にん, 〜つ, 〜さい, 〜まい, 〜だい, 〜ほん, 〜ど
  description: string;
  items: {
    num: number;
    kanji: string;
    furigana: string;
    vi: string;
    isSpecial?: boolean;
  }[];
}
