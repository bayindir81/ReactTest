/**
 * Subtitle Parser Utility
 * Parses subtitle text into words with positions
 */

import { SubtitleLine, SubtitleWord } from '../types';

/**
 * Parse a subtitle line text into individual words with metadata
 */
export const parseSubtitleLineToWords = (
  text: string,
  lineId: string
): SubtitleWord[] => {
  const words: SubtitleWord[] = [];
  let currentIndex = 0;

  // Regex to match words and punctuation separately
  const wordRegex = /\S+/g;
  let match;

  while ((match = wordRegex.exec(text)) !== null) {
    const fullWord = match[0];
    const startIndex = match.index;

    // Check if this is pure punctuation
    const isPunctuation = /^[^\w\s]+$/.test(fullWord);

    // Extract the actual word (remove trailing punctuation)
    const cleanWord = fullWord.replace(/[^\w'-]+$/g, '');
    const normalizedWord = normalizeWord(cleanWord);

    words.push({
      id: `${lineId}_w_${currentIndex}`,
      word: fullWord,
      normalizedWord,
      startIndex,
      endIndex: startIndex + fullWord.length,
      isPunctuation,
    });

    currentIndex++;
  }

  return words;
};

/**
 * Normalize a word (lowercase, remove special characters)
 */
export const normalizeWord = (word: string): string => {
  return word
    .toLowerCase()
    .replace(/['']/g, "'") // Normalize apostrophes
    .replace(/[^\w'-]/g, '') // Remove special chars except apostrophe and hyphen
    .trim();
};

/**
 * Parse SRT subtitle format to SubtitleLine array
 */
export const parseSRTSubtitle = (srtContent: string): SubtitleLine[] => {
  const lines: SubtitleLine[] = [];
  const blocks = srtContent.trim().split(/\n\s*\n/);

  blocks.forEach((block, index) => {
    const blockLines = block.split('\n');

    if (blockLines.length >= 3) {
      // Parse time
      const timeLine = blockLines[1];
      const timeMatch = timeLine.match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})/);

      if (timeMatch) {
        const startTime =
          parseInt(timeMatch[1]) * 3600 +
          parseInt(timeMatch[2]) * 60 +
          parseInt(timeMatch[3]) +
          parseInt(timeMatch[4]) / 1000;

        const endTime =
          parseInt(timeMatch[5]) * 3600 +
          parseInt(timeMatch[6]) * 60 +
          parseInt(timeMatch[7]) +
          parseInt(timeMatch[8]) / 1000;

        // Get text (can be multiple lines)
        const text = blockLines.slice(2).join(' ');
        const lineId = `sub_${index}`;

        const words = parseSubtitleLineToWords(text, lineId);

        lines.push({
          id: lineId,
          index,
          startTime,
          endTime,
          text,
          words,
        });
      }
    }
  });

  return lines;
};

/**
 * Parse VTT subtitle format to SubtitleLine array
 */
export const parseVTTSubtitle = (vttContent: string): SubtitleLine[] => {
  const lines: SubtitleLine[] = [];
  const blocks = vttContent.replace(/^WEBVTT\n+/, '').split(/\n\s*\n/);

  blocks.forEach((block, index) => {
    const blockLines = block.split('\n');

    if (blockLines.length >= 2) {
      // Find the time line
      const timeLine = blockLines.find(line => line.includes('-->'));
      const textLines = blockLines.filter(line => !line.includes('-->') && line.trim() !== '');

      if (timeLine && textLines.length > 0) {
        const timeMatch = timeLine.match(/(\d{2}):(\d{2}):(\d{2})\.(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})\.(\d{3})/);

        if (timeMatch) {
          const startTime =
            parseInt(timeMatch[1]) * 3600 +
            parseInt(timeMatch[2]) * 60 +
            parseInt(timeMatch[3]) +
            parseInt(timeMatch[4]) / 1000;

          const endTime =
            parseInt(timeMatch[5]) * 3600 +
            parseInt(timeMatch[6]) * 60 +
            parseInt(timeMatch[7]) +
            parseInt(timeMatch[8]) / 1000;

          const text = textLines.join(' ');
          const lineId = `sub_${index}`;

          const words = parseSubtitleLineToWords(text, lineId);

          lines.push({
            id: lineId,
            index,
            startTime,
            endTime,
            text,
            words,
          });
        }
      }
    }
  });

  return lines;
};

/**
 * Get unique words from subtitle lines
 */
export const getUniqueWords = (lines: SubtitleLine[]): string[] => {
  const wordSet = new Set<string>();

  lines.forEach(line => {
    line.words.forEach(word => {
      if (!word.isPunctuation && word.normalizedWord) {
        wordSet.add(word.normalizedWord);
      }
    });
  });

  return Array.from(wordSet);
};

/**
 * Count total words in subtitle
 */
export const countTotalWords = (lines: SubtitleLine[]): number => {
  return lines.reduce((total, line) => {
    return total + line.words.filter(w => !w.isPunctuation).length;
  }, 0);
};

/**
 * Calculate average words per line
 */
export const calculateAverageWordsPerLine = (lines: SubtitleLine[]): number => {
  if (lines.length === 0) return 0;
  return countTotalWords(lines) / lines.length;
};

/**
 * Extract context sentence for a word
 */
export const extractWordContext = (
  word: string,
  lines: SubtitleLine[]
): string | null => {
  const normalizedSearchWord = normalizeWord(word);

  for (const line of lines) {
    const foundWord = line.words.find(
      w => w.normalizedWord === normalizedSearchWord
    );

    if (foundWord) {
      return line.text;
    }
  }

  return null;
};
