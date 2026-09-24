const path = require('path');

module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/../testing'],
  moduleDirectories: ['node_modules', path.resolve(__dirname, 'node_modules')],
  modulePaths: [path.resolve(__dirname, 'node_modules')],
  testMatch: [
    '**/*.test.js',
    '**/*.spec.js'
  ],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
};
