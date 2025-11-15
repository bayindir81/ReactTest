/**
 * EnglishLearnTV - Type Definitions
 * Complete type system for the English learning app
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type SeriesCategory =
  | 'drama'
  | 'comedy'
  | 'scifi'
  | 'thriller'
  | 'documentary'
  | 'animation'
  | 'crime'
  | 'fantasy';

export type WordKnowledgeStatus = 'unknown' | 'known' | 'learning';

export type LearningMode = 'word' | 'sentence' | 'subtitle';

export type FilterType = 'popular' | 'new' | 'beginner' | 'advanced';

// ============================================
// SERIES MODELS
// ============================================

export interface Series {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  bannerImage: string;
  category: SeriesCategory;
  level: CEFRLevel;
  rating: number;
  totalSeasons: number;
  totalEpisodes: number;
  releaseYear: number;
  isPopular: boolean;
  isNew: boolean;
  tags: string[];
  cast: string[];
  director: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface Episode {
  id: string;
  seriesId: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  description: string;
  thumbnail: string;
  duration: number; // in seconds
  releaseDate: string;
  subtitleUrl: string;
  hasSubtitles: boolean;
  level: CEFRLevel;
}

// ============================================
// SUBTITLE MODELS
// ============================================

export interface SubtitleLine {
  id: string;
  index: number;
  startTime: number; // seconds
  endTime: number;
  text: string;
  translation?: string; // Turkish translation
  words: SubtitleWord[];
}

export interface SubtitleWord {
  id: string;
  word: string;
  normalizedWord: string; // lowercase, no punctuation
  startIndex: number;
  endIndex: number;
  isPunctuation: boolean;
}

export interface Subtitle {
  episodeId: string;
  language: string;
  lines: SubtitleLine[];
  totalWords: number;
  uniqueWords: number;
  averageWordsPerLine: number;
}

// ============================================
// WORD MODELS
// ============================================

export interface WordDefinition {
  word: string;
  phonetic: string;
  phoneticAudio?: string;
  meanings: WordMeaning[];
  level: CEFRLevel;
  frequency: number; // how common the word is (1-10)
}

export interface WordMeaning {
  partOfSpeech: string; // noun, verb, adjective, etc.
  definitions: WordDefinitionItem[];
  synonyms: string[];
  antonyms: string[];
}

export interface WordDefinitionItem {
  definition: string;
  example: string;
  translation: string; // Turkish translation
}

// ============================================
// USER WORD LIST
// ============================================

export interface UserWord {
  id: string;
  userId: string;
  word: string;
  normalizedWord: string;
  status: WordKnowledgeStatus;
  addedAt: string;
  lastReviewedAt?: string;
  reviewCount: number;
  source: {
    seriesId: string;
    episodeId: string;
    subtitleLineId: string;
    context: string; // the sentence where user found this word
  };
  isFavorite: boolean;
  notes?: string;
}

export interface UserWordStats {
  totalWords: number;
  knownWords: number;
  unknownWords: number;
  learningWords: number;
  favoriteWords: number;
  wordsLearnedToday: number;
  wordsLearnedThisWeek: number;
  wordsLearnedThisMonth: number;
  currentStreak: number; // consecutive days
}

// ============================================
// LEARNING MODES
// ============================================

export interface FlashCard {
  id: string;
  word: string;
  definition: string;
  example: string;
  translation: string;
  phonetic: string;
  audioUrl?: string;
}

export interface LearningSession {
  id: string;
  userId: string;
  mode: LearningMode;
  startedAt: string;
  endedAt?: string;
  wordsReviewed: number;
  correctAnswers: number;
  wrongAnswers: number;
  duration: number; // seconds
  cards: FlashCard[];
}

// ============================================
// ANALYTICS & PROGRESS
// ============================================

export interface DailyProgress {
  date: string; // YYYY-MM-DD
  wordsLearned: number;
  sessionsCompleted: number;
  timeSpent: number; // minutes
  episodesWatched: string[]; // episode ids
}

export interface WeeklyProgress {
  weekStart: string; // YYYY-MM-DD
  weekEnd: string;
  totalWords: number;
  dailyProgress: DailyProgress[];
  mostStudiedSeries: string[];
  averageSessionTime: number;
}

export interface UserProgress {
  userId: string;
  totalWordsLearned: number;
  totalTimeSpent: number; // minutes
  totalEpisodesCompleted: number;
  currentLevel: CEFRLevel;
  joinedAt: string;
  lastActiveAt: string;
  dailyGoal: number; // words per day
  dailyStreak: number;
  longestStreak: number;
  weeklyProgress: WeeklyProgress[];
}

export interface TopWord {
  word: string;
  count: number;
  lastUsed: string;
}

// ============================================
// USER PROFILE
// ============================================

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  currentLevel: CEFRLevel;
  targetLevel: CEFRLevel;
  dailyGoal: number;
  nativeLanguage: string;
  learningLanguage: string;
  createdAt: string;
  settings: UserSettings;
}

export interface UserSettings {
  ttsEnabled: boolean;
  ttsSpeed: number; // 0.5 - 2.0
  ttsVoice: string;
  showTranslations: boolean;
  autoPlaySubtitles: boolean;
  highlightUnknownWords: boolean;
  dailyReminderEnabled: boolean;
  dailyReminderTime: string; // HH:mm
  theme: 'light' | 'dark' | 'auto';
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface SeriesListResponse {
  series: Series[];
  categories: SeriesCategory[];
  popularSeries: string[]; // series ids
  newSeries: string[];
}

export interface EpisodeListResponse {
  episodes: Episode[];
  totalSeasons: number;
}

export interface SubtitleResponse {
  subtitle: Subtitle;
}

export interface WordDefinitionResponse {
  word: WordDefinition;
}

// ============================================
// NAVIGATION TYPES
// ============================================

export type RootStackParamList = {
  MainTabs: undefined;
  SeriesDetail: { seriesId: string };
  SubtitlePlayer: { episodeId: string; seriesId: string };
  WordDetail: { word: string };
  LearningMode: { mode: LearningMode };
};

export type MainTabParamList = {
  Explore: undefined;
  WordList: undefined;
  Learning: undefined;
  Analytics: undefined;
  Profile: undefined;
};

// ============================================
// CONTEXT STATE TYPES
// ============================================

export interface AppState {
  // Series
  series: Series[];
  selectedSeries: Series | null;
  episodes: Episode[];

  // Subtitle
  currentSubtitle: Subtitle | null;
  currentEpisode: Episode | null;

  // User Words
  userWords: UserWord[];
  wordStats: UserWordStats;

  // Learning
  learningSession: LearningSession | null;

  // Progress
  userProgress: UserProgress;

  // UI State
  isLoading: boolean;
  error: string | null;
}

export interface AppActions {
  // Series
  fetchSeries: () => Promise<void>;
  selectSeries: (seriesId: string) => Promise<void>;
  fetchEpisodes: (seriesId: string) => Promise<void>;

  // Subtitle
  loadSubtitle: (episodeId: string) => Promise<void>;

  // User Words
  addUserWord: (word: UserWord) => Promise<void>;
  updateWordStatus: (wordId: string, status: WordKnowledgeStatus) => Promise<void>;
  toggleFavorite: (wordId: string) => Promise<void>;
  deleteUserWord: (wordId: string) => Promise<void>;

  // Learning
  startLearningSession: (mode: LearningMode, words: UserWord[]) => void;
  endLearningSession: () => Promise<void>;
  reviewWord: (wordId: string, correct: boolean) => void;

  // Progress
  updateDailyProgress: (progress: Partial<DailyProgress>) => Promise<void>;

  // Utility
  clearError: () => void;
}
