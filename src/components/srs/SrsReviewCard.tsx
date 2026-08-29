'use client';

import React from 'react';
import { Word } from '@/app/page';
import { speakJapanese } from '@/lib/audio';
import { Volume2, VolumeX, Flag, ArrowRight, BookOpen, CheckSquare, Headphones } from 'lucide-react';

interface SrsReviewCardProps {
  currentCard: Word;
  currentIndex: number;
  totalCount: number;
  srsQuizMode: 'vi2jp' | 'mcq' | 'audio';
  onModeChange: (mode: 'vi2jp' | 'mcq' | 'audio') => void;
  srsInput: string;
  onInputChange: (val: string) => void;
  srsFeedback: { type: 'ok' | 'no'; msg: string; oldLevel?: number; newLevel?: number } | null;
  srsMcqOptions: Word[];
  selectedMcqWordId: string | null;
  onSelectMcqChoice: (option: Word) => void;
  onCheckGrade: () => void;
  onAdvanceCard: () => void;
  onOpenReportModal: (word: Word) => void;
  renderSrsChip: (level?: number, isDue?: boolean) => React.ReactNode;
  autoSpeak: boolean;
  onToggleAutoSpeak: () => void;
}

export default function SrsReviewCard({
  currentCard,
  currentIndex,
  totalCount,
  srsQuizMode,
  onModeChange,
  srsInput,
  onInputChange,
  srsFeedback,
  srsMcqOptions,
  selectedMcqWordId,
  onSelectMcqChoice,
  onCheckGrade,
  onAdvanceCard,
  onOpenReportModal,
  renderSrsChip,
  autoSpeak,
  onToggleAutoSpeak
}: SrsReviewCardProps) {
  return (
    <div className="space-y-4">
      {/* SRS Quiz Mode Switcher Header */}
      <div className="flex flex-col sm:flex-row gap-2 pt-1 items-stretch sm:items-center justify-between border-b border-[var(--card-border)] pb-3">
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => onModeChange('vi2jp')}
            className={`py-1.5 sm:py-2 px-3 sm:px-3.5 text-xs font-bold rounded-lg border transition flex items-center justify-center gap-1.5 shrink-0 ${
              srsQuizMode === 'vi2jp'
                ? 'bg-[var(--indigo)] text-white border-[var(--indigo)] shadow-xs'
                : 'bg-white text-[var(--ink-soft)] border-[var(--card-border)] hover:border-[var(--indigo)]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Gõ chữ
          </button>

          <button
            onClick={() => onModeChange('mcq')}
            className={`py-1.5 sm:py-2 px-3 sm:px-3.5 text-xs font-bold rounded-lg border transition flex items-center justify-center gap-1.5 shrink-0 ${
              srsQuizMode === 'mcq'
                ? 'bg-[var(--indigo)] text-white border-[var(--indigo)] shadow-xs'
                : 'bg-white text-[var(--ink-soft)] border-[var(--card-border)] hover:border-[var(--indigo)]'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" /> Trắc nghiệm
          </button>

          <button
            onClick={() => onModeChange('audio')}
            className={`py-1.5 sm:py-2 px-3 sm:px-3.5 text-xs font-bold rounded-lg border transition flex items-center justify-center gap-1.5 shrink-0 ${
              srsQuizMode === 'audio'
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

      {/* Main Review Card Box */}
      <div className="bg-[#FFFDF9] border border-[var(--card-border)] p-4 sm:p-6 rounded-2xl text-center space-y-4 shadow-2xs">
        <div className="flex justify-between items-center text-xs text-[var(--ink-soft)] font-semibold border-b border-[var(--card-border)] pb-3">
          <span>Tiến độ: {currentIndex} / {totalCount}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenReportModal(currentCard)}
              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition flex items-center gap-1"
              title="Báo lỗi"
            >
              <Flag className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden sm:inline font-medium">Báo lỗi</span>
            </button>
            {renderSrsChip(currentCard.srs_level, true)}
          </div>
        </div>

        {/* MODE 1: VI2JP (Default Gõ chữ) */}
        {srsQuizMode === 'vi2jp' && (
          <>
            <div className="py-3 sm:py-4 space-y-1">
              <div className="text-base sm:text-xl md:text-2xl font-bold text-[var(--ink)] leading-snug break-words px-2">
                {currentCard.vi}
              </div>
              {srsFeedback && (
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
              type="text"
              value={srsInput}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (srsFeedback) {
                    onAdvanceCard();
                  } else {
                    onCheckGrade();
                  }
                }
              }}
              placeholder="Nhập tiếng Nhật hoặc Romaji..."
              className="w-full text-center py-2.5 sm:py-3 border border-[var(--card-border)] rounded-xl text-base sm:text-lg font-jp focus:outline-none focus:border-[var(--indigo)] bg-white shadow-2xs"
              autoFocus
            />
          </>
        )}

        {/* MODE 2 & 3: MCQ / AUDIO */}
        {(srsQuizMode === 'mcq' || srsQuizMode === 'audio') && (
          <>
            <div className="py-2 space-y-3 border-b border-[var(--card-border)] pb-3 flex flex-col items-center justify-center">
              {srsQuizMode === 'mcq' ? (
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
                  {srsFeedback && (
                    <div className="text-sm sm:text-base font-bold font-jp text-[var(--indigo-deep)] break-words">
                      {currentCard.jp}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2">
              {srsMcqOptions.map((opt, idx) => {
                const isSelected = selectedMcqWordId === opt.id;
                const isTarget = opt.id === currentCard.id;

                let style = 'bg-white border-[var(--card-border)] text-[var(--ink)] hover:border-[var(--indigo)] hover:bg-indigo-50/50';

                if (srsFeedback) {
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
                    disabled={srsFeedback !== null}
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

        {/* Feedback message display */}
        {srsFeedback && (
          <div className="space-y-1 pt-2">
            <div className={`text-xs sm:text-sm font-semibold transition ${srsFeedback.type === 'ok' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {srsFeedback.msg}
            </div>
            {srsFeedback.oldLevel !== undefined && srsFeedback.newLevel !== undefined && (
              <div className="flex items-center justify-center gap-2 pt-0.5">
                {renderSrsChip(srsFeedback.oldLevel)}
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                {renderSrsChip(srsFeedback.newLevel)}
              </div>
            )}
          </div>
        )}

        {/* Action Controls */}
        {srsFeedback ? (
          <div className="pt-2">
            <button
              onClick={onAdvanceCard}
              autoFocus
              className="w-full py-3 bg-[var(--indigo)] text-white rounded-xl text-xs font-bold hover:bg-[var(--indigo-deep)] transition flex items-center justify-center gap-1.5 shadow"
            >
              Tiếp tục <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : srsQuizMode === 'vi2jp' && (
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
      </div>
    </div>
  );
}
