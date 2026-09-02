import { kanaToRomaji } from './kana';

// Normalize any tildes, dashes, or fullwidth characters to standard representation
function normalizeString(str: string): string {
  return str
    .trim()
    .toLowerCase()
    // normalize various fullwidth tildes, wave dashes, etc. to standard '~'
    .replace(/[\uFF5E\u301C\u007E]/g, '~')
    // normalize various dashes to standard '-'
    .replace(/[\u2013\u2014\u2212\uFF0D]/g, '-')
    // normalize fullwidth alphanumeric/spaces to halfwidth
    .normalize('NFKC');
}

// Strip leading/trailing symbols often omitted by learners (like ~, -, punctuation)
function stripSurroundingSymbols(str: string): string {
  return str.replace(/^[~–—\-\.\,\?\!\s]+|[~–—\-\.\,\?\!\s]+$/g, '');
}

/**
 * Validates user input against a word's Japanese and Romaji forms.
 * Supports:
 * - Prefix/suffix tildes (~, ～, 〜) and dashes (optional for learners)
 * - Alternatives separated by /, ≒, or comma
 * - Kanji with furigana in parentheses (e.g. 私 (わたし))
 * - Spacing tolerance (e.g. "ano hito" vs "anohito")
 * - Automatic Kana to Romaji fallback comparison
 */
export function checkWordAnswer(userInput: string, target?: { jp?: string; romaji?: string } | null): boolean {
  if (!userInput || !target || !target.jp) return false;

  const rawInput = normalizeString(userInput);
  const strippedInput = stripSurroundingSymbols(rawInput);
  if (!rawInput && !strippedInput) return false;

  // Set of all accepted canonical forms
  const accepted = new Set<string>();

  const addVariant = (val?: string) => {
    if (!val) return;
    const norm = normalizeString(val);
    if (!norm) return;
    accepted.add(norm);

    const stripped = stripSurroundingSymbols(norm);
    if (stripped) accepted.add(stripped);

    // If string contains Kana, convert to romaji as well
    const rom = kanaToRomaji(stripped);
    if (rom.romaji && !rom.unknown) {
      const normRom = normalizeString(rom.romaji);
      accepted.add(normRom);
      const strippedRom = stripSurroundingSymbols(normRom);
      if (strippedRom) accepted.add(strippedRom);
    }
  };

  // 1. Process JP field: split multiple options separated by / or ≒ or ,
  const jpParts = target.jp.split(/[/≒,、]/);
  for (const part of jpParts) {
    const trimmedPart = part.trim();
    if (!trimmedPart) continue;

    addVariant(trimmedPart);

    // Check for parentheses (e.g. "私 (わたし)" or "私(わたし)")
    const parenMatch = trimmedPart.match(/^([^(（]+)[(（]([^)）]+)[)）]$/);
    if (parenMatch) {
      const outside = parenMatch[1].trim();
      const inside = parenMatch[2].trim();
      addVariant(outside);
      addVariant(inside);
    }
  }

  // 2. Process Romaji field: split multiple options
  if (target.romaji) {
    const romajiParts = target.romaji.split(/[/≒,]/);
    for (const part of romajiParts) {
      const trimmedPart = part.trim();
      if (!trimmedPart) continue;
      addVariant(trimmedPart);
    }
  }

  // 3. Direct match with rawInput or strippedInput
  if (accepted.has(rawInput) || (strippedInput && accepted.has(strippedInput))) {
    return true;
  }

  // 4. Space-insensitive match (e.g. "ano hito" vs "anohito", "yoroshiku onegaishimasu" vs "yoroshikuonegaishimasu")
  const inputNoSpaces = rawInput.replace(/\s+/g, '');
  const strippedNoSpaces = strippedInput.replace(/\s+/g, '');

  for (const acc of accepted) {
    const accNoSpaces = acc.replace(/\s+/g, '');
    if (inputNoSpaces === accNoSpaces || (strippedNoSpaces && strippedNoSpaces === accNoSpaces)) {
      return true;
    }
  }

  return false;
}
