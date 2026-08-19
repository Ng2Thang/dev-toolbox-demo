export type ToolDefinition = {
  href: string;
  label: string;
  description: string;
  category: string;
  icon: string;
};

export const tools: readonly ToolDefinition[] = [
  {
    href: '/tools/jwt',
    label: 'JWT Decoder',
    description: 'Decode and inspect JWT tokens with local processing.',
    category: 'Encode / decode',
    icon: 'JWT',
  },
  {
    href: '/tools/json',
    label: 'JSON Formatter',
    description: 'Format, pretty-print, and validate JSON instantly.',
    category: 'JSON',
    icon: '{}',
  },
  {
    href: '/tools/timestamp',
    label: 'Unix Timestamp',
    description: 'Convert epoch time to human-readable dates.',
    category: 'Developer',
    icon: 'TS',
  },
  {
    href: '/tools/concat',
    label: 'Concatenate String',
    description: 'Combine line-separated values using any separator.',
    category: 'Text',
    icon: '++',
  },
  {
    href: '/tools/uuid',
    label: 'UUID Generator',
    description: 'Generate valid v4 UUIDs quickly.',
    category: 'Generators',
    icon: 'ID',
  },
  {
    href: '/tools/text-statistics',
    label: 'Text Statistics',
    description: 'Count words, characters, lines, and more locally.',
    category: 'Text',
    icon: 'TX',
  },
  {
    href: '/tools/encode-decode',
    label: 'Encoder / Decoder',
    description: 'Encode and decode common UTF-8 text formats locally.',
    category: 'Encode / decode',
    icon: '<>',
  },
];

export const primaryNavigation = [
  { href: '/', label: 'Explore', icon: 'EX' },
  { href: '/tools/jwt', label: 'JWT Decoder', icon: 'JWT' },
  { href: '/tools/json', label: 'JSON Formatter', icon: '{}' },
  { href: '/tools/timestamp', label: 'Unix Timestamp', icon: 'TS' },
  { href: '/tools/concat', label: 'Concatenate String', icon: '++' },
  { href: '/tools/uuid', label: 'UUID Generator', icon: 'ID' },
  { href: '/tools/text-statistics', label: 'Text Statistics', icon: 'TX' },
  { href: '/tools/encode-decode', label: 'Encoder / Decoder', icon: '<>' },
  { href: '/history', label: 'Saved runs', icon: 'HR' },
] as const;
