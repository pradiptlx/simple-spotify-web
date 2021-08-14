const path = require("path");

module.exports = {
  rootDir: path.join(__dirname, ".."),
  moduleDirectories: [
    "node_modules",
    path.join(__dirname, "../src"),
    __dirname,
  ],
  collectCoverageFrom: [
    "**/src/**/*.+(ts|tsx)",
    "!**/__tests__/**",
    "!**/node_modules/**",
  ],
  projects: ["./src/test/jest.lint.js"],
  moduleNameMapper: {
    "\\.module\\.css$": "identity-obj-proxy",
    "\\.css$": require.resolve("./src/test/style-mock.js"),
  },
  watchPlugins: ["jest-runner-eslint/watch-fix"],
};
