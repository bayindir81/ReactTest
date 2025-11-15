/**
 * Learning Screen
 * Choose between different learning modes
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList, LearningMode } from '../../types';
import { useApp } from '../../contexts/AppContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface LearningModeCard {
  mode: LearningMode;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const LEARNING_MODES: LearningModeCard[] = [
  {
    mode: 'word',
    title: 'Word Mode',
    description: 'Learn individual words with flashcards and definitions',
    icon: 'book',
    color: '#6366f1',
  },
  {
    mode: 'sentence',
    title: 'Sentence Mode',
    description: 'Practice with full sentences from your favorite series',
    icon: 'chatbox-ellipses',
    color: '#10b981',
  },
  {
    mode: 'subtitle',
    title: 'Subtitle Mode',
    description: 'Read complete episode subtitles and learn in context',
    icon: 'film',
    color: '#f59e0b',
  },
];

const LearningScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { userWords, wordStats } = useApp();

  const handleModePress = (mode: LearningMode) => {
    navigation.navigate('LearningMode', { mode });
  };

  const renderModeCard = (modeCard: LearningModeCard) => (
    <TouchableOpacity
      key={modeCard.mode}
      style={styles.modeCard}
      onPress={() => handleModePress(modeCard.mode)}
    >
      <View style={[styles.iconContainer, { backgroundColor: modeCard.color }]}>
        <Ionicons name={modeCard.icon} size={32} color="#ffffff" />
      </View>

      <View style={styles.modeContent}>
        <Text style={styles.modeTitle}>{modeCard.title}</Text>
        <Text style={styles.modeDescription}>{modeCard.description}</Text>
      </View>

      <Ionicons name="chevron-forward" size={24} color="#d1d5db" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Learning Modes</Text>
        <Text style={styles.headerSubtitle}>
          Choose how you want to learn today
        </Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsCard}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="trophy" size={24} color="#fbbf24" />
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{wordStats.wordsLearnedToday}</Text>
              <Text style={styles.statLabel}>Words Today</Text>
            </View>
          </View>

          <View style={styles.statItem}>
            <Ionicons name="flame" size={24} color="#ef4444" />
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{wordStats.currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle" size={24} color="#10b981" />
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{wordStats.knownWords}</Text>
              <Text style={styles.statLabel}>Known Words</Text>
            </View>
          </View>

          <View style={styles.statItem}>
            <Ionicons name="school" size={24} color="#6366f1" />
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{wordStats.learningWords}</Text>
              <Text style={styles.statLabel}>Learning</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Learning Modes */}
      <View style={styles.modesSection}>
        <Text style={styles.sectionTitle}>Select a Learning Mode</Text>
        {LEARNING_MODES.map(renderModeCard)}
      </View>

      {/* Daily Goal */}
      <View style={styles.goalCard}>
        <Ionicons name="target" size={32} color="#6366f1" />
        <View style={styles.goalContent}>
          <Text style={styles.goalTitle}>Daily Goal</Text>
          <Text style={styles.goalText}>
            {wordStats.wordsLearnedToday} / 10 words
          </Text>
        </View>
        <View style={styles.goalProgress}>
          <View
            style={[
              styles.goalProgressBar,
              { width: `${(wordStats.wordsLearnedToday / 10) * 100}%` },
            ]}
          />
        </View>
      </View>
    </ScrollView>
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
  statsCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statContent: {
    marginLeft: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  modesSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modeContent: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  goalCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  goalContent: {
    flex: 1,
    marginLeft: 16,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  goalText: {
    fontSize: 14,
    color: '#6b7280',
  },
  goalProgress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#e5e7eb',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  goalProgressBar: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderBottomLeftRadius: 12,
  },
});

export default LearningScreen;
