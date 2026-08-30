'use client';

import React, { useState } from 'react';
import { Word, Folder } from '@/app/page';
import { speakJapanese } from '@/lib/audio';
import { Search, X, Volume2, Trash2, Edit2, Check, Save } from 'lucide-react';

interface WordListSectionProps {
  words: Word[];
  folders: Folder[];
  activeFolderId: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onDeleteWord: (wordId: string) => void;
  onUpdateWord: (updatedWord: Word) => void;
}

export default function WordListSection({
  words,
  folders,
  activeFolderId,
  searchQuery,
  onSearchChange,
  onDeleteWord,
  onUpdateWord
}: WordListSectionProps) {
  // Editing state
  const [editingWordId, setEditingWordId] = useState<string | null>(null);
  const [editJp, setEditJp] = useState<string>('');
  const [editRomaji, setEditRomaji] = useState<string>('');
  const [editVi, setEditVi] = useState<string>('');
  const [editFolderId, setEditFolderId] = useState<string>('');

  // Filter to only include custom user folders (excluding lesson folders)
  const userFolders = folders.filter(f => !f.id.startsWith('lesson-'));

  const startEdit = (word: Word) => {
    if (word.lesson_id) return;
    setEditingWordId(word.id);
    setEditJp(word.jp);
    setEditRomaji(word.romaji);
    setEditVi(word.vi);
    setEditFolderId(word.folder_id || (userFolders.length > 0 ? userFolders[0].id : ''));
  };

  const cancelEdit = () => {
    setEditingWordId(null);
  };

  const saveEdit = (wordId: string) => {
    if (!editJp.trim() || !editVi.trim()) return;

    const originalWord = words.find(w => w.id === wordId);
    if (!originalWord) return;

    const updated: Word = {
      ...originalWord,
      jp: editJp.trim(),
      romaji: editRomaji.trim() || editJp.trim(),
      vi: editVi.trim(),
      folder_id: editFolderId && !editFolderId.startsWith('lesson-') ? editFolderId : (userFolders[0]?.id || null),
      lesson_id: null
    };

    onUpdateWord(updated);
    setEditingWordId(null);
  };

  const filteredWords = words.filter(w => {
    const matchesFolder =
      activeFolderId === 'all' ||
      w.folder_id === activeFolderId ||
      (w.lesson_id && activeFolderId === `lesson-${w.lesson_id}`);
    if (!matchesFolder) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      w.jp.toLowerCase().includes(q) ||
      w.romaji.toLowerCase().includes(q) ||
      w.vi.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-3">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm theo tiếng Nhật, Romaji hoặc tiếng Việt..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-9 py-2.5 text-xs border border-[var(--card-border)] rounded-xl bg-white focus:outline-none focus:border-[var(--indigo)] shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Grid List of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredWords.length === 0 ? (
          <div className="col-span-full text-center py-12 text-sm text-[var(--ink-soft)] bg-[#FFFDF9] rounded-xl border border-dashed border-[var(--card-border)]">
            {searchQuery ? `Không tìm thấy từ vựng khớp với "${searchQuery}".` : 'Chưa có từ vựng nào trong mục này.'}
          </div>
        ) : (
          filteredWords.map(w => {
            const isEditing = editingWordId === w.id;

            if (isEditing) {
              return (
                <div key={w.id} className="bg-white border-2 border-[var(--indigo)] p-4 rounded-xl shadow-md space-y-3">
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[10px] font-bold text-[var(--indigo)] uppercase">Tiếng Nhật</label>
                      <input
                        type="text"
                        value={editJp}
                        onChange={(e) => setEditJp(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-base font-jp focus:outline-none focus:border-[var(--indigo)] bg-gray-50"
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
                    {userFolders.length > 0 && (
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--indigo)] uppercase">Thư mục</label>
                        <select
                          value={editFolderId}
                          onChange={(e) => setEditFolderId(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[var(--indigo)] bg-gray-50 font-semibold text-[var(--indigo-deep)]"
                        >
                          {userFolders.map(f => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-100 transition flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Hủy
                    </button>
                    <button
                      onClick={() => saveEdit(w.id)}
                      className="flex-1 py-1.5 bg-[var(--indigo)] hover:bg-[var(--indigo-deep)] text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" /> Lưu thay đổi
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div key={w.id} className="bg-[#FFFDF9] border border-[var(--card-border)] p-4 rounded-xl relative shadow-xs hover:border-[var(--indigo)] transition flex flex-col justify-between space-y-2 group">
                <div>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-medium font-jp text-[var(--ink)]">{w.jp}</div>
                      <button
                        onClick={() => speakJapanese(w.jp)}
                        title="Nghe phát âm"
                        className="p-1 rounded-full text-[var(--indigo)] hover:bg-indigo-50 transition"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    {w.lesson_id ? (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 shrink-0" title="Từ vựng bài học (chỉnh sửa trong tab Bài học)">
                        Bài {w.lesson_id}
                      </span>
                    ) : (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEdit(w)}
                          className="p-1.5 text-gray-400 hover:text-[var(--indigo)] hover:bg-indigo-50 rounded-lg transition"
                          title="Chỉnh sửa từ vựng"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteWord(w.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Xóa từ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-jetbrains text-[var(--indigo)] font-semibold mt-0.5">{w.romaji}</div>
                  <div className="text-sm text-[var(--ink-soft)] mt-1.5 font-medium">{w.vi}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
