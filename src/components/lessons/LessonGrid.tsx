'use client';

import React, { useState } from 'react';
import { Lesson, LessonStatus } from '@/types/lesson';
import { BookOpen, CheckCircle2, Clock, Circle, Search, Layers } from 'lucide-react';

interface LessonGridProps {
  lessons: Lesson[];
  lessonStatuses: Record<number, LessonStatus>;
  onSelectLesson: (lessonId: number) => void;
  onUpdateStatus: (lessonId: number, status: LessonStatus) => void;
  onPracticeLesson: (lessonId: number) => void;
}

export default function LessonGrid({
  lessons,
  lessonStatuses,
  onSelectLesson,
  onUpdateStatus,
  onPracticeLesson
}: LessonGridProps) {
  const [filter, setFilter] = useState<'all' | LessonStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate statistics
  const totalLessons = lessons.length;
  const completedCount = lessons.filter(l => (lessonStatuses[l.id] || 'not_started') === 'completed').length;
  const inProgressCount = lessons.filter(l => (lessonStatuses[l.id] || 'not_started') === 'in_progress').length;
  const notStartedCount = totalLessons - completedCount - inProgressCount;
  const percentCompleted = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Filter lessons
  const filteredLessons = lessons.filter(lesson => {
    const status = lessonStatuses[lesson.id] || 'not_started';
    if (filter !== 'all' && status !== filter) return false;
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = lesson.title.toLowerCase().includes(q);
      const matchDesc = lesson.description.toLowerCase().includes(q);
      const matchShort = lesson.shortTitle.toLowerCase().includes(q);
      const matchGrammar = lesson.grammarPoints.some(g => 
        g.title.toLowerCase().includes(q) || 
        g.meaning.toLowerCase().includes(q)
      );
      return matchTitle || matchDesc || matchShort || matchGrammar;
    }
    return true;
  });

  const getStatusBadge = (status: LessonStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Đã thuộc
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Đang học
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
            <Circle className="w-3 h-3 text-gray-400" /> Chưa học
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Overview & Progress Card */}
      <div className="bg-[#FFFDF9] border border-[var(--card-border)] p-5 sm:p-6 rounded-2xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-indigo-100 text-[var(--indigo-deep)] font-bold text-xs rounded-lg uppercase tracking-wider">
                JLPT N5
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--indigo-deep)]">
                Danh sách Bài học
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[var(--ink-soft)] mt-1">
              Học theo thứ tự: <strong>1. Từ vựng</strong> → <strong>2. Mở rộng giao tiếp</strong> → <strong>3. Ngữ pháp</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-[var(--card-border)] shrink-0">
            <div className="w-12 h-12 rounded-full bg-indigo-50 border-2 border-[var(--indigo)] flex items-center justify-center font-bold text-sm text-[var(--indigo)]">
              {percentCompleted}%
            </div>
            <div className="text-xs space-y-0.5">
              <div className="font-bold text-[var(--ink)]">Tiến độ bài học</div>
              <div className="text-[var(--ink-soft)]">{completedCount} / {totalLessons} bài hoàn thành</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden flex">
            <div 
              className="bg-emerald-500 transition-all duration-500" 
              style={{ width: `${(completedCount / totalLessons) * 100}%` }}
              title={`Đã thuộc: ${completedCount} bài`}
            />
            <div 
              className="bg-amber-400 transition-all duration-500" 
              style={{ width: `${(inProgressCount / totalLessons) * 100}%` }}
              title={`Đang học: ${inProgressCount} bài`}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-[var(--ink-soft)] font-medium pt-1">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                Đã thuộc ({completedCount})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                Đang học ({inProgressCount})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-200 inline-block" />
                Chưa học ({notStartedCount})
              </span>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="pt-2 border-t border-[var(--card-border)] flex flex-col sm:flex-row gap-2.5 justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm mẫu ngữ pháp, từ vựng (VD: N1 の N2, phủ định...)"
              className="w-full pl-9 pr-4 py-2 border border-[var(--card-border)] rounded-xl text-xs bg-white focus:outline-none focus:border-[var(--indigo)] shadow-2xs"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {(['all', 'in_progress', 'completed', 'not_started'] as const).map((mode) => {
              const labels = {
                all: `Tất cả (${totalLessons})`,
                in_progress: `Đang học (${inProgressCount})`,
                completed: `Đã thuộc (${completedCount})`,
                not_started: `Chưa học (${notStartedCount})`
              };
              return (
                <button
                  key={mode}
                  onClick={() => setFilter(mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition border ${
                    filter === mode
                      ? 'bg-[var(--indigo)] text-white border-[var(--indigo)] shadow-xs'
                      : 'bg-white text-[var(--ink-soft)] border-[var(--card-border)] hover:bg-gray-50'
                  }`}
                >
                  {labels[mode]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lesson Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLessons.map((lesson) => {
          const status = lessonStatuses[lesson.id] || 'not_started';

          return (
            <div
              key={lesson.id}
              className={`bg-[#FFFDF9] border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-md ${
                status === 'completed'
                  ? 'border-emerald-200 hover:border-emerald-400'
                  : status === 'in_progress'
                  ? 'border-amber-200 hover:border-amber-400'
                  : 'border-[var(--card-border)] hover:border-[var(--indigo)]'
              }`}
            >
              <div className="space-y-3">
                {/* Header: Lesson Number & Status */}
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-xs text-[var(--indigo-deep)]">
                    {lesson.id < 10 ? `0${lesson.id}` : lesson.id}
                  </span>
                  
                  {/* Status toggle dropdown */}
                  <div className="relative group">
                    {getStatusBadge(status)}
                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-1.5 hidden group-hover:flex flex-col gap-1 z-20 w-32">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateStatus(lesson.id, 'not_started');
                        }}
                        className="px-2 py-1 text-[11px] font-medium text-left text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-1.5"
                      >
                        <Circle className="w-3 h-3 text-gray-400" /> Chưa học
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateStatus(lesson.id, 'in_progress');
                        }}
                        className="px-2 py-1 text-[11px] font-medium text-left text-amber-700 hover:bg-amber-50 rounded-md flex items-center gap-1.5"
                      >
                        <Clock className="w-3 h-3 text-amber-500" /> Đang học
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateStatus(lesson.id, 'completed');
                        }}
                        className="px-2 py-1 text-[11px] font-medium text-left text-emerald-700 hover:bg-emerald-50 rounded-md flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Đã thuộc
                      </button>
                    </div>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-bold text-sm text-[var(--indigo-deep)] line-clamp-1 group-hover:text-[var(--indigo)]">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-[var(--ink-soft)] mt-1.5 line-clamp-2 leading-relaxed">
                    {lesson.description}
                  </p>
                </div>

                {/* Structure Pills: 1. Từ vựng -> 2. Mở rộng -> 3. Ngữ pháp */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-[10px] font-semibold text-[var(--indigo)]">
                    1. Từ vựng ({lesson.vocabulary?.length || 0})
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-purple-50 border border-purple-100 text-[10px] font-semibold text-purple-700">
                    2. Mở rộng ({lesson.expansions?.length || 0})
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-gray-200 text-[10px] font-semibold text-gray-700">
                    3. Ngữ pháp ({lesson.grammarPoints.length})
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-3 border-t border-[var(--card-border)] flex items-center gap-2">
                <button
                  onClick={() => onSelectLesson(lesson.id)}
                  className="flex-1 py-2 px-3 bg-[var(--indigo)] hover:bg-[var(--indigo-deep)] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Vào học</span>
                </button>

                {lesson.vocabulary && lesson.vocabulary.length > 0 && (
                  <button
                    onClick={() => onPracticeLesson(lesson.id)}
                    className="p-2 bg-indigo-50 hover:bg-indigo-100 text-[var(--indigo)] border border-indigo-200 rounded-xl transition flex items-center justify-center"
                    title="Luyện Flashcard bài này"
                  >
                    <Layers className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
