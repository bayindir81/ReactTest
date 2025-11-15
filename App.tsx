/**
 * EnglishLearnTV
 * Learn English with your favorite TV series
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';

import { AppProvider } from './src/contexts/AppContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <AppProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </AppProvider>
  );
}
