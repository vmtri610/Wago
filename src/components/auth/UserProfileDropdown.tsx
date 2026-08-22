'use client';

import React, { useEffect, useRef } from 'react';
import { LogOut, User as UserIcon } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/types/user';

interface UserProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  profile?: UserProfile | null;
  onSignOut: () => void;
}

export default function UserProfileDropdown({
  isOpen,
  onClose,
  user,
  profile,
  onSignOut,
}: UserProfileDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fullName = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0];
  const email = user.email;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-14 right-4 z-50 w-60 bg-[#FFFDF9] border border-[var(--card-border)] rounded-2xl shadow-xl p-2.5 animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Profile Header Info */}
      <div className="px-2 py-1.5 space-y-0.5">
        <p className="text-xs font-bold text-[var(--indigo-deep)] truncate">{fullName}</p>
        <p className="text-[10px] text-[var(--ink-soft)] truncate font-medium">{email}</p>
      </div>

      <div className="my-1.5 border-t border-[var(--card-border)]" />

      {/* Option Items */}
      <button
        onClick={() => {
          onClose();
          onSignOut();
        }}
        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 active:bg-rose-100 transition"
      >
        <LogOut className="w-4 h-4 shrink-0" />
        <span>Đăng xuất</span>
      </button>
    </div>
  );
}
