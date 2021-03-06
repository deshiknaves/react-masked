module.exports = {
  ...require('./test/jest.common'),
  collectCoverageFrom: [
    '**/src/**/*.(js|jsx|ts|tsx)',
    '!**/*.test.(js|jsx|ts|tsx)',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  projects: ['./test/jest.lint.js', './test/jest.client.js'],
}
