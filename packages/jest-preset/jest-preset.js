const preset = require('@stickyjs/jest/jest-preset');

module.exports = {
  ...preset,
  moduleNameMapper: {
    '(.+)\\.js': '$1',
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'esbuild-jest',
  },
  transformIgnorePatterns: [],
};
