'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Lesson, LessonStatus, GrammarPoint, ExpansionItem, LessonVocab } from '@/types/lesson';
import { createClient } from '@/utils/supabase/client';
import LessonGrid from './LessonGrid';
import LessonDetail from './LessonDetail';
import { RefreshCw } from 'lucide-react';

interface LessonsTabProps {
  userId?: string;
  onPracticeLesson: (lessonId: number) => void;
  onStatusChange?: (lessonId: number, status: LessonStatus) => void;
  onInitialStatusesLoaded?: (statuses: Record<number, LessonStatus>) => void;
}

export default function LessonsTab({ userId, onPracticeLesson, onStatusChange, onInitialStatusesLoaded }: LessonsTabProps) {
  const supabase = createClient();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [lessonStatuses, setLessonStatuses] = useState<Record<number, LessonStatus>>({
    1: 'in_progress'
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // 1. Fetch Lessons & Relational Data Directly from Supabase DB (NO localStorage)
  const fetchLessonsFromDb = useCallback(async () => {
    try {
      setIsRefreshing(true);

      // A. Fetch lessons from 'lessons' table
      const { data: dbLessons, error: lErr } = await supabase
        .from('lessons')
        .select('*')
        .order('id', { ascending: true });

      if (lErr) {
        console.error('Lỗi tải bảng lessons từ Supabase:', lErr.message);
        return;
      }

      if (!dbLessons || dbLessons.length === 0) {
        setLessons([]);
        return;
      }

      // B. Fetch words from 'words' table where lesson_id is not null
      const { data: dbWords, error: wErr } = await supabase
        .from('words')
        .select('id, lesson_id, jp, romaji, vi, order_index')
        .not('lesson_id', 'is', null)
        .order('order_index', { ascending: true });

      if (wErr) console.warn('Lỗi tải words từ Supabase:', wErr.message);

      // C. Fetch grammar & examples from 'lesson_grammar' and 'lesson_grammar_examples'
      const { data: dbGrammar, error: gErr } = await supabase
        .from('lesson_grammar')
        .select('*, lesson_grammar_examples(*)')
        .order('order_index', { ascending: true });

      if (gErr) console.warn('Lỗi tải lesson_grammar từ Supabase:', gErr.message);

      // D. Fetch expansions & dialogues from 'lesson_expansions' and 'lesson_expansion_dialogues'
      const { data: dbExpansions, error: eErr } = await supabase
        .from('lesson_expansions')
        .select('*, lesson_expansion_dialogues(*)')
        .order('order_index', { ascending: true });

      if (eErr) console.warn('Lỗi tải lesson_expansions từ Supabase:', eErr.message);

      // Map relational rows into complete structured lessons
      const mappedLessons: Lesson[] = dbLessons.map((l: any) => {
        // Words
        const lessonVocab: LessonVocab[] = (dbWords || [])
          .filter((w: any) => w.lesson_id === l.id)
          .map((w: any) => ({
            jp: w.jp,
            romaji: w.romaji,
            vi: w.vi
          }));

        // Grammar Points & Examples
        const lessonGrammar: GrammarPoint[] = (dbGrammar || [])
          .filter((g: any) => g.lesson_id === l.id)
          .map((g: any) => ({
            id: g.id,
            order: g.order_label || '',
            title: g.title,
            meaning: g.meaning,
            usage: g.usage || '',
            formula: g.formula,
            notes: g.notes || [],
            responses: g.responses || undefined,
            examples: (g.lesson_grammar_examples || [])
              .sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))
              .map((ex: any) => ({
                id: ex.id,
                speaker: ex.speaker || undefined,
                jp: ex.jp,
                romaji: ex.romaji || undefined,
                vi: ex.vi
              }))
          }));

        // Expansions & Dialogues
        const lessonExp: ExpansionItem[] = (dbExpansions || [])
          .filter((e: any) => e.lesson_id === l.id)
          .map((e: any) => ({
            id: e.id,
            order: e.order_label || '',
            title: e.title,
            formula: e.formula || undefined,
            meaning: e.meaning || undefined,
            notes: e.notes || [],
            dialogue: (e.lesson_expansion_dialogues || [])
              .sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))
              .map((d: any) => ({
                id: d.id,
                speaker: d.speaker || undefined,
                jp: d.jp,
                romaji: d.romaji || undefined,
                vi: d.vi
              }))
          }));

        return {
          id: l.id,
          title: l.title,
          shortTitle: l.short_title || `Bài ${l.id}`,
          description: l.description || '',
          grammarCount: lessonGrammar.length,
          vocabulary: lessonVocab,
          grammarPoints: lessonGrammar,
          expansions: lessonExp
        };
      });

      setLessons(mappedLessons);
    } catch (err: any) {
      console.error('Lỗi kết nối Supabase lessons:', err?.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [supabase]);

  // 2. Fetch User Lesson Progress directly from Supabase (NO localStorage)
  const fetchUserProgress = useCallback(async () => {
    if (!userId) {
      setLessonStatuses({});
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_lesson_progress')
        .select('lesson_id, status')
        .eq('user_id', userId);

      if (error) {
        console.warn('Lỗi lấy user_lesson_progress từ Supabase:', error.message);
        return;
      }

      const progressMap: Record<number, LessonStatus> = { 1: 'in_progress' };
      if (data && data.length > 0) {
        data.forEach((row: any) => {
          progressMap[row.lesson_id] = row.status as LessonStatus;
        });
      }
      setLessonStatuses(progressMap);
      onInitialStatusesLoaded?.(progressMap);
    } catch (err) {
      console.error('Lỗi kết nối user_lesson_progress:', err);
    }
  }, [supabase, userId, onInitialStatusesLoaded]);

  useEffect(() => {
    fetchLessonsFromDb();
    fetchUserProgress();
  }, [fetchLessonsFromDb, fetchUserProgress]);

  // 3. Update status: Ghi trực tiếp vào Supabase (NO localStorage)
  const handleUpdateStatus = async (lessonId: number, status: LessonStatus) => {
    setLessonStatuses(prev => ({ ...prev, [lessonId]: status }));
    onStatusChange?.(lessonId, status);

    if (userId) {
      try {
        const { error } = await supabase
          .from('user_lesson_progress')
          .upsert({
            user_id: userId,
            lesson_id: lessonId,
            status: status,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,lesson_id' });

        if (error) {
          console.error('Lỗi lưu trạng thái vào Supabase:', error.message);
        }
      } catch (err: any) {
        console.error('Lỗi khi cập nhật Supabase user_lesson_progress:', err?.message);
      }
    }
  };

  const selectedLesson = lessons.find(l => l.id === selectedLessonId);

  if (loading) {
    return (
      <div className="bg-[#FFFDF9] border border-[var(--card-border)] p-12 rounded-2xl text-center space-y-3 shadow-xs">
        <div className="w-8 h-8 border-3 border-indigo-200 border-t-[var(--indigo)] rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-[var(--ink-soft)]">Đang tải dữ liệu bài học từ Supabase DB...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {selectedLesson ? (
        <LessonDetail
          lesson={selectedLesson}
          totalLessons={lessons.length}
          status={lessonStatuses[selectedLesson.id] || 'not_started'}
          onBack={() => setSelectedLessonId(null)}
          onSelectLesson={(id) => setSelectedLessonId(id)}
          onUpdateStatus={handleUpdateStatus}
          onPracticeLesson={onPracticeLesson}
        />
      ) : (
        <LessonGrid
          lessons={lessons}
          lessonStatuses={lessonStatuses}
          onSelectLesson={(id) => setSelectedLessonId(id)}
          onUpdateStatus={handleUpdateStatus}
          onPracticeLesson={onPracticeLesson}
        />
      )}
    </div>
  );
}
