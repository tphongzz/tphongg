import { GrammarMatch, TextStatistics } from '../types';

/**
 * Check grammar and spelling using LanguageTool HTTP API (api.languagetool.org)
 */
export const checkGrammarLanguageTool = async (
  text: string,
  language: string = 'en-US'
): Promise<GrammarMatch[]> => {
  const cleanText = text.trim();
  if (!cleanText) return [];

  try {
    const params = new URLSearchParams();
    params.append('text', cleanText);
    params.append('language', language);

    const res = await fetch('https://api.languagetool.org/v2/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!res.ok) return [];

    const data = await res.json();
    if (!data || !Array.isArray(data.matches)) return [];

    return data.matches.map((m: any) => ({
      message: m.message || 'Grammar or spelling issue detected.',
      shortMessage: m.shortMessage || 'Correction available',
      offset: m.offset || 0,
      length: m.length || 0,
      replacements: (m.replacements || []).map((r: any) => r.value).filter(Boolean),
      ruleId: m.rule?.id || 'LANGUAGE_TOOL_RULE',
      contextText: m.context?.text || '',
    }));
  } catch (error) {
    console.warn('LanguageTool API failed:', error);
    return [];
  }
};

/**
 * Calculate Flesch-Kincaid Readability & Text Statistics (Client-side engine + Sapling AI API)
 */
export const computeTextStatistics = async (
  text: string,
  saplingApiKey?: string
): Promise<TextStatistics> => {
  const cleanText = text.trim();
  if (!cleanText) {
    return {
      wordCount: 0,
      characterCount: 0,
      sentenceCount: 0,
      fleschKincaidGrade: 0,
      readabilityScore: 100,
      readingTimeSeconds: 0,
    };
  }

  // 1. Try Sapling AI API if key is present
  if (saplingApiKey) {
    try {
      const res = await fetch('https://api.sapling.ai/api/v1/statistics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: saplingApiKey, text: cleanText }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.num_words === 'number') {
          return {
            wordCount: data.num_words,
            characterCount: data.num_chars || cleanText.length,
            sentenceCount: data.num_sentences || 1,
            fleschKincaidGrade: Math.round((data.flesch_kincaid_grade || 5) * 10) / 10,
            readabilityScore: Math.round(data.readability_score || 70),
            readingTimeSeconds: Math.ceil(data.num_words / 3.3),
          };
        }
      }
    } catch (e) {
      console.warn('Sapling AI API statistics call failed, falling back to local engine:', e);
    }
  }

  // 2. Local Fallback Math Engine for Readability & Statistics
  const words = cleanText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const characterCount = cleanText.length;

  // Split into sentences using punctuation rules
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length || 1;

  // Count syllables roughly
  let syllableCount = 0;
  words.forEach(w => {
    const wordLower = w.toLowerCase().replace(/[^a-z]/g, '');
    if (!wordLower) return;
    if (wordLower.length <= 3) {
      syllableCount += 1;
      return;
    }
    const matches = wordLower.match(/[aeiouy]{1,2}/g);
    let count = matches ? matches.length : 1;
    if (wordLower.endsWith('e') && !wordLower.endsWith('le')) count--;
    syllableCount += Math.max(1, count);
  });

  // Flesch-Kincaid Grade Level formula:
  // 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59
  const wordsPerSentence = wordCount / sentenceCount;
  const syllablesPerWord = syllableCount / (wordCount || 1);
  let gradeLevel = 0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59;
  gradeLevel = Math.max(1, Math.min(20, Math.round(gradeLevel * 10) / 10));

  // Flesch Reading Ease score:
  // 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
  let easeScore = 206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord;
  easeScore = Math.max(0, Math.min(100, Math.round(easeScore)));

  const readingTimeSeconds = Math.ceil(wordCount / 3.3); // ~200 wpm

  return {
    wordCount,
    characterCount,
    sentenceCount,
    fleschKincaidGrade: gradeLevel,
    readabilityScore: easeScore,
    readingTimeSeconds,
  };
};
