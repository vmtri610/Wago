/**
 * Xử lý phát âm tiếng Nhật Audio TTS
 * Chỉ phát giọng nữ (Female voice) chuẩn ngữ điệu tiếng Nhật
 * Nếu chưa tải được giọng nữ tiếng Nhật thì không phát âm thanh tạp/giọng nam.
 */

let cachedVoices: SpeechSynthesisVoice[] = [];
let isVoiceListenerAttached = false;

function initVoicePreload() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  cachedVoices = window.speechSynthesis.getVoices();

  if (!isVoiceListenerAttached) {
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoices = window.speechSynthesis.getVoices();
    };
    isVoiceListenerAttached = true;
  }
}

// Khởi chạy preload ngay khi load file trên browser
if (typeof window !== 'undefined') {
  initVoicePreload();
}

/**
 * Danh sách tên các giọng nữ tiếng Nhật chuẩn
 */
const FEMALE_VOICE_KEYWORDS = [
  'kyoko',
  'nanami',
  'sayaka',
  'ayumi',
  'haruka',
  'mayu',
  'google 日本語',
  'google ja-jp',
  'female',
  'siri' // Siri nữ trên Apple
];

/**
 * Danh sách tên các giọng nam tiếng Nhật cần loại trừ 100%
 */
const MALE_VOICE_KEYWORDS = [
  'otoya',
  'hattori',
  'keita',
  'ichiro',
  'daichi',
  'male',
  'naoki',
  'takumi'
];

/**
 * Tìm giọng nữ tiếng Nhật chuẩn
 */
export function getJapaneseFemaleVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  initVoicePreload();
  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const jaVoices = voices.filter(v => {
    const lang = (v.lang || '').toLowerCase().replace('_', '-');
    return lang.startsWith('ja');
  });

  if (jaVoices.length === 0) return null;

  // 1. Ưu tiên cao nhất: Giọng nằm trong danh sách giọng nữ nổi tiếng (Kyoko, Nanami, Sayaka, Google...)
  const knownFemaleVoice = jaVoices.find(v => {
    const name = (v.name || '').toLowerCase();
    const isMale = MALE_VOICE_KEYWORDS.some(k => name.includes(k));
    if (isMale) return false;
    return FEMALE_VOICE_KEYWORDS.some(k => name.includes(k));
  });

  if (knownFemaleVoice) return knownFemaleVoice;

  // 2. Tìm bất kỳ giọng Nhật nào KHÔNG PHẢI giọng nam
  const safeJaVoice = jaVoices.find(v => {
    const name = (v.name || '').toLowerCase();
    return !MALE_VOICE_KEYWORDS.some(k => name.includes(k));
  });

  return safeJaVoice || null;
}

/**
 * Xóa ký tự phụ, số thứ tự ví dụ, dấu ngoặc để TTS phát âm tiếng Nhật chuẩn ngữ điệu
 */
export function cleanForTTS(text: string): string {
  if (!text) return '';
  return text
    .replace(/[①②③④⑤⑥⑦⑧⑨⑩]/g, '')
    .replace(/^[A-B]:\s*/i, '')
    .replace(/[～~]/g, '')
    .replace(/\(.*?\)|（.*?）/g, '')
    .replace(/\[.*?\]|【.*?】/g, '')
    .replace(/≒|\/|\|/g, ' ')
    .trim();
}

/**
 * Phát âm tiếng Nhật với giọng NỮ
 */
export function speakJapanese(text: string) {
  if (typeof window === 'undefined' || !text || !text.trim()) return;

  const cleanText = cleanForTTS(text);
  if (!cleanText) return;

  if (!('speechSynthesis' in window)) return;

  try {
    const femaleVoice = getJapaneseFemaleVoice();

    // Nếu chưa load được giọng nữ tiếng Nhật thì không phát
    if (!femaleVoice) {
      // Thử kích hoạt getVoices lại cho lần bấm sau
      if (window.speechSynthesis.getVoices().length === 0) {
        initVoicePreload();
      }
      console.warn('Đang chờ tải giọng nữ tiếng Nhật...');
      return;
    }

    window.speechSynthesis.cancel(); // Dừng phát đoạn trước nếu đang chạy

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ja-JP';
    utterance.voice = femaleVoice;
    // Tốc độ 0.88 giúp nghe rõ từng cao độ mora của ngữ điệu tiếng Nhật
    utterance.rate = 0.88;
    utterance.pitch = 1.05; // Độ cao nhẹ giúp giọng nữ thêm trong trẻo, tự nhiên

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('SpeechSynthesis female voice playback error:', e);
  }
}
