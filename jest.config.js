module.exports = {
  collectCoverageFrom: [
    "**/src/**/*.+(ts|tsx)",
    "!**/__tests__/**",
    "!**/node_modules/**",
  ],
  projects: ["./src/test/jest.dom.js", "./src/test/jest.lint.js"],
  moduleNameMapper: {
    "\\.module\\.css$": "identity-obj-proxy",
    "\\.css$": require.resolve("./src/test/style-mock.js"),
  },
  watchPlugins: [
    "jest-runner-eslint/watch-fix",
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
    "jest-watch-select-projects",
  ],
};
