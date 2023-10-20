module.exports = {
  plugins: ['simple-import-sort', 'check-file', 'unused-imports', 'no-only-tests'],
  extends: ['airbnb-base', 'airbnb-typescript/base', 'prettier'],
  ignorePatterns: ['dist', 'node_modules'],
  rules: {
    'class-methods-use-this': 'off',
    'max-classes-per-file': 'off',
    'no-use-before-define': 'off',
    'no-console': 'error',

    // https://github.com/airbnb/javascript/issues/1271
    'no-restricted-syntax': 'off',

    'no-await-in-loop': 'off',

    // import
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',

    // simple-import-sort
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    /**
     * Enforce PascalCase for filenames.
     */
    'check-file/filename-naming-convention': [
      'error',
      {
        'src/**/*.{js,jsx,tsx,ts}': 'PASCAL_CASE',
      },
      {
        ignoreMiddleExtensions: true,
      },
    ],

    '@typescript-eslint/no-throw-literal': 'warn',

    '@typescript-eslint/no-floating-promises': 'error',
    'no-void': [
      'error',
      {
        allowAsStatement: true,
      },
    ],

    // @typescript-eslint
    '@typescript-eslint/no-use-before-define': 'off',

    /**
     * Separates out the `no-unused-vars` rule depending on it being an import statement in the AST and providing
     * an auto-fix rule to remove the nodes if they are imports.
     * With this, we can now target test files with `'unused-imports/no-unused-vars': 'off'` for testing DX.
     */
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': 'error',

    /**
     * Do not use ambiguous identifiers like `id`, use context identifiers like `userId` or `postId` instead.
     * Please do not ignore this rule completely, for scenarios where you need to use `id` as a variable name,
     * use `// eslint-disable-next-line no-restricted-properties` to disable this rule for that line.
     */
    'no-restricted-properties': [
      'error',
      {
        property: 'id',
        message:
          'Do not use ambiguous identifiers like `id`, use context identifiers like `userId` or `postId` instead.',
      },
    ],

    /**
     * disallow .only to be used in tests
     */
    'no-only-tests/no-only-tests': 'error',
  },
  env: {
    node: true,
    jest: true,
  },
  overrides: [
    {
      files: ['**/*.unit.ts', '**/*.i9n.ts', '**/*.e2e.ts'],
      rules: {
        /**
         * To cater for complex test scenarios, where we need to scope blocks. This allows variables to be reused,
         * so we don't have to create `const getObject` and `const updatedObject` for each scenario.
         * We can just use `const object`.
         */
        'no-lone-blocks': 'off',

        /**
         * Separates out the `no-unused-vars` rule depending on it being an import statement in the AST and providing
         * an auto-fix rule to remove the nodes if they are imports.
         * With this, we can now target test files with `'unused-imports/no-unused-vars': 'off'` for testing DX.
         */
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': 'off',
      },
    },
    {
      /**
       * Enforce PascalCase for filenames, ignoring common files like `index.ts`, `cli.ts`, `main.ts`.
       */
      files: ['**/{index,cli}.ts'],
      rules: {
        'check-file/filename-naming-convention': ['off'],
      },
    },
  ],
};
