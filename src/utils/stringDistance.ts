/**
 * Utility for calculating string similarity, Levenshtein distance,
 * and word-by-word pronunciation match for Shadowing evaluation.
 */

export interface WordMatchResult {
  word: string;
  status: 'correct' | 'missing' | 'extra';
}

export interface ShadowingEvaluationResult {
  score: number; // 0 to 100
  wordMatches: WordMatchResult[];
  feedback: string;
  feedbackColor: string;
}

/**
 * Standard Levenshtein distance algorithm
 */
export const getLevenshteinDistance = (a: string, b: string): number => {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          )
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

/**
 * Clean text for comparison: remove punctuation, lowercase, strip extra whitespace
 */
export const cleanText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"’]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Evaluate spoken text against target transcript line
 */
export const evaluateShadowingSpeech = (
  targetLine: string,
  spokenText: string
): ShadowingEvaluationResult => {
  const cleanTarget = cleanText(targetLine);
  const cleanSpoken = cleanText(spokenText);

  if (!cleanSpoken) {
    return {
      score: 0,
      wordMatches: cleanTarget.split(' ').map((w) => ({ word: w, status: 'missing' })),
      feedback: 'Chưa nhận diện thấy giọng nói. Hãy bấm nút thu âm và nói rõ hơn.',
      feedbackColor: 'var(--accent-red, #ff4757)',
    };
  }

  // 1. Levenshtein similarity ratio
  const maxLen = Math.max(cleanTarget.length, cleanSpoken.length);
  const dist = getLevenshteinDistance(cleanTarget, cleanSpoken);
  const levSimilarity = maxLen === 0 ? 100 : Math.max(0, (1 - dist / maxLen) * 100);

  // 2. Word-by-word alignment check
  const targetWords = cleanTarget.split(' ').filter(Boolean);
  const spokenWords = cleanSpoken.split(' ').filter(Boolean);

  const wordMatches: WordMatchResult[] = [];
  let correctCount = 0;

  targetWords.forEach((tWord) => {
    const foundIndex = spokenWords.findIndex((sWord) => {
      if (sWord === tWord) return true;
      // Allow minor 1-char edit distance for short words or typos in STT
      if (tWord.length > 3 && getLevenshteinDistance(tWord, sWord) <= 1) return true;
      return false;
    });

    if (foundIndex !== -1) {
      wordMatches.push({ word: tWord, status: 'correct' });
      correctCount++;
    } else {
      wordMatches.push({ word: tWord, status: 'missing' });
    }
  });

  const wordMatchScore = targetWords.length > 0 ? (correctCount / targetWords.length) * 100 : 0;

  // Final score: weighted blend of word match (70%) and Levenshtein similarity (30%)
  const finalScore = Math.round(wordMatchScore * 0.7 + levSimilarity * 0.3);
  const clampedScore = Math.min(100, Math.max(0, finalScore));

  let feedback = '';
  let feedbackColor = '';

  if (clampedScore >= 85) {
    feedback = 'Xuất sắc! Phát âm và nhịp điệu của bạn rất chuẩn xác! 🔥';
    feedbackColor = 'var(--accent-green, #2ed573)';
  } else if (clampedScore >= 70) {
    feedback = 'Rất tốt! Giọng nói tự nhiên, chỉ cần chú ý một vài từ chưa phát âm rõ. 👍';
    feedbackColor = 'var(--accent-cyan, #00f0ff)';
  } else if (clampedScore >= 50) {
    feedback = 'Khá ổn! Hãy nghe lại video câu này và nhại lại từng từ. 💡';
    feedbackColor = 'var(--accent-orange, #ffa500)';
  } else {
    feedback = 'Cần luyện tập thêm! Nhấp "Nghe lại" để lắng nghe ngữ điệu chuẩn và thử lại nhé. 💪';
    feedbackColor = 'var(--accent-red, #ff4757)';
  }

  return {
    score: clampedScore,
    wordMatches,
    feedback,
    feedbackColor,
  };
};
