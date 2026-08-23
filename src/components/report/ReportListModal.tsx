'use client';

import React, { useState } from 'react';
import { Flag, X, Check, Edit2, Trash2, AlertCircle, Save, Calendar, Search } from 'lucide-react';
import type { Word, WordReport } from '@/app/page';

interface ReportListModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: WordReport[];
  words: Word[];
  onUpdateWord: (updatedWord: Word) => Promise<void>;
  onResolveReport: (reportId: string) => Promise<void>;
  onDeleteWord: (wordId: string) => Promise<void>;
}

export default function ReportListModal({
  isOpen,
  onClose,
  reports,
  words,
  onUpdateWord,
  onResolveReport,
  onDeleteWord,
}: ReportListModalProps) {
  const [editingWordId, setEditingWordId] = useState<string | null>(null);
  const [editJp, setEditJp] = useState<string>('');
  const [editRomaji, setEditRomaji] = useState<string>('');
  const [editVi, setEditVi] = useState<string>('');
  const [savingWordId, setSavingWordId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const startEdit = (word: Word) => {
    setEditingWordId(word.id);
    setEditJp(word.jp);
    setEditRomaji(word.romaji);
    setEditVi(word.vi);
  };

  const handleSaveWord = async (word: Word, reportId: string) => {
    if (!editJp.trim() || !editRomaji.trim() || !editVi.trim()) return;
    setSavingWordId(word.id);
    try {
      const updated: Word = {
        ...word,
        jp: editJp.trim(),
        romaji: editRomaji.trim(),
        vi: editVi.trim(),
      };
      await onUpdateWord(updated);
      await onResolveReport(reportId);
      setEditingWordId(null);
    } catch (err) {
      console.error('Lỗi cập nhật từ vựng:', err);
    } finally {
      setSavingWordId(null);
    }
  };

  const filteredReports = reports.filter(r => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      r.word_jp.toLowerCase().includes(q) ||
      r.word_romaji.toLowerCase().includes(q) ||
      r.word_vi.toLowerCase().includes(q) ||
      (r.reason && r.reason.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#FFFDF9] border border-[var(--card-border)] rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[var(--indigo-deep)] flex items-center gap-2">
                Danh sách Báo cáo Lỗi Nhập liệu
                <span className="px-2 py-0.5 text-xs font-bold bg-rose-100 text-rose-700 rounded-full">
                  {reports.length}
                </span>
              </h3>
              <p className="text-[11px] text-[var(--ink-soft)] font-medium">
                Kiểm tra lại các từ vựng bạn đã báo lỗi trong lúc luyện tập
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-black/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Filter */}
        {reports.length > 0 && (
          <div className="relative shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo Tiếng Nhật, Romaji, Tiếng Việt hoặc lý do báo cáo..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-[var(--card-border)] rounded-xl bg-white focus:outline-none focus:border-[var(--indigo)]"
            />
          </div>
        )}

        {/* Reports List */}
        <div className="overflow-y-auto space-y-3 pr-1 flex-1">
          {reports.length === 0 ? (
            <div className="py-12 text-center text-xs text-[var(--ink-soft)] space-y-2">
              <Check className="w-10 h-10 mx-auto text-emerald-500 bg-emerald-50 p-2 rounded-full" />
              <p className="font-bold text-sm text-[var(--indigo-deep)]">Chưa có báo cáo lỗi nào!</p>
              <p className="text-[11px] max-w-xs mx-auto text-gray-500">
                Khi bạn bấm vào biểu tượng báo cáo (cờ đỏ) trên các thẻ từ vựng trong lượt Luyện tập, từ đó sẽ xuất hiện ở đây để bạn rà soát lại.
              </p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--ink-soft)] font-medium">
              Không tìm thấy báo cáo khớp với từ khóa tìm kiếm.
            </div>
          ) : (
            filteredReports.map(rep => {
              const currentWord = words.find(w => w.id === rep.word_id);
              const isEditing = currentWord && editingWordId === currentWord.id;
              const dateStr = rep.created_at ? new Date(rep.created_at).toLocaleDateString('vi-VN') : '';

              return (
                <div
                  key={rep.id}
                  className="bg-white border border-[var(--card-border)] rounded-2xl p-4 space-y-3 shadow-2xs hover:border-rose-200 transition"
                >
                  {/* Top info */}
                  <div className="flex items-start justify-between gap-2 border-b border-[var(--card-border)]/60 pb-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Lý do: {rep.reason || 'Lỗi nhập liệu'}
                    </div>
                    {dateStr && (
                      <div className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {dateStr}
                      </div>
                    )}
                  </div>

                  {/* Word Content / Edit Form */}
                  {isEditing && currentWord ? (
                    <div className="space-y-2 pt-1 bg-amber-50/50 p-3 rounded-xl border border-amber-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-[var(--ink-soft)]">Tiếng Nhật:</label>
                          <input
                            type="text"
                            value={editJp}
                            onChange={e => setEditJp(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-sm font-jp border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[var(--indigo)]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-[var(--ink-soft)]">Romaji:</label>
                          <input
                            type="text"
                            value={editRomaji}
                            onChange={e => setEditRomaji(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-sm font-jetbrains border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[var(--indigo)]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[var(--ink-soft)]">Nghĩa tiếng Việt:</label>
                        <input
                          type="text"
                          value={editVi}
                          onChange={e => setEditVi(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs font-medium border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[var(--indigo)]"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingWordId(null)}
                          className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          disabled={savingWordId === currentWord.id}
                          onClick={() => handleSaveWord(currentWord, rep.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1 shadow-2xs"
                        >
                          <Save className="w-3.5 h-3.5" />
                          Lưu & Hoàn tất
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold font-jp text-[var(--ink)]">
                          {currentWord ? currentWord.jp : rep.word_jp}
                        </span>
                        <span className="text-xs font-jetbrains font-semibold text-[var(--indigo)]">
                          {currentWord ? currentWord.romaji : rep.word_romaji}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--ink-soft)] font-medium">
                        Nghĩa: <strong className="text-[var(--ink)]">{currentWord ? currentWord.vi : rep.word_vi}</strong>
                      </p>

                      {/* Display original reported values if word was changed */}
                      {currentWord && (currentWord.jp !== rep.word_jp || currentWord.romaji !== rep.word_romaji || currentWord.vi !== rep.word_vi) && (
                        <p className="text-[10px] text-gray-400 italic pt-0.5">
                          (Dữ liệu lúc báo cáo: {rep.word_jp} - {rep.word_romaji}: {rep.word_vi})
                        </p>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  {!isEditing && (
                    <div className="pt-2 border-t border-[var(--card-border)]/50 flex items-center justify-between">
                      {currentWord ? (
                        <button
                          onClick={() => startEdit(currentWord)}
                          className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-[var(--indigo)] rounded-xl text-xs font-semibold hover:bg-indigo-100 flex items-center gap-1.5 transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Sửa từ này
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-400 italic">Từ gốc đã bị xóa</span>
                      )}

                      <div className="flex items-center gap-2">
                        {currentWord && (
                          <button
                            onClick={() => {
                              if (confirm('Bạn có chắc muốn xóa hẳn từ vựng này không?')) {
                                onDeleteWord(currentWord.id);
                                onResolveReport(rep.id);
                              }
                            }}
                            className="p-1.5 text-gray-400 hover:text-rose-600 transition"
                            title="Xóa từ vựng"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onResolveReport(rep.id)}
                          className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold hover:bg-emerald-100 flex items-center gap-1 transition"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Đã xử lý
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[var(--card-border)] flex items-center justify-between shrink-0">
          <span className="text-[11px] text-[var(--ink-soft)] font-medium">
            Tổng cộng: <strong className="text-[var(--indigo-deep)]">{reports.length}</strong> báo cáo
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[var(--indigo)] text-white text-xs font-semibold hover:bg-[var(--indigo-deep)] shadow-xs transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
