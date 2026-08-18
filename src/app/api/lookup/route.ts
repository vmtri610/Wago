import { NextResponse } from 'next/server';
import { kanaToRomaji } from '@/lib/kana';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword')?.trim();

  if (!keyword) {
    return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
  }

  const { romaji: localRomaji, unknown } = kanaToRomaji(keyword);

  let suggestedRomaji = localRomaji;
  let suggestedMeaningVi = '';
  let readings: string[] = [];

  // 1. Lấy nghĩa Tiếng Việt trực tiếp từ API dịch Nhật - Việt chuẩn
  try {
    const viRes = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=vi&dt=t&q=${encodeURIComponent(keyword)}`,
      { 
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }, 
        next: { revalidate: 3600 } 
      }
    );
    if (viRes.ok) {
      const viData = await viRes.json();
      if (viData && viData[0] && viData[0][0] && viData[0][0][0]) {
        suggestedMeaningVi = viData[0][0][0].trim();
      }
    }
  } catch (err) {
    console.error('Lỗi API dịch tiếng Việt:', err);
  }

  // 2. Lấy cách đọc Hiragana / Romaji chuẩn từ Jisho API
  try {
    const jishoRes = await fetch(
      `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(keyword)}`,
      { 
        headers: { 'User-Agent': 'WagoNoteApp/1.0' }, 
        next: { revalidate: 3600 } 
      }
    );

    if (jishoRes.ok) {
      const data = await jishoRes.json();
      if (data?.data && data.data.length > 0) {
        const item = data.data[0];
        const japaneseObj = item.japanese?.[0] || {};
        const reading = japaneseObj.reading || '';

        if (reading) {
          const readingRomaji = kanaToRomaji(reading).romaji;
          if (readingRomaji) suggestedRomaji = readingRomaji;
          readings.push(reading);
        }
      }
    }
  } catch (err) {
    console.error('Lỗi Jisho API:', err);
  }

  return NextResponse.json({
    keyword,
    romaji: suggestedRomaji,
    meaning: suggestedMeaningVi,
    readings,
    hasKanji: unknown
  });
}
