'use client';

import React from 'react';
import { getPitchAccent } from '@/lib/pitchAccent';

interface PitchAccentTextProps {
  text: string;
  pitch?: number | null;
  className?: string;
  showBadge?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  accentColor?: string; // default slender orange/amber
}

export const PitchAccentText: React.FC<PitchAccentTextProps> = ({
  text,
  pitch,
  className = '',
  showBadge = false,
  size = 'md',
  accentColor = '#EA580C' // Cam thanh lịch, mảnh và rõ nét
}) => {
  if (!text) return null;

  // Xử lý các tiền tố như 〜 hoặc ~
  const hasPrefix = text.startsWith('～') || text.startsWith('~');
  const mainText = hasPrefix ? text.slice(1) : text;

  // Lấy dữ liệu pitch accent
  const { moras, pitchNumber, description, patternType } = getPitchAccent(mainText, pitch);

  // Kích cỡ chữ vừa vặn, không bị quá to
  const sizeClasses = {
    sm: 'text-xs sm:text-sm py-0.5',
    md: 'text-sm sm:text-base py-0.5',
    lg: 'text-base sm:text-lg py-1',
    xl: 'text-lg sm:text-xl py-1'
  };

  // Thanh kẻ mảnh (1.5px) thanh lịch theo phong cách giáo trình chuẩn
  const borderThicknessClass = 'border-[1.5px]';

  return (
    <div className={`inline-flex items-center gap-1.5 flex-wrap ${className}`}>
      <span
        className={`inline-flex items-center font-jp font-bold tracking-wider select-text ${sizeClasses[size]}`}
        title={`Ngữ điệu: ${description}`}
      >
        {hasPrefix && <span className="opacity-70 mr-0.5">～</span>}

        {moras.map((mora, idx) => {
          const isHigh = mora.isHigh;
          const isStepUp = mora.stepUpBefore;
          const isStepDown = mora.stepDownAfter;

          return (
            <span
              key={idx}
              className="relative inline-flex items-center justify-center px-[1.5px] transition-all"
            >
              {/* Đường kẻ trên thanh mảnh (cho âm Cao - High) */}
              {isHigh && (
                <span
                  className={`absolute top-0 left-0 right-0 ${borderThicknessClass} border-t`}
                  style={{ borderColor: accentColor }}
                />
              )}

              {/* Đường kẻ dưới thanh mảnh (cho âm Thấp - Low) */}
              {!isHigh && (
                <span
                  className={`absolute bottom-0 left-0 right-0 ${borderThicknessClass} border-b`}
                  style={{ borderColor: accentColor }}
                />
              )}

              {/* Vạch đứng chuyển từ Thấp -> Cao (bước nhảy lên) */}
              {isStepUp && (
                <span
                  className={`absolute top-0 bottom-0 left-0 ${borderThicknessClass} border-l`}
                  style={{ borderColor: accentColor }}
                />
              )}

              {/* Vạch đứng chuyển từ Cao -> Thấp (bước nhảy xuống) */}
              {isStepDown && (
                <span
                  className={`absolute top-0 bottom-0 right-0 ${borderThicknessClass} border-r`}
                  style={{ borderColor: accentColor }}
                />
              )}

              <span className="relative z-10 px-0.5">{mora.text}</span>
            </span>
          );
        })}
      </span>

      {showBadge && (
        <span
          className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-orange-50 text-orange-700 border border-orange-200 shrink-0"
          title={description}
        >
          [{pitchNumber}] {patternType === 'heiban' ? '平板' : patternType === 'atamadaka' ? '頭高' : '中高'}
        </span>
      )}
    </div>
  );
};
