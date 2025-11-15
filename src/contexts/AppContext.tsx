/**
 * App Context
 * Global state management using React Context API
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Series,
  Episode,
  Subtitle,
  UserWord,
  UserWordStats,
  LearningSession,
  UserProgress,
  WordKnowledgeStatus,
  LearningMode,
  DailyProgress,
  AppState,
  AppActions,
} from '../types';
import * as API from '../services/api';

// Storage keys
const STORAGE_KEYS = {
  USER_WORDS: '@englishlearntv:userWords',
  USER_PROGRESS: '@englishlearntv:userProgress',
  USER_ID: '@englishlearntv:userId',
};

// Context type combining state and actions
type AppContextType = AppState & AppActions;

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider props
interface AppProviderProps {
  children: ReactNode;
}

/**
 * App Provider Component
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // ============================================
  // STATE
  // ============================================

  const [series, setSeries] = useState<Series[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [userWords, setUserWords] = useState<UserWord[]>([]);
  const [wordStats, setWordStats] = useState<UserWordStats>({
    totalWords: 0,
    knownWords: 0,
    unknownWords: 0,
    learningWords: 0,
    favoriteWords: 0,
    wordsLearnedToday: 0,
    wordsLearnedThisWeek: 0,
    wordsLearnedThisMonth: 0,
    currentStreak: 0,
  });
  const [learningSession, setLearningSession] = useState<LearningSession | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    userId: 'user_1',
    totalWordsLearned: 0,
    totalTimeSpent: 0,
    totalEpisodesCompleted: 0,
    currentLevel: 'A1',
    joinedAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    dailyGoal: 10,
    dailyStreak: 0,
    longestStreak: 0,
    weeklyProgress: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // EFFECTS - Load data on mount
  // ============================================

  useEffect(() => {
    loadInitialData();
  }, []);

  // Update word stats whenever userWords changes
  useEffect(() => {
    calculateWordStats();
  }, [userWords]);

  // ============================================
  // INITIALIZATION
  // ============================================

  const loadInitialData = async () => {
    try {
      setIsLoading(true);

      // Load user words from storage
      const storedWords = await AsyncStorage.getItem(STORAGE_KEYS.USER_WORDS);
      if (storedWords) {
        setUserWords(JSON.parse(storedWords));
      }

      // Load user progress from storage
      const storedProgress = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
      if (storedProgress) {
        setUserProgress(JSON.parse(storedProgress));
      }

      // Fetch series
      await fetchSeries();
    } catch (err) {
      setError('Failed to load initial data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // SERIES ACTIONS
  // ============================================

  const fetchSeries = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await API.fetchSeries();
      setSeries(data.series);
    } catch (err) {
      setError('Failed to fetch series');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectSeries = async (seriesId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const seriesData = await API.fetchSeriesById(seriesId);
      setSelectedSeries(seriesData);

      // Also fetch episodes for this series
      await fetchEpisodes(seriesId);
    } catch (err) {
      setError('Failed to select series');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEpisodes = async (seriesId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const episodesData = await API.fetchEpisodes(seriesId);
      setEpisodes(episodesData);
    } catch (err) {
      setError('Failed to fetch episodes');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // SUBTITLE ACTIONS
  // ============================================

  const loadSubtitle = async (episodeId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch episode info
      const episode = await API.fetchEpisodeById(episodeId);
      setCurrentEpisode(episode);

      // Fetch subtitle
      const subtitle = await API.fetchSubtitle(episodeId);
      setCurrentSubtitle(subtitle);
    } catch (err) {
      setError('Failed to load subtitle');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // USER WORDS ACTIONS
  // ============================================

  const addUserWord = async (word: UserWord) => {
    try {
      // Check if word already exists
      const existingWord = userWords.find(
        w => w.normalizedWord === word.normalizedWord
      );

      if (existingWord) {
        // Update existing word
        await updateWordStatus(existingWord.id, word.status);
        return;
      }

      // Add new word
      const newWords = [...userWords, word];
      setUserWords(newWords);

      // Save to storage
      await AsyncStorage.setItem(STORAGE_KEYS.USER_WORDS, JSON.stringify(newWords));

      // Save to API
      await API.saveUserWord(word);
    } catch (err) {
      setError('Failed to add word');
      console.error(err);
    }
  };

  const updateWordStatus = async (wordId: string, status: WordKnowledgeStatus) => {
    try {
      const updatedWords = userWords.map(word =>
        word.id === wordId
          ? { ...word, status, lastReviewedAt: new Date().toISOString() }
          : word
      );

      setUserWords(updatedWords);

      // Save to storage
      await AsyncStorage.setItem(STORAGE_KEYS.USER_WORDS, JSON.stringify(updatedWords));

      // Update API
      await API.updateUserWordStatus(wordId, status);
    } catch (err) {
      setError('Failed to update word status');
      console.error(err);
    }
  };

  const toggleFavorite = async (wordId: string) => {
    try {
      const updatedWords = userWords.map(word =>
        word.id === wordId ? { ...word, isFavorite: !word.isFavorite } : word
      );

      setUserWords(updatedWords);

      // Save to storage
      await AsyncStorage.setItem(STORAGE_KEYS.USER_WORDS, JSON.stringify(updatedWords));
    } catch (err) {
      setError('Failed to toggle favorite');
      console.error(err);
    }
  };

  const deleteUserWord = async (wordId: string) => {
    try {
      const updatedWords = userWords.filter(word => word.id !== wordId);
      setUserWords(updatedWords);

      // Save to storage
      await AsyncStorage.setItem(STORAGE_KEYS.USER_WORDS, JSON.stringify(updatedWords));

      // Delete from API
      await API.deleteUserWord(wordId);
    } catch (err) {
      setError('Failed to delete word');
      console.error(err);
    }
  };

  // ============================================
  // LEARNING SESSION ACTIONS
  // ============================================

  const startLearningSession = (mode: LearningMode, words: UserWord[]) => {
    const flashCards = words.map(word => ({
      id: word.id,
      word: word.word,
      definition: '', // Would be fetched from API
      example: word.source.context,
      translation: '',
      phonetic: '',
    }));

    const session: LearningSession = {
      id: `session_${Date.now()}`,
      userId: userProgress.userId,
      mode,
      startedAt: new Date().toISOString(),
      wordsReviewed: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      duration: 0,
      cards: flashCards,
    };

    setLearningSession(session);
  };

  const endLearningSession = async () => {
    if (!learningSession) return;

    try {
      const endTime = new Date();
      const startTime = new Date(learningSession.startedAt);
      const durationSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

      const updatedSession = {
        ...learningSession,
        endedAt: endTime.toISOString(),
        duration: durationSeconds,
      };

      // Update progress
      await updateDailyProgress({
        wordsLearned: learningSession.wordsReviewed,
        sessionsCompleted: 1,
        timeSpent: Math.floor(durationSeconds / 60), // Convert to minutes
      });

      // Clear session
      setLearningSession(null);
    } catch (err) {
      setError('Failed to end learning session');
      console.error(err);
    }
  };

  const reviewWord = (wordId: string, correct: boolean) => {
    if (!learningSession) return;

    setLearningSession({
      ...learningSession,
      wordsReviewed: learningSession.wordsReviewed + 1,
      correctAnswers: correct
        ? learningSession.correctAnswers + 1
        : learningSession.correctAnswers,
      wrongAnswers: !correct
        ? learningSession.wrongAnswers + 1
        : learningSession.wrongAnswers,
    });
  };

  // ============================================
  // PROGRESS ACTIONS
  // ============================================

  const updateDailyProgress = async (progress: Partial<DailyProgress>) => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Update progress
      const updatedProgress = await API.updateDailyProgress(
        userProgress.userId,
        progress
      );

      // Update user progress state
      setUserProgress(prev => ({
        ...prev,
        totalWordsLearned: prev.totalWordsLearned + (progress.wordsLearned || 0),
        totalTimeSpent: prev.totalTimeSpent + (progress.timeSpent || 0),
        lastActiveAt: new Date().toISOString(),
      }));

      // Save to storage
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(userProgress));
    } catch (err) {
      setError('Failed to update progress');
      console.error(err);
    }
  };

  // ============================================
  // UTILITY
  // ============================================

  const calculateWordStats = () => {
    const stats: UserWordStats = {
      totalWords: userWords.length,
      knownWords: userWords.filter(w => w.status === 'known').length,
      unknownWords: userWords.filter(w => w.status === 'unknown').length,
      learningWords: userWords.filter(w => w.status === 'learning').length,
      favoriteWords: userWords.filter(w => w.isFavorite).length,
      wordsLearnedToday: 0,
      wordsLearnedThisWeek: 0,
      wordsLearnedThisMonth: 0,
      currentStreak: 0,
    };

    // Calculate today's words
    const today = new Date().toISOString().split('T')[0];
    stats.wordsLearnedToday = userWords.filter(
      w => w.addedAt.split('T')[0] === today
    ).length;

    setWordStats(stats);
  };

  const clearError = () => {
    setError(null);
  };

  // ============================================
  // CONTEXT VALUE
  // ============================================

  const value: AppContextType = {
    // State
    series,
    selectedSeries,
    episodes,
    currentSubtitle,
    currentEpisode,
    userWords,
    wordStats,
    learningSession,
    userProgress,
    isLoading,
    error,

    // Actions
    fetchSeries,
    selectSeries,
    fetchEpisodes,
    loadSubtitle,
    addUserWord,
    updateWordStatus,
    toggleFavorite,
    deleteUserWord,
    startLearningSession,
    endLearningSession,
    reviewWord,
    updateDailyProgress,
    clearError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * Custom hook to use the App Context
 */
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }

  return context;
};
