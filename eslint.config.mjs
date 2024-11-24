import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginJest from 'eslint-plugin-jest';
import pluginJestDom from 'eslint-plugin-jest-dom';
import pluginTest from 'eslint-plugin-testing-library';
import pluginPrettier from 'eslint-plugin-prettier/recommended';
import configPrettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginJest.configs['flat/recommended'],
  pluginJestDom.configs['flat/recommended'],
  pluginTest.configs['flat/react'],
  pluginPrettier,
  configPrettier,
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/promise-function-async': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/consistent-type-assertions': 'warn',
      '@typescript-eslint/naming-convention': 'warn',
    },
  },
];
