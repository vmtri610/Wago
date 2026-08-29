/**
 * Chuyển đổi số nguyên (0 -> 99,999,999) sang tiếng Nhật (Hiragana & Romaji)
 * Xử lý chính xác mọi biến âm (300, 600, 800, 3000, 8000, 10000, ...)
 */

const ONES_JP: Record<number, { hiragana: string; romaji: string }> = {
  0: { hiragana: 'ゼロ', romaji: 'zero' },
  1: { hiragana: 'いち', romaji: 'ichi' },
  2: { hiragana: 'に', romaji: 'ni' },
  3: { hiragana: 'さん', romaji: 'san' },
  4: { hiragana: 'よん', romaji: 'yon' },
  5: { hiragana: 'ご', romaji: 'go' },
  6: { hiragana: 'ろく', romaji: 'roku' },
  7: { hiragana: 'なな', romaji: 'nana' },
  8: { hiragana: 'はち', romaji: 'hachi' },
  9: { hiragana: 'きゅう', romaji: 'kyuu' }
};

const HUNDREDS_JP: Record<number, { hiragana: string; romaji: string }> = {
  1: { hiragana: 'ひゃく', romaji: 'hyaku' },
  2: { hiragana: 'にひゃく', romaji: 'nihyaku' },
  3: { hiragana: 'さんびゃく', romaji: 'sanbyaku' }, // Biến âm
  4: { hiragana: 'よんひゃく', romaji: 'yonhyaku' },
  5: { hiragana: 'ごひゃく', romaji: 'gohyaku' },
  6: { hiragana: 'ろっぴゃく', romaji: 'roppyaku' }, // Biến âm
  7: { hiragana: 'ななひゃく', romaji: 'nanahyaku' },
  8: { hiragana: 'はっぴゃく', romaji: 'happyaku' }, // Biến âm
  9: { hiragana: 'きゅうひゃく', romaji: 'kyuuhyaku' }
};

const THOUSANDS_JP: Record<number, { hiragana: string; romaji: string }> = {
  1: { hiragana: 'せん', romaji: 'sen' },
  2: { hiragana: 'にせん', romaji: 'nisen' },
  3: { hiragana: 'さんぜん', romaji: 'sanzen' }, // Biến âm
  4: { hiragana: 'よんせん', romaji: 'yonsen' },
  5: { hiragana: 'ごせん', romaji: 'gosen' },
  6: { hiragana: 'ろくせん', romaji: 'rokusen' },
  7: { hiragana: 'ななせん', romaji: 'nanasen' },
  8: { hiragana: 'はっせん', romaji: 'hassen' }, // Biến âm
  9: { hiragana: 'きゅうせん', romaji: 'kyuusen' }
};

function convertUnder10000(num: number): { hiragana: string; romaji: string } {
  if (num === 0) return { hiragana: '', romaji: '' };
  if (num < 10) return { hiragana: ONES_JP[num].hiragana, romaji: ONES_JP[num].romaji };

  let h = '';
  let r = '';

  const thousands = Math.floor(num / 1000);
  const hundreds = Math.floor((num % 1000) / 100);
  const tens = Math.floor((num % 100) / 10);
  const ones = num % 10;

  if (thousands > 0) {
    h += THOUSANDS_JP[thousands].hiragana;
    r += (r ? ' ' : '') + THOUSANDS_JP[thousands].romaji;
  }

  if (hundreds > 0) {
    h += HUNDREDS_JP[hundreds].hiragana;
    r += (r ? ' ' : '') + HUNDREDS_JP[hundreds].romaji;
  }

  if (tens > 0) {
    if (tens === 1) {
      h += 'じゅう';
      r += (r ? ' ' : '') + 'juu';
    } else {
      h += ONES_JP[tens].hiragana + 'じゅう';
      r += (r ? ' ' : '') + ONES_JP[tens].romaji + 'juu';
    }
  }

  if (ones > 0) {
    h += ONES_JP[ones].hiragana;
    r += (r ? ' ' : '') + ONES_JP[ones].romaji;
  }

  return { hiragana: h, romaji: r };
}

export function numberToJapanese(num: number): { hiragana: string; romaji: string; acceptableAnswers: string[] } {
  if (num === 0) {
    return {
      hiragana: 'ゼロ',
      romaji: 'zero',
      acceptableAnswers: ['ゼロ', 'ぜろ', 'れい', 'zero', 'rei']
    };
  }

  const man = Math.floor(num / 10000);
  const remainder = num % 10000;

  let h = '';
  let r = '';

  if (man > 0) {
    const manPart = convertUnder10000(man);
    h += (man === 1 ? 'いち' : manPart.hiragana) + 'まん';
    r += (man === 1 ? 'ichi' : manPart.romaji) + ' man';
  }

  if (remainder > 0) {
    const remPart = convertUnder10000(remainder);
    h += remPart.hiragana;
    r += (r ? ' ' : '') + remPart.romaji;
  }

  const answers = new Set<string>();
  const cleanH = h.replace(/\s+/g, '');
  const cleanR = r.replace(/\s+/g, '').toLowerCase();

  answers.add(cleanH);
  answers.add(h);
  answers.add(cleanR);
  answers.add(r.toLowerCase());

  // Alternate spellings (juu/jyuu/jyu/ju, kyuu/kyu/ku, yon/shi, nana/shichi)
  const addVariants = (text: string) => {
    answers.add(text);
    answers.add(text.replace(/juu/g, 'jyuu'));
    answers.add(text.replace(/juu/g, 'jyu'));
    answers.add(text.replace(/juu/g, 'ju'));
    answers.add(text.replace(/jyuu/g, 'juu'));
    answers.add(text.replace(/jyuu/g, 'jyu'));
    answers.add(text.replace(/kyuu/g, 'kyu'));
    answers.add(text.replace(/kyuu/g, 'ku'));
    answers.add(text.replace(/yon/g, 'shi'));
    answers.add(text.replace(/nana/g, 'shichi'));
  };

  addVariants(cleanR);

  return {
    hiragana: h,
    romaji: r,
    acceptableAnswers: Array.from(answers)
  };
}

export function checkNumberAnswer(input: string, num: number): boolean {
  const result = numberToJapanese(num);
  const cleanInput = input.trim().toLowerCase().replace(/\s+/g, '').replace(/[\-–—]/g, '');
  if (!cleanInput) return false;

  const normalizedAnswers = result.acceptableAnswers.map(a => a.toLowerCase().replace(/\s+/g, '').replace(/[\-–—]/g, ''));
  
  if (normalizedAnswers.includes(cleanInput)) return true;

  // Normalize input variants (e.g. jyu -> juu, kyu -> kyuu)
  const normalizedInputVariant = cleanInput
    .replace(/jyuu/g, 'juu')
    .replace(/jyu/g, 'juu')
    .replace(/ju([^u]|$)/g, 'juu$1')
    .replace(/kyu([^u]|$)/g, 'kyuu$1');

  return normalizedAnswers.includes(normalizedInputVariant);
}
