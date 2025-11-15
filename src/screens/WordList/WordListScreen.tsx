/**
 * Word List Screen
 * Display and manage user's saved words
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useApp } from '../../contexts/AppContext';
import { UserWord, WordKnowledgeStatus } from '../../types';
import WordCard from '../../components/word/WordCard';
import { speakWord } from '../../utils/textToSpeech';

const WordListScreen: React.FC = () => {
  const { userWords, wordStats, updateWordStatus, toggleFavorite, deleteUserWord } =
    useApp();

  const [filter, setFilter] = useState<WordKnowledgeStatus | 'favorite' | 'all'>('all');

  const getFilteredWords = (): UserWord[] => {
    if (filter === 'all') {
      return userWords;
    } else if (filter === 'favorite') {
      return userWords.filter(w => w.isFavorite);
    } else {
      return userWords.filter(w => w.status === filter);
    }
  };

  const handleSpeak = (word: string) => {
    speakWord(word);
  };

  const handleMarkKnown = (wordId: string) => {
    updateWordStatus(wordId, 'known');
  };

  const handleMarkUnknown = (wordId: string) => {
    updateWordStatus(wordId, 'unknown');
  };

  const handleToggleFavorite = (wordId: string) => {
    toggleFavorite(wordId);
  };

  const renderWordItem = ({ item }: { item: UserWord }) => (
    <WordCard
      word={item}
      onSpeak={() => handleSpeak(item.word)}
      onMarkKnown={() => handleMarkKnown(item.id)}
      onMarkUnknown={() => handleMarkUnknown(item.id)}
      onToggleFavorite={() => handleToggleFavorite(item.id)}
      showActions={true}
    />
  );

  const filteredWords = getFilteredWords();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Words</Text>
        <Text style={styles.headerSubtitle}>
          {wordStats.totalWords} words saved
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={24} color="#10b981" />
          <Text style={styles.statValue}>{wordStats.knownWords}</Text>
          <Text style={styles.statLabel}>Known</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="school" size={24} color="#f59e0b" />
          <Text style={styles.statValue}>{wordStats.learningWords}</Text>
          <Text style={styles.statLabel}>Learning</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="help-circle" size={24} color="#ef4444" />
          <Text style={styles.statValue}>{wordStats.unknownWords}</Text>
          <Text style={styles.statLabel}>Unknown</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="heart" size={24} color="#ec4899" />
          <Text style={styles.statValue}>{wordStats.favoriteWords}</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterChipText,
              filter === 'all' && styles.filterChipTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, filter === 'known' && styles.filterChipActive]}
          onPress={() => setFilter('known')}
        >
          <Text
            style={[
              styles.filterChipText,
              filter === 'known' && styles.filterChipTextActive,
            ]}
          >
            Known
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, filter === 'learning' && styles.filterChipActive]}
          onPress={() => setFilter('learning')}
        >
          <Text
            style={[
              styles.filterChipText,
              filter === 'learning' && styles.filterChipTextActive,
            ]}
          >
            Learning
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, filter === 'unknown' && styles.filterChipActive]}
          onPress={() => setFilter('unknown')}
        >
          <Text
            style={[
              styles.filterChipText,
              filter === 'unknown' && styles.filterChipTextActive,
            ]}
          >
            Unknown
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, filter === 'favorite' && styles.filterChipActive]}
          onPress={() => setFilter('favorite')}
        >
          <Text
            style={[
              styles.filterChipText,
              filter === 'favorite' && styles.filterChipTextActive,
            ]}
          >
            Favorites
          </Text>
        </TouchableOpacity>
      </View>

      {/* Word List */}
      <FlatList
        data={filteredWords}
        renderItem={renderWordItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>No words yet</Text>
            <Text style={styles.emptySubtext}>
              Start learning by watching series with subtitles
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#6366f1',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0e7ff',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterChipActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  filterChipText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default WordListScreen;
