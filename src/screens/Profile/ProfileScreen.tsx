/**
 * Profile Screen
 * User profile and settings
 */

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useApp } from '../../contexts/AppContext';

const ProfileScreen: React.FC = () => {
  const { userProgress } = useApp();

  const settingItems = [
    {
      icon: 'language' as keyof typeof Ionicons.glyphMap,
      title: 'Learning Language',
      value: 'English',
      onPress: () => {},
    },
    {
      icon: 'volume-high' as keyof typeof Ionicons.glyphMap,
      title: 'Text-to-Speech',
      value: 'Enabled',
      onPress: () => {},
    },
    {
      icon: 'notifications' as keyof typeof Ionicons.glyphMap,
      title: 'Daily Reminder',
      value: 'Off',
      onPress: () => {},
    },
    {
      icon: 'moon' as keyof typeof Ionicons.glyphMap,
      title: 'Theme',
      value: 'Auto',
      onPress: () => {},
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color="#ffffff" />
          </View>
        </View>
        <Text style={styles.name}>English Learner</Text>
        <Text style={styles.email}>learner@example.com</Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelBadgeText}>{userProgress.currentLevel}</Text>
        </View>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsSection}>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{userProgress.totalWordsLearned}</Text>
            <Text style={styles.statLabel}>Words</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{userProgress.dailyStreak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{userProgress.totalEpisodesCompleted}</Text>
            <Text style={styles.statLabel}>Episodes</Text>
          </View>
        </View>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        {settingItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.settingItem}
            onPress={item.onPress}
          >
            <View style={styles.settingIcon}>
              <Ionicons name={item.icon} size={24} color="#6366f1" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>{item.title}</Text>
              <Text style={styles.settingValue}>{item.value}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Learning Goals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Learning Goals</Text>
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalTitle}>Daily Goal</Text>
            <Text style={styles.goalValue}>{userProgress.dailyGoal} words/day</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Goal</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Account Actions */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="help-circle-outline" size={24} color="#6366f1" />
          <Text style={styles.actionButtonText}>Help & Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="information-circle-outline" size={24} color="#6366f1" />
          <Text style={styles.actionButtonText}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.logoutButton]}>
          <Ionicons name="log-out-outline" size={24} color="#ef4444" />
          <Text style={[styles.actionButtonText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>EnglishLearnTV v1.0.0</Text>
        <Text style={styles.footerSubtext}>
          Learn English with your favorite series
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
  header: {
    backgroundColor: '#6366f1',
    paddingTop: 60,
    paddingBottom: 32,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#e0e7ff',
    marginBottom: 12,
  },
  levelBadge: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  statsSection: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statBox: {
    flex: 1,
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
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 2,
  },
  settingValue: {
    fontSize: 13,
    color: '#6b7280',
  },
  goalCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  goalValue: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  logoutText: {
    color: '#ef4444',
  },
  footer: {
    padding: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 11,
    color: '#d1d5db',
  },
});

export default ProfileScreen;
