/**
 * API Service
 * Handles all API calls (mock implementation for now)
 */

import {
  Series,
  Episode,
  Subtitle,
  WordDefinition,
  SeriesListResponse,
  EpisodeListResponse,
  SubtitleResponse,
  WordDefinitionResponse,
  UserWord,
  UserProgress,
  DailyProgress,
} from '../types';

// Import mock data
import mockSeriesData from '../data/mockSeriesData.json';
import mockEpisodesData from '../data/mockEpisodesData.json';
import mockSubtitleData from '../data/mockSubtitleData.json';
import mockWordDefinitionData from '../data/mockWordDefinitionData.json';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch all series
 */
export const fetchSeries = async (): Promise<SeriesListResponse> => {
  await delay(500);
  return mockSeriesData.data as SeriesListResponse;
};

/**
 * Fetch series by ID
 */
export const fetchSeriesById = async (seriesId: string): Promise<Series | null> => {
  await delay(300);
  const seriesData = mockSeriesData.data as SeriesListResponse;
  return seriesData.series.find(s => s.id === seriesId) || null;
};

/**
 * Search series by query
 */
export const searchSeries = async (query: string): Promise<Series[]> => {
  await delay(400);
  const seriesData = mockSeriesData.data as SeriesListResponse;

  return seriesData.series.filter(series =>
    series.title.toLowerCase().includes(query.toLowerCase()) ||
    series.description.toLowerCase().includes(query.toLowerCase()) ||
    series.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );
};

/**
 * Fetch episodes for a series
 */
export const fetchEpisodes = async (seriesId: string): Promise<Episode[]> => {
  await delay(400);
  const episodesData = mockEpisodesData.data as EpisodeListResponse;

  return episodesData.episodes.filter(ep => ep.seriesId === seriesId);
};

/**
 * Fetch episode by ID
 */
export const fetchEpisodeById = async (episodeId: string): Promise<Episode | null> => {
  await delay(300);
  const episodesData = mockEpisodesData.data as EpisodeListResponse;

  return episodesData.episodes.find(ep => ep.id === episodeId) || null;
};

/**
 * Fetch subtitle for an episode
 */
export const fetchSubtitle = async (episodeId: string): Promise<Subtitle> => {
  await delay(600);

  // In a real app, this would fetch from the subtitle URL
  // For now, return mock data
  const subtitleData = mockSubtitleData.data as SubtitleResponse;

  return {
    ...subtitleData.subtitle,
    episodeId, // Override with the requested episode ID
  };
};

/**
 * Fetch word definition
 */
export const fetchWordDefinition = async (word: string): Promise<WordDefinition> => {
  await delay(500);

  // In a real app, this would call an actual dictionary API
  // For now, return mock data with the word
  const wordData = mockWordDefinitionData.data.word as WordDefinition;

  return {
    ...wordData,
    word, // Override with the requested word
  };
};

/**
 * Save user word
 */
export const saveUserWord = async (userWord: UserWord): Promise<UserWord> => {
  await delay(300);

  // In a real app, this would POST to the API
  // For now, just return the word
  return userWord;
};

/**
 * Update user word status
 */
export const updateUserWordStatus = async (
  wordId: string,
  status: string
): Promise<void> => {
  await delay(200);

  // In a real app, this would PATCH to the API
  console.log(`Updated word ${wordId} to status ${status}`);
};

/**
 * Delete user word
 */
export const deleteUserWord = async (wordId: string): Promise<void> => {
  await delay(200);

  // In a real app, this would DELETE to the API
  console.log(`Deleted word ${wordId}`);
};

/**
 * Fetch user words
 */
export const fetchUserWords = async (userId: string): Promise<UserWord[]> => {
  await delay(400);

  // In a real app, this would fetch from the API
  // For now, return empty array
  return [];
};

/**
 * Fetch user progress
 */
export const fetchUserProgress = async (userId: string): Promise<UserProgress> => {
  await delay(500);

  // Mock progress data
  return {
    userId,
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
  };
};

/**
 * Update daily progress
 */
export const updateDailyProgress = async (
  userId: string,
  progress: Partial<DailyProgress>
): Promise<DailyProgress> => {
  await delay(300);

  // In a real app, this would POST/PATCH to the API
  const today = new Date().toISOString().split('T')[0];

  return {
    date: today,
    wordsLearned: progress.wordsLearned || 0,
    sessionsCompleted: progress.sessionsCompleted || 0,
    timeSpent: progress.timeSpent || 0,
    episodesWatched: progress.episodesWatched || [],
  };
};

/**
 * Filter series by category
 */
export const filterSeriesByCategory = async (
  category: string
): Promise<Series[]> => {
  await delay(300);
  const seriesData = mockSeriesData.data as SeriesListResponse;

  return seriesData.series.filter(s => s.category === category);
};

/**
 * Filter series by level
 */
export const filterSeriesByLevel = async (level: string): Promise<Series[]> => {
  await delay(300);
  const seriesData = mockSeriesData.data as SeriesListResponse;

  return seriesData.series.filter(s => s.level === level);
};

/**
 * Get popular series
 */
export const getPopularSeries = async (): Promise<Series[]> => {
  await delay(300);
  const seriesData = mockSeriesData.data as SeriesListResponse;

  return seriesData.series.filter(s => s.isPopular);
};

/**
 * Get new series
 */
export const getNewSeries = async (): Promise<Series[]> => {
  await delay(300);
  const seriesData = mockSeriesData.data as SeriesListResponse;

  return seriesData.series.filter(s => s.isNew);
};
