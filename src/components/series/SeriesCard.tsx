/**
 * Series Card Component
 * Displays a series card with image, title, and metadata
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Series } from '../../types';

interface SeriesCardProps {
  series: Series;
  onPress: () => void;
}

const SeriesCard: React.FC<SeriesCardProps> = ({ series, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{ uri: series.coverImage }}
        style={styles.coverImage}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {series.title}
          </Text>
          {series.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {series.description}
        </Text>

        <View style={styles.metadata}>
          <View style={styles.metadataItem}>
            <Ionicons name="star" size={14} color="#fbbf24" />
            <Text style={styles.metadataText}>{series.rating}</Text>
          </View>

          <View style={styles.metadataItem}>
            <Ionicons name="videocam" size={14} color="#6366f1" />
            <Text style={styles.metadataText}>{series.totalEpisodes} episodes</Text>
          </View>

          <View style={[styles.levelBadge, getLevelBadgeStyle(series.level)]}>
            <Text style={styles.levelBadgeText}>{series.level}</Text>
          </View>
        </View>

        <View style={styles.tags}>
          {series.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const getLevelBadgeStyle = (level: string) => {
  switch (level) {
    case 'A1':
    case 'A2':
      return { backgroundColor: '#10b981' };
    case 'B1':
    case 'B2':
      return { backgroundColor: '#f59e0b' };
    case 'C1':
    case 'C2':
      return { backgroundColor: '#ef4444' };
    default:
      return { backgroundColor: '#6b7280' };
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  coverImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#e5e7eb',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  newBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  newBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
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
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 'auto',
  },
  levelBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    color: '#4b5563',
  },
});

export default SeriesCard;
