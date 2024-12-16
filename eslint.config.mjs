import globals from 'globals';
import pluginJs from '@eslint/js';
import { configs as tseslint } from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginJest from 'eslint-plugin-jest';
import pluginJestDom from 'eslint-plugin-jest-dom';
import pluginTest from 'eslint-plugin-testing-library';
import pluginPrettier from 'eslint-plugin-prettier/recommended';
import configPrettier from 'eslint-config-prettier';
import pluginImport from 'eslint-plugin-import';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  ...tseslint.strict,
  ...tseslint.recommended,
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginJest.configs['flat/recommended'],
  pluginJestDom.configs['flat/recommended'],
  pluginTest.configs['flat/react'],
  pluginPrettier,
  configPrettier,
  pluginImport.flatConfigs.recommended,
  {
    rules: {
      'import/order': [
        'error',
        { groups: ['builtin', 'external', 'internal'] },
      ],
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/promise-function-async': 'error',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-restricted-imports': ['error', { patterns: ['..*'] }],
    },
    languageOptions: {
      parserOptions: { project: true, tsconfigRootDir: import.meta.dirname },
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
      'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    },
  },
];
