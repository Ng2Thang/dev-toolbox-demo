export const BASE64_VARIANTS = ['standard', 'url-safe'] as const;

export type Base64Variant = (typeof BASE64_VARIANTS)[number];

function binaryFromBytes(bytes: Uint8Array) {
  let binary = '';

  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }

  return binary;
}

function bytesFromBinary(binary: string) {
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function assertInput(input: string) {
  if (!input) {
    throw new Error('Enter text or Base64 input to continue.');
  }
}

function normalizeBase64(input: string, variant: Base64Variant) {
  assertInput(input);

  if (variant === 'standard') {
    if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(input)) {
      throw new Error('Enter valid Base64 characters and padding.');
    }

    return input;
  }

  if (!/^[A-Za-z0-9_-]*={0,2}$/.test(input)) {
    throw new Error('Enter valid Base64 characters and padding.');
  }

  const withoutPadding = input.replace(/=+$/, '');
  const padding = input.length - withoutPadding.length;
  const remainder = withoutPadding.length % 4;

  if (
    remainder === 1 ||
    (padding > 0 &&
      (input.length % 4 !== 0 || padding !== (remainder === 2 ? 2 : remainder === 3 ? 1 : 0)))
  ) {
    throw new Error('Enter valid Base64 characters and padding.');
  }

  return `${withoutPadding.replaceAll('-', '+').replaceAll('_', '/')}${'='.repeat(
    (4 - remainder) % 4,
  )}`;
}

export function isBase64Variant(value: string): value is Base64Variant {
  return (BASE64_VARIANTS as readonly string[]).includes(value);
}

export function encodeBase64(input: string, variant: Base64Variant) {
  assertInput(input);

  const standard = btoa(binaryFromBytes(new TextEncoder().encode(input)));

  return variant === 'url-safe'
    ? standard.replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
    : standard;
}

export function decodeBase64(input: string, variant: Base64Variant) {
  const normalized = normalizeBase64(input, variant);

  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytesFromBinary(atob(normalized)));
  } catch {
    throw new Error('Enter valid Base64 characters and UTF-8 text.');
  }
}
