/**
 * Analytics Screen
 * Display user progress and statistics
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useApp } from '../../contexts/AppContext';

const AnalyticsScreen: React.FC = () => {
  const { userProgress, wordStats } = useApp();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Progress</Text>
        <Text style={styles.headerSubtitle}>Track your learning journey</Text>
      </View>

      {/* Overall Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overall Statistics</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#6366f1' }]}>
              <Ionicons name="book" size={24} color="#ffffff" />
            </View>
            <Text style={styles.statValue}>{userProgress.totalWordsLearned}</Text>
            <Text style={styles.statLabel}>Words Learned</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#10b981' }]}>
              <Ionicons name="time" size={24} color="#ffffff" />
            </View>
            <Text style={styles.statValue}>{userProgress.totalTimeSpent}</Text>
            <Text style={styles.statLabel}>Minutes Spent</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#f59e0b' }]}>
              <Ionicons name="film" size={24} color="#ffffff" />
            </View>
            <Text style={styles.statValue}>{userProgress.totalEpisodesCompleted}</Text>
            <Text style={styles.statLabel}>Episodes Watched</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#ef4444' }]}>
              <Ionicons name="flame" size={24} color="#ffffff" />
            </View>
            <Text style={styles.statValue}>{userProgress.dailyStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>
      </View>

      {/* Current Level */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>English Level</Text>
        <View style={styles.levelCard}>
          <View style={styles.levelInfo}>
            <Text style={styles.levelCurrent}>Current: {userProgress.currentLevel}</Text>
            <View style={styles.levelProgress}>
              <View style={styles.levelProgressBar} />
            </View>
            <Text style={styles.levelNext}>Next: B1</Text>
          </View>
        </View>
      </View>

      {/* Word Distribution */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Word Status</Text>
        <View style={styles.distributionCard}>
          <View style={styles.distributionRow}>
            <View style={styles.distributionItem}>
              <View style={[styles.distributionDot, { backgroundColor: '#10b981' }]} />
              <Text style={styles.distributionLabel}>Known</Text>
              <Text style={styles.distributionValue}>{wordStats.knownWords}</Text>
            </View>
          </View>

          <View style={styles.distributionRow}>
            <View style={styles.distributionItem}>
              <View style={[styles.distributionDot, { backgroundColor: '#f59e0b' }]} />
              <Text style={styles.distributionLabel}>Learning</Text>
              <Text style={styles.distributionValue}>{wordStats.learningWords}</Text>
            </View>
          </View>

          <View style={styles.distributionRow}>
            <View style={styles.distributionItem}>
              <View style={[styles.distributionDot, { backgroundColor: '#ef4444' }]} />
              <Text style={styles.distributionLabel}>Unknown</Text>
              <Text style={styles.distributionValue}>{wordStats.unknownWords}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <View style={styles.activityItem}>
            <Ionicons name="calendar" size={20} color="#6366f1" />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Words learned today</Text>
              <Text style={styles.activityValue}>{wordStats.wordsLearnedToday}</Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <Ionicons name="calendar-outline" size={20} color="#6366f1" />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Words this week</Text>
              <Text style={styles.activityValue}>{wordStats.wordsLearnedThisWeek}</Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <Ionicons name="calendar-outline" size={20} color="#6366f1" />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Words this month</Text>
              <Text style={styles.activityValue}>{wordStats.wordsLearnedThisMonth}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementsGrid}>
          <View style={styles.achievementCard}>
            <Ionicons name="trophy" size={32} color="#fbbf24" />
            <Text style={styles.achievementTitle}>First Steps</Text>
            <Text style={styles.achievementDesc}>Learned 10 words</Text>
          </View>

          <View style={styles.achievementCard}>
            <Ionicons name="flame" size={32} color="#ef4444" />
            <Text style={styles.achievementTitle}>On Fire</Text>
            <Text style={styles.achievementDesc}>7 day streak</Text>
          </View>

          <View style={styles.achievementCard}>
            <Ionicons name="school" size={32} color="#6366f1" />
            <Text style={styles.achievementTitle}>Dedicated</Text>
            <Text style={styles.achievementDesc}>100 words learned</Text>
          </View>
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
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  levelCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  levelInfo: {
    alignItems: 'center',
  },
  levelCurrent: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 16,
  },
  levelProgress: {
    width: '100%',
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 16,
  },
  levelProgressBar: {
    width: '60%',
    height: '100%',
    backgroundColor: '#6366f1',
  },
  levelNext: {
    fontSize: 14,
    color: '#6b7280',
  },
  distributionCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  distributionRow: {
    marginBottom: 16,
  },
  distributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distributionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  distributionLabel: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  distributionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  activityCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityText: {
    fontSize: 15,
    color: '#374151',
  },
  activityValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  achievementsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  achievementCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementDesc: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default AnalyticsScreen;
