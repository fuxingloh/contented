module.exports = {
  moduleFileExtensions: ['ts', 'js', 'json'],
  testRegex: '.*\\.(unit|i9n|e2e)\\.ts$',
  preset: 'ts-jest',
  reporters: ['default', 'github-actions'],
  moduleNameMapper: {
    '(.+)\\.js': '$1',
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'esbuild-jest',
  },
  transformIgnorePatterns: [],
};
