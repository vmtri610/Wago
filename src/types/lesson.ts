export type LessonStatus = 'not_started' | 'in_progress' | 'completed';

export interface GrammarExample {
  id: string;
  speaker?: string; // 'A' | 'B' | undefined
  jp: string;
  romaji?: string;
  vi: string;
  furigana?: string;
  note?: string;
}

export interface GrammarPoint {
  id: string;
  order: string; // e.g. "2", "3", "4", "4.1", "4.2", "5"
  title: string; // e.g. "N1 の N2", "N1 は N2 じゃ ありません"
  meaning: string; // e.g. "N2 của/thuộc N1"
  usage: string; // e.g. "Dùng khi nói về nơi làm việc của bản thân."
  formula?: string;
  responses?: {
    affirmative?: string[];
    negative?: string[];
  };
  notes?: string[];
  tips?: string[];
  examples: GrammarExample[];
}

export interface ExpansionItem {
  id: string;
  order: string; // "Mở rộng 2", "Mở rộng 3"
  title: string; // "Cách hỏi công việc", "Cách giới thiệu bản thân"
  meaning?: string;
  formula?: string;
  dialogue?: GrammarExample[];
  notes?: string[];
}

export interface LessonVocab {
  jp: string;
  romaji: string;
  vi: string;
  type?: string;
}

export interface Lesson {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  grammarCount: number;
  grammarPoints: GrammarPoint[];
  expansions?: ExpansionItem[];
  vocabulary?: LessonVocab[];
}
