export const UUID_VERSIONS = ['v1', 'v4', 'v7'] as const;
export const MAX_UUID_QUANTITY = 100;

export type UuidVersion = (typeof UUID_VERSIONS)[number];
export type RandomBytes = (length: number) => Uint8Array;

const UUID_V1_EPOCH_OFFSET_MILLISECONDS = 12219292800000;
const BYTE_BASE = 256;
const UINT32_MODULUS = BYTE_BASE ** 4;

function bytesToUuid(bytes: Uint8Array) {
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function writeBigEndian(bytes: Uint8Array, value: number, start: number, length: number) {
  for (let index = start + length - 1; index >= start; index -= 1) {
    bytes[index] = value % BYTE_BASE;
    value = Math.floor(value / BYTE_BASE);
  }
}

function uuidV1TimestampFields(milliseconds: number, sequence: number) {
  const timestampMilliseconds = milliseconds + UUID_V1_EPOCH_OFFSET_MILLISECONDS;
  const quotient = Math.floor(timestampMilliseconds / UINT32_MODULUS);
  const remainder = timestampMilliseconds % UINT32_MODULUS;
  const lowerTicks = remainder * 10000 + sequence;
  const upperTicks = quotient * 10000 + Math.floor(lowerTicks / UINT32_MODULUS);

  return {
    timeHigh: Math.floor(upperTicks / 65536) % 4096,
    timeLow: lowerTicks % UINT32_MODULUS,
    timeMid: upperTicks % 65536,
  };
}

export function validateUuidQuantity(value: string) {
  const normalized = value.trim();

  if (!/^\d+$/.test(normalized)) {
    throw new Error(`Enter a whole number from 1 to ${MAX_UUID_QUANTITY}.`);
  }

  const quantity = Number(normalized);

  if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > MAX_UUID_QUANTITY) {
    throw new Error(`Enter a whole number from 1 to ${MAX_UUID_QUANTITY}.`);
  }

  return quantity;
}

export function isUuidVersion(value: string): value is UuidVersion {
  return (UUID_VERSIONS as readonly string[]).includes(value);
}

function generateUuidV1(randomBytes: RandomBytes, milliseconds: number, sequence: number) {
  const bytes = randomBytes(16);
  const { timeHigh, timeLow, timeMid } = uuidV1TimestampFields(milliseconds, sequence);

  writeBigEndian(bytes, timeLow, 0, 4);
  writeBigEndian(bytes, timeMid, 4, 2);
  writeBigEndian(bytes, timeHigh | 0x1000, 6, 2);
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  bytes[9] &= 0xff;
  bytes[10] = (bytes[10] & 0xfe) | 0x01;

  return bytesToUuid(bytes);
}

function generateUuidV4(randomBytes: RandomBytes) {
  const bytes = randomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  return bytesToUuid(bytes);
}

function generateUuidV7(randomBytes: RandomBytes, milliseconds: number) {
  const bytes = randomBytes(16);

  writeBigEndian(bytes, milliseconds, 0, 6);
  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  return bytesToUuid(bytes);
}

export function generateUuids(
  version: UuidVersion,
  quantity: number,
  randomBytes: RandomBytes,
  milliseconds = Date.now(),
) {
  if (!isUuidVersion(version)) {
    throw new Error('Choose a supported UUID version.');
  }

  if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > MAX_UUID_QUANTITY) {
    throw new Error(`Enter a whole number from 1 to ${MAX_UUID_QUANTITY}.`);
  }

  if (!Number.isSafeInteger(milliseconds) || milliseconds < 0) {
    throw new Error('Current time is unavailable for UUID generation.');
  }

  return Array.from({ length: quantity }, (_, index) => {
    if (version === 'v1') {
      return generateUuidV1(randomBytes, milliseconds, index);
    }

    return version === 'v4'
      ? generateUuidV4(randomBytes)
      : generateUuidV7(randomBytes, milliseconds);
  });
}
