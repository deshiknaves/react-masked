const path = require('path')

module.exports = {
  rootDir: path.join(__dirname, '..'),
  transform: {
    '^.+\\.(js|jsx)': 'babel-jest',
  },
  moduleDirectories: [
    'node_modules',
    path.join(__dirname, '../src'),
    'shared',
    __dirname,
    path.join(__dirname, '..'),
  ],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
  },
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
    'jest-watch-select-projects',
  ],
}
