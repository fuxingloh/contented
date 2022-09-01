const preset = require('@birthdayresearch/sticky-jest/jest-preset');

module.exports = {
  ...preset,
  moduleNameMapper: {
    "(.+)\\.js": "$1"
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'esbuild-jest',
  },
  transformIgnorePatterns: []
};
