/**
 * Word Card Component
 * Displays a word with definition, pronunciation, and actions
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserWord, WordKnowledgeStatus } from '../../types';

interface WordCardProps {
  word: UserWord;
  onSpeak?: () => void;
  onMarkKnown?: () => void;
  onMarkUnknown?: () => void;
  onToggleFavorite?: () => void;
  onPress?: () => void;
  showActions?: boolean;
}

const WordCard: React.FC<WordCardProps> = ({
  word,
  onSpeak,
  onMarkKnown,
  onMarkUnknown,
  onToggleFavorite,
  onPress,
  showActions = true,
}) => {
  const getStatusColor = (status: WordKnowledgeStatus) => {
    switch (status) {
      case 'known':
        return '#10b981';
      case 'learning':
        return '#f59e0b';
      case 'unknown':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: WordKnowledgeStatus) => {
    switch (status) {
      case 'known':
        return 'checkmark-circle';
      case 'learning':
        return 'school';
      case 'unknown':
        return 'help-circle';
      default:
        return 'ellipse';
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        <View style={styles.wordInfo}>
          <Text style={styles.word}>{word.word}</Text>
          <View
            style={[styles.statusBadge, { backgroundColor: getStatusColor(word.status) }]}
          >
            <Ionicons
              name={getStatusIcon(word.status)}
              size={12}
              color="#ffffff"
            />
            <Text style={styles.statusText}>
              {word.status.charAt(0).toUpperCase() + word.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          {onToggleFavorite && (
            <TouchableOpacity onPress={onToggleFavorite} style={styles.actionButton}>
              <Ionicons
                name={word.isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={word.isFavorite ? '#ef4444' : '#9ca3af'}
              />
            </TouchableOpacity>
          )}

          {onSpeak && (
            <TouchableOpacity onPress={onSpeak} style={styles.actionButton}>
              <Ionicons name="volume-high" size={24} color="#6366f1" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.context}>
        <Text style={styles.contextLabel}>Context:</Text>
        <Text style={styles.contextText} numberOfLines={2}>
          "{word.source.context}"
        </Text>
      </View>

      <View style={styles.metadata}>
        <View style={styles.metadataItem}>
          <Ionicons name="calendar-outline" size={14} color="#6b7280" />
          <Text style={styles.metadataText}>
            {new Date(word.addedAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.metadataItem}>
          <Ionicons name="repeat-outline" size={14} color="#6b7280" />
          <Text style={styles.metadataText}>{word.reviewCount} reviews</Text>
        </View>
      </View>

      {showActions && (
        <View style={styles.actionBar}>
          {onMarkKnown && word.status !== 'known' && (
            <TouchableOpacity
              style={[styles.button, styles.knownButton]}
              onPress={onMarkKnown}
            >
              <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
              <Text style={styles.buttonText}>I Know This</Text>
            </TouchableOpacity>
          )}

          {onMarkUnknown && word.status !== 'unknown' && (
            <TouchableOpacity
              style={[styles.button, styles.unknownButton]}
              onPress={onMarkUnknown}
            >
              <Ionicons name="close-circle" size={18} color="#ffffff" />
              <Text style={styles.buttonText}>I Don't Know</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  wordInfo: {
    flex: 1,
  },
  word: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 12,
  },
  context: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  contextLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  contextText: {
    fontSize: 14,
    color: '#374151',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  metadata: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metadataText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  knownButton: {
    backgroundColor: '#10b981',
  },
  unknownButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default WordCard;
