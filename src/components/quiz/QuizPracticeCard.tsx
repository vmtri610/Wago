'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Word } from '@/app/page';
import { speakJapanese } from '@/lib/audio';
import { 
  Volume2, VolumeX, Flag, ArrowRight, ArrowLeft, BookOpen, Layers, CheckSquare, 
  Headphones, RotateCcw, RefreshCw 
} from 'lucide-react';

interface QuizPracticeCardProps {
  quizMode: 'flashcard' | 'vi2jp' | 'mcq' | 'audio';
  onModeChange: (mode: 'flashcard' | 'vi2jp' | 'mcq' | 'audio') => void;
  currentCard: Word | null;
  currentIndex: number;
  totalCount: number;
  completedDeck: boolean;
  quizInput: string;
  onInputChange: (val: string) => void;
  quizFeedback: { type: 'ok' | 'no'; msg: string; oldLevel?: number; newLevel?: number } | null;
  quizMcqOptions: Word[];
  selectedMcqWordId: string | null;
  onSelectMcqChoice: (option: Word) => void;
  onCheckGrade: () => void;
  onAdvanceCard: () => void;
  onPrevCard?: () => void;
  canGoPrev?: boolean;
  isReviewingWrong?: boolean;
  sourceLessonId?: number | null;
  onBackToLesson?: () => void;
  onRestartDeck: () => void;
  onOpenReportModal: (word: Word) => void;
  renderSrsChip: (level?: number, isDue?: boolean) => React.ReactNode;
  autoSpeak: boolean;
  onToggleAutoSpeak: () => void;
}

