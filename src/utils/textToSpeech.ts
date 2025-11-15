/**
 * Text-to-Speech Utility
 * Handles pronunciation of words and sentences using expo-speech
 */

import * as Speech from 'expo-speech';

export interface TTSOptions {
  language?: string;
  pitch?: number;
  rate?: number;
  volume?: number;
}

/**
 * Speak a word or sentence
 */
export const speak = async (
  text: string,
  options: TTSOptions = {}
): Promise<void> => {
  const {
    language = 'en-US',
    pitch = 1.0,
    rate = 0.85, // Slightly slower for learning
    volume = 1.0,
  } = options;

  try {
    // Stop any ongoing speech
    await Speech.stop();

    // Speak the text
    await Speech.speak(text, {
      language,
      pitch,
      rate,
      volume,
    });
  } catch (error) {
    console.error('TTS Error:', error);
    throw new Error('Failed to speak text');
  }
};

/**
 * Speak a word with emphasis (for word learning)
 */
export const speakWord = async (word: string): Promise<void> => {
  return speak(word, {
    language: 'en-US',
    pitch: 1.0,
    rate: 0.7, // Slower for individual words
    volume: 1.0,
  });
};

/**
 * Speak a sentence (for sentence learning)
 */
export const speakSentence = async (sentence: string): Promise<void> => {
  return speak(sentence, {
    language: 'en-US',
    pitch: 1.0,
    rate: 0.85,
    volume: 1.0,
  });
};

/**
 * Stop current speech
 */
export const stopSpeaking = async (): Promise<void> => {
  try {
    await Speech.stop();
  } catch (error) {
    console.error('Stop TTS Error:', error);
  }
};

/**
 * Check if speech is available
 */
export const isSpeechAvailable = async (): Promise<boolean> => {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    return voices.length > 0;
  } catch (error) {
    return false;
  }
};

/**
 * Get available voices
 */
export const getAvailableVoices = async () => {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    return voices.filter(voice => voice.language.startsWith('en'));
  } catch (error) {
    console.error('Get voices error:', error);
    return [];
  }
};

/**
 * Speak with phonetic representation
 * Useful for pronunciation training
 */
export const speakPhonetic = async (
  word: string,
  phonetic: string
): Promise<void> => {
  // First speak the word normally
  await speakWord(word);

  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 500));

  // Then speak it again slowly
  await speak(word, {
    rate: 0.5,
    pitch: 1.1,
  });
};
