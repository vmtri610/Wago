'use client';

import React from 'react';
import { LogOut, X } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/types/user';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  profile?: UserProfile | null;
  onSignOut: () => void;
}

export default function UserProfileModal({
  isOpen,
  onClose,
  user,
  profile,
  onSignOut,
}: UserProfileModalProps) {
  if (!isOpen) return null;

  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;
  const fullName = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0];
  const email = user.email;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xs bg-[#FFFDF9] border border-[var(--card-border)] rounded-3xl p-6 shadow-2xl space-y-5 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-black/5 transition"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center space-y-3 pt-2">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-16 h-16 rounded-full border-2 border-[var(--indigo)]/20 shadow-xs object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[var(--indigo)] text-white flex items-center justify-center font-bold text-xl shadow-xs">
              {(email || 'U')[0].toUpperCase()}
            </div>
          )}

          <div className="space-y-0.5 max-w-full">
            <h3 className="font-bold text-base text-[var(--indigo-deep)] truncate px-2">{fullName}</h3>
            <p className="text-xs text-[var(--ink-soft)] font-medium truncate px-2">{email}</p>
          </div>
        </div>

        <div className="pt-2 border-t border-[var(--card-border)]">
          <button
            onClick={() => {
              onClose();
              onSignOut();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-50 text-rose-600 font-semibold text-xs hover:bg-rose-100 flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  );
}
