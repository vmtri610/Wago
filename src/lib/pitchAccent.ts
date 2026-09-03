/**
 * Bộ xử lý và từ điển Pitch Accent (Ngữ điệu Cao độ Tokyo) Tiếng Nhật Chuẩn
 * Dựa theo quy chuẩn NHK 日本語発音アクセント新辞典 & Kanjium
 */

export interface MoraInfo {
  text: string;
  isHigh: boolean;
  stepUpBefore?: boolean;
  stepDownAfter?: boolean;
}

export interface PitchAccentResult {
  patternType: 'heiban' | 'atamadaka' | 'nakadaka' | 'odaka' | 'unknown';
  pitchNumber: number; // 0, 1, 2, ...
  moras: MoraInfo[];
  description: string;
}

/**
 * Tách một chuỗi Hiragana / Katakana thành các âm tiết Mora đơn vị
 * Xử lý các âm ghép (拗音: ゃ, ゅ, ょ, ぁ, ぃ, ぅ, ぇ, ぉ...),
 * âm ngắt (っ, ッ), trường âm (ー, ん, ン).
 */
export function splitIntoMoras(text: string): string[] {
  if (!text) return [];

  // Chuẩn hóa chuỗi (bỏ khoảng trắng và dấu phụ không cần thiết)
  const cleaned = text.trim();
  const moras: string[] = [];
  const smallKanaRegex = /[ぁぃぅぇぉゃゅょゎァィゥェォャュョヮ]/;

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    const nextChar = cleaned[i + 1];

    if (nextChar && smallKanaRegex.test(nextChar)) {
      moras.push(char + nextChar);
      i++; // Bỏ qua ký tự nhỏ tiếp theo vì đã gộp
    } else {
      moras.push(char);
    }
  }

  return moras;
}

/**
 * Từ điển Pitch Accent chuẩn cho từ vựng N5 / N4 và từ thông dụng
 * Giá trị là số chỉ số hạ giọng (Pitch Accent Number):
 *  - 0: 平板 (Heiban - Thấp -> Cao -> Cao...)
 *  - 1: 頭高 (Atamadaka - Cao -> Thấp -> Thấp...)
 *  - 2+: 中高 (Nakadaka - Thấp -> Cao... -> Thấp)
 */
export const PITCH_ACCENT_DICTIONARY: Record<string, number> = {
  // Đại từ & Danh xưng
  'わたし': 0,
  '私': 0,
  'あなた': 2,
  'あのひと': 2,
  'あの人': 2,
  'あのかた': 2,
  'あの方': 2,
  'かれ': 1,
  '彼': 1,
  'かのじょ': 1,
  '彼女': 1,
  'なまえ': 0,
  '名前': 0,
  'だれ': 1,
  'どなた': 1,
  '～さん': 1,
  '～ちゃん': 1,
  '～くん': 1,
  'ちゃん': 1,
  'くん': 1,

  // Nghề nghiệp & Trường học, Cơ quan
  'しごと': 0,
  '仕事': 0,
  'おしごと': 0,
  'お仕事': 0,
  'きょうし': 1,
  '教師': 1,
  'せんせい': 3,
  '先生': 3,
  'かいしゃいん': 3,
  '会社員': 3,
  'ぎんこういん': 3,
  '銀行員': 3,
  'がくせい': 0,
  '学生': 0,
  'しゅっしん': 0,
  '出身': 0,
  'いしゃ': 0,
  '医者': 0,
  'エンジニア': 3,
  'ナース': 1,
  'かしゅ': 1,
  '歌手': 1,
  'はいゆう': 0,
  '俳優': 0,
  'エディター': 2,
  'かいしゃ': 0,
  '会社': 0,
  'だいがく': 0,
  '大学': 0,
  'ぎんこう': 0,
  '銀行': 0,
  'びょういん': 0,
  '病院': 0,
  'けんきゅうしゃ': 3,
  '研究者': 3,

  // Quốc gia & Vùng miền
  'ベトナム': 0,
  'ベトナムじん': 4,
  'ベトナムご': 0,
  'イギリス': 0,
  'イギリスじん': 4,
  'えいご': 0,
  '英語': 0,
  'ちゅうごく': 1,
  '中国': 1,
  'ちゅうごくじん': 4,
  '中国人': 4,
  'ちゅうごくご': 0,
  '中国語': 0,
  'アメリカ': 0,
  'アメリカじん': 4,
  'かんこく': 1,
  '韓国': 1,
  'かんこくじん': 4,
  '韓国人': 4,
  'かんこくご': 0,
  '韓国語': 0,
  'にほん': 2,
  '日本': 2,
  'にほんじん': 4,
  '日本人': 4,
  'にほんご': 0,
  '日本語': 0,
  'ドイツ': 1,
  'ドイツじん': 3,
  'ドイツご': 0,
  'タイ': 1,
  'タイじん': 3,
  'タイご': 0,
  'フランス': 0,
  'フランスじん': 4,
  'フランスご': 0,

  // Chào hỏi & Giao tiếp cơ bản
  'はじめまして': 4,
  'どうぞ': 1,
  'よろしく': 2,
  'おねがいします': 6,
  'はい': 1,
  'いいえ': 3,
  'そうです': 1,
  'ちがいます': 3,
  'ありがとう': 2,
  'ありがとうございます': 7,
  'すみません': 4,
  'ごめんなさい': 5,
  'さようなら': 5,
  'おはよう': 2,
  'こんにちは': 0,
  'こんばんは': 0,

  // Số đếm cơ bản
  'ゼロ': 1,
  'れい': 1,
  'いち': 2,
  'に': 1,
  'さん': 0,
  'よん': 1,
  'し': 1,
  'ご': 1,
  'ろく': 2,
  'なな': 1,
  'しち': 2,
  'はち': 2,
  'きゅう': 1,
  'く': 1,
  'じゅう': 1,
  'ひゃく': 2,
  'せん': 1,
  'まん': 1
};

