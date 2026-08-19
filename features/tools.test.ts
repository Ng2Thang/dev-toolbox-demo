import { describe, expect, it } from 'vitest';

import { formatJson } from './json/json';
import { convertTimestamp } from './timestamp/timestamp';

describe('tool utilities', () => {
  it('formats JSON and reports invalid input through its caller', () => {
    expect(formatJson('{"status":"ready"}')).toBe('{\n  "status": "ready"\n}');
    expect(() => formatJson('{')).toThrow();
  });

  it('converts Unix seconds', () => {
    expect(convertTimestamp('0')).toContain('1970-01-01T00:00:00.000Z');
    expect(() => convertTimestamp('not-a-number')).toThrow('valid numeric');
  });
});
