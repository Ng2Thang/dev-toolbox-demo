export type TextStatisticsResult = {
  characters: number;
  charactersWithoutSpaces: number;
  words: number;
  lines: number;
  paragraphs: number;
  bytes: number;
  readingTimeMinutes: number;
};

export function calculateTextStatistics(text: string): TextStatisticsResult {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return {
    characters: text.length,
    charactersWithoutSpaces: text.replace(/\s/g, '').length,
    words,
    lines: text ? text.split(/\r?\n/).length : 0,
    paragraphs: text.trim() ? text.trim().split(/\n\s*\n/).length : 0,
    bytes: new TextEncoder().encode(text).length,
    readingTimeMinutes: words ? Math.max(1, Math.ceil(words / 200)) : 0,
  };
}
