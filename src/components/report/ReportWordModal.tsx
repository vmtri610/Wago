'use client';

import React, { useState } from 'react';
import { Flag, X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { Word } from '@/app/page';

interface ReportWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  word: Word | null;
  onSubmitReport: (word: Word, reason: string) => Promise<void>;
}

const PRESET_REASONS = [
  'Sai Romaji',
  'Sai nghĩa Tiếng Việt',
  'Sai chữ Tiếng Nhật (Kanji/Kana)',
  'Lỗi chính tả / nhập liệu khác'
];

export default function ReportWordModal({
  isOpen,
  onClose,
  word,
  onSubmitReport,
}: ReportWordModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>(PRESET_REASONS[0]);
  const [customReason, setCustomReason] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<boolean>(false);

  if (!isOpen || !word) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const finalReason = selectedReason === 'Lỗi chính tả / nhập liệu khác' && customReason.trim()
        ? customReason.trim()
        : selectedReason;

      await onSubmitReport(word, finalReason);
      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Lỗi khi gửi báo cáo:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-[#FFFDF9] border border-[var(--card-border)] rounded-3xl p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[var(--indigo-deep)]">
                Báo cáo lỗi nhập liệu
              </h3>
              <p className="text-[11px] text-[var(--ink-soft)] font-medium">
                Gắn cờ từ vựng bị sai để kiểm tra lại
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

        {/* Word Info Preview */}
        <div className="p-3 bg-white border border-[var(--card-border)] rounded-2xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold font-jp text-[var(--ink)]">{word.jp}</span>
            <span className="text-xs font-jetbrains font-semibold text-[var(--indigo)]">{word.romaji}</span>
          </div>
          <p className="text-xs text-[var(--ink-soft)] font-medium truncate">{word.vi}</p>
        </div>

        {successMsg ? (
          <div className="py-6 text-center space-y-2">
            <div className="inline-flex p-3 bg-emerald-100 text-emerald-600 rounded-full">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold text-emerald-800">Đã gửi báo cáo thành công!</p>
            <p className="text-xs text-gray-500">Bạn có thể xem lại lỗi trong danh sách báo cáo.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--ink-soft)] flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                Vấn đề phát hiện:
              </label>
              <div className="space-y-1.5">
                {PRESET_REASONS.map(reason => (
                  <label
                    key={reason}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition ${
                      selectedReason === reason
                        ? 'bg-rose-50 border-rose-300 text-rose-900 font-semibold'
                        : 'bg-white border-[var(--card-border)] text-[var(--ink)] hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                      className="accent-rose-600"
                    />
                    {reason}
                  </label>
                ))}
              </div>
            </div>

            {selectedReason === 'Lỗi chính tả / nhập liệu khác' && (
              <textarea
                value={customReason}
                onChange={e => setCustomReason(e.target.value)}
                placeholder="Mô tả cụ thể hơn lỗi nhập liệu (không bắt buộc)..."
                rows={2}
                className="w-full p-2.5 text-xs border border-[var(--card-border)] rounded-xl bg-white focus:outline-none focus:border-rose-500"
              />
            )}

            {/* Actions */}
            <div className="pt-2 border-t border-[var(--card-border)] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl border border-[var(--card-border)] text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 disabled:opacity-50 shadow-xs transition flex items-center gap-1.5"
              >
                <Flag className="w-3.5 h-3.5" />
                {submitting ? 'Đang gửi...' : 'Gửi báo cáo'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
