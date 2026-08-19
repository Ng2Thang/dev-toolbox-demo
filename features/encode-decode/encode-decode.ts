export type EncodingFormat = 'base64' | 'base64url' | 'url' | 'hex' | 'html';
export type Direction = 'encode' | 'decode';
const entities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};
const decodeEntities: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  '#39': "'",
};
function fromBytes(bytes: Uint8Array) {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    throw new Error('The encoded value is not valid UTF-8 text.');
  }
}
export function convertText(input: string, format: EncodingFormat, direction: Direction): string {
  if (!input) throw new Error('Enter text to convert.');
  if (format === 'url') {
    try {
      return direction === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input);
    } catch {
      throw new Error('Invalid URL-encoded input. Check % sequences.');
    }
  }
  if (format === 'html')
    return direction === 'encode'
      ? input.replace(/[&<>"']/g, (c) => entities[c])
      : input.replace(/&(amp|lt|gt|quot|#39);/g, (_m, e) => decodeEntities[e]);
  if (format === 'hex') {
    if (direction === 'encode')
      return Array.from(new TextEncoder().encode(input), (b) =>
        b.toString(16).padStart(2, '0'),
      ).join('');
    if (!/^(?:[\da-fA-F]{2})+$/.test(input))
      throw new Error('Hex input must contain complete byte pairs (00–FF).');
    return fromBytes(
      Uint8Array.from(input.match(/[\da-fA-F]{2}/g) ?? [], (p) => Number.parseInt(p, 16)),
    );
  }
  if (direction === 'encode') {
    const value = btoa(String.fromCharCode(...new TextEncoder().encode(input)));
    return format === 'base64url'
      ? value.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
      : value;
  }
  const normalized = (
    format === 'base64url' ? input.replace(/-/g, '+').replace(/_/g, '/') : input
  ).padEnd(Math.ceil(input.length / 4) * 4, '=');
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalized))
    throw new Error('Invalid Base64 input. Check its characters and padding.');
  try {
    return fromBytes(Uint8Array.from(atob(normalized), (c) => c.charCodeAt(0)));
  } catch {
    throw new Error('Invalid Base64 input. Check its characters and padding.');
  }
}
