const path = require('path');

module.exports = {
  root: true,
  env: { browser: true, node: true, jest: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: true,
    tsconfigRootDir: __dirname,
  },
  globals: { React: true, NodeJS: true },
  plugins: [
    '@typescript-eslint',
    'react',
    'jest',
    'jest-dom',
    'testing-library',
    'import',
    'prettier',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/strict',
    'plugin:react/recommended',
    'plugin:jest/recommended',
    'plugin:jest-dom/recommended',
    'plugin:testing-library/react',
    'plugin:import/recommended',
    'plugin:prettier/recommended',
    'plugin:@next/next/recommended',
    'prettier',
  ],
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
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: path.resolve(__dirname, './tsconfig.json'),
      },
    },
    react: { version: 'detect' },
  },
};
