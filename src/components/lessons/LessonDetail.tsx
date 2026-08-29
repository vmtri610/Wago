'use client';

import React, { useState } from 'react';
import { Lesson, LessonStatus } from '@/types/lesson';
import { speakJapanese } from '@/lib/audio';
import { 
  ArrowLeft, BookOpen, Volume2, CheckCircle2, Clock, 
  Circle, Eye, EyeOff, Layers, MessageSquare, Sparkles, AlertCircle, ChevronLeft, ChevronRight, Dices 
} from 'lucide-react';
import NumberPracticeTool from './NumberPracticeTool';

interface LessonDetailProps {
  lesson: Lesson;
  totalLessons: number;
  status: LessonStatus;
  onBack: () => void;
  onSelectLesson: (id: number) => void;
  onUpdateStatus: (id: number, status: LessonStatus) => void;
  onPracticeLesson: (id: number) => void;
}

export default function LessonDetail({
  lesson,
  totalLessons,
  status,
  onBack,
  onSelectLesson,
  onUpdateStatus,
  onPracticeLesson
}: LessonDetailProps) {
  const [showVietnamese, setShowVietnamese] = useState(true);
  const [showRomaji, setShowRomaji] = useState(true);
  // Order: 1. Từ vựng -> 2. Mở rộng -> 3. Ngữ pháp -> (Tuỳ chọn: Luyện gõ số)
  const [activeSection, setActiveSection] = useState<'vocab' | 'expansion' | 'grammar' | 'number_practice'>('vocab');

  const cleanAudioText = (text: string) => {
    return text
      .replace(/^[\d.,/]+\s*[:：]\s*/, '')
      .replace(/^[①②③④⑤\sAB:\s]*/g, '')
      .replace(/\s*\(.*?\)/g, '')
      .replace(/\*/g, '')
      .trim();
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Action Header */}
      <div className="bg-[#FFFDF9] border border-[var(--card-border)] p-4 sm:p-5 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-2 border-b border-[var(--card-border)] pb-3">
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded-xl border border-[var(--card-border)] hover:bg-gray-50 text-xs font-bold text-[var(--ink)] flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-4 h-4 text-[var(--indigo)]" />
            <span>Danh sách bài học</span>
          </button>

          {/* Status Switcher Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const nextStatus: Record<LessonStatus, LessonStatus> = {
                  not_started: 'in_progress',
                  in_progress: 'completed',
                  completed: 'not_started'
                };
                onUpdateStatus(lesson.id, nextStatus[status]);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition ${
                status === 'completed'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : status === 'in_progress'
                  ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              {status === 'in_progress' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
              {status === 'not_started' && <Circle className="w-3.5 h-3.5 text-gray-400" />}
              <span>
                {status === 'completed' ? 'Đã thuộc' : status === 'in_progress' ? 'Đang học' : 'Chưa học'}
              </span>
            </button>
          </div>
        </div>

        {/* Title and Summary */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-lg sm:text-2xl font-bold text-[var(--indigo-deep)]">
              {lesson.title}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--ink-soft)] leading-relaxed">
              {lesson.description}
            </p>
          </div>

          {lesson.vocabulary && lesson.vocabulary.length > 0 && (
            <button
              onClick={() => onPracticeLesson(lesson.id)}
              className="px-4 py-2.5 bg-[var(--indigo)] hover:bg-[var(--indigo-deep)] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-xs shrink-0"
            >
              <Layers className="w-4 h-4" />
              <span>Ôn Flashcard bài này</span>
            </button>
          )}
        </div>

        {/* View Controls & Section Tabs: Strict order: 1. Từ vựng -> 2. Mở rộng -> 3. Ngữ pháp */}
        <div className="pt-3 border-t border-[var(--card-border)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {/* 1. TỪ VỰNG */}
            {lesson.vocabulary && lesson.vocabulary.length > 0 && (
              <button
                onClick={() => setActiveSection('vocab')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeSection === 'vocab'
                    ? 'bg-[var(--indigo)] text-white shadow-xs'
                    : 'bg-white text-[var(--ink-soft)] border border-[var(--card-border)] hover:bg-gray-50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                1. Từ vựng ({lesson.vocabulary.length})
              </button>
            )}

            {/* 2. MỞ RỘNG */}
            {lesson.expansions && lesson.expansions.length > 0 && (
              <button
                onClick={() => setActiveSection('expansion')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeSection === 'expansion'
                    ? 'bg-[var(--indigo)] text-white shadow-xs'
                    : 'bg-white text-[var(--ink-soft)] border border-[var(--card-border)] hover:bg-gray-50'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                2. Mở rộng ({lesson.expansions.length})
              </button>
            )}

            {/* 3. NGỮ PHÁP */}
            {lesson.grammarPoints && lesson.grammarPoints.length > 0 && (
              <button
                onClick={() => setActiveSection('grammar')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeSection === 'grammar'
                    ? 'bg-[var(--indigo)] text-white shadow-xs'
                    : 'bg-white text-[var(--ink-soft)] border border-[var(--card-border)] hover:bg-gray-50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                3. Ngữ pháp ({lesson.grammarPoints.length})
              </button>
            )}

            {/* 4. CHỨC NĂNG RIÊNG: LUYỆN GÕ SỐ ĐẾM NGẪU NHIÊN (Chỉ cho bài số đếm) */}
            {(lesson.id === 2 || lesson.title.toLowerCase().includes('số đếm') || lesson.shortTitle.toLowerCase().includes('số đếm')) && (
              <button
                onClick={() => setActiveSection('number_practice')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeSection === 'number_practice'
                    ? 'bg-[var(--indigo)] text-white shadow-xs'
                    : 'bg-white text-[var(--ink-soft)] border border-[var(--card-border)] hover:bg-gray-50'
                }`}
              >
                <Dices className="w-3.5 h-3.5" />
                Luyện gõ số
              </button>
            )}
          </div>

          {/* Toggles for Vietnamese Translation & Romaji */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setShowVietnamese(!showVietnamese)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border flex items-center gap-1 transition ${
                showVietnamese
                  ? 'bg-indigo-50 border-indigo-200 text-[var(--indigo)]'
                  : 'bg-white border-gray-200 text-gray-400'
              }`}
              title="Ẩn / Hiện dịch tiếng Việt"
            >
              {showVietnamese ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Dịch Việt</span>
            </button>

            <button
              onClick={() => setShowRomaji(!showRomaji)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border flex items-center gap-1 transition ${
                showRomaji
                  ? 'bg-indigo-50 border-indigo-200 text-[var(--indigo)]'
                  : 'bg-white border-gray-200 text-gray-400'
              }`}
              title="Ẩn / Hiện Romaji"
            >
              <span>Romaji</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. SECTION: VOCABULARY LIST (TỪ VỰNG) */}
      {activeSection === 'vocab' && lesson.vocabulary && (
        <div className="bg-[#FFFDF9] border border-[var(--card-border)] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
            <h2 className="text-base sm:text-lg font-bold text-[var(--indigo-deep)] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--indigo)]" />
              1. Từ vựng trong bài
            </h2>
            <span className="text-xs font-semibold text-[var(--ink-soft)] bg-indigo-50 px-2.5 py-1 rounded-lg">
              {lesson.vocabulary.length} từ
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {lesson.vocabulary.map((v, idx) => (
              <div
                key={idx}
                className="bg-white border border-[var(--card-border)] p-3 rounded-xl flex items-center justify-between hover:border-[var(--indigo)] transition"
              >
                <div className="space-y-0.5">
                  <div className="text-sm sm:text-base font-bold font-jp text-[var(--indigo-deep)]">{v.jp}</div>
                  {showRomaji && (
                    <div className="text-[11px] font-jetbrains text-[var(--indigo)] font-semibold">{v.romaji}</div>
                  )}
                  {showVietnamese && (
                    <div className="text-xs text-[var(--ink-soft)] font-medium">{v.vi}</div>
                  )}
                </div>

                <button
                  onClick={() => speakJapanese(cleanAudioText(v.jp))}
                  className="p-2 text-[var(--indigo)] hover:bg-indigo-50 rounded-lg transition shrink-0"
                  title="Nghe phát âm"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. SECTION: EXPANSION & CONVERSATION (MỞ RỘNG) */}
      {activeSection === 'expansion' && lesson.expansions && (
        <div className="space-y-6">
          {lesson.expansions.map((exp) => (
            <article
              key={exp.id}
              className="bg-[#FFFDF9] border border-[var(--card-border)] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 font-bold text-xs">
                    {exp.order}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-[var(--indigo-deep)]">
                    {exp.title}
                  </h2>
                </div>
              </div>

              {exp.formula && (
                <div className="bg-white border border-purple-100 p-3 rounded-xl text-center">
                  <div className="text-base font-bold font-jp text-purple-900">{exp.formula}</div>
                  {exp.meaning && <div className="text-xs text-gray-500 mt-0.5">{exp.meaning}</div>}
                </div>
              )}

              {/* Dialogue / Samples */}
              {exp.dialogue && (
                <div className="space-y-2.5">
                  {exp.dialogue.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="bg-white border border-[var(--card-border)] rounded-xl p-3.5 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="text-sm sm:text-base font-medium font-jp text-[var(--indigo-deep)] flex items-center gap-2 flex-wrap">
                          {item.speaker && (
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              item.speaker === 'A' ? 'bg-indigo-100 text-[var(--indigo-deep)]' : 'bg-purple-100 text-purple-800'
                            }`}>
                              {item.speaker}
                            </span>
                          )}
                          <span>{item.jp}</span>
                        </div>

                        {showRomaji && item.romaji && (
                          <div className="text-xs font-jetbrains font-semibold text-[var(--indigo)]">
                            {item.romaji}
                          </div>
                        )}

                        {showVietnamese && (
                          <div className="text-xs sm:text-sm text-[var(--ink-soft)]">
                            {item.vi}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => speakJapanese(cleanAudioText(item.jp))}
                        className="p-2 text-[var(--indigo)] hover:bg-indigo-50 rounded-lg transition shrink-0"
                        title="Nghe"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Notes */}
              {exp.notes && (
                <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-3.5 space-y-1 text-xs text-purple-950">
                  <div className="font-bold flex items-center gap-1">
                    <span>Lưu ý:</span>
                  </div>
                  <ul className="space-y-1 pl-4 list-disc">
                    {exp.notes.map((n, i) => (
                      <li key={i} className="leading-relaxed">{n}</li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {/* 3. SECTION: GRAMMAR POINTS (NGỮ PHÁP) */}
      {activeSection === 'grammar' && (
        <div className="space-y-6">
          {lesson.grammarPoints.map((gp) => (
            <article
              key={gp.id}
              id={gp.id}
              className="bg-[#FFFDF9] border border-[var(--card-border)] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4"
            >
              {/* Grammar Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--card-border)] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-[var(--indigo)] text-white flex items-center justify-center font-bold text-xs font-jetbrains">
                    {gp.order}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold font-jp text-[var(--indigo-deep)]">
                    {gp.title}
                  </h2>
                </div>

                <span className="text-xs font-semibold text-[var(--indigo)] bg-indigo-50 px-2.5 py-1 rounded-lg self-start sm:self-auto border border-indigo-100">
                  {gp.meaning}
                </span>
              </div>

              {/* Usage Box */}
              {gp.usage && (
                <div className="text-xs sm:text-sm text-[var(--ink)] bg-[#FAF7F2] p-3.5 rounded-xl border border-[var(--card-border)] space-y-1">
                  <span className="font-bold text-[var(--indigo-deep)]">Cách sử dụng: </span>
                  <span className="text-[var(--ink)] leading-relaxed">{gp.usage}</span>
                </div>
              )}

              {/* Formula Highlight if available */}
              {gp.formula && (
                <div className="bg-white border-2 border-indigo-100 rounded-xl p-3 text-center space-y-1">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Công thức chung</div>
                  <div className="text-sm sm:text-base font-bold font-jp text-[var(--indigo-deep)]">
                    {gp.formula}
                  </div>
                </div>
              )}

              {/* Responses (Khẳng định / Phủ định) if available */}
              {gp.responses && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-[var(--card-border)] text-xs">
                  {gp.responses.affirmative && gp.responses.affirmative.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="font-bold text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Khẳng định:
                      </div>
                      <ul className="space-y-1 pl-5 list-disc font-jp text-[var(--ink)]">
                        {gp.responses.affirmative.map((res, i) => (
                          <li key={i}>{res}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {gp.responses.negative && gp.responses.negative.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="font-bold text-rose-700 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" /> Phủ định:
                      </div>
                      <ul className="space-y-1 pl-5 list-disc font-jp text-[var(--ink)]">
                        {gp.responses.negative.map((res, i) => (
                          <li key={i}>{res}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Notes & Tips */}
              {gp.notes && gp.notes.length > 0 && (
                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-1.5 text-xs text-amber-900">
                  <div className="font-bold flex items-center gap-1.5 text-amber-950">
                    <span>Lưu ý:</span>
                  </div>
                  <ul className="space-y-1 pl-4 list-disc">
                    {gp.notes.map((n, i) => (
                      <li key={i} className="leading-relaxed">{n}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Examples */}
              {gp.examples && gp.examples.length > 0 && (
                <div className="space-y-2.5 pt-2">
                  <div className="text-xs font-bold text-[var(--ink-soft)] uppercase tracking-wider">
                    Ví dụ:
                  </div>
                  <div className="space-y-2">
                    {gp.examples.map((ex, idx) => (
                      <div
                        key={ex.id || idx}
                        className="bg-white border border-[var(--card-border)] rounded-xl p-3.5 hover:border-[var(--indigo)] transition space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1 flex-1">
                            <div className="text-sm sm:text-base font-medium font-jp text-[var(--indigo-deep)] leading-relaxed flex items-center gap-2 flex-wrap">
                              <span>{ex.jp}</span>
                            </div>

                            {showRomaji && ex.romaji && (
                              <div className="text-xs font-jetbrains font-semibold text-[var(--indigo)]">
                                {ex.romaji}
                              </div>
                            )}

                            {showVietnamese && (
                              <div className="text-xs sm:text-sm text-[var(--ink-soft)] font-medium">
                                {ex.vi}
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => speakJapanese(cleanAudioText(ex.jp))}
                            className="p-2 text-[var(--indigo)] hover:bg-indigo-50 rounded-lg transition shrink-0"
                            title="Nghe phát âm"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {/* SECTION 4: LUYỆN GÕ SỐ ĐẾM NGẪU NHIÊN */}
      {activeSection === 'number_practice' && (
        <NumberPracticeTool />
      )}
    </div>
  );
}
