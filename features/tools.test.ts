import { describe, expect, it, vi } from 'vitest';

import { concatenateLines } from './concat/concatenate';
import { formatJson } from './json/json';
import { calculateTextStatistics } from './text-statistics/text-statistics';
import { convertTimestamp } from './timestamp/timestamp';
import { generateUuids } from './uuid/uuid';

describe('tool utilities', () => {
  it('formats JSON and reports invalid input through its caller', () => {
    expect(formatJson('{"status":"ready"}')).toBe('{\n  "status": "ready"\n}');
    expect(() => formatJson('{')).toThrow();
  });

  it('concatenates non-empty trimmed lines', () => {
    expect(concatenateLines(' first \n\n second ', ', ')).toBe('first, second');
  });

  it('converts Unix seconds', () => {
    expect(convertTimestamp('0')).toContain('1970-01-01T00:00:00.000Z');
    expect(() => convertTimestamp('not-a-number')).toThrow('valid numeric');
  });

  it('calculates text statistics', () => {
    expect(calculateTextStatistics('One two\n\nThree')).toMatchObject({
      characters: 14,
      words: 3,
      lines: 3,
      paragraphs: 2,
    });
  });

  it('limits UUID generation to twenty values', () => {
    const randomUuid = vi.spyOn(crypto, 'randomUUID').mockReturnValue('uuid');
    expect(generateUuids('50')).toHaveLength(20);
    randomUuid.mockRestore();
  });
});
