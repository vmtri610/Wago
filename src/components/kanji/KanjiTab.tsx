'use client';

import React, { useState } from 'react';
import { KanjiCard, RecurringCounter } from '@/types/kanji';
import { KANJI_LIST, RECURRING_COUNTERS } from '@/data/kanjiData';
import { speakJapanese } from '@/lib/audio';
import { 
  Search, Volume2, Sparkles, BookOpen, Layers, X, ChevronRight,
  Info, Lightbulb, Tag, CheckCircle2, Bookmark, Flame
} from 'lucide-react';

export default function KanjiTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKanji, setSelectedKanji] = useState<KanjiCard | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'cards' | 'counters'>('cards');
  const [activeCounterCategory, setActiveCounterCategory] = useState<string>('all');

  // Lọc danh sách Kanji
  const filteredKanji = KANJI_LIST.filter(k => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      k.character.includes(q) ||
      k.hanViet.toLowerCase().includes(q) ||
      k.meaning.toLowerCase().includes(q) ||
      k.onReading.includes(q) ||
      k.kunReading.includes(q) ||
      k.onVocab.some(v => v.kanji.includes(q) || v.furigana.includes(q) || v.vi.toLowerCase().includes(q)) ||
      k.kunVocab.some(v => v.kanji.includes(q) || v.furigana.includes(q) || v.vi.toLowerCase().includes(q))
    );
  });

  // Lọc bảng đếm lặp lại
  const filteredCounters = RECURRING_COUNTERS.filter(c => {
    if (activeCounterCategory === 'all') return true;
    return c.id === activeCounterCategory;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* HEADER SECTION */}
      <div className="bg-[#FFFDF9] border border-[var(--card-border)] rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-[var(--indigo)] border border-indigo-100">
              N5 Kanji
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--indigo-deep)] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Học Hán Tự (Kanji)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[var(--ink-soft)]">
            Học Kanji theo bộ giáo trình: Âm On/Kun, mẹo nhớ hình ảnh, từ vựng ghép và các đơn vị đếm lặp lại.
          </p>
        </div>

        {/* View switcher */}
        <div className="flex items-center gap-1 bg-[#F5F0E6] p-1 rounded-xl border border-[var(--card-border)] self-stretch sm:self-auto shrink-0">
          <button
            onClick={() => setActiveSubTab('cards')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeSubTab === 'cards'
                ? 'bg-[var(--indigo)] text-white shadow-xs'
                : 'text-[var(--ink-soft)] hover:text-[var(--indigo-deep)]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Thẻ Kanji ({KANJI_LIST.length})
          </button>
          <button
            onClick={() => setActiveSubTab('counters')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeSubTab === 'counters'
                ? 'bg-[var(--indigo)] text-white shadow-xs'
                : 'text-[var(--ink-soft)] hover:text-[var(--indigo-deep)]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            Đơn vị đếm lặp lại ({RECURRING_COUNTERS.length})
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* VIEW 1: KANJI CARDS GRID */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'cards' && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo chữ Hán, Hán Việt (NHẤT, NHỊ...), Hiragana hoặc nghĩa tiếng Việt..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[var(--card-border)] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[var(--indigo)] shadow-2xs font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {filteredKanji.map((kanji) => (
              <div
                key={kanji.id}
                onClick={() => setSelectedKanji(kanji)}
                className="bg-[#FFFDF9] border border-[var(--card-border)] rounded-2xl p-4 sm:p-5 hover:border-[var(--indigo)] hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-3 group relative select-none"
              >
                <div className="space-y-3">
                  {/* Top Bar: Code badge & Han Viet */}
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[11px] font-bold tracking-wider">
                      {kanji.code}
                    </span>
                    <span className="text-xs font-bold text-[var(--ink-soft)] bg-[#F5F0E6] px-2 py-0.5 rounded-md">
                      {kanji.meaning}
                    </span>
                  </div>

                  {/* Big Character & Pronunciation */}
                  <div className="flex items-center justify-between gap-4 py-1">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl sm:text-5xl font-bold font-jp text-[var(--indigo-deep)] leading-none group-hover:scale-105 transition transform">
                        {kanji.character}
                      </div>
                      <div>
                        <div className="text-base sm:text-lg font-bold text-[var(--ink)] tracking-wider">
                          {kanji.hanViet}
                        </div>
                        <div className="text-[11px] text-[var(--ink-soft)] flex items-center gap-1 mt-0.5">
                          <span>{kanji.strokeCount} nét</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakJapanese(kanji.character);
                      }}
                      className="p-2 text-[var(--indigo)] hover:bg-indigo-50 rounded-full transition shrink-0"
                      title="Nghe phát âm"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Readings Brief Box */}
                  <div className="bg-[#FAF7F2] rounded-xl p-2.5 border border-[var(--card-border)] text-xs space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[10px] text-amber-800 bg-amber-100/80 px-1.5 py-0.5 rounded shrink-0">
                        Âm On
                      </span>
                      <span className="font-jp text-[var(--indigo-deep)] font-semibold truncate">
                        {kanji.onReading}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[10px] text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded shrink-0">
                        Âm Kun
                      </span>
                      <span className="font-jp text-[var(--indigo-deep)] font-semibold truncate">
                        {kanji.kunReading}
                      </span>
                    </div>
                  </div>

                  {/* Mnemonic highlight */}
                  <div className="text-[11px] text-[var(--ink-soft)] bg-amber-50/70 border border-amber-200/60 rounded-lg p-2 flex items-start gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{kanji.mnemonic}</span>
                  </div>
                </div>

                {/* Footer action */}
                <div className="pt-2 border-t border-[var(--card-border)] flex items-center justify-between text-xs text-[var(--indigo)] font-semibold">
                  <span>{kanji.onVocab.length + kanji.kunVocab.length} từ vựng ghép</span>
                  <span className="flex items-center gap-0.5 text-[11px] group-hover:translate-x-1 transition transform">
                    Chi tiết <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW 2: RECURRING COUNTERS & SUFFIXES (BẢNG ĐƠN VỊ ĐẾM LẶP LẠI) */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'counters' && (
        <div className="space-y-4">
          {/* Quick Filter Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveCounterCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeCounterCategory === 'all'
                  ? 'bg-[var(--indigo)] text-white shadow-xs'
                  : 'bg-white border border-[var(--card-border)] text-[var(--ink-soft)] hover:bg-gray-50'
              }`}
            >
              Tất cả ({RECURRING_COUNTERS.length})
            </button>
            {RECURRING_COUNTERS.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCounterCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  activeCounterCategory === c.id
                    ? 'bg-[var(--indigo)] text-white shadow-xs'
                    : 'bg-white border border-[var(--card-border)] text-[var(--ink-soft)] hover:bg-gray-50'
                }`}
              >
                {c.name.split('(')[0].trim()} ({c.suffix})
              </button>
            ))}
          </div>

          {/* Grid of counter tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCounters.map(counter => (
              <div
                key={counter.id}
                className="bg-[#FFFDF9] border border-[var(--card-border)] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2 border-b border-[var(--card-border)] pb-2.5">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[var(--indigo-deep)] flex items-center gap-2">
                      <Bookmark className="w-4 h-4 text-[var(--indigo)]" />
                      {counter.name}
                    </h3>
                    <p className="text-[11px] text-[var(--ink-soft)] mt-0.5 font-medium">
                      {counter.description}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold font-jp bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                    {counter.suffix} ({counter.reading})
                  </span>
                </div>

                {/* Items List */}
                <div className="divide-y divide-gray-100">
                  {counter.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="py-2 flex items-center justify-between hover:bg-black/2 px-2 rounded-lg transition"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 text-center text-xs font-bold text-gray-400">
                          {item.num}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-base font-bold font-jp text-[var(--indigo-deep)]">
                              {item.kanji}
                            </span>
                            <span className="text-xs font-jp text-gray-500 font-semibold">
                              ({item.furigana})
                            </span>
                            {item.isSpecial && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 bg-rose-50 text-rose-700 border border-rose-200 rounded">
                                Đặc biệt
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[var(--ink-soft)] font-medium">
                            {item.vi}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => speakJapanese(item.kanji)}
                        className="p-1 text-[var(--indigo)] hover:bg-indigo-50 rounded-full transition"
                        title="Nghe phát âm"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* KANJI DETAIL MODAL (TEXTBOOK STYLE BẢNG ĐỐI CHIẾU ON/KUN) */}
      {/* ------------------------------------------------------------- */}
      {selectedKanji && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#FFFDF9] border border-[var(--card-border)] rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-7 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            {/* Top Close Button */}
            <button
              onClick={() => setSelectedKanji(null)}
              className="absolute right-4 top-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            {/* HEADER BANNER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--card-border)]">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-emerald-600 text-white flex flex-col items-center justify-center font-bold shadow-sm shrink-0">
                  <span className="text-xs uppercase opacity-80">Mã</span>
                  <span className="text-lg sm:text-xl leading-none">{selectedKanji.code}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-3xl sm:text-4xl font-bold font-jp text-[var(--indigo-deep)]">
                      {selectedKanji.character}
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-[var(--ink)] tracking-wide">
                      {selectedKanji.hanViet}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--ink-soft)] font-medium mt-0.5">
                    Ý nghĩa: <strong className="text-[var(--ink)]">{selectedKanji.meaning}</strong> ({selectedKanji.strokeCount} nét)
                  </p>
                </div>
              </div>

              <button
                onClick={() => speakJapanese(selectedKanji.character)}
                className="px-4 py-2 bg-indigo-50 border border-indigo-200 text-[var(--indigo)] hover:bg-indigo-100 rounded-xl text-xs font-bold transition flex items-center gap-2 self-start sm:self-auto shadow-xs"
              >
                <Volume2 className="w-4 h-4" />
                Phát âm chữ
              </button>
            </div>

            {/* MNEMONIC (MẸO NHỚ CHỮ) */}
            <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-900">Mẹo nhớ hình ảnh: </span>
                <span>{selectedKanji.mnemonic}</span>
              </div>
            </div>

            {/* MAIN TEXTBOOK TABLE: ON (音) vs KUN (訓) */}
            <div className="border border-gray-300 rounded-xl overflow-hidden bg-white shadow-2xs">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-300">
                {/* 1. CỘT ÂM ON (音) */}
                <div className="p-4 space-y-3">
                  <div className="border-b border-gray-200 pb-2 text-center bg-gray-50 -mx-4 -mt-4 p-2.5">
                    <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">音 (Âm On)</div>
                    <div className="text-base font-bold font-jp text-[var(--indigo-deep)] mt-0.5">
                      {selectedKanji.onReading}
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Từ vựng ghép âm On ({selectedKanji.onVocab.length})
                    </div>
                    <div className="space-y-1.5">
                      {selectedKanji.onVocab.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-gray-50/60 hover:bg-indigo-50/60 transition group border border-transparent hover:border-indigo-100"
                        >
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-sm font-bold font-jp text-[var(--indigo-deep)]">
                                {item.kanji}
                              </span>
                              <span className="text-xs font-jp text-[var(--indigo)] font-semibold">
                                ({item.furigana})
                              </span>
                              <span className="text-xs text-[var(--ink)] font-medium">
                                : {item.vi}
                              </span>
                            </div>
                            {item.note && (
                              <div className="text-[10px] text-amber-700 italic mt-0.5">
                                {item.note}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => speakJapanese(item.kanji)}
                            className="p-1 text-gray-400 group-hover:text-[var(--indigo)] rounded-full transition"
                            title="Nghe"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* On Examples */}
                  {selectedKanji.onExamples && selectedKanji.onExamples.length > 0 && (
                    <div className="pt-2 border-t border-gray-100 space-y-1.5">
                      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        Ví dụ câu mẫu
                      </div>
                      {selectedKanji.onExamples.map((ex, idx) => (
                        <div key={idx} className="bg-amber-50/40 p-2.5 rounded-lg border border-amber-200/50 space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-jp font-semibold text-[var(--indigo-deep)]">
                              {ex.jp}
                            </span>
                            <button
                              onClick={() => speakJapanese(ex.jp)}
                              className="p-1 text-[var(--indigo)] hover:bg-indigo-100 rounded-full transition"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-[11px] text-[var(--ink-soft)] font-medium">
                            {ex.vi}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. CỘT ÂM KUN (訓) */}
                <div className="p-4 space-y-3">
                  <div className="border-b border-gray-200 pb-2 text-center bg-gray-50 -mx-4 -mt-4 p-2.5">
                    <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">訓 (Âm Kun)</div>
                    <div className="text-base font-bold font-jp text-[var(--indigo-deep)] mt-0.5">
                      {selectedKanji.kunReading}
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Từ vựng ghép âm Kun ({selectedKanji.kunVocab.length})
                    </div>
                    <div className="space-y-1.5">
                      {selectedKanji.kunVocab.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-gray-50/60 hover:bg-indigo-50/60 transition group border border-transparent hover:border-indigo-100"
                        >
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-sm font-bold font-jp text-[var(--indigo-deep)]">
                                {item.kanji}
                              </span>
                              <span className="text-xs font-jp text-[var(--indigo)] font-semibold">
                                ({item.furigana})
                              </span>
                              <span className="text-xs text-[var(--ink)] font-medium">
                                : {item.vi}
                              </span>
                            </div>
                            {item.note && (
                              <div className="text-[10px] text-amber-700 italic mt-0.5">
                                {item.note}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => speakJapanese(item.kanji)}
                            className="p-1 text-gray-400 group-hover:text-[var(--indigo)] rounded-full transition"
                            title="Nghe"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Kun Examples */}
                  {selectedKanji.kunExamples && selectedKanji.kunExamples.length > 0 && (
                    <div className="pt-2 border-t border-gray-100 space-y-1.5">
                      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        Ví dụ câu mẫu
                      </div>
                      {selectedKanji.kunExamples.map((ex, idx) => (
                        <div key={idx} className="bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-200/50 space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-jp font-semibold text-[var(--indigo-deep)]">
                              {ex.jp}
                            </span>
                            <button
                              onClick={() => speakJapanese(ex.jp)}
                              className="p-1 text-[var(--indigo)] hover:bg-indigo-100 rounded-full transition"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-[11px] text-[var(--ink-soft)] font-medium">
                            {ex.vi}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SPECIAL NOTES */}
            {selectedKanji.notes && selectedKanji.notes.length > 0 && (
              <div className="bg-blue-50/70 border border-blue-200 p-3 rounded-xl text-xs text-blue-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-blue-950">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  Ghi chú quan trọng:
                </div>
                {selectedKanji.notes.map((note, idx) => (
                  <p key={idx} className="pl-5 leading-relaxed font-medium">
                    {note}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
