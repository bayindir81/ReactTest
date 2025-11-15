/**
 * Series Detail Screen
 * Displays series information and episode list
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { useApp } from '../../contexts/AppContext';
import { RootStackParamList, Episode } from '../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SeriesDetail'>;
type RouteProps = RouteProp<RootStackParamList, 'SeriesDetail'>;

const SeriesDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { seriesId } = route.params;

  const { selectedSeries, episodes, selectSeries, isLoading } = useApp();
  const [selectedSeason, setSelectedSeason] = useState(1);

  useEffect(() => {
    selectSeries(seriesId);
  }, [seriesId]);

  const handleEpisodePress = (episode: Episode) => {
    navigation.navigate('SubtitlePlayer', {
      episodeId: episode.id,
      seriesId: seriesId,
    });
  };

  const filteredEpisodes = episodes.filter(
    ep => ep.seasonNumber === selectedSeason
  );

  const renderEpisodeItem = ({ item }: { item: Episode }) => (
    <TouchableOpacity
      style={styles.episodeCard}
      onPress={() => handleEpisodePress(item)}
    >
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.episodeThumbnail}
        resizeMode="cover"
      />

      <View style={styles.episodeInfo}>
        <View style={styles.episodeHeader}>
          <Text style={styles.episodeNumber}>
            S{item.seasonNumber}E{item.episodeNumber}
          </Text>
          {item.hasSubtitles && (
            <Ionicons name="closed-captioning" size={16} color="#6366f1" />
          )}
        </View>

        <Text style={styles.episodeTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.episodeDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.episodeMeta}>
          <Ionicons name="time-outline" size={14} color="#6b7280" />
          <Text style={styles.episodeMetaText}>
            {Math.floor(item.duration / 60)} min
          </Text>

          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>{item.level}</Text>
          </View>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={24} color="#d1d5db" />
    </TouchableOpacity>
  );

  if (isLoading || !selectedSeries) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  const seasons = Array.from({ length: selectedSeries.totalSeasons }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: selectedSeries.bannerImage }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay} />
        </View>

        {/* Series Info */}
        <View style={styles.infoSection}>
          <Text style={styles.title}>{selectedSeries.title}</Text>

          <View style={styles.metadata}>
            <View style={styles.metadataItem}>
              <Ionicons name="star" size={16} color="#fbbf24" />
              <Text style={styles.metadataText}>{selectedSeries.rating}</Text>
            </View>

            <View style={styles.metadataItem}>
              <Ionicons name="calendar" size={16} color="#6366f1" />
              <Text style={styles.metadataText}>{selectedSeries.releaseYear}</Text>
            </View>

            <View style={[styles.levelBadgeLarge, getLevelStyle(selectedSeries.level)]}>
              <Text style={styles.levelBadgeTextLarge}>{selectedSeries.level}</Text>
            </View>
          </View>

          <Text style={styles.description}>{selectedSeries.description}</Text>

          {/* Tags */}
          <View style={styles.tags}>
            {selectedSeries.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Cast */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cast</Text>
            <Text style={styles.castText}>{selectedSeries.cast.join(', ')}</Text>
          </View>

          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{selectedSeries.totalSeasons}</Text>
              <Text style={styles.statLabel}>Seasons</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{selectedSeries.totalEpisodes}</Text>
              <Text style={styles.statLabel}>Episodes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{selectedSeries.category}</Text>
              <Text style={styles.statLabel}>Category</Text>
            </View>
          </View>
        </View>

        {/* Season Selector */}
        <View style={styles.seasonSelector}>
          <Text style={styles.sectionTitle}>Episodes</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.seasonChips}
          >
            {seasons.map(season => (
              <TouchableOpacity
                key={season}
                style={[
                  styles.seasonChip,
                  selectedSeason === season && styles.seasonChipSelected,
                ]}
                onPress={() => setSelectedSeason(season)}
              >
                <Text
                  style={[
                    styles.seasonChipText,
                    selectedSeason === season && styles.seasonChipTextSelected,
                  ]}
                >
                  Season {season}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Episode List */}
        <View style={styles.episodeList}>
          {filteredEpisodes.map(episode => (
            <View key={episode.id}>{renderEpisodeItem({ item: episode })}</View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const getLevelStyle = (level: string) => {
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
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerContainer: {
    height: 240,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  infoSection: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metadataText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  levelBadgeLarge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  levelBadgeTextLarge: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tag: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 13,
    color: '#6366f1',
    fontWeight: '500',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  castText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  seasonSelector: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginTop: 8,
  },
  seasonChips: {
    paddingVertical: 8,
  },
  seasonChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  seasonChipSelected: {
    backgroundColor: '#6366f1',
  },
  seasonChipText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  seasonChipTextSelected: {
    color: '#ffffff',
  },
  episodeList: {
    padding: 16,
  },
  episodeCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  episodeThumbnail: {
    width: 120,
    height: 120,
    backgroundColor: '#e5e7eb',
  },
  episodeInfo: {
    flex: 1,
    padding: 12,
  },
  episodeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  episodeNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6366f1',
    marginRight: 8,
  },
  episodeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  episodeDescription: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
    marginBottom: 8,
  },
  episodeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  episodeMetaText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
    marginRight: 12,
  },
  levelBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  levelBadgeText: {
    fontSize: 11,
    color: '#6366f1',
    fontWeight: '600',
  },
});

export default SeriesDetailScreen;
