import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import importPlugin from 'eslint-plugin-import';
import jest from 'eslint-plugin-jest';
import jestDom from 'eslint-plugin-jest-dom';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import testingLibrary from 'eslint-plugin-testing-library';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['.next/', 'next-env.d.ts', 'public/', '.swc/', 'node_modules/'],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.strict,
  react.configs.flat.recommended,
  jest.configs['flat/recommended'],
  jestDom.configs['flat/recommended'],
  testingLibrary.configs['flat/react'],
  importPlugin.flatConfigs.recommended,
  prettierRecommended,
  {
    plugins: { '@next/next': nextPlugin },
    rules: nextPlugin.configs.recommended.rules,
  },
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node, ...globals.jest, React: true, NodeJS: true },
      parserOptions: { project: true, tsconfigRootDir: import.meta.dirname },
    },
    settings: {
      'import/resolver': {
        typescript: { alwaysTryTypes: true, project: './tsconfig.json' },
      },
      react: { version: 'detect' },
    },
    rules: {
      'prettier/prettier': ['error', { printWidth: 100 }],
      'import/order': [
        'error',
        { groups: ['builtin', 'external', 'internal'], alphabetize: { order: 'asc' } },
      ],
      'no-restricted-imports': ['warn', { patterns: ['../../*'] }],
      'react/react-in-jsx-scope': 'off',
      'testing-library/no-container': 'warn',
      'testing-library/no-node-access': 'warn',
      '@typescript-eslint/promise-function-async': 'error',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
