'use client';

import React from 'react';
import { Folder } from '@/app/page';
import { Check, Share2, Edit2, Trash2 } from 'lucide-react';

interface FolderFilterBarProps {
  folders: Folder[];
  wordsCountMap: Record<string, number>;
  totalWordsCount: number;
  activeFolderId: string | string[]; // 'all' or single folder ID or array of folder IDs
  onSelectFolder: (folderId: string) => void;
  isMultiSelect?: boolean;
  onShareFolder?: (folder: Folder) => void;
  onRenameFolder?: (folder: Folder) => void;
  onDeleteFolder?: (folderId: string) => void;
  renamingFolderId?: string | null;
  renameInputValue?: string;
  onRenameValueChange?: (val: string) => void;
  onCommitRename?: (folderId: string) => void;
  onCancelRename?: () => void;
}

export default function FolderFilterBar({
  folders,
  wordsCountMap,
  totalWordsCount,
  activeFolderId,
  onSelectFolder,
  isMultiSelect = false,
  onShareFolder,
  onRenameFolder,
  onDeleteFolder,
  renamingFolderId,
  renameInputValue,
  onRenameValueChange,
  onCommitRename,
  onCancelRename
}: FolderFilterBarProps) {
  const isSelected = (fId: string) => {
    if (Array.isArray(activeFolderId)) {
      return activeFolderId.includes(fId);
    }
    return activeFolderId === fId;
  };

  const isAllSelected = Array.isArray(activeFolderId) 
    ? activeFolderId.includes('all') 
    : activeFolderId === 'all';

  return (
    <div className="flex items-center gap-2 border-t border-b border-[var(--card-border)]/60 py-2 my-2">
      <div className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar whitespace-nowrap">
        {/* All Folders Option */}
        <button
          onClick={() => onSelectFolder('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition shrink-0 ${
            isAllSelected
              ? 'bg-[var(--indigo)] text-white border-[var(--indigo)] shadow-2xs'
              : 'bg-white text-[var(--ink-soft)] border-[var(--card-border)] hover:border-[var(--indigo)]'
          }`}
        >
          Tất cả ({totalWordsCount})
        </button>

        {/* Individual Folders */}
        {folders.map(f => {
          const selected = !isAllSelected && isSelected(f.id);
          const count = wordsCountMap[f.id] || 0;

          if (renamingFolderId === f.id) {
            return (
              <div key={f.id} className="flex items-center gap-1 bg-white border border-[var(--indigo)] rounded-full px-2.5 py-0.5 shadow-2xs shrink-0">
                <input
                  type="text"
                  value={renameInputValue}
                  onChange={(e) => onRenameValueChange?.(e.target.value)}
                  className="w-24 text-xs px-1 focus:outline-none"
                  autoFocus
                />
                <button onClick={() => onCommitRename?.(f.id)} className="text-emerald-600 p-0.5"><Check className="w-3 h-3" /></button>
                <button onClick={() => onCancelRename?.()} className="text-rose-600 p-0.5"><Check className="w-3 h-3 rotate-45" /></button>
              </div>
            );
          }

          return (
            <div
              key={f.id}
              className={`inline-flex items-center border rounded-full overflow-hidden text-xs font-semibold shadow-2xs transition shrink-0 ${
                selected
                  ? 'bg-[var(--indigo)] text-white border-[var(--indigo)]'
                  : 'bg-white text-[var(--ink-soft)] border-[var(--card-border)] hover:border-gray-300'
              }`}
            >
              <button
                onClick={() => onSelectFolder(f.id)}
                className="px-3.5 py-1.5 whitespace-nowrap flex items-center gap-1"
              >
                {isMultiSelect && selected && <Check className="w-3 h-3" />}
                {f.name} ({count})
              </button>

              {onShareFolder && !f.id.startsWith('lesson-') && (
                <button
                  onClick={() => onShareFolder(f)}
                  className="px-2 py-1.5 opacity-60 hover:opacity-100 border-l border-current/20 hover:text-amber-300"
                  title="Chia sẻ thư mục"
                >
                  <Share2 className="w-3 h-3" />
                </button>
              )}

              {onRenameFolder && !f.id.startsWith('lesson-') && (
                <button
                  onClick={() => onRenameFolder(f)}
                  className="px-2 py-1.5 opacity-60 hover:opacity-100 border-l border-current/20"
                  title="Đổi tên"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              )}

              {onDeleteFolder && !f.id.startsWith('lesson-') && (
                <button
                  onClick={() => onDeleteFolder(f.id)}
                  className="px-2 py-1.5 opacity-60 hover:opacity-100 text-rose-300 hover:text-rose-100 border-l border-current/20"
                  title="Xóa thư mục"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
