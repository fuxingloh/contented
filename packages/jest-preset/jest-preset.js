module.exports = {
  roots: ['<rootDir>'],
  verbose: true,
  modulePathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/dist'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testRegex: '.*\\.unit\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'esbuild-jest',
  },
  preset: 'ts-jest',
  reporters: ['default', 'github-actions'],
  transformIgnorePatterns: [],
  setupFilesAfterEnv: ['jest-extended/all'],
};
