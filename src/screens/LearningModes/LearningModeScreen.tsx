/**
 * Learning Mode Screen
 * Flashcard-based learning session
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../../types';
import { useApp } from '../../contexts/AppContext';
import { speakWord } from '../../utils/textToSpeech';

type RouteProps = RouteProp<RootStackParamList, 'LearningMode'>;

const LearningModeScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();
  const { mode } = route.params;

  const { userWords, learningSession, startLearningSession, endLearningSession, reviewWord } =
    useApp();

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    // Start learning session with user's words
    const wordsToReview = userWords.filter(w => w.status !== 'known').slice(0, 10);
    startLearningSession(mode, wordsToReview);

    return () => {
      // Clean up when leaving
      if (learningSession) {
        endLearningSession();
      }
    };
  }, []);

  if (!learningSession || learningSession.cards.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="school-outline" size={64} color="#d1d5db" />
        <Text style={styles.emptyText}>No words to review</Text>
        <Text style={styles.emptySubtext}>
          Add words from series subtitles to start learning
        </Text>
      </View>
    );
  }

  const currentCard = learningSession.cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / learningSession.cards.length) * 100;

  const handleNext = (correct: boolean) => {
    reviewWord(currentCard.id, correct);

    if (currentCardIndex < learningSession.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      // Session completed
      endLearningSession();
      navigation.goBack();
    }
  };

  const handleSpeak = () => {
    speakWord(currentCard.word);
  };

  const handleFlip = () => {
    setShowAnswer(!showAnswer);
  };

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {currentCardIndex + 1} / {learningSession.cards.length}
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{learningSession.correctAnswers}</Text>
          <Text style={styles.statLabel}>Correct</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{learningSession.wrongAnswers}</Text>
          <Text style={styles.statLabel}>Wrong</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{learningSession.wordsReviewed}</Text>
          <Text style={styles.statLabel}>Reviewed</Text>
        </View>
      </View>

      {/* Flashcard */}
      <TouchableOpacity style={styles.card} onPress={handleFlip} activeOpacity={0.9}>
        <View style={styles.cardContent}>
          {!showAnswer ? (
            <>
              <Text style={styles.cardWord}>{currentCard.word}</Text>
              <TouchableOpacity style={styles.speakButton} onPress={handleSpeak}>
                <Ionicons name="volume-high" size={32} color="#6366f1" />
              </TouchableOpacity>
              <Text style={styles.cardHint}>Tap to see answer</Text>
            </>
          ) : (
            <>
              <Text style={styles.cardDefinition}>{currentCard.definition}</Text>
              <Text style={styles.cardExample}>"{currentCard.example}"</Text>
              <Text style={styles.cardTranslation}>{currentCard.translation}</Text>
            </>
          )}
        </View>
      </TouchableOpacity>

      {/* Action Buttons */}
      {showAnswer && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.wrongButton]}
            onPress={() => handleNext(false)}
          >
            <Ionicons name="close-circle" size={32} color="#ffffff" />
            <Text style={styles.actionButtonText}>Don't Know</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.correctButton]}
            onPress={() => handleNext(true)}
          >
            <Ionicons name="checkmark-circle" size={32} color="#ffffff" />
            <Text style={styles.actionButtonText}>Know It</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  statBox: {
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 24,
  },
  cardContent: {
    alignItems: 'center',
  },
  cardWord: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
  },
  speakButton: {
    marginBottom: 16,
  },
  cardHint: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  cardDefinition: {
    fontSize: 20,
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 28,
  },
  cardExample: {
    fontSize: 16,
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 16,
    textAlign: 'center',
  },
  cardTranslation: {
    fontSize: 16,
    color: '#10b981',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 8,
  },
  wrongButton: {
    backgroundColor: '#ef4444',
  },
  correctButton: {
    backgroundColor: '#10b981',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

export default LearningModeScreen;