export default function QuizPracticeCard({
  quizMode,
  onModeChange,
  currentCard,
  currentIndex,
  totalCount,
  completedDeck,
  quizInput,
  onInputChange,
  quizFeedback,
  quizMcqOptions,
  selectedMcqWordId,
  onSelectMcqChoice,
  onCheckGrade,
  onAdvanceCard,
  onPrevCard,
  canGoPrev = false,
  isReviewingWrong = false,
  sourceLessonId,
  onBackToLesson,
  onRestartDeck,
  onOpenReportModal,
  renderSrsChip,
  autoSpeak,
  onToggleAutoSpeak
}: QuizPracticeCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset card flip when card changes
  useEffect(() => {
    setIsFlipped(false);
  }, [currentCard?.id]);

  // Auto focus input when switching cards or resetting feedback in vi2jp mode
  useEffect(() => {
    if (quizMode === 'vi2jp' && !quizFeedback) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentCard?.id, quizMode, quizFeedback]);

  // Focus next button when feedback is shown in MCQ/Audio modes
  useEffect(() => {
    if (quizFeedback && quizMode !== 'vi2jp') {
      nextBtnRef.current?.focus();
    }
  }, [quizFeedback, quizMode]);

  // Global keyboard shortcuts for flashcard navigation
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.isComposing) return;

      const activeEl = document.activeElement;
      const isInputActive = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');

      // Flashcard navigation
      if (quizMode === 'flashcard' && !isInputActive) {
        if (e.key === 'ArrowLeft' && canGoPrev && onPrevCard) {
          e.preventDefault();
          onPrevCard();
        } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
          e.preventDefault();
          onAdvanceCard();
        } else if (e.key === ' ') {
          e.preventDefault();
          setIsFlipped(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [quizMode, canGoPrev, onPrevCard, onAdvanceCard]);

  return (
    <div className="space-y-4">
      {/* Mode Navigation Tabs */}
      <div className="flex flex-col sm:flex-row gap-2 pt-1 items-stretch sm:items-center justify-between border-b border-[var(--card-border)] pb-3">
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => onModeChange('flashcard')}
            className={`py-1.5 sm:py-2 px-3 sm:px-3.5 text-xs font-bold rounded-lg border transition flex items-center justify-center gap-1.5 shrink-0 ${
              quizMode === 'flashcard'
                ? 'bg-[var(--indigo)] text-white border-[var(--indigo)] shadow-xs'
                : 'bg-white text-[var(--ink-soft)] border-[var(--card-border)] hover:border-[var(--indigo)]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Flashcard
          </button>

          <button
            onClick={() => onModeChange('vi2jp')}
            className={`py-1.5 sm:py-2 px-3 sm:px-3.5 text-xs font-bold rounded-lg border transition flex items-center justify-center gap-1.5 shrink-0 ${
              quizMode === 'vi2jp'
                ? 'bg-[var(--indigo)] text-white border-[var(--indigo)] shadow-xs'
                : 'bg-white text-[var(--ink-soft)] border-[var(--card-border)] hover:border-[var(--indigo)]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Gõ chữ
          </button>

          <button
            onClick={() => onModeChange('mcq')}
            className={`py-1.5 sm:py-2 px-3 sm:px-3.5 text-xs font-bold rounded-lg border transition flex items-center justify-center gap-1.5 shrink-0 ${
              quizMode === 'mcq'
                ? 'bg-[var(--indigo)] text-white border-[var(--indigo)] shadow-xs'
                : 'bg-white text-[var(--ink-soft)] border-[var(--card-border)] hover:border-[var(--indigo)]'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" /> Trắc nghiệm
          </button>

          <button
            onClick={() => onModeChange('audio')}
            className={`py-1.5 sm:py-2 px-3 sm:px-3.5 text-xs font-bold rounded-lg border transition flex items-center justify-center gap-1.5 shrink-0 ${
              quizMode === 'audio'
                ? 'bg-[var(--indigo)] text-white border-[var(--indigo)] shadow-xs'
                : 'bg-white text-[var(--ink-soft)] border-[var(--card-border)] hover:border-[var(--indigo)]'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" /> Luyện nghe
          </button>
        </div>

        <button
          onClick={onToggleAutoSpeak}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition shrink-0 ${
            autoSpeak
              ? 'bg-indigo-50 border-[var(--indigo)] text-[var(--indigo)]'
              : 'bg-white border-gray-300 text-gray-400'
          }`}
          title="Tự động phát âm"
        >
          {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span className="text-[11px]">Tự động đọc</span>
        </button>
      </div>

      {/* Back to Lesson shortcut if opened from a specific lesson */}
      {sourceLessonId && onBackToLesson && (
        <div className="flex items-center pb-0.5">
          <button
            onClick={onBackToLesson}
            className="text-xs font-semibold text-[var(--indigo)] hover:underline flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-indigo-50/70 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Quay lại Bài học {sourceLessonId}
          </button>
        </div>
      )}

      {/* Card Practice Container */}
      <div className="bg-[#FFFDF9] border border-[var(--card-border)] p-4 sm:p-6 rounded-2xl text-center space-y-4 shadow-2xs">
        {completedDeck ? (
          <div className="py-8 space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-[var(--indigo-deep)]">Hoàn thành bài luyện tập!</h3>
            <p className="text-xs text-[var(--ink-soft)]">Bạn đã hoàn thành tất cả các từ vựng trong danh sách.</p>
            <button
              onClick={onRestartDeck}
              className="px-6 py-2.5 bg-[var(--indigo)] text-white text-xs font-bold rounded-xl hover:bg-[var(--indigo-deep)] inline-flex items-center gap-2 shadow"
            >
              <RotateCcw className="w-4 h-4" /> Làm lại từ đầu
            </button>
          </div>
        ) : currentCard ? (
          <>
            {/* Header info */}
            <div className="flex justify-between items-center text-xs text-[var(--ink-soft)] font-semibold border-b border-[var(--card-border)] pb-3">
              <div className="flex items-center gap-2">
                {isReviewingWrong ? (
                  <span 
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300"
                    title="Ôn tập lại từ chưa đúng"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />
                    <span>{currentIndex} / {totalCount}</span>
                  </span>
                ) : (
                  <span>Tiến độ: {currentIndex} / {totalCount}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenReportModal(currentCard)}
                  className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition flex items-center gap-1"
                  title="Báo lỗi"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span className="text-[10px] hidden sm:inline font-medium">Báo lỗi</span>
                </button>
                {renderSrsChip(currentCard.srs_level)}
              </div>
            </div>

            {/* MODE 1: FLASHCARD MODE */}
            {quizMode === 'flashcard' && (
              <div className="py-2 sm:py-4 space-y-4 sm:space-y-5">
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="min-h-[170px] sm:min-h-[220px] border border-[var(--card-border)] hover:border-[var(--indigo)] rounded-2xl p-4 sm:p-6 bg-white flex flex-col items-center justify-center cursor-pointer transition shadow-xs hover:shadow-md relative select-none"
                >
                  {!isFlipped ? (
                    /* FRONT: TIẾNG NHẬT */
                    <div className="space-y-2 sm:space-y-3 text-center my-auto w-full px-2">
                      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                        <span className="text-xl sm:text-2xl md:text-3xl font-medium font-jp text-[var(--indigo-deep)] leading-relaxed break-words max-w-full">
                          {currentCard.jp}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speakJapanese(currentCard.jp);
                          }}
                          className="p-1.5 sm:p-2 text-[var(--indigo)] hover:bg-indigo-50 rounded-full transition shrink-0"
                          title="Nghe phát âm"
                        >
                          <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                      </div>
                      {currentCard.romaji && (
                        <div className="text-xs sm:text-sm font-jetbrains font-semibold text-[var(--indigo)] break-words">
                          {currentCard.romaji}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* BACK: TIẾNG VIỆT (Chỉ hiển thị nghĩa Tiếng Việt) */
                    <div className="text-center my-auto w-full px-2">
                      <div className="text-lg sm:text-2xl md:text-3xl font-bold text-[var(--ink)] leading-snug break-words max-w-full">
                        {currentCard.vi}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-4 pt-1">
                  <button
                    onClick={onPrevCard}
                    disabled={!canGoPrev}
                    className="p-3 bg-white border border-[var(--card-border)] hover:bg-gray-50 hover:border-[var(--indigo)] text-[var(--ink)] disabled:opacity-30 disabled:pointer-events-none rounded-full transition flex items-center justify-center shadow-xs active:scale-95"
                    title="Quay lại thẻ trước (Phím ←)"
                    aria-label="Quay lại thẻ trước"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={onAdvanceCard}
                    className="p-3 bg-[var(--indigo)] hover:bg-[var(--indigo-deep)] text-white rounded-full transition flex items-center justify-center shadow active:scale-95"
                    title={currentIndex >= totalCount ? 'Hoàn thành' : 'Tiếp theo (Phím → hoặc Enter)'}
                    aria-label="Thẻ tiếp theo"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* MODE 2: VI2JP (Gõ chữ) */}
            {quizMode === 'vi2jp' && (
              <>
                <div className="py-3 sm:py-4 space-y-1">
                  <div className="text-base sm:text-xl md:text-2xl font-bold text-[var(--ink)] leading-snug break-words px-2">
                    {currentCard.vi}
                  </div>
                  {quizFeedback && (
                    <div className="text-sm sm:text-base font-medium font-jp text-[var(--indigo-deep)] mt-3 flex items-center justify-center gap-2 flex-wrap">
                      <span>{currentCard.jp}</span>
                      <span className="font-jetbrains text-xs font-semibold text-[var(--indigo)]">({currentCard.romaji})</span>
                      <button onClick={() => speakJapanese(currentCard.jp)} className="p-1 text-[var(--indigo)] hover:bg-indigo-50 rounded-full">
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <input
                  ref={inputRef}
                  type="text"
                  value={quizInput}
                  onChange={(e) => onInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      e.stopPropagation();
                      if (quizFeedback) {
                        onAdvanceCard();
                      } else {
                        onCheckGrade();
                      }
                    }
                  }}
                  readOnly={quizFeedback !== null}
                  placeholder="Nhập tiếng Nhật hoặc Romaji..."
                  className={`w-full text-center py-2.5 sm:py-3 border border-[var(--card-border)] rounded-xl text-base sm:text-lg font-jp focus:outline-none focus:border-[var(--indigo)] bg-white shadow-2xs ${
                    quizFeedback ? 'bg-gray-50/60 cursor-default' : ''
                  }`}
                  autoFocus
                />
              </>
            )}

            {/* MODE 3 & 4: MCQ / AUDIO */}
            {(quizMode === 'mcq' || quizMode === 'audio') && (
              <>
                <div className="py-2 space-y-3 border-b border-[var(--card-border)] pb-3 flex flex-col items-center justify-center">
                  {quizMode === 'mcq' ? (
                    <div className="space-y-1">
                      <div className="text-base sm:text-lg md:text-xl font-bold text-[var(--ink)] leading-snug break-words px-2">
                        {currentCard.vi}
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => speakJapanese(currentCard.jp)}
                        className="p-4 sm:p-5 bg-indigo-50 border-2 border-[var(--indigo)] text-[var(--indigo)] rounded-full hover:bg-indigo-100 active:scale-95 transition shadow-sm inline-flex items-center justify-center"
                        title="Nghe lại"
                      >
                        <Volume2 className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse text-[var(--indigo)]" />
                      </button>
                      {quizFeedback && (
                        <div className="text-sm sm:text-base font-bold font-jp text-[var(--indigo-deep)] break-words">
                          {currentCard.jp}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2">
                  {quizMcqOptions.map((opt, idx) => {
                    const isSelected = selectedMcqWordId === opt.id;
                    const isTarget = opt.id === currentCard.id;

                    let style = 'bg-white border-[var(--card-border)] text-[var(--ink)] hover:border-[var(--indigo)] hover:bg-indigo-50/50';

                    if (quizFeedback) {
                      if (isTarget) {
                        style = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold shadow-xs';
                      } else if (isSelected && !isTarget) {
                        style = 'bg-rose-100 border-rose-500 text-rose-900 font-bold shadow-xs';
                      } else {
                        style = 'bg-gray-50 border-gray-200 text-gray-400 opacity-60 pointer-events-none';
                      }
                    }

                    return (
                      <button
                        key={opt.id || idx}
                        onClick={() => onSelectMcqChoice(opt)}
                        disabled={quizFeedback !== null}
                        className={`p-2.5 sm:p-4 border-2 rounded-xl text-center min-h-[56px] sm:min-h-[64px] flex flex-col items-center justify-center transition ${style}`}
                      >
                        <span className="text-xs sm:text-base font-medium font-jp break-words leading-tight">
                          {opt.jp}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Feedback Message */}
            {quizFeedback && (
              <div className="space-y-1 pt-2">
                <div className={`text-xs sm:text-sm font-semibold transition ${quizFeedback.type === 'ok' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {quizFeedback.msg}
                </div>
              </div>
            )}

            {/* Controls */}
            {quizFeedback ? (
              <div className="pt-2">
                <button
                  ref={nextBtnRef}
                  onClick={onAdvanceCard}
                  autoFocus
                  className="w-full py-3 bg-[var(--indigo)] text-white rounded-xl text-xs font-bold hover:bg-[var(--indigo-deep)] transition flex items-center justify-center gap-1.5 shadow focus:ring-2 focus:ring-[var(--indigo)]"
                >
                  Tiếp tục <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : quizMode === 'vi2jp' && (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={onAdvanceCard}
                  className="px-4 py-2.5 border border-gray-300 text-[var(--ink-soft)] rounded-xl text-xs font-semibold hover:bg-gray-100"
                >
                  Bỏ qua
                </button>
                <button
                  onClick={onCheckGrade}
                  className="flex-1 py-2.5 bg-[var(--indigo)] text-white rounded-xl text-xs font-bold hover:bg-[var(--indigo-deep)] transition shadow"
                >
                  Kiểm tra
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-8 text-xs sm:text-sm text-[var(--ink-soft)]">
            Chưa có từ vựng phù hợp trong bài / thư mục đã chọn.
          </div>
        )}
      </div>
    </div>
  );
}