/**
 * Tự động xác định quy tắc ngữ điệu cho từ vựng
 */
export function getPitchAccent(text: string, manualPitch?: number | null): PitchAccentResult {
  const clean = text ? text.replace(/[～~()（）\s]/g, '').trim() : '';
  const moras = splitIntoMoras(clean);
  const n = moras.length;

  if (n === 0) {
    return {
      patternType: 'unknown',
      pitchNumber: 0,
      moras: [],
      description: 'Chưa xác định'
    };
  }

  // 1. Xác định số Pitch
  let pitch = 0;
  if (typeof manualPitch === 'number' && !isNaN(manualPitch)) {
    pitch = manualPitch;
  } else if (PITCH_ACCENT_DICTIONARY[clean] !== undefined) {
    pitch = PITCH_ACCENT_DICTIONARY[clean];
  } else if (PITCH_ACCENT_DICTIONARY[text] !== undefined) {
    pitch = PITCH_ACCENT_DICTIONARY[text];
  } else {
    // Heuristic tự động đoán theo quy tắc tiếng Nhật:
    if (clean.endsWith('じん') || clean.endsWith('人')) {
      // Hậu tố ~じん thường là Nakadaka hạ ở âm trước đuôi hoặc ngay じん
      pitch = Math.max(1, n - 1);
    } else if (clean.endsWith('ご') || clean.endsWith('語')) {
      // Hậu tố ~ご phần lớn là Heiban (0)
      pitch = 0;
    } else if (clean.endsWith('いん') || clean.endsWith('員')) {
      // Hậu tố ~いん thường là Nakadaka hạ ở 3
      pitch = 3;
    } else if (clean.startsWith('お') || clean.startsWith('ご')) {
      // Tiền tố lịch sự お〜 / ご〜 thường giữ Heiban
      pitch = 0;
    } else {
      // Mặc định cho từ Heiban (phổ biến nhất ~60% trong tiếng Nhật)
      pitch = 0;
    }
  }

  // 2. Xác định dạng pattern (Heiban, Atamadaka, Nakadaka, Odaka)
  let patternType: PitchAccentResult['patternType'] = 'heiban';
  let description = 'Heiban (平板 - Bằng phẳng: Thấp -> Cao)';

  if (pitch === 0) {
    patternType = 'heiban';
    description = 'Heiban (平板 - Bằng phẳng [0])';
  } else if (pitch === 1) {
    patternType = 'atamadaka';
    description = 'Atamadaka (頭高 - Cao đầu [1])';
  } else if (pitch >= n) {
    patternType = 'odaka';
    description = `Odaka (尾高 - Cao đuôi [${pitch}])`;
  } else {
    patternType = 'nakadaka';
    description = `Nakadaka (中高 - Cao giữa [${pitch}])`;
  }

  // 3. Tính toán trạng thái Cao / Thấp cho từng mora
  // Quy tắc Tokyo Japanese Pitch Accent:
  // - Pitch = 0 (Heiban): Mora 1 là Thấp, Mora 2..n là Cao
  // - Pitch = 1 (Atamadaka): Mora 1 là Cao, Mora 2..n là Thấp
  // - Pitch = k (2 <= k): Mora 1 là Thấp, Mora 2..k là Cao, Mora (k+1)..n là Thấp
  const moraInfos: MoraInfo[] = [];

  for (let i = 0; i < n; i++) {
    let isHigh = false;

    if (pitch === 0) {
      isHigh = i > 0;
    } else if (pitch === 1) {
      isHigh = i === 0;
    } else {
      isHigh = i >= 1 && i < pitch;
    }

    moraInfos.push({
      text: moras[i],
      isHigh
    });
  }

  // 4. Đánh dấu các điểm chuyển bước nhảy (step up / step down)
  for (let i = 0; i < moraInfos.length; i++) {
    const prev = moraInfos[i - 1];
    const curr = moraInfos[i];
    const next = moraInfos[i + 1];

    if (prev && !prev.isHigh && curr.isHigh) {
      curr.stepUpBefore = true;
    }
    if (curr.isHigh && next && !next.isHigh) {
      curr.stepDownAfter = true;
    }
  }

  return {
    patternType,
    pitchNumber: pitch,
    moras: moraInfos,
    description
  };
}
