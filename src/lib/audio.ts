export function speakJapanese(text: string) {
  if (typeof window === 'undefined' || !text || !text.trim()) return;

  const cleanText = text.trim();

  // 1. Dùng Google Neural TTS Endpoint (giọng đọc người thật tiếng Nhật chất lượng cao)
  const gTranslateUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=gtx&tl=ja&q=${encodeURIComponent(cleanText)}`;
  
  try {
    // Dừng âm thanh đang phát trước đó
    if ((window as any)._wagoAudio) {
      (window as any)._wagoAudio.pause();
      (window as any)._wagoAudio = null;
    }

    const audio = new Audio(gTranslateUrl);
    audio.playbackRate = 0.92;
    (window as any)._wagoAudio = audio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Google Audio playback blocked, fallback to Web Speech API:', err);
        useWebSpeechFallback(cleanText);
      });
    }
  } catch (e) {
    useWebSpeechFallback(cleanText);
  }
}

function useWebSpeechFallback(text: string) {
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  utterance.rate = 0.88;

  const voices = window.speechSynthesis.getVoices();
  // Lọc tìm giọng đọc tự nhiên (Natural/Enhanced/Google)
  const naturalVoice = voices.find(v => 
    v.lang.toLowerCase().includes('ja') && (
      v.name.includes('Natural') || 
      v.name.includes('Enhanced') || 
      v.name.includes('Google') || 
      v.name.includes('Kyoko') || 
      v.name.includes('Otoya')
    )
  ) || voices.find(v => v.lang.toLowerCase().includes('ja'));

  if (naturalVoice) {
    utterance.voice = naturalVoice;
  }

  window.speechSynthesis.speak(utterance);
}
