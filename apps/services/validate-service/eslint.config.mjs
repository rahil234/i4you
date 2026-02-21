import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import parser from '@typescript-eslint/parser';
import globals from 'globals';
import prettierPlugin from 'eslint-plugin-prettier';

export default defineConfig([
  // Base JS + TS recommended configs
  js.configs.recommended,
  ...tseslint.configs.recommended, // Custom config block
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
      parser: parser,
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Prettier formatting as ESLint errors
      'prettier/prettier': 'warn',

      // General ESLint rules
      'no-console': 'off',
      quotes: ['error', 'single'],
      semi: ['error', 'always'],

      // TS rules override
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
    ignores: ['node_modules/', 'dist/', 'build/'],
  },
]);
