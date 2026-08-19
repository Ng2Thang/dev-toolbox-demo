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
];

export const primaryNavigation = [
  { href: '/', label: 'Explore', icon: 'EX' },
  { href: '/tools/jwt', label: 'JWT Decoder', icon: 'JWT' },
  { href: '/tools/json', label: 'JSON Formatter', icon: '{}' },
  { href: '/tools/timestamp', label: 'Unix Timestamp', icon: 'TS' },
  { href: '/history', label: 'Saved runs', icon: 'HR' },
] as const;
