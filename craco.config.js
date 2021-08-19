module.exports = {
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  jest: {
    babel: {
      addPresets: true /* (default value) */,
      addPlugins: true /* (default value) */,
    },
    configure: {
      collectCoverageFrom: [
        "**/src/**/*.+(ts|tsx)",
        "!**/__tests__/**",
        "!**/node_modules/**",
      ],
      moduleNameMapper: {
        "\\.module\\.css$": "identity-obj-proxy",
        "\\.css$": require.resolve("./src/test/style-mock.js"),
      },
    },
  },
};
