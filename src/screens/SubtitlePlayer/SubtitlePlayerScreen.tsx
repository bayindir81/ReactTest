/**
 * Subtitle Player Screen
 * Learn English by reading and interacting with subtitles
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useApp } from '../../contexts/AppContext';
import { RootStackParamList, SubtitleLine, WordDefinition, UserWord } from '../../types';
import SubtitleLineComponent from '../../components/subtitle/SubtitleLineComponent';
import { speakWord, speakSentence } from '../../utils/textToSpeech';
import * as API from '../../services/api';

type RouteProps = RouteProp<RootStackParamList, 'SubtitlePlayer'>;

const SubtitlePlayerScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const { episodeId, seriesId } = route.params;

  const { currentSubtitle, currentEpisode, loadSubtitle, addUserWord, userWords } =
    useApp();

  const [activeLine, setActiveLine] = useState<SubtitleLine | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordContext, setWordContext] = useState<string>('');
  const [wordDefinition, setWordDefinition] = useState<WordDefinition | null>(null);
  const [showWordModal, setShowWordModal] = useState(false);
  const [isLoadingWord, setIsLoadingWord] = useState(false);

  useEffect(() => {
    loadSubtitle(episodeId);
  }, [episodeId]);

  const handleWordPress = async (word: string, context: string) => {
    setSelectedWord(word);
    setWordContext(context);
    setShowWordModal(true);
    setIsLoadingWord(true);

    try {
      const definition = await API.fetchWordDefinition(word);
      setWordDefinition(definition);

      // Speak the word
      await speakWord(word);
    } catch (error) {
      console.error('Error fetching word definition:', error);
    } finally {
      setIsLoadingWord(false);
    }
  };

  const handleLinePress = async (line: SubtitleLine) => {
    setActiveLine(line);

    // Speak the sentence
    await speakSentence(line.text);
  };

  const handleMarkKnown = () => {
    if (!selectedWord || !currentEpisode) return;

    const userWord: UserWord = {
      id: `word_${Date.now()}`,
      userId: 'user_1',
      word: selectedWord,
      normalizedWord: selectedWord.toLowerCase(),
      status: 'known',
      addedAt: new Date().toISOString(),
      reviewCount: 0,
      source: {
        seriesId,
        episodeId,
        subtitleLineId: activeLine?.id || '',
        context: wordContext,
      },
      isFavorite: false,
    };

    addUserWord(userWord);
    setShowWordModal(false);
  };

  const handleMarkUnknown = () => {
    if (!selectedWord || !currentEpisode) return;

    const userWord: UserWord = {
      id: `word_${Date.now()}`,
      userId: 'user_1',
      word: selectedWord,
      normalizedWord: selectedWord.toLowerCase(),
      status: 'unknown',
      addedAt: new Date().toISOString(),
      reviewCount: 0,
      source: {
        seriesId,
        episodeId,
        subtitleLineId: activeLine?.id || '',
        context: wordContext,
      },
      isFavorite: false,
    };

    addUserWord(userWord);
    setShowWordModal(false);
  };

  if (!currentSubtitle || !currentEpisode) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading subtitles...</Text>
      </View>
    );
  }

  // Create a set of known words for highlighting
  const knownWords = new Set(
    userWords.filter(w => w.status === 'known').map(w => w.normalizedWord)
  );

  return (
    <View style={styles.container}>
      {/* Episode Info */}
      <View style={styles.episodeInfo}>
        <Text style={styles.episodeTitle}>{currentEpisode.title}</Text>
        <Text style={styles.episodeSubtitle}>
          Season {currentEpisode.seasonNumber}, Episode {currentEpisode.episodeNumber}
        </Text>
      </View>

      {/* Subtitle Stats */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{currentSubtitle.totalWords}</Text>
          <Text style={styles.statLabel}>Total Words</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{currentSubtitle.uniqueWords}</Text>
          <Text style={styles.statLabel}>Unique Words</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {Math.round(currentSubtitle.averageWordsPerLine)}
          </Text>
          <Text style={styles.statLabel}>Avg/Line</Text>
        </View>
      </View>

      {/* Subtitle Lines */}
      <ScrollView style={styles.subtitleContainer}>
        {currentSubtitle.lines.map(line => (
          <SubtitleLineComponent
            key={line.id}
            line={line}
            onWordPress={handleWordPress}
            onLinePress={handleLinePress}
            isActive={activeLine?.id === line.id}
            userKnownWords={knownWords}
          />
        ))}
      </ScrollView>

      {/* Word Definition Modal */}
      <Modal
        visible={showWordModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowWordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedWord ? selectedWord.charAt(0).toUpperCase() + selectedWord.slice(1) : ''}
              </Text>
              <TouchableOpacity onPress={() => setShowWordModal(false)}>
                <Ionicons name="close" size={28} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {isLoadingWord ? (
              <ActivityIndicator size="large" color="#6366f1" />
            ) : wordDefinition ? (
              <ScrollView style={styles.definitionContainer}>
                {/* Phonetic */}
                <View style={styles.phoneticContainer}>
                  <Text style={styles.phonetic}>{wordDefinition.phonetic}</Text>
                  <TouchableOpacity
                    style={styles.speakButton}
                    onPress={() => selectedWord && speakWord(selectedWord)}
                  >
                    <Ionicons name="volume-high" size={24} color="#6366f1" />
                  </TouchableOpacity>
                </View>

                {/* Context */}
                <View style={styles.contextSection}>
                  <Text style={styles.sectionTitle}>Used in context:</Text>
                  <Text style={styles.contextText}>"{wordContext}"</Text>
                </View>

                {/* Meanings */}
                {wordDefinition.meanings.map((meaning, index) => (
                  <View key={index} style={styles.meaningSection}>
                    <Text style={styles.partOfSpeech}>{meaning.partOfSpeech}</Text>

                    {meaning.definitions.map((def, defIndex) => (
                      <View key={defIndex} style={styles.definition}>
                        <Text style={styles.definitionText}>{def.definition}</Text>
                        {def.example && (
                          <Text style={styles.exampleText}>"{def.example}"</Text>
                        )}
                        {def.translation && (
                          <Text style={styles.translationText}>
                            🇹🇷 {def.translation}
                          </Text>
                        )}
                      </View>
                    ))}

                    {meaning.synonyms.length > 0 && (
                      <View style={styles.synonymsContainer}>
                        <Text style={styles.synonymsLabel}>Synonyms: </Text>
                        <Text style={styles.synonymsText}>
                          {meaning.synonyms.join(', ')}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}

                {/* CEFR Level */}
                <View style={styles.levelContainer}>
                  <Text style={styles.levelLabel}>CEFR Level:</Text>
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>{wordDefinition.level}</Text>
                  </View>
                </View>
              </ScrollView>
            ) : (
              <Text style={styles.errorText}>Could not load word definition</Text>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.knownButton]}
                onPress={handleMarkKnown}
              >
                <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                <Text style={styles.actionButtonText}>I Know This</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.unknownButton]}
                onPress={handleMarkUnknown}
              >
                <Ionicons name="close-circle" size={20} color="#ffffff" />
                <Text style={styles.actionButtonText}>I Don't Know</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  episodeInfo: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  episodeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  episodeSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
  subtitleContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  definitionContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  phoneticContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  phonetic: {
    fontSize: 18,
    color: '#6366f1',
    fontStyle: 'italic',
    flex: 1,
  },
  speakButton: {
    padding: 8,
  },
  contextSection: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 6,
  },
  contextText: {
    fontSize: 15,
    color: '#374151',
    fontStyle: 'italic',
  },
  meaningSection: {
    marginBottom: 20,
  },
  partOfSpeech: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  definition: {
    marginBottom: 12,
    paddingLeft: 12,
  },
  definitionText: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 6,
    lineHeight: 22,
  },
  exampleText: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  translationText: {
    fontSize: 14,
    color: '#10b981',
  },
  synonymsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  synonymsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  synonymsText: {
    fontSize: 13,
    color: '#6b7280',
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  levelLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginRight: 8,
  },
  levelBadge: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  levelText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    padding: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  knownButton: {
    backgroundColor: '#10b981',
  },
  unknownButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default SubtitlePlayerScreen;
