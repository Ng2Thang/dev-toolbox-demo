import { describe, expect, it } from 'vitest';

import { formatJson } from './json/json';

describe('tool utilities', () => {
  it('formats JSON and reports invalid input through its caller', () => {
    expect(formatJson('{"status":"ready"}')).toBe('{\n  "status": "ready"\n}');
    expect(() => formatJson('{')).toThrow();
  });
});
