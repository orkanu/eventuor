module.exports = {
  preset: 'ts-jest',
  verbose: true,
  testRegex: 'src/.*\\.spec.(js|jsx|ts|tsx)$',
  coverageDirectory: 'test/coverage',
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    }
  }
};
