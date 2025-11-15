/**
 * Word Detail Screen
 * Detailed view of a single word
 */

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../../types';

type RouteProps = RouteProp<RootStackParamList, 'WordDetail'>;

const WordDetailScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const { word } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.word}>{word}</Text>
        <Text style={styles.message}>
          Full word details would be displayed here
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 20,
  },
  word: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#6b7280',
  },
});

export default WordDetailScreen;
