import { describe, expect, it } from 'vitest';

import { formatJson } from './json';

describe('JSON Formatter - Level 3 advanced/risk-driven', () => {
  it('handles Unicode content without changing it (raw developer text risk)', () => {
    expect(
      formatJson('{"message":"Xin ch\\u00e0o \\ud83d\\udc4b","cjk":"\\u65e5\\u672c\\u8a9e"}'),
    ).toBe('{\n  "message": "Xin chào 👋",\n  "cjk": "日本語"\n}');
  });

  it('normalizes CRLF input from cross-platform editors (line-ending risk)', () => {
    expect(formatJson('{\r\n"first":1,\r\n"second":2\r\n}')).toBe(
      '{\n  "first": 1,\n  "second": 2\n}',
    );
  });

  it('is deterministic for repeated formatting of the same input (acceptance criterion risk)', () => {
    const input = '{"b":2,"a":1}';

    expect(formatJson(input)).toBe(formatJson(input));
  });

  it('is idempotent when formatting already formatted output (formatter invariant risk)', () => {
    const formatted = formatJson('{"config":{"enabled":true},"ports":[80,443]}');

    expect(formatJson(formatted)).toBe(formatted);
  });

  it('round-trips deeply structured JSON without changing its parsed value (inspection risk)', () => {
    const input = '{"meta":{"version":1},"items":[{"name":"first"},{"name":"second"}]}';

    expect(JSON.parse(formatJson(input))).toEqual(JSON.parse(input));
  });
});
