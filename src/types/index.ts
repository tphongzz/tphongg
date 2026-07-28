export type RankLevel = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master';

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface RankInfo {
  level: RankLevel;
  name: string;
  minXp: number;
  maxXp: number;
  iconName: string;
  badgeBg: string;
  borderColor: string;
  textColor: string;
  glowColor: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  rank: RankLevel;
  xp: number;
  streak: number;
  lastActiveDate: string;
  wordsLearned: number;
  grammarCompleted: number;
  shadowingCompleted: number;
  placementTestDone: boolean;
  weakTopics: string[];
  weakWords: string[];
  geminiApiKey?: string;
  merriamWebsterApiKey?: string;
  saplingApiKey?: string;
  azureSpeechKey?: string;
  azureSpeechRegion?: string;
  speechSuperAppKey?: string;
  speechSuperSecretKey?: string;
}

export interface WordItem {
  id: string;
  term: string;
  phonetic: string;
  audio?: string;
  definition: string;
  vietnameseMeaning: string;
  exampleSentence: string;
  exampleTranslation: string;
  level: CEFRLevel;
  topic: string;
  mastered?: boolean;
}

export interface GrammarQuiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index
  explanation: string;
}

export interface GrammarLesson {
  id: string;
  title: string;
  level: CEFRLevel;
  category: string;
  summary: string;
  explanationMarkdown: string;
  examples: { english: string; vietnamese: string }[];
  quizzes: GrammarQuiz[];
  completed?: boolean;
}

export interface TranscriptLine {
  id: string;
  startTime: number; // in seconds
  endTime: number;   // in seconds
  text: string;
  translation?: string;
}

export interface ShadowingLesson {
  id: string;
  title: string;
  youtubeId: string;
  thumbnailUrl: string;
  duration: string;
  level: CEFRLevel;
  category: string;
  transcript: TranscriptLine[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'adam' | 'eva' | 'tutor';
  text: string;
  timestamp: string;
  audioUrl?: string;
  grammarFix?: {
    original: string;
    corrected: string;
    explanation: string;
  };
}

export interface PlacementQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'listening';
  level: CEFRLevel;
  question: string;
  audioText?: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export type ActiveTab = 'dashboard' | 'vocabulary' | 'grammar' | 'chatbot' | 'shadowing' | 'placement' | 'tutor' | 'settings' | 'minigames' | 'exams';

// -------------------------------------------------------------
// New Types for 10 Mini-Games Arcade
// -------------------------------------------------------------

export type MiniGameType =
  | 'match'
  | 'unscramble'
  | 'speed'
  | 'listening'
  | 'builder'
  | 'boss'
  | 'crossword'
  | 'runner'
  | 'ninja'
  | 'memory';

export interface MiniGameInfo {
  id: MiniGameType;
  title: string;
  subtitle: string;
  iconName: string;
  badge: string;
  color: string;
  description: string;
}

export interface GameScoreRecord {
  gameId: MiniGameType;
  highScore: number;
  lastPlayed: string;
  timesPlayed: number;
}

export interface CrosswordCell {
  row: number;
  col: number;
  letter: string;
  number?: number;
  userLetter?: string;
  isBlocked?: boolean;
}

// -------------------------------------------------------------
// New Types for 500+ Practice Tests Bank
// -------------------------------------------------------------

export type ExamSkillType = 'vocabulary' | 'grammar' | 'reading' | 'listening';

export interface ExamQuestion {
  id: string;
  skill: ExamSkillType;
  type: 'multiple-choice' | 'fill-blank' | 'reading-comprehension' | 'listening-audio';
  level: CEFRLevel;
  question: string;
  readingPassage?: {
    title: string;
    content: string;
  };
  audioText?: string;
  options: string[];
  correctAnswer: number; // 0-based index
  explanation: string; // Detailed Vietnamese explanation
}

export interface ExamTest {
  id: string;
  testNumber: number; // 1 to 500+
  title: string;
  level: CEFRLevel;
  durationMinutes: number;
  totalQuestions: number; // 30 questions
  skillCounts: {
    vocabulary: number; // 7
    grammar: number;    // 7
    reading: number;    // 8
    listening: number;  // 8
  };
  questions: ExamQuestion[];
}

export interface ExamResult {
  testId: string;
  testNumber: number;
  title: string;
  level: CEFRLevel;
  score: number; // out of 30
  percentage: number;
  completedAt: string;
  timeSpentSeconds: number;
  skillScores: {
    vocabulary: number;
    grammar: number;
    reading: number;
    listening: number;
  };
  userAnswers: Record<string, number>; // questionId -> chosen answer index
}

export interface ChatFixRecord {
  id: string;
  original: string;
  corrected: string;
  explanation: string;
  date: string;
}

export interface ShadowingRecord {
  id: string;
  lessonTitle: string;
  score: number;
  date: string;
}

export interface RecommendedTask {
  id: string;
  title: string;
  description: string;
  category: 'vocabulary' | 'grammar' | 'shadowing' | 'chatbot';
  targetTab: ActiveTab;
  xpReward: number;
  completed?: boolean;
}

export interface RemediationQuestion {
  id: string;
  type: 'word' | 'grammar';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  targetItem: string;
}

export interface LearningAnalytics {
  weakWords: { term: string; count: number }[];
  weakTopics: { topic: string; count: number }[];
  shadowingHistory: ShadowingRecord[];
  chatFixHistory: ChatFixRecord[];
  overallAccuracy: number;
  recommendedDailyXp: number;
}

// -------------------------------------------------------------
// New Types for Extended API Integration
// -------------------------------------------------------------

export interface DictionaryPhonetic {
  text?: string;
  audio?: string;
  tag?: string;
}

export interface DictionaryDefinition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

export interface DictionaryMeaning {
  partOfSpeech: string;
  definitions: DictionaryDefinition[];
  synonyms?: string[];
  antonyms?: string[];
}

export interface DetailedWordLookup {
  word: string;
  phonetics: DictionaryPhonetic[];
  meanings: DictionaryMeaning[];
  vietnameseMeaning?: string;
  sourceUrl?: string;
}

export interface DatamuseSuggestion {
  word: string;
  score: number;
  tags?: string[];
}

export interface GrammarMatch {
  message: string;
  shortMessage?: string;
  offset: number;
  length: number;
  replacements: string[];
  ruleId?: string;
  contextText?: string;
}

export interface TextStatistics {
  wordCount: number;
  characterCount: number;
  sentenceCount: number;
  fleschKincaidGrade?: number;
  readabilityScore?: number;
  readingTimeSeconds?: number;
}

export interface DetailedPronunciationScore {
  overallScore: number;
  accuracyScore: number;
  fluencyScore: number;
  completenessScore: number;
  prosodyScore?: number;
  wordsDetails?: {
    word: string;
    score: number;
    errorType?: 'None' | 'Omission' | 'Insertion' | 'Mispronunciation';
  }[];
}
