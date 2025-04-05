import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import prettierPlugin from 'eslint-plugin-prettier';

export default defineConfig([
  // Base JS + TS recommended configs
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Custom config block
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Prettier formatting as ESLint errors
      'prettier/prettier': 'error',

      // General ESLint rules
      'no-console': 'off',
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      // TS rules override
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]);
