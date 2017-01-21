process.env.NODE_ENV = 'test';

require('dotenv').config({ silent: true });

const { existsSync } = require('fs');
const { resolve } = require('path');
const jest = require('jest');
const paths = require('./config/paths');

const argv = process.argv.slice(2);

// Watch unless on CI
if (!process.env.CI) {
  argv.push('--watch');
}

const setupTestsFile = existsSync(paths.testsSetup)
  ? '<rootDir>/src/setupTests.js' : undefined;

argv.push('--config', JSON.stringify({
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  setupFiles: [resolve(__dirname, 'config', 'polyfills.js')],
  setupTestFrameworkScriptFile: setupTestsFile,
  testPathIgnorePatterns: [
    '<rootDir>[/\\\\](build|docs|node_modules|scripts|public|views)[/\\\\]',
  ],
  testEnvironment: 'jsdom', // [jsdom, node]
  testURL: 'http://localhost',
  transform: {
    '^.+\\.(js|jsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.css$': resolve(__dirname, 'config/jest/cssTransform.js'),
    '^(?!.*\\.(js|jsx|css|json)$)': resolve(__dirname, 'config/jest/fileTransform.js'),
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'
  ],
}));

jest.run(argv);
