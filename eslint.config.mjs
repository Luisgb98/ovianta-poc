import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    settings: {
      react: { version: '19' },
    },
    rules: {
      // setState in useEffect is intentional for localStorage hydration in 'use client' contexts.
      'react-hooks/set-state-in-effect': 'off',
      // Allow _-prefixed variables to be intentionally unused (e.g. destructuring `{ id: _id, ...rest }`).
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Generated output — do not lint.
    'coverage/**',
  ]),
]);

export default eslintConfig;
