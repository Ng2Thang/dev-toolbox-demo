export const MOCK_DATA_TYPES = [
  'lorem-ipsum',
  'people',
  'user-profiles',
  'products',
  'dates',
  'identifiers',
  'statuses',
  'json-records',
] as const;
export const TEXT_UNITS = ['words', 'sentences', 'paragraphs'] as const;
export const LOCALES = ['en', 'vi'] as const;
export const MAX_MOCK_DATA_QUANTITY = 100;

export type MockDataType = (typeof MOCK_DATA_TYPES)[number];
export type TextUnit = (typeof TEXT_UNITS)[number];
export type MockLocale = (typeof LOCALES)[number];
export type MockRecord = Record<string, string | number>;

export type MockDataSettings = {
  type: MockDataType;
  unit: TextUnit;
  quantity: number;
  locale: MockLocale;
  seed?: number;
};

export type MockDataResult = {
  text: string;
  records: MockRecord[];
};

const WORDS = {
  en: [
    'lorem',
    'ipsum',
    'dolor',
    'sit',
    'amet',
    'consectetur',
    'adipiscing',
    'elit',
    'integer',
    'vel',
    'nibh',
    'semper',
  ],
  vi: ['lập', 'trình', 'viên', 'tạo', 'dữ', 'liệu', 'mẫu', 'an', 'toàn', 'cho', 'giao', 'diện'],
} as const;
const NAMES = {
  en: ['Avery Morgan', 'Jordan Lee', 'Taylor Nguyen', 'Samira Patel', 'Noah Kim'],
  vi: ['Minh Anh', 'Gia Huy', 'Ngọc Linh', 'Quang Huy', 'Bảo Trân'],
} as const;
const CITIES = {
  en: ['Seattle', 'Austin', 'Chicago', 'Boston'],
  vi: ['Hà Nội', 'Đà Nẵng', 'Hồ Chí Minh', 'Cần Thơ'],
} as const;
const STATUSES = ['active', 'pending', 'inactive'] as const;

function hash(value: string) {
  let result = 2166136261;
  for (const character of value) result = Math.imul(result ^ character.charCodeAt(0), 16777619);
  return result >>> 0;
}

function randomFrom(seed: number) {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(items: readonly T[], random: () => number) {
  return items[Math.floor(random() * items.length)] as T;
}

export function validateQuantity(value: string) {
  if (!/^\d+$/.test(value.trim()))
    throw new Error(`Enter a whole number from 1 to ${MAX_MOCK_DATA_QUANTITY}.`);
  const quantity = Number(value);
  if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > MAX_MOCK_DATA_QUANTITY)
    throw new Error(`Enter a whole number from 1 to ${MAX_MOCK_DATA_QUANTITY}.`);
  return quantity;
}

export function parseSeed(value: string) {
  if (!value.trim()) return undefined;
  if (!/^-?\d+$/.test(value.trim()) || !Number.isSafeInteger(Number(value)))
    throw new Error('Enter a valid integer seed.');
  return Number(value);
}

export function toCsv(records: MockRecord[]) {
  if (!records.length) return '';
  const headers = [...new Set(records.flatMap((record) => Object.keys(record)))];
  const escape = (value: string | number | undefined) =>
    `"${String(value ?? '').replaceAll('"', '""')}"`;
  return [
    headers.join(','),
    ...records.map((record) => headers.map((header) => escape(record[header])).join(',')),
  ].join('\n');
}

function lorem(unit: TextUnit, quantity: number, locale: MockLocale, random: () => number) {
  const word = () => pick(WORDS[locale], random);
  if (unit === 'words') return Array.from({ length: quantity }, word).join(' ');
  const sentence = () => `${Array.from({ length: 8 }, word).join(' ')}.`;
  if (unit === 'sentences') return Array.from({ length: quantity }, sentence).join(' ');
  return Array.from({ length: quantity }, () => Array.from({ length: 3 }, sentence).join(' ')).join(
    '\n\n',
  );
}

export function generateMockData(settings: MockDataSettings): MockDataResult {
  if (!MOCK_DATA_TYPES.includes(settings.type)) throw new Error('Choose a supported output type.');
  if (!TEXT_UNITS.includes(settings.unit)) throw new Error('Choose a supported text unit.');
  if (!LOCALES.includes(settings.locale)) throw new Error('Choose a supported locale.');
  if (
    !Number.isSafeInteger(settings.quantity) ||
    settings.quantity < 1 ||
    settings.quantity > MAX_MOCK_DATA_QUANTITY
  )
    throw new Error(`Enter a whole number from 1 to ${MAX_MOCK_DATA_QUANTITY}.`);
  if (settings.seed !== undefined && !Number.isSafeInteger(settings.seed))
    throw new Error('Enter a valid integer seed.');
  const random = randomFrom(
    hash(`${settings.seed ?? Date.now()}|${settings.type}|${settings.locale}|${settings.quantity}`),
  );
  if (settings.type === 'lorem-ipsum')
    return { text: lorem(settings.unit, settings.quantity, settings.locale, random), records: [] };
  const records: MockRecord[] = Array.from(
    { length: settings.quantity },
    (_, index): MockRecord => {
      const number = String(index + 1).padStart(2, '0');
      const name = pick(NAMES[settings.locale], random);
      const status = pick(STATUSES, random);
      const id = `mock_${Math.floor(random() * 0xffffff)
        .toString(16)
        .padStart(6, '0')}`;
      const base = {
        id,
        status,
        createdAt: new Date(Date.UTC(2024, 0, 1 + Math.floor(random() * 365))).toISOString(),
      };
      if (settings.type === 'people')
        return {
          ...base,
          name,
          email: `${name.toLowerCase().replaceAll(' ', '.')}@example.test`,
          phone: `+1-555-01${number}`,
          address: `${100 + index} ${pick(CITIES[settings.locale], random)} Avenue`,
        };
      if (settings.type === 'user-profiles')
        return {
          ...base,
          name,
          email: `${name.toLowerCase().replaceAll(' ', '.')}@example.test`,
          avatar: `/placeholders/avatars/profile-${number}.svg`,
        };
      if (settings.type === 'products')
        return {
          ...base,
          name: `Sample ${pick(['Keyboard', 'Monitor', 'Adapter', 'Notebook'], random)}`,
          category: 'Mock inventory',
          price: Number((10 + random() * 90).toFixed(2)),
        };
      if (settings.type === 'dates')
        return {
          id,
          date: base.createdAt,
          timezone: settings.locale === 'vi' ? 'Asia/Ho_Chi_Minh' : 'America/Los_Angeles',
        };
      if (settings.type === 'identifiers')
        return {
          id,
          uuid: `${id}-${number}`,
          reference: `REF-${String(Math.floor(random() * 999999)).padStart(6, '0')}`,
        };
      if (settings.type === 'statuses')
        return { id, status, label: status[0].toUpperCase() + status.slice(1) };
      return { ...base, name, value: `record-${number}` };
    },
  );
  return { records, text: JSON.stringify(records, null, 2) };
}
