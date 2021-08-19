const path = require("path");

module.exports = {
  displayName: "lint",
  rootDir: path.join(__dirname, "../.."),
  moduleDirectories: ["node_modules", path.join(__dirname, ".."), __dirname],
  runner: "jest-runner-eslint",
  testMatch: ["<rootDir>/**/*.+(ts|tsx)"],
  watchPlugins: ["jest-runner-eslint/watch-fix"],
};
