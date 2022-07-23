module.exports = {
  plugins: ['simple-import-sort'],
  extends: ['airbnb-base', 'airbnb-typescript/base', 'prettier'],
  ignorePatterns: ['dist'],
  rules: {
    'class-methods-use-this': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'no-console': 'error',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/no-default-export': 'error',
  },
  env: {
    node: true,
    jest: true,
  },
};
