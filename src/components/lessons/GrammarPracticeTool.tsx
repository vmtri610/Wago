'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GrammarQuizQuestion } from '@/types/grammarQuiz';
import { getQuestionsForLesson } from '@/lib/grammarQuizData';
import { speakJapanese } from '@/lib/audio';
import { 
  Volume2, CheckCircle2, XCircle, RotateCcw, ArrowRight, 
  Sparkles, HelpCircle, Eye, EyeOff, BookOpen, Trophy, 
  Check, ArrowLeft, Lightbulb, Zap
} from 'lucide-react';

interface GrammarPracticeToolProps {
  lessonId: number;
  lessonTitle: string;
  onBackToLesson?: () => void;
}

export default function GrammarPracticeTool({
  lessonId,
  lessonTitle,
  onBackToLesson
}: GrammarPracticeToolProps) {
  const [questions, setQuestions] = useState<GrammarQuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [scrambleAnswer, setScrambleAnswer] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [showTranslation, setShowTranslation] = useState(true);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [wrongQuestions, setWrongQuestions] = useState<GrammarQuizQuestion[]>([]);

  // Load questions on mount / lessonId change
  const startNewQuiz = useCallback(() => {
    const list = getQuestionsForLesson(lessonId, 10);
    setQuestions(list);
    setCurrentIndex(0);
    setSelectedOption(null);
    setScrambleAnswer([]);
    setIsAnswered(false);
    setIsCorrect(false);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setIsCompleted(false);
    setWrongQuestions([]);
  }, [lessonId]);

  useEffect(() => {
    startNewQuiz();
  }, [startNewQuiz]);

  const currentQ = questions[currentIndex];

  // Auto speak question or answer if autoSpeak is on
  const playAudio = useCallback((text: string) => {
    speakJapanese(text);
  }, []);

  // Handle Option Select (for MCQ / Fill-in / QA)
  const handleSelectOption = (option: string) => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(option);
    const correct = option === currentQ.correctAnswer;
    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      setScore(s => s + 1);
      setStreak(st => {
        const next = st + 1;
        setMaxStreak(m => Math.max(m, next));
        return next;
      });
      if (autoSpeak && currentQ.audioJp) {
        playAudio(currentQ.audioJp);
      }
    } else {
      setStreak(0);
      setWrongQuestions(prev => [...prev, currentQ]);
    }
  };

  // Handle Scramble Token Click
  const handleAddScrambleToken = (token: string, tokenIndex: number) => {
    if (isAnswered) return;
    setScrambleAnswer(prev => [...prev, token]);
  };

  const handleRemoveScrambleToken = (indexToRemove: number) => {
    if (isAnswered) return;
    setScrambleAnswer(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleCheckScramble = () => {
    if (isAnswered || !currentQ) return;
    const userTokens = scrambleAnswer;
    const correctTokens = currentQ.correctTokens || [];
    const correct = 
      userTokens.length === correctTokens.length && 
      userTokens.every((t, i) => t === correctTokens[i]);

    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      setScore(s => s + 1);
      setStreak(st => {
        const next = st + 1;
        setMaxStreak(m => Math.max(m, next));
        return next;
      });
      if (autoSpeak && currentQ.audioJp) {
        playAudio(currentQ.audioJp);
      }
    } else {
      setStreak(0);
      setWrongQuestions(prev => [...prev, currentQ]);
    }
  };

  // Move to next question or complete
  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setScrambleAnswer([]);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      setIsCompleted(true);
    }
  };

  // Keyboard navigation for Enter / 1-4
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCompleted || !currentQ) return;

      if (e.key === 'Enter' && isAnswered) {
        e.preventDefault();
        handleNextQuestion();
        return;
      }

      if (!isAnswered && currentQ.type !== 'word_scramble' && currentQ.options) {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const idx = parseInt(e.key, 10) - 1;
          if (idx < currentQ.options.length) {
            e.preventDefault();
            handleSelectOption(currentQ.options[idx]);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, isCompleted, currentQ, currentIndex, questions.length]);

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[var(--card-border)] p-8 text-center space-y-4 shadow-sm">
        <BookOpen className="w-12 h-12 mx-auto text-gray-400" />
        <h3 className="text-lg font-bold text-[var(--indigo-deep)]">Chưa có bài tập cho bài học này</h3>
        <p className="text-sm text-[var(--ink-soft)]">Dữ liệu bài tập đang được cập nhật thêm.</p>
        {onBackToLesson && (
          <button
            onClick={onBackToLesson}
            className="px-4 py-2 bg-[var(--indigo)] text-white rounded-xl text-sm font-medium hover:opacity-90"
          >
            Quay lại bài học
          </button>
        )}
      </div>
    );
  }

  // ==========================================
  // COMPLETED SCREEN
  // ==========================================
  if (isCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    const isGreat = percentage >= 80;

    return (
      <div className="bg-white rounded-2xl border border-[var(--card-border)] p-6 sm:p-8 shadow-sm space-y-6 max-w-2xl mx-auto">
        <div className="text-center space-y-3">
          <div className="inline-flex p-4 bg-amber-50 border border-amber-200 rounded-full text-amber-500 shadow-xs">
            <Trophy className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--indigo-deep)]">
            Hoàn thành luyện tập!
          </h2>
          <p className="text-sm text-[var(--ink-soft)]">
            {lessonTitle} • Luyện tập Ngữ pháp & Từ vựng
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#FAF9F5] border border-[var(--card-border)] p-4 rounded-xl text-center">
            <div className="text-2xl font-black text-[var(--indigo)]">
              {score} / {questions.length}
            </div>
            <div className="text-xs text-[var(--ink-soft)] font-medium mt-0.5">Điểm số</div>
          </div>
          <div className="bg-[#FAF9F5] border border-[var(--card-border)] p-4 rounded-xl text-center">
            <div className={`text-2xl font-black ${isGreat ? 'text-emerald-600' : 'text-amber-600'}`}>
              {percentage}%
            </div>
            <div className="text-xs text-[var(--ink-soft)] font-medium mt-0.5">Độ chính xác</div>
          </div>
          <div className="bg-[#FAF9F5] border border-[var(--card-border)] p-4 rounded-xl text-center">
            <div className="text-2xl font-black text-orange-500 flex items-center justify-center gap-1">
              <Zap className="w-5 h-5 fill-current" />
              {maxStreak}
            </div>
            <div className="text-xs text-[var(--ink-soft)] font-medium mt-0.5">Chuỗi đúng cao nhất</div>
          </div>
        </div>

        {/* List of wrong questions to review */}
        {wrongQuestions.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-bold text-[var(--indigo-deep)] flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-500" />
              Các câu cần lưu ý ôn lại ({wrongQuestions.length}):
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {wrongQuestions.map((wq, i) => (
                <div key={i} className="p-3.5 bg-rose-50/60 border border-rose-100 rounded-xl text-xs space-y-1.5">
                  <div className="font-bold text-rose-900 font-jp text-sm whitespace-pre-line">
                    {wq.question}
                  </div>
                  <div className="text-gray-600 italic">
                    {wq.translation}
                  </div>
                  <div className="text-emerald-700 font-medium font-jp flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Đáp án đúng: <span className="font-bold">{wq.correctAnswer}</span>
                  </div>
                  <div className="text-gray-600 pt-0.5 border-t border-rose-100">
                    💡 <span className="font-medium">Giải thích:</span> {wq.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={startNewQuiz}
            className="flex-1 py-3 px-4 bg-[var(--indigo)] text-white rounded-xl text-sm font-bold hover:opacity-90 transition flex items-center justify-center gap-2 shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Làm lại lượt mới
          </button>
          {onBackToLesson && (
            <button
              onClick={onBackToLesson}
              className="py-3 px-4 bg-white border border-[var(--card-border)] text-[var(--ink)] rounded-xl text-sm font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại lý thuyết
            </button>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // ACTIVE QUESTION SCREEN
  // ==========================================
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  // Unplaced tokens for word scramble
  const availableTokens = (currentQ.scrambleTokens || []).filter((token) => {
    const totalCount = (currentQ.scrambleTokens || []).filter(t => t === token).length;
    const usedCount = scrambleAnswer.filter(t => t === token).length;
    return usedCount < totalCount;
  });

  return (
    <div className="bg-white rounded-2xl border border-[var(--card-border)] shadow-sm overflow-hidden max-w-2xl mx-auto">
      {/* Top Header bar */}
      <div className="p-4 sm:p-5 border-b border-[var(--card-border)] bg-[#FCFBF8] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[var(--indigo)] font-bold text-xs">
            {currentIndex + 1}/{questions.length}
          </div>
          <div>
            <div className="text-xs font-bold text-[var(--indigo-deep)] line-clamp-1">
              {currentQ.grammarTopic}
            </div>
            <div className="text-[11px] text-[var(--ink-soft)]">
              Điểm: <span className="font-bold text-emerald-600">{score}</span>
              {streak > 1 && (
                <span className="ml-2 font-bold text-orange-500 inline-flex items-center gap-0.5">
                  <Zap className="w-3 h-3 fill-current" /> {streak} streak
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Toolbar toggles */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition ${
              showTranslation
                ? 'bg-indigo-50 border-indigo-200 text-[var(--indigo)]'
                : 'bg-white border-gray-200 text-gray-400'
            }`}
            title="Ẩn / Hiện bản dịch gợi ý"
          >
            {showTranslation ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition ${
              autoSpeak
                ? 'bg-indigo-50 border-indigo-200 text-[var(--indigo)]'
                : 'bg-white border-gray-200 text-gray-400'
            }`}
            title="Tự động phát âm khi trả lời đúng"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={startNewQuiz}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition"
            title="Bắt đầu lại"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress line */}
      <div className="w-full h-1 bg-gray-100">
        <div 
          className="h-full bg-[var(--indigo)] transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Question Body */}
      <div className="p-5 sm:p-7 space-y-6">
        {/* Question Prompt */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold px-2.5 py-0.5 bg-indigo-50 text-[var(--indigo)] rounded-full border border-indigo-100">
              {currentQ.type === 'fill_in_blank' && 'Điền vào chỗ trống [ ? ]'}
              {currentQ.type === 'mcq' && 'Trắc nghiệm chọn đáp án'}
              {currentQ.type === 'qa_matching' && 'Chọn câu trả lời phù hợp'}
              {currentQ.type === 'word_scramble' && 'Sắp xếp các từ thành câu'}
            </span>

            {currentQ.audioJp && (
              <button
                onClick={() => playAudio(currentQ.audioJp)}
                className="text-xs font-semibold text-[var(--indigo)] hover:underline flex items-center gap-1 p-1"
                title="Nghe câu"
              >
                <Volume2 className="w-4 h-4" />
                Nghe
              </button>
            )}
          </div>

          <div className="text-xl sm:text-2xl font-bold text-[var(--ink)] font-jp leading-relaxed whitespace-pre-line bg-[#FCFBF8] p-4 rounded-xl border border-[var(--card-border)]">
            {currentQ.question}
          </div>

          {showTranslation && currentQ.translation && (
            <div className="text-xs sm:text-sm text-[var(--ink-soft)] italic flex items-center gap-1.5 pl-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Gợi ý: {currentQ.translation}</span>
            </div>
          )}
        </div>

        {/* Interactive Interaction Area */}

        {/* 1. Word Scramble mode */}
        {currentQ.type === 'word_scramble' ? (
          <div className="space-y-4">
            {/* Placed tokens container */}
            <div className="min-h-[56px] p-3 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/30 flex flex-wrap gap-2 items-center">
              {scrambleAnswer.length === 0 ? (
                <span className="text-xs text-gray-400 italic">
                  Nhấn vào các từ bên dưới theo đúng thứ tự để xếp thành câu...
                </span>
              ) : (
                scrambleAnswer.map((token, idx) => (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleRemoveScrambleToken(idx)}
                    className={`px-3 py-1.5 rounded-lg font-jp text-sm font-bold shadow-xs transition flex items-center gap-1 ${
                      isAnswered
                        ? isCorrect
                          ? 'bg-emerald-500 text-white'
                          : 'bg-rose-500 text-white'
                        : 'bg-[var(--indigo)] text-white hover:bg-opacity-90'
                    }`}
                  >
                    <span>{token}</span>
                    {!isAnswered && <span className="text-indigo-200 text-xs">✕</span>}
                  </button>
                ))
              )}
            </div>

            {/* Available Tokens bank */}
            {!isAnswered && (
              <div className="flex flex-wrap gap-2 pt-1">
                {(currentQ.scrambleTokens || []).map((token, idx) => {
                  const usedCount = scrambleAnswer.filter(t => t === token).length;
                  const totalCount = (currentQ.scrambleTokens || []).filter(t => t === token).length;
                  const isUsed = usedCount >= totalCount;

                  return (
                    <button
                      key={idx}
                      disabled={isUsed}
                      onClick={() => handleAddScrambleToken(token, idx)}
                      className={`px-3 py-2 rounded-xl font-jp text-sm font-bold border transition ${
                        isUsed
                          ? 'opacity-25 bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-[var(--ink)] shadow-xs active:scale-95'
                      }`}
                    >
                      {token}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Check Button for Scramble */}
            {!isAnswered && (
              <div className="flex justify-end pt-2">
                <button
                  disabled={scrambleAnswer.length === 0}
                  onClick={handleCheckScramble}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm ${
                    scrambleAnswer.length > 0
                      ? 'bg-[var(--indigo)] text-white hover:opacity-95 active:scale-95'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Kiểm tra đáp án
                </button>
              </div>
            )}
          </div>
        ) : (
          /* 2. Options Grid (MCQ / Fill in blank / QA) */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentQ.options?.map((option, idx) => {
              const letter = String.fromCharCode(65 + idx); // A, B, C, D
              const isThisSelected = selectedOption === option;
              const isThisCorrect = option === currentQ.correctAnswer;

              let btnStyle = 'bg-white border-gray-200 text-[var(--ink)] hover:border-indigo-300 hover:bg-indigo-50/40';

              if (isAnswered) {
                if (isThisCorrect) {
                  btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-xs font-bold';
                } else if (isThisSelected && !isCorrect) {
                  btnStyle = 'bg-rose-50 border-rose-300 text-rose-800 opacity-90';
                } else {
                  btnStyle = 'bg-gray-50 border-gray-200 text-gray-400 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(option)}
                  className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 active:scale-[0.99] ${btnStyle}`}
                >
                  <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                    isAnswered && isThisCorrect
                      ? 'bg-emerald-500 text-white'
                      : isAnswered && isThisSelected && !isCorrect
                      ? 'bg-rose-500 text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {isAnswered && isThisCorrect ? <Check className="w-3.5 h-3.5" /> : letter}
                  </span>
                  <span className="font-jp font-bold text-sm sm:text-base leading-snug">
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Feedback Sheet (Appears after answer) */}
        {isAnswered && (
          <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200 ${
            isCorrect
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : 'bg-rose-50/70 border-rose-200 text-rose-900'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="font-bold text-sm text-emerald-800">Chính xác! Rất tốt 🎉</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span className="font-bold text-sm text-rose-800">Chưa chính xác!</span>
                  </>
                )}
              </div>

              {currentQ.audioJp && (
                <button
                  onClick={() => playAudio(currentQ.audioJp)}
                  className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1 shadow-2xs"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Nghe lại câu
                </button>
              )}
            </div>

            {!isCorrect && (
              <div className="text-xs sm:text-sm font-medium">
                👉 Đáp án đúng là:{' '}
                <span className="font-bold font-jp text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                  {currentQ.correctAnswer}
                </span>
              </div>
            )}

            {/* Grammar Explanation Box */}
            <div className="pt-2 border-t border-black/5 text-xs text-gray-700 space-y-1">
              <div className="font-bold text-gray-800 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                Giải thích ngữ pháp:
              </div>
              <p className="leading-relaxed pl-4">
                {currentQ.explanation}
              </p>
            </div>

            {/* Next Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2.5 bg-[var(--indigo)] text-white rounded-xl text-xs sm:text-sm font-bold hover:opacity-90 transition flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <span>{currentIndex + 1 < questions.length ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
