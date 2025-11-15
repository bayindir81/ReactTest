/**
 * Explore Screen
 * Browse and search for TV series to learn English
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { useApp } from '../../contexts/AppContext';
import { RootStackParamList, Series, SeriesCategory, FilterType } from '../../types';
import SeriesCard from '../../components/series/SeriesCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CATEGORIES: { label: string; value: SeriesCategory }[] = [
  { label: 'All', value: 'drama' as SeriesCategory },
  { label: 'Drama', value: 'drama' },
  { label: 'Comedy', value: 'comedy' },
  { label: 'Sci-Fi', value: 'scifi' },
  { label: 'Thriller', value: 'thriller' },
  { label: 'Documentary', value: 'documentary' },
];

const FILTERS: { label: string; value: FilterType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Popular', value: 'popular' },
  { label: 'New', value: 'new' },
  { label: 'Beginner', value: 'beginner' },
  { label: 'Advanced', value: 'advanced' },
];

const ExploreScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { series, fetchSeries, isLoading } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SeriesCategory | 'all'>('all');
  const [selectedFilter, setSelectedFilter] = useState<FilterType | 'all'>('all');
  const [filteredSeries, setFilteredSeries] = useState<Series[]>([]);

  useEffect(() => {
    fetchSeries();
  }, []);

  useEffect(() => {
    filterSeries();
  }, [series, searchQuery, selectedCategory, selectedFilter]);

  const filterSeries = () => {
    let result = [...series];

    // Search filter
    if (searchQuery) {
      result = result.filter(
        s =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(s => s.category === selectedCategory);
    }

    // Additional filters
    if (selectedFilter === 'popular') {
      result = result.filter(s => s.isPopular);
    } else if (selectedFilter === 'new') {
      result = result.filter(s => s.isNew);
    } else if (selectedFilter === 'beginner') {
      result = result.filter(s => s.level === 'A1' || s.level === 'A2');
    } else if (selectedFilter === 'advanced') {
      result = result.filter(s => s.level === 'C1' || s.level === 'C2');
    }

    setFilteredSeries(result);
  };

  const handleSeriesPress = (seriesItem: Series) => {
    navigation.navigate('SeriesDetail', { seriesId: seriesItem.id });
  };

  const renderSeriesItem = ({ item }: { item: Series }) => (
    <SeriesCard series={item} onPress={() => handleSeriesPress(item)} />
  );

  const renderCategoryChip = (category: { label: string; value: string }) => {
    const isSelected =
      category.value === selectedCategory ||
      (category.label === 'All' && selectedCategory === 'all');

    return (
      <TouchableOpacity
        key={category.value}
        style={[styles.chip, isSelected && styles.chipSelected]}
        onPress={() =>
          setSelectedCategory(
            category.label === 'All' ? 'all' : (category.value as SeriesCategory)
          )
        }
      >
        <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
          {category.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderFilterChip = (filter: { label: string; value: FilterType | 'all' }) => {
    const isSelected = filter.value === selectedFilter;

    return (
      <TouchableOpacity
        key={filter.value}
        style={[styles.chip, isSelected && styles.chipSelected]}
        onPress={() => setSelectedFilter(filter.value)}
      >
        <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
          {filter.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Series</Text>
        <Text style={styles.headerSubtitle}>Learn English with your favorite shows</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search series..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9ca3af"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={styles.filterContent}
      >
        <Text style={styles.filterLabel}>Categories:</Text>
        {CATEGORIES.map(renderCategoryChip)}
      </ScrollView>

      {/* Additional Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={styles.filterContent}
      >
        <Text style={styles.filterLabel}>Filter:</Text>
        {FILTERS.map(renderFilterChip)}
      </ScrollView>

      {/* Series List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Loading series...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredSeries}
          renderItem={renderSeriesItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="film-outline" size={64} color="#d1d5db" />
              <Text style={styles.emptyText}>No series found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
            </View>
          }
        />
      )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  filterRow: {
    marginBottom: 12,
  },
  filterContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginRight: 12,
  },
  chip: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  chipSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  chipText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#ffffff',
  },
  listContent: {
    padding: 16,
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
  },
});

export default ExploreScreen;
