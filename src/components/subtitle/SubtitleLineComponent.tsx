/**
 * Subtitle Line Component
 * Displays a subtitle line with clickable words
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SubtitleLine } from '../../types';

interface SubtitleLineComponentProps {
  line: SubtitleLine;
  onWordPress: (word: string, context: string) => void;
  onLinePress: (line: SubtitleLine) => void;
  isActive?: boolean;
  userKnownWords?: Set<string>;
}

const SubtitleLineComponent: React.FC<SubtitleLineComponentProps> = ({
  line,
  onWordPress,
  onLinePress,
  isActive = false,
  userKnownWords = new Set(),
}) => {
  const renderWord = (word: any, index: number) => {
    if (word.isPunctuation) {
      return (
        <Text key={word.id} style={styles.punctuation}>
          {word.word}
        </Text>
      );
    }

    const isKnown = userKnownWords.has(word.normalizedWord);

    return (
      <TouchableOpacity
        key={word.id}
        onPress={() => onWordPress(word.normalizedWord, line.text)}
        style={styles.wordContainer}
      >
        <Text
          style={[
            styles.word,
            isActive && styles.activeWord,
            !isKnown && styles.unknownWord,
          ]}
        >
          {word.word}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, isActive && styles.activeContainer]}>
      <TouchableOpacity
        style={styles.playButton}
        onPress={() => onLinePress(line)}
      >
        <Ionicons
          name="play-circle"
          size={24}
          color={isActive ? '#6366f1' : '#9ca3af'}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>
            {formatTime(line.startTime)} - {formatTime(line.endTime)}
          </Text>
        </View>

        <View style={styles.textContainer}>
          {line.words.map((word, index) => renderWord(word, index))}
        </View>

        {line.translation && (
          <Text style={styles.translation}>{line.translation}</Text>
        )}
      </View>
    </View>
  );
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  activeContainer: {
    backgroundColor: '#eff6ff',
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  playButton: {
    marginRight: 12,
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  content: {
    flex: 1,
  },
  timeContainer: {
    marginBottom: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  textContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  wordContainer: {
    marginRight: 4,
    marginBottom: 4,
  },
  word: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 24,
  },
  activeWord: {
    color: '#6366f1',
    fontWeight: '600',
  },
  unknownWord: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 2,
    borderRadius: 2,
  },
  punctuation: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 24,
  },
  translation: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 4,
  },
});

export default SubtitleLineComponent;
