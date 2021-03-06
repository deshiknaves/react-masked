const path = require('path')

module.exports = {
  rootDir: path.join(__dirname, '..'),
  displayName: 'lint',
  runner: 'jest-runner-eslint',
  testMatch: ['<rootDir>/**/*.(js|jsx|ts|tsx)'],
  testPathIgnorePatterns: ['/node_modules/', '/coverage/', '/dist/', '/other/'],
}
