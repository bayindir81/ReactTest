/**
 * Root Navigator
 * Main navigation structure for the app
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList, MainTabParamList } from '../types';

// Import screens
import ExploreScreen from '../screens/Explore/ExploreScreen';
import SeriesDetailScreen from '../screens/SeriesDetail/SeriesDetailScreen';
import SubtitlePlayerScreen from '../screens/SubtitlePlayer/SubtitlePlayerScreen';
import WordListScreen from '../screens/WordList/WordListScreen';
import LearningScreen from '../screens/LearningModes/LearningScreen';
import AnalyticsScreen from '../screens/Analytics/AnalyticsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import WordDetailScreen from '../screens/WordList/WordDetailScreen';
import LearningModeScreen from '../screens/LearningModes/LearningModeScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * Main Tab Navigator
 */
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          switch (route.name) {
            case 'Explore':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'WordList':
              iconName = focused ? 'book' : 'book-outline';
              break;
            case 'Learning':
              iconName = focused ? 'school' : 'school-outline';
              break;
            case 'Analytics':
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#9ca3af',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      })}
    >
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{ tabBarLabel: 'Explore' }}
      />
      <Tab.Screen
        name="WordList"
        component={WordListScreen}
        options={{ tabBarLabel: 'My Words' }}
      />
      <Tab.Screen
        name="Learning"
        component={LearningScreen}
        options={{ tabBarLabel: 'Learn' }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{ tabBarLabel: 'Progress' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

/**
 * Root Stack Navigator
 */
const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#6366f1',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SeriesDetail"
          component={SeriesDetailScreen}
          options={{ title: 'Series Details' }}
        />
        <Stack.Screen
          name="SubtitlePlayer"
          component={SubtitlePlayerScreen}
          options={{ title: 'Learn with Subtitles' }}
        />
        <Stack.Screen
          name="WordDetail"
          component={WordDetailScreen}
          options={{ title: 'Word Details' }}
        />
        <Stack.Screen
          name="LearningMode"
          component={LearningModeScreen}
          options={{ title: 'Learning Mode' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
