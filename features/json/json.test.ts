import { describe, expect, it } from 'vitest';

import { formatJson } from './json';

describe('formatJson', () => {
  it('formats values with the selected indentation', () => {
    expect(formatJson('{"ok":true}', 4)).toBe('{\n    "ok": true\n}');
    expect(formatJson('{"ok":true}', 'tab')).toBe('{\n\t"ok": true\n}');
  });

  it('sorts nested object keys without reordering arrays', () => {
    expect(formatJson('{"z":[{"b":2,"a":1}],"a":true}', 2, true)).toBe(
      '{\n  "a": true,\n  "z": [\n    {\n      "a": 1,\n      "b": 2\n    }\n  ]\n}',
    );
  });

  it('provides useful input errors', () => {
    expect(() => formatJson('')).toThrow('JSON input is required.');
    expect(() => formatJson('{')).toThrow('Invalid JSON');
  });
});
