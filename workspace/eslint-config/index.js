module.exports = [
  {
    ignores: ['**/*.js', '**/*.d.ts', '**/*.d.ts.map'],
  },
  require('@eslint/js').configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    rules: require('@typescript-eslint/eslint-plugin').configs.recommended.rules,
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      globals: {
        __dirname: true,
      },
    },
  },
  {
    plugins: {
      'simple-import-sort': require('eslint-plugin-simple-import-sort'),
      import: require('eslint-plugin-import'),
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
    },
  },
  {
    plugins: {
      'no-only-tests': require('eslint-plugin-no-only-tests'),
    },
    rules: {
      'no-only-tests/no-only-tests': 'error',
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  require('eslint-config-prettier'),
];
