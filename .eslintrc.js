module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "plugin:react/recommended",
    "airbnb",
    "eslint-config-prettier",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:jest/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: [
    "react",
    "@typescript-eslint",
    "@typescript-eslint/eslint-plugin",
    "prettier",
    "jest",
  ],
  rules: {
    "react/jsx-filename-extension": ["warn", { extensions: [".tsx"] }],
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["error"],
    "@typescript-eslint/no-var-requires": "off",
    "import/extensions": ["off"],
    "react/prop-types": "off",
  },
  overrides: [
    {
      files: "**/*/.+(ts|tsx)",
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    {
      files: ["**/*.test.js"],
      env: {
        jest: true,
      },
      plugins: ["jest"],
      rules: {
        "jest/no-disabled-tests": "warn",
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/prefer-to-have-length": "warn",
        "jest/valid-expect": "error",
      },
    },
  ],
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
};
