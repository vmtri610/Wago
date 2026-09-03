'use client';

import React, { useState } from 'react';
import { Lesson, LessonStatus } from '@/types/lesson';
import { speakJapanese } from '@/lib/audio';
import { PitchAccentText } from '@/components/ui/PitchAccentText';
import { 
  ArrowLeft, BookOpen, Volume2, CheckCircle2, Clock, 
  Circle, Eye, EyeOff, Layers, MessageSquare, Sparkles, AlertCircle, ChevronLeft, ChevronRight, Dices,
  Edit2, Check, X, Save, Plus, Trash2, Shield
} from 'lucide-react';
import NumberPracticeTool from './NumberPracticeTool';

interface LessonDetailProps {
  lesson: Lesson;
  totalLessons: number;
  status: LessonStatus;
  isAdmin?: boolean;
  onBack: () => void;
  onSelectLesson: (id: number) => void;
  onUpdateStatus: (id: number, status: LessonStatus) => void;
  onPracticeLesson: (id: number) => void;
  onUpdateVocab?: (lessonId: number, vocabId: string, updated: { jp: string; romaji: string; vi: string }, oldJp?: string) => Promise<boolean>;
  onAddVocab?: (lessonId: number, newVocab: { jp: string; romaji: string; vi: string }) => Promise<boolean>;
  onDeleteVocab?: (lessonId: number, vocabId: string, oldJp?: string) => Promise<boolean>;
  onUpdateGrammar?: (
    lessonId: number,
    grammarId: string,
    updated: {
      title: string;
      meaning: string;
      usage?: string;
      formula?: string;
      notes?: string[];
      examples?: Array<{ id?: string; speaker?: string; jp: string; romaji?: string; vi: string }>;
    }
  ) => Promise<boolean>;
}

