export function speakJapanese(text: string) {
  if (typeof window === 'undefined' || !text || !text.trim()) return;

  const cleanText = text.trim();

  // 1. Ưu tiên sử dụng Web Speech API sẵn có trên hệ điều hành iOS/Android (Native, phát âm chuẩn tiếng Nhật & không bị chặn CORS)
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.88;

      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(v => 
        (v.lang.toLowerCase().includes('ja') || v.lang.toLowerCase().includes('jp')) && (
          v.name.includes('Kyoko') || 
          v.name.includes('Otoya') || 
          v.name.includes('Hattori') ||
          v.name.includes('Natural') || 
          v.name.includes('Enhanced') || 
          v.name.includes('Google')
        )
      ) || voices.find(v => v.lang.toLowerCase().includes('ja') || v.lang.toLowerCase().includes('jp'));

      if (naturalVoice) {
        utterance.voice = naturalVoice;
      }

      utterance.onerror = () => {
        playGoogleAudioFallback(cleanText);
      };

      window.speechSynthesis.speak(utterance);
      return;
    } catch (e) {
      console.warn('WebSpeech error, falling back to Google TTS:', e);
    }
  }

  // 2. Fallback sang Google Neural TTS
  playGoogleAudioFallback(cleanText);
}

function playGoogleAudioFallback(cleanText: string) {
  const gTranslateUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=gtx&tl=ja&q=${encodeURIComponent(cleanText)}`;
  
  try {
    if ((window as any)._wagoAudio) {
      (window as any)._wagoAudio.pause();
      (window as any)._wagoAudio = null;
    }

    const audio = new Audio(gTranslateUrl);
    audio.playbackRate = 0.92;
    (window as any)._wagoAudio = audio;
    audio.play().catch(err => {
      console.warn('Google Audio playback error on mobile:', err);
    });
  } catch (err) {
    console.error('Audio fallback error:', err);
  }
}
