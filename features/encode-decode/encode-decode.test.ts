import { describe, expect, it } from 'vitest';
import { convertText } from './encode-decode';
describe('convertText', () => {
  it('round-trips UTF-8 Base64', () =>
    expect(convertText(convertText('Xin chào 👋', 'base64', 'encode'), 'base64', 'decode')).toBe(
      'Xin chào 👋',
    ));
  it('supports URL and hex', () => {
    expect(convertText('a b', 'url', 'encode')).toBe('a%20b');
    expect(convertText('6869', 'hex', 'decode')).toBe('hi');
  });
  it('rejects malformed hex', () =>
    expect(() => convertText('abc', 'hex', 'decode')).toThrow('Hex input'));
});
