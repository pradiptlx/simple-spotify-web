const path = require("path");

module.exports = {
  displayName: "client",
  rootDir: path.join(__dirname, "../.."),
  moduleDirectories: [
    "node_modules",
    path.join(__dirname, ".."),
    __dirname,
  ],
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
};
