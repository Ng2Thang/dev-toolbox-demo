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
    href: '/tools/uuid',
    label: 'UUID Generator',
    description: 'Generate UUID v1, v4, and v7 values locally.',
    category: 'Developer',
    icon: 'ID',
  },
  {
    href: '/tools/base64',
    label: 'Base64 Encoder / Decoder',
    description: 'Convert text to standard or URL-safe Base64 locally.',
    category: 'Encode / decode',
    icon: '64',
  },
];

const shellNavigation = [{ href: '/', label: 'Explore', icon: 'EX' }];

const shellFooterNavigation = [{ href: '/history', label: 'Saved runs', icon: 'HR' }];

export const primaryNavigation = [
  ...shellNavigation,
  ...tools.map(({ href, label, icon }) => ({ href, label, icon })),
  ...shellFooterNavigation,
] as const;
