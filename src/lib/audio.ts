let sharedAudio: HTMLAudioElement | null = null;

export function speakJapanese(text: string) {
  if (typeof window === 'undefined' || !text || !text.trim()) return;

  const cleanText = text.trim();

  // 1. Thử dùng Web Speech API (tương thích 100% với iOS PWA Standalone)
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel(); // Dừng phát đoạn trước
      
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.88;

      const voices = window.speechSynthesis.getVoices();
      const jaVoice = voices.find(v => 
        v.lang.toLowerCase().replace('_', '-').includes('ja') && (
          v.name.includes('Natural') || 
          v.name.includes('Enhanced') || 
          v.name.includes('Google') || 
          v.name.includes('Kyoko') || 
          v.name.includes('Otoya') ||
          v.name.includes('Hattori')
        )
      ) || voices.find(v => v.lang.toLowerCase().replace('_', '-').includes('ja'));

      if (jaVoice) {
        utterance.voice = jaVoice;
      }

      window.speechSynthesis.speak(utterance);
      return;
    } catch (e) {
      console.warn('SpeechSynthesis error, fallback to HTML5 Audio:', e);
    }
  }

  // 2. Fallback: HTML5 Audio Stream với Google TTS
  try {
    const gTranslateUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=gtx&tl=ja&q=${encodeURIComponent(cleanText)}`;
    
    if (!sharedAudio) {
      sharedAudio = new Audio();
    }
    sharedAudio.pause();
    sharedAudio.src = gTranslateUrl;
    sharedAudio.playbackRate = 0.92;

    const playPromise = sharedAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Google Audio play error:', err);
      });
    }
  } catch (e) {
    console.error('Audio playback exception:', e);
  }
}
