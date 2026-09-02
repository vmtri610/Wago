'use client';

import React, { useState, useEffect, useRef } from 'react';
import { numberToJapanese, checkNumberAnswer } from '@/lib/japaneseNumbers';
import { speakJapanese } from '@/lib/audio';
import { 
  Dices, Check, Volume2, ArrowRight, Flame, SlidersHorizontal 
} from 'lucide-react';

export default function NumberPracticeTool() {
  // Range Presets
  const PRESETS = [
    { label: '0 – 10', min: 0, max: 10 },
    { label: '10 – 99', min: 10, max: 99 },
    { label: '100 – 999', min: 100, max: 999 },
    { label: '1,000 – 9,999', min: 1000, max: 9999 },
    { label: '10,000 – 999,999', min: 10000, max: 999999 }
  ];

  const [minRange, setMinRange] = useState<number>(0);
  const [maxRange, setMaxRange] = useState<number>(999);
  const [currentNumber, setCurrentNumber] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string; solution: { hiragana: string; romaji: string } } | null>(null);
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    correct: 0,
    streak: 0,
    maxStreak: 0
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  // Generate random number within range
  const generateRandomNumber = (min: number, max: number) => {
    const validMin = Math.max(0, Math.min(min, max));
    const validMax = Math.max(validMin, max);
    const random = Math.floor(Math.random() * (validMax - validMin + 1)) + validMin;
    setCurrentNumber(random);
    setUserInput('');
    setFeedback(null);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  useEffect(() => {
    generateRandomNumber(minRange, maxRange);
  }, []);



  const handleSelectPreset = (min: number, max: number) => {
    setMinRange(min);
    setMaxRange(max);
    generateRandomNumber(min, max);
  };

  const handleCheck = () => {
    if (!userInput.trim() || feedback) return;

    const isCorrect = checkNumberAnswer(userInput, currentNumber);
    const solution = numberToJapanese(currentNumber);

    speakJapanese(solution.hiragana);

    if (isCorrect) {
      setStats(prev => {
        const nextStreak = prev.streak + 1;
        return {
          total: prev.total + 1,
          correct: prev.correct + 1,
          streak: nextStreak,
          maxStreak: Math.max(prev.maxStreak, nextStreak)
        };
      });
      setFeedback({
        isCorrect: true,
        message: 'Chính xác!',
        solution
      });
    } else {
      setStats(prev => ({
        total: prev.total + 1,
        correct: prev.correct,
        streak: 0,
        maxStreak: prev.maxStreak
      }));
      setFeedback({
        isCorrect: false,
        message: 'Chưa đúng!',
        solution
      });
    }
  };

  const handleNext = () => {
    generateRandomNumber(minRange, maxRange);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      e.stopPropagation();
      if (feedback) {
        handleNext();
      } else {
        handleCheck();
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Range Configuration Card (Mobile Optimized) */}
      <div className="bg-[#FFFDF9] border border-[var(--card-border)] rounded-2xl p-3.5 sm:p-4 shadow-xs space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
          <span className="font-bold text-[var(--indigo-deep)] uppercase tracking-wider flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--indigo)]" />
            Khoảng số:
          </span>
          <span className="font-semibold text-[var(--ink-soft)]">
            <strong className="text-[var(--indigo)] font-jetbrains">{minRange.toLocaleString()}</strong> → <strong className="text-[var(--indigo)] font-jetbrains">{maxRange.toLocaleString()}</strong>
          </span>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p, idx) => {
            const isSelected = minRange === p.min && maxRange === p.max;
            return (
              <button
                key={idx}
                onClick={() => handleSelectPreset(p.min, p.max)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                  isSelected
                    ? 'bg-[var(--indigo)] text-white border-[var(--indigo)] shadow-2xs'
                    : 'bg-white text-[var(--ink-soft)] border-[var(--card-border)] hover:border-[var(--indigo)] hover:text-[var(--indigo)]'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Custom Min / Max Inputs */}
        <div className="pt-2 border-t border-[var(--card-border)]/60 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[var(--ink-soft)] font-medium shrink-0">Tuỳ chỉnh:</span>
          <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
            <input
              type="number"
              min={0}
              max={99999999}
              value={minRange}
              onChange={(e) => setMinRange(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-20 sm:w-24 px-2 py-1 border border-[var(--card-border)] rounded-lg text-center font-jetbrains focus:outline-none focus:border-[var(--indigo)] bg-white text-xs"
              placeholder="Min"
            />
            <span className="text-gray-400">→</span>
            <input
              type="number"
              min={0}
              max={99999999}
              value={maxRange}
              onChange={(e) => setMaxRange(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-20 sm:w-24 px-2 py-1 border border-[var(--card-border)] rounded-lg text-center font-jetbrains focus:outline-none focus:border-[var(--indigo)] bg-white text-xs"
              placeholder="Max"
            />
            <button
              onClick={() => generateRandomNumber(minRange, maxRange)}
              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-[var(--indigo-deep)] font-bold rounded-lg transition flex items-center gap-1 text-xs shrink-0"
            >
              <Dices className="w-3 h-3" /> Áp dụng
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Practice Card (Clean, Fitted & Mobile Optimized) */}
      <div className="bg-[#FFFDF9] border border-[var(--card-border)] rounded-2xl p-5 sm:p-6 shadow-xs text-center space-y-4">
        {/* Stats Row */}
        <div className="flex justify-center items-center gap-3 text-xs font-semibold text-[var(--ink-soft)]">
          <div className="flex items-center gap-1">
            <span>Đã làm:</span>
            <strong className="text-[var(--ink)]">{stats.total}</strong>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <div className="flex items-center gap-1">
            <span>Đúng:</span>
            <strong className="text-emerald-600">{stats.correct}</strong>
            {stats.total > 0 && (
              <span className="text-[10px] text-gray-400">({Math.round((stats.correct / stats.total) * 100)}%)</span>
            )}
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <div className="flex items-center gap-1 text-orange-600">
            <Flame className="w-3.5 h-3.5 fill-current animate-pulse" />
            <span>Chuỗi:</span>
            <strong>{stats.streak}</strong>
          </div>
        </div>

        {/* Compact & Clean Random Number Display */}
        <div className="py-2">
          <div className="text-3xl sm:text-4xl font-extrabold font-jetbrains text-[var(--indigo-deep)] tracking-tight">
            {currentNumber.toLocaleString()}
          </div>
        </div>

        {/* Standard Sized Input Box (Same as Practice/Quiz) */}
        <div className="w-full space-y-3">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            readOnly={!!feedback}
            placeholder="Nhập tiếng Nhật hoặc Romaji..."
            className={`w-full text-center py-2.5 sm:py-3 border border-[var(--card-border)] rounded-xl text-base sm:text-lg font-jp focus:outline-none focus:border-[var(--indigo)] bg-white shadow-2xs ${
              feedback ? 'bg-gray-50/60 cursor-default' : ''
            }`}
            autoFocus
          />

          {/* Feedback Message (Exact matching style as Quiz/Practice) */}
          {feedback && (
            <div className="pt-1">
              <div className={`text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 ${
                feedback.isCorrect ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                <span>
                  {feedback.isCorrect ? 'Chính xác — ' : 'Chưa đúng — '}
                  <span className="font-jp font-bold text-sm sm:text-base text-[var(--indigo-deep)]">{feedback.solution.hiragana}</span>{' '}
                  <span className="font-jetbrains text-xs text-[var(--indigo)] font-semibold">({feedback.solution.romaji})</span>
                </span>
                <button
                  onClick={() => speakJapanese(feedback.solution.hiragana)}
                  className="p-1 text-[var(--indigo)] hover:bg-indigo-50 rounded-full transition"
                  title="Nghe phát âm"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {feedback ? (
            <div className="pt-1">
              <button
                ref={nextButtonRef}
                onClick={handleNext}
                autoFocus
                className="w-full py-2.5 bg-[var(--indigo)] text-white rounded-xl text-xs font-bold hover:bg-[var(--indigo-deep)] transition flex items-center justify-center gap-1.5 shadow focus:ring-2 focus:ring-[var(--indigo)]"
              >
                Tiếp tục <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleNext}
                className="px-4 py-2.5 border border-gray-300 text-[var(--ink-soft)] rounded-xl text-xs font-semibold hover:bg-gray-100 transition"
              >
                Bỏ qua
              </button>
              <button
                onClick={handleCheck}
                disabled={!userInput.trim()}
                className="flex-1 py-2.5 bg-[var(--indigo)] text-white rounded-xl text-xs font-bold hover:bg-[var(--indigo-deep)] transition shadow disabled:opacity-50"
              >
                Kiểm tra
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
