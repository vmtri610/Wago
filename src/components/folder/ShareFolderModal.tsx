'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Share2, X, Check, Search, UserCheck, Users } from 'lucide-react';
import type { Folder } from '@/app/page';
import type { UserProfile } from '@/types/user';

interface ShareFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder: Folder | null;
  currentUserId: string;
  onSuccess: () => void;
}

export default function ShareFolderModal({
  isOpen,
  onClose,
  folder,
  currentUserId,
  onSuccess,
}: ShareFolderModalProps) {
  const supabase = createClient();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (!isOpen || !folder) return;

    // Set initial selected users from folder.shared_with
    setSelectedUserIds(folder.shared_with || []);

    // Fetch all user profiles except current user
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', currentUserId)
          .order('full_name', { ascending: true });

        if (!error && data) {
          setUsers(data as UserProfile[]);
        }
      } catch (err) {
        console.error('Lỗi tải danh sách người dùng:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isOpen, folder, currentUserId, supabase]);

  if (!isOpen || !folder) return null;

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Cập nhật mảng shared_with trên thư mục
      const { error: fError } = await supabase
        .from('folders')
        .update({ shared_with: selectedUserIds })
        .eq('id', folder.id);

      if (fError) throw fError;

      // 2. Cập nhật mảng shared_with cho tất cả các từ vựng thuộc thư mục này
      const { error: wError } = await supabase
        .from('words')
        .update({ shared_with: selectedUserIds })
        .eq('folder_id', folder.id);

      if (wError) {
        console.warn('Lưu ý cập nhật từ vựng:', wError.message);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Lỗi lưu chia sẻ thư mục:', err?.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (u.full_name && u.full_name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-[#FFFDF9] border border-[var(--card-border)] rounded-3xl p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-[var(--indigo)]">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[var(--indigo-deep)] truncate max-w-[200px]">
                Chia sẻ "{folder.name}"
              </h3>
              <p className="text-[11px] text-[var(--ink-soft)] font-medium">
                Chọn người dùng muốn chia sẻ
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

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-[var(--card-border)] rounded-xl bg-white focus:outline-none focus:border-[var(--indigo)]"
          />
        </div>

        {/* User List */}
        <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
          {loading ? (
            <div className="py-8 text-center text-xs text-[var(--ink-soft)] font-medium">
              Đang tải danh sách người dùng...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--ink-soft)] space-y-1">
              <Users className="w-8 h-8 mx-auto text-gray-300 mb-1" />
              <p className="font-semibold">Chưa có người dùng nào khác</p>
              <p className="text-[11px]">Khi có người dùng mới đăng ký, họ sẽ xuất hiện tại đây.</p>
            </div>
          ) : (
            filteredUsers.map(u => {
              const isSelected = selectedUserIds.includes(u.id);
              const avatar = u.avatar_url;
              const name = u.full_name || u.email?.split('@')[0] || 'User';

              return (
                <div
                  key={u.id}
                  onClick={() => toggleUserSelection(u.id)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-200'
                      : 'bg-white border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full border border-black/10 shrink-0 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[var(--indigo)] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {(u.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[var(--indigo-deep)] truncate">{name}</p>
                      <p className="text-[10px] text-[var(--ink-soft)] truncate">{u.email}</p>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition shrink-0 ${
                      isSelected
                        ? 'bg-[var(--indigo)] text-white'
                        : 'border border-gray-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-[var(--card-border)] flex items-center justify-between">
          <span className="text-[11px] text-[var(--ink-soft)] font-medium">
            Đã chọn: <strong className="text-[var(--indigo-deep)]">{selectedUserIds.length}</strong> người
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl border border-[var(--card-border)] text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-[var(--indigo)] text-white text-xs font-semibold hover:bg-[var(--indigo-deep)] disabled:opacity-50 shadow-xs transition"
            >
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
