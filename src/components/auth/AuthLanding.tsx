"use client";

import React from "react";
import GoogleSignInButton from "./GoogleSignInButton";
import {
  Brain,
  Sparkles,
  Layers,
  Volume2,
  ShieldCheck,
  Flame,
} from "lucide-react";

interface AuthLandingProps {
  onSignIn: () => void;
}

export default function AuthLanding({ onSignIn }: AuthLandingProps) {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Subtle Japanese Aesthetic Background Elements */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-rose-100/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-indigo-100/40 blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-8 bg-[#FFFDF9]/90 backdrop-blur-md border border-[var(--card-border)] p-8 rounded-3xl shadow-xl z-10 text-center">
        {/* Logo & Header */}
        <div className="space-y-3">
          <h1 className="font-shippori font-bold text-3xl text-[var(--indigo-deep)] tracking-wide">
            和語ノート
          </h1>
          <p className="text-xs font-semibold text-[var(--indigo)] uppercase tracking-wider">
            Wago Note • Ghi Nhớ Từ Vựng Tiếng Nhật
          </p>
          <p className="text-sm text-[var(--ink-soft)] font-medium leading-relaxed">
            Sổ tay học từ vựng tiếng Nhật thông minh với phương pháp Lặp lại
            ngắt quãng giúp ghi nhớ từ lâu dài.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 gap-3 text-left py-2">
          <div className="p-3 rounded-xl bg-white/80 border border-gray-100 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-rose-600 font-semibold text-xs">
              <Flame className="w-4 h-4" />
              <span>Lặp lại ngắt quãng</span>
            </div>
            <p className="text-[11px] text-gray-500">
              Tự động nhắc ôn trước khi quên
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/80 border border-gray-100 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-600 font-semibold text-xs">
              <Brain className="w-4 h-4" />
              <span>5 Chế độ Luyện</span>
            </div>
            <p className="text-[11px] text-gray-500">
              MCQ, Gõ Romaji, Audio, Match
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/80 border border-gray-100 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-xs">
              <Layers className="w-4 h-4" />
              <span>Quản lý Thư mục</span>
            </div>
            <p className="text-[11px] text-gray-500">
              Phân loại từ theo N5 - N1
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/80 border border-gray-100 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-amber-600 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Lưu trữ An toàn</span>
            </div>
            <p className="text-[11px] text-gray-500">
              Dữ liệu riêng biệt theo tài khoản
            </p>
          </div>
        </div>

        {/* Google Sign In Call To Action */}
        <div className="pt-2 space-y-3">
          <p className="text-xs font-semibold text-gray-600">
            Vui lòng đăng nhập để bắt đầu học và lưu tiến trình
          </p>
          <GoogleSignInButton
            onClick={onSignIn}
            className="!py-3.5 !text-sm !rounded-2xl border-gray-300 hover:border-indigo-400 hover:shadow-md transition-all transform active:scale-98"
          />
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-400">
          Tài khoản của bạn được bảo mật bởi Supabase Auth & Google OAuth 2.0
        </div>
      </div>
    </div>
  );
}