export default function LessonDetail({
  lesson,
  totalLessons,
  status,
  isAdmin = false,
  onBack,
  onSelectLesson,
  onUpdateStatus,
  onPracticeLesson,
  onUpdateVocab,
  onAddVocab,
  onDeleteVocab,
  onUpdateGrammar
}: LessonDetailProps) {
  const [showVietnamese, setShowVietnamese] = useState(true);
  const [showRomaji, setShowRomaji] = useState(true);
  // Order: 1. Từ vựng -> 2. Mở rộng -> 3. Ngữ pháp -> (Tuỳ chọn: Luyện gõ số)
  const [activeSection, setActiveSection] = useState<'vocab' | 'expansion' | 'grammar' | 'number_practice'>('vocab');

  // Vocab editing state (Admin only)
  const [editingVocabIdx, setEditingVocabIdx] = useState<number | null>(null);
  const [editJp, setEditJp] = useState('');
  const [editRomaji, setEditRomaji] = useState('');
  const [editVi, setEditVi] = useState('');
  const [isSavingVocab, setIsSavingVocab] = useState(false);

  // Vocab adding state (Admin only)
  const [isAddingVocab, setIsAddingVocab] = useState(false);
  const [newJp, setNewJp] = useState('');
  const [newRomaji, setNewRomaji] = useState('');
  const [newVi, setNewVi] = useState('');
  const [isSavingNewVocab, setIsSavingNewVocab] = useState(false);

  // Vocab deleting state (Admin only)
  const [deletingVocab, setDeletingVocab] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Grammar editing state (Admin only)
  const [editingGrammarId, setEditingGrammarId] = useState<string | null>(null);
  const [editGTitle, setEditGTitle] = useState('');
  const [editGMeaning, setEditGMeaning] = useState('');
  const [editGUsage, setEditGUsage] = useState('');
  const [editGFormula, setEditGFormula] = useState('');
  const [editGNotes, setEditGNotes] = useState('');
  const [editGExamples, setEditGExamples] = useState<Array<{ id?: string; speaker?: string; jp: string; romaji: string; vi: string }>>([]);
  const [isSavingGrammar, setIsSavingGrammar] = useState(false);

  const startEditGrammar = (gp: any) => {
    if (!isAdmin) return;
    setEditingGrammarId(gp.id);
    setEditGTitle(gp.title || '');
    setEditGMeaning(gp.meaning || '');
    setEditGUsage(gp.usage || '');
    setEditGFormula(gp.formula || '');
    setEditGNotes((gp.notes || []).join('\n'));
    setEditGExamples(
      (gp.examples || []).map((ex: any) => ({
        id: ex.id,
        speaker: ex.speaker || '',
        jp: ex.jp || '',
        romaji: ex.romaji || '',
        vi: ex.vi || ''
      }))
    );
  };

  const handleExampleChange = (idx: number, field: string, val: string) => {
    setEditGExamples(prev =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
    );
  };

  const handleAddExampleItem = () => {
    setEditGExamples(prev => [
      ...prev,
      { id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), speaker: '', jp: '', romaji: '', vi: '' }
    ]);
  };

  const handleRemoveExampleItem = (idx: number) => {
    setEditGExamples(prev => prev.filter((_, i) => i !== idx));
  };

  const cancelEditGrammar = () => {
    setEditingGrammarId(null);
  };

  const saveEditGrammar = async (gp: any) => {
    if (!isAdmin || !editGTitle.trim() || !editGMeaning.trim()) return;
    if (!onUpdateGrammar) {
      setEditingGrammarId(null);
      return;
    }
    setIsSavingGrammar(true);
    const parsedNotes = editGNotes
      .split('\n')
      .map(line => line.trimEnd())
      .filter(line => line.trim().length > 0);

    const validExamples = editGExamples
      .filter(ex => ex.jp.trim() && ex.vi.trim())
      .map(ex => ({
        id: ex.id,
        speaker: ex.speaker?.trim() || undefined,
        jp: ex.jp.trim(),
        romaji: ex.romaji?.trim() || ex.jp.trim(),
        vi: ex.vi.trim()
      }));

    const success = await onUpdateGrammar(lesson.id, gp.id, {
      title: editGTitle.trim(),
      meaning: editGMeaning.trim(),
      usage: editGUsage.trim() || undefined,
      formula: editGFormula.trim() || undefined,
      notes: parsedNotes,
      examples: validExamples
    });
    setIsSavingGrammar(false);
    if (success) {
      setEditingGrammarId(null);
    }
  };

  const startEditVocab = (v: any, idx: number) => {
    if (!isAdmin) return;
    setEditingVocabIdx(idx);
    setEditJp(v.jp);
    setEditRomaji(v.romaji);
    setEditVi(v.vi);
  };

  const cancelEditVocab = () => {
    setEditingVocabIdx(null);
  };

  const saveEditVocab = async (v: any) => {
    if (!isAdmin || !editJp.trim() || !editVi.trim()) return;
    if (!onUpdateVocab) {
      setEditingVocabIdx(null);
      return;
    }
    setIsSavingVocab(true);
    const success = await onUpdateVocab(
      lesson.id,
      v.id || '',
      {
        jp: editJp.trim(),
        romaji: editRomaji.trim() || editJp.trim(),
        vi: editVi.trim()
      },
      v.jp
    );
    setIsSavingVocab(false);
    if (success) {
      setEditingVocabIdx(null);
    }
  };

  const handleSaveNewVocab = async () => {
    if (!isAdmin || !newJp.trim() || !newVi.trim()) return;
    if (!onAddVocab) return;
    setIsSavingNewVocab(true);
    const success = await onAddVocab(lesson.id, {
      jp: newJp.trim(),
      romaji: newRomaji.trim() || newJp.trim(),
      vi: newVi.trim()
    });
    setIsSavingNewVocab(false);
    if (success) {
      setIsAddingVocab(false);
      setNewJp('');
      setNewRomaji('');
      setNewVi('');
    }
  };

  const handleConfirmDelete = async () => {
    if (!isAdmin || !onDeleteVocab || !deletingVocab) return;
    setIsDeleting(true);
    await onDeleteVocab(lesson.id, deletingVocab.id || '', deletingVocab.jp);
    setIsDeleting(false);
    setDeletingVocab(null);
  };

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
      {activeSection === 'vocab' && (
        <div className="bg-[#FFFDF9] border border-[var(--card-border)] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--card-border)] pb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-[var(--indigo-deep)] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--indigo)]" />
                1. Từ vựng trong bài
              </h2>
              <span className="text-xs font-semibold text-[var(--ink-soft)] bg-indigo-50 px-2.5 py-1 rounded-lg">
                {lesson.vocabulary?.length || 0} từ
              </span>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  <Shield className="w-3 h-3 text-amber-700" />
                  Quyền Admin
                </span>
              )}
            </div>

            {isAdmin && !isAddingVocab && (
              <button
                onClick={() => setIsAddingVocab(true)}
                className="px-3.5 py-1.5 bg-[var(--indigo)] hover:bg-[var(--indigo-deep)] text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm từ vựng bài học
              </button>
            )}
          </div>

          {/* Admin Add New Vocab Form */}
          {isAdmin && isAddingVocab && (
            <div className="bg-amber-50/60 border-2 border-amber-300 p-4 rounded-xl space-y-3 shadow-xs">
              <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-amber-700" />
                Thêm từ vựng mới vào bài học
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-[var(--indigo)] uppercase mb-1">Tiếng Nhật *</label>
                  <input
                    type="text"
                    value={newJp}
                    onChange={(e) => setNewJp(e.target.value)}
                    placeholder="Ví dụ: 本 (ほん)"
                    className="w-full px-2.5 py-2 border border-gray-300 rounded-lg text-sm font-jp bg-white focus:outline-none focus:border-[var(--indigo)]"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[var(--indigo)] uppercase mb-1">Romaji</label>
                  <input
                    type="text"
                    value={newRomaji}
                    onChange={(e) => setNewRomaji(e.target.value)}
                    placeholder="Ví dụ: hon"
                    className="w-full px-2.5 py-2 border border-gray-300 rounded-lg text-xs font-jetbrains bg-white focus:outline-none focus:border-[var(--indigo)]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[var(--indigo)] uppercase mb-1">Tiếng Việt *</label>
                  <input
                    type="text"
                    value={newVi}
                    onChange={(e) => setNewVi(e.target.value)}
                    placeholder="Ví dụ: Sách"
                    className="w-full px-2.5 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:border-[var(--indigo)]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setIsAddingVocab(false)}
                  disabled={isSavingNewVocab}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 bg-white rounded-lg text-xs font-semibold hover:bg-gray-50 transition flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Hủy
                </button>
                <button
                  onClick={handleSaveNewVocab}
                  disabled={isSavingNewVocab || !newJp.trim() || !newVi.trim()}
                  className="px-4 py-1.5 bg-[var(--indigo)] hover:bg-[var(--indigo-deep)] text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs disabled:opacity-50"
                >
                  {isSavingNewVocab ? 'Đang thêm...' : <><Check className="w-3.5 h-3.5" /> Thêm vào bài học</>}
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(lesson.vocabulary || []).map((v, idx) => {
              const isEditing = editingVocabIdx === idx;

              if (isEditing && isAdmin) {
                return (
                  <div key={v.id || idx} className="bg-white border-2 border-[var(--indigo)] p-3.5 rounded-xl shadow-md space-y-2.5 sm:col-span-2">
                    <div className="text-xs font-bold text-[var(--indigo-deep)]">Chỉnh sửa từ vựng bài học</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--indigo)] uppercase">Tiếng Nhật</label>
                        <input
                          type="text"
                          value={editJp}
                          onChange={(e) => setEditJp(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm font-jp focus:outline-none focus:border-[var(--indigo)] bg-gray-50"
                          autoFocus
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--indigo)] uppercase">Romaji</label>
                        <input
                          type="text"
                          value={editRomaji}
                          onChange={(e) => setEditRomaji(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs font-jetbrains focus:outline-none focus:border-[var(--indigo)] bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--indigo)] uppercase">Tiếng Việt</label>
                        <input
                          type="text"
                          value={editVi}
                          onChange={(e) => setEditVi(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[var(--indigo)] bg-gray-50"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={cancelEditVocab}
                        disabled={isSavingVocab}
                        className="px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-100 transition flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" /> Hủy
                      </button>
                      <button
                        onClick={() => saveEditVocab(v)}
                        disabled={isSavingVocab}
                        className="px-4 py-1.5 bg-[var(--indigo)] hover:bg-[var(--indigo-deep)] text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
                      >
                        {isSavingVocab ? (
                          <span>Đang lưu...</span>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" /> Lưu bài học
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={v.id || idx}
                  className="bg-white border border-[var(--card-border)] p-3 rounded-xl flex items-center justify-between hover:border-[var(--indigo)] transition group"
                >
                  <div className="space-y-1">
                    <div className="text-sm sm:text-base font-bold font-jp text-[var(--indigo-deep)]">
                      <PitchAccentText text={v.jp} pitch={v.pitch_accent} size="md" />
                    </div>
                    {showRomaji && (
                      <div className="text-[11px] font-jetbrains text-[var(--indigo)] font-semibold">{v.romaji}</div>
                    )}
                    {showVietnamese && (
                      <div className="text-xs text-[var(--ink-soft)] font-medium">{v.vi}</div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => speakJapanese(cleanAudioText(v.jp))}
                      className="p-1.5 text-[var(--indigo)] hover:bg-indigo-50 rounded-lg transition"
                      title="Nghe phát âm"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    {isAdmin && (
                      <>
                        <button
                          onClick={() => startEditVocab(v, idx)}
                          className="p-1.5 text-gray-400 hover:text-[var(--indigo)] hover:bg-indigo-50 rounded-lg transition"
                          title="Chỉnh sửa từ vựng bài học (Admin)"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingVocab(v)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Xóa từ vựng bài học (Admin)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
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
                  <ul className="space-y-1 pl-4">
                    {exp.notes.map((n, i) => {
                      const isLevel2 = /^(\s{2,}|\t+|--\s*|->\s*)/.test(n);
                      const cleanContent = n
                        .replace(/^(\s{2,}|\t+|--\s*|->\s*)/, '')
                        .replace(/^[-*•+]\s*/, '')
                        .trim();

                      if (isLevel2) {
                        return (
                          <li key={i} className="ml-5 list-[circle] leading-relaxed text-purple-900/90 font-normal">
                            {cleanContent}
                          </li>
                        );
                      }

                      return (
                        <li key={i} className="leading-relaxed list-disc">
                          {n.replace(/^[-*•+]\s*/, '').trim()}
                        </li>
                      );
                    })}
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
          {lesson.grammarPoints.map((gp) => {
            const isEditing = editingGrammarId === gp.id;

            if (isEditing && isAdmin) {
              return (
                <article
                  key={gp.id}
                  className="bg-white border-2 border-[var(--indigo)] rounded-2xl p-5 sm:p-6 shadow-md space-y-4"
                >
                  <div className="text-sm font-bold text-[var(--indigo-deep)] border-b border-gray-100 pb-2">
                    Chỉnh sửa ngữ pháp ({gp.order})
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-[var(--indigo)] uppercase mb-1">Tiêu đề ngữ pháp *</label>
                      <input
                        type="text"
                        value={editGTitle}
                        onChange={(e) => setEditGTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-jp bg-gray-50 focus:outline-none focus:border-[var(--indigo)]"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[var(--indigo)] uppercase mb-1">Ý nghĩa *</label>
                      <input
                        type="text"
                        value={editGMeaning}
                        onChange={(e) => setEditGMeaning(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[var(--indigo)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[var(--indigo)] uppercase mb-1">Cách sử dụng</label>
                    <textarea
                      rows={2}
                      value={editGUsage}
                      onChange={(e) => setEditGUsage(e.target.value)}
                      placeholder="Giải thích cách dùng..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-gray-50 focus:outline-none focus:border-[var(--indigo)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[var(--indigo)] uppercase mb-1">Công thức chung</label>
                    <input
                      type="text"
                      value={editGFormula}
                      onChange={(e) => setEditGFormula(e.target.value)}
                      placeholder="Ví dụ: N1 は N2 です"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-jp bg-gray-50 focus:outline-none focus:border-[var(--indigo)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[var(--indigo)] uppercase mb-1">
                      Lưu ý (mỗi dòng 1 ý. Thụt 2 dấu cách '  ' hoặc gõ '-- ' ở đầu dòng để tạo bullet cấp 2)
                    </label>
                    <textarea
                      rows={3}
                      value={editGNotes}
                      onChange={(e) => setEditGNotes(e.target.value)}
                      placeholder={'Ý chính cấp 1\n  - Ý phụ cấp 2 (thụt lề 2 dấu cách)\n  - Ý phụ cấp 2 khác'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-gray-50 focus:outline-none focus:border-[var(--indigo)] font-mono"
                    />
                  </div>

                  {/* Examples Editor */}
                  <div className="space-y-3 pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-[var(--indigo-deep)] uppercase">
                        Danh sách ví dụ minh họa ({editGExamples.length})
                      </label>
                      <button
                        type="button"
                        onClick={handleAddExampleItem}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-[var(--indigo)] rounded-lg text-xs font-bold transition flex items-center gap-1 border border-indigo-200"
                      >
                        <Plus className="w-3.5 h-3.5" /> Thêm ví dụ
                      </button>
                    </div>

                    <div className="space-y-3">
                      {editGExamples.map((ex, exIdx) => (
                        <div
                          key={ex.id || exIdx}
                          className="bg-gray-50/80 border border-gray-200 p-3 rounded-xl space-y-2 relative"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[var(--indigo)]">Ví dụ #{exIdx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveExampleItem(exIdx)}
                              className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                              title="Xóa ví dụ này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-semibold text-gray-500 uppercase">Tiếng Nhật *</label>
                              <input
                                type="text"
                                value={ex.jp}
                                onChange={(e) => handleExampleChange(exIdx, 'jp', e.target.value)}
                                placeholder="Ví dụ: わたしは がくせいです。"
                                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs font-jp bg-white focus:outline-none focus:border-[var(--indigo)]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-semibold text-gray-500 uppercase">Romaji</label>
                              <input
                                type="text"
                                value={ex.romaji}
                                onChange={(e) => handleExampleChange(exIdx, 'romaji', e.target.value)}
                                placeholder="Ví dụ: Watashi wa gakusei desu."
                                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs font-jetbrains bg-white focus:outline-none focus:border-[var(--indigo)]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-gray-500 uppercase">Tiếng Việt *</label>
                            <input
                              type="text"
                              value={ex.vi}
                              onChange={(e) => handleExampleChange(exIdx, 'vi', e.target.value)}
                              placeholder="Ví dụ: Tôi là học sinh."
                              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:border-[var(--indigo)]"
                            />
                          </div>
                        </div>
                      ))}

                      {editGExamples.length === 0 && (
                        <div className="text-center py-4 text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl bg-white">
                          Chưa có ví dụ nào. Bấm "+ Thêm ví dụ" để thêm.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={cancelEditGrammar}
                      disabled={isSavingGrammar}
                      className="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-xl text-xs font-semibold hover:bg-gray-50 transition"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={() => saveEditGrammar(gp)}
                      disabled={isSavingGrammar || !editGTitle.trim() || !editGMeaning.trim()}
                      className="px-5 py-2 bg-[var(--indigo)] hover:bg-[var(--indigo-deep)] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                    >
                      {isSavingGrammar ? 'Đang lưu...' : 'Lưu ngữ pháp'}
                    </button>
                  </div>
                </article>
              );
            }

            const hasAffirmative = !!(gp.responses?.affirmative && gp.responses.affirmative.filter((r: any) => r && String(r).trim()).length > 0);
            const hasNegative = !!(gp.responses?.negative && gp.responses.negative.filter((r: any) => r && String(r).trim()).length > 0);
            const hasResponses = hasAffirmative || hasNegative;
            const validNotes = (gp.notes || []).filter((n: any) => n && String(n).trim());

            return (
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

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[var(--indigo)] bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                      {gp.meaning}
                    </span>
                    {isAdmin && (
                      <button
                        onClick={() => startEditGrammar(gp)}
                        className="p-1.5 text-gray-400 hover:text-[var(--indigo)] hover:bg-indigo-50 rounded-lg transition"
                        title="Chỉnh sửa điểm ngữ pháp (Admin)"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Usage Box */}
                {gp.usage && gp.usage.trim() && (
                  <div className="text-xs sm:text-sm text-[var(--ink)] bg-[#FAF7F2] p-3.5 rounded-xl border border-[var(--card-border)] space-y-1">
                    <span className="font-bold text-[var(--indigo-deep)]">Cách sử dụng: </span>
                    <span className="text-[var(--ink)] leading-relaxed">{gp.usage}</span>
                  </div>
                )}

                {/* Formula Highlight if available */}
                {gp.formula && gp.formula.trim() && (
                  <div className="bg-white border-2 border-indigo-100 rounded-xl p-3 text-center space-y-1">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Công thức chung</div>
                    <div className="text-sm sm:text-base font-bold font-jp text-[var(--indigo-deep)]">
                      {gp.formula}
                    </div>
                  </div>
                )}

                {/* Responses (Khẳng định / Phủ định) only if non-empty */}
                {hasResponses && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-[var(--card-border)] text-xs">
                    {hasAffirmative && (
                      <div className="space-y-1.5">
                        <div className="font-bold text-emerald-700 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Khẳng định:
                        </div>
                        <ul className="space-y-1 pl-5 list-disc font-jp text-[var(--ink)]">
                          {gp.responses!.affirmative!.filter((r: any) => r && String(r).trim()).map((res, i) => (
                            <li key={i}>{res}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {hasNegative && (
                      <div className="space-y-1.5">
                        <div className="font-bold text-rose-700 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5" /> Phủ định:
                        </div>
                        <ul className="space-y-1 pl-5 list-disc font-jp text-[var(--ink)]">
                          {gp.responses!.negative!.filter((r: any) => r && String(r).trim()).map((res, i) => (
                            <li key={i}>{res}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Notes & Tips only if non-empty */}
                {validNotes.length > 0 && (
                  <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-1.5 text-xs text-amber-900">
                    <div className="font-bold flex items-center gap-1.5 text-amber-950">
                      <span>Lưu ý:</span>
                    </div>
                    <ul className="space-y-1 pl-4">
                      {validNotes.map((n: string, i: number) => {
                        const isLevel2 = /^(\s{2,}|\t+|--\s*|->\s*)/.test(n);
                        const cleanContent = n
                          .replace(/^(\s{2,}|\t+|--\s*|->\s*)/, '')
                          .replace(/^[-*•+]\s*/, '')
                          .trim();

                        if (isLevel2) {
                          return (
                            <li key={i} className="ml-5 list-[circle] leading-relaxed text-amber-900/90 font-normal">
                              {cleanContent}
                            </li>
                          );
                        }

                        return (
                          <li key={i} className="leading-relaxed list-disc">
                            {n.replace(/^[-*•+]\s*/, '').trim()}
                          </li>
                        );
                      })}
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
            );
          })}
        </div>
      )}

      {/* SECTION 4: LUYỆN GÕ SỐ ĐẾM NGẪU NHIÊN */}
      {activeSection === 'number_practice' && (
        <NumberPracticeTool />
      )}

      {/* Delete Confirmation Modal */}
      {deletingVocab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-[#FFFDF9] border border-[var(--card-border)] rounded-2xl p-5 shadow-xl space-y-4">
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-[var(--indigo-deep)]">
                Xác nhận xóa
              </h3>
              <p className="text-sm text-[var(--ink)] leading-relaxed">
                Bạn có chắc chắn muốn xóa từ <span className="font-bold text-[var(--indigo)] font-jp">"{deletingVocab.jp}"</span> ({deletingVocab.vi}) không?
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--card-border)]">
              <button
                onClick={() => setDeletingVocab(null)}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-xl text-xs font-semibold hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                {isDeleting ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
