export type QuizQuestionType = 'fill_in_blank' | 'mcq' | 'qa_matching' | 'word_scramble';

export interface GrammarQuizQuestion {
  id: string;
  lessonId: number;
  grammarPointId?: string;
  type: QuizQuestionType;
  grammarTopic: string;
  question: string;
  translation: string;
  options?: string[];
  correctAnswer: string;
  scrambleTokens?: string[];
  correctTokens?: string[];
  explanation: string;
  audioJp: string;
}
