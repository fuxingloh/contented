const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  {
    ignores: ['**/*.js', '**/*.d.ts', '**/*.d.ts.map'],
  },
  require('@eslint/js').configs.recommended,
  ...tseslint.configs.recommended,
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
);
