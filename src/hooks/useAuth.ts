'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/types/user';

export function useAuth() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch Profile record from Supabase 'profiles' table with metadata fallback
  const fetchProfile = useCallback(async (currentUser: User) => {
    // Default fallback from user metadata
    const fallbackProfile: UserProfile = {
      id: currentUser.id,
      email: currentUser.email || '',
      full_name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'User',
      avatar_url: currentUser.user_metadata?.avatar_url || null,
      created_at: currentUser.created_at || new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (error) {
        console.warn('Lưu ý khi lấy profile DB (sử dụng metadata fallback):', error.message);
        setProfile(fallbackProfile);
      } else if (data) {
        setProfile(data as UserProfile);
      } else {
        setProfile(fallbackProfile);
      }
    } catch (err) {
      console.warn('Fetch profile error, fallback to user metadata:', err);
      setProfile(fallbackProfile);
    }
  }, [supabase]);

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        fetchProfile(user);
      }
      setLoading(false);
    });

    // Listen to Auth State changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  const signInWithGoogle = async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }
      if (data) {
        setProfile(data as UserProfile);
      }
    } catch (err: any) {
      console.error('Cập nhật profile thất bại:', err?.message);
    }
  };

  return {
    user,
    profile,
    loading,
    signInWithGoogle,
    signOut,
    updateProfile,
  };
}
