import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import prettierConfig from 'eslint-config-prettier/flat';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const config = [
  ...compat.config({ extends: ['next/core-web-vitals'] }),
  prettierConfig,
  {
    ignores: ['.next/**', 'coverage/**', 'node_modules/**'],
  },
];

export default config;
