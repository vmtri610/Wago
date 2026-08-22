'use client';

import React from 'react';
import { LogOut } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/types/user';

interface UserMenuProps {
  user: User;
  profile?: UserProfile | null;
  onSignOut: () => void;
  collapsed?: boolean;
}

export default function UserMenu({ user, profile, onSignOut, collapsed = false }: UserMenuProps) {
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;
  const fullName = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0];
  const email = user.email;

  return (
    <div
      className={`p-2.5 rounded-xl bg-black/5 flex items-center gap-3 ${
        collapsed ? 'md:justify-center md:p-2' : ''
      }`}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="w-8 h-8 rounded-full border border-black/10 shrink-0 object-cover"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-[var(--indigo)] text-white flex items-center justify-center font-bold text-sm shrink-0">
          {(email || 'U')[0].toUpperCase()}
        </div>
      )}

      <div className={`overflow-hidden flex-1 ${collapsed ? 'md:hidden' : 'block'}`}>
        <p className="text-xs font-bold text-[var(--indigo-deep)] truncate">{fullName}</p>
        <p className="text-[10px] text-[var(--ink-soft)] truncate">{email}</p>
      </div>

      <button
        onClick={onSignOut}
        title="Đăng xuất"
        className={`p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition shrink-0 ${
          collapsed ? 'md:hidden' : 'block'
        }`}
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}
