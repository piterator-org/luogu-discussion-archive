const { join } = require("node:path");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "next/core-web-vitals",
    "airbnb",
    "plugin:react/jsx-runtime",
    "plugin:prettier/recommended",
  ],
  settings: { next: { rootDir: __dirname } },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      extends: [
        "airbnb-typescript",
        "plugin:@typescript-eslint/recommended-type-checked",
        "plugin:@typescript-eslint/stylistic-type-checked",
        "plugin:prettier/recommended",
      ],
      settings: {
        "import/resolver": {
          typescript: { project: join(__dirname, "tsconfig.json") },
        },
      },
      parserOptions: {
        project: "tsconfig.json",
        tsconfigRootDir: __dirname,
      },
      rules: {
        "no-underscore-dangle": ["error", { allow: ["_count"] }],
      },
    },
    {
      files: ["route.ts", "route.tsx"],
      rules: { "import/prefer-default-export": "off" },
    },
    {
      files: ["*.config.*", ".*rc.*"],
      rules: {
        "import/no-extraneous-dependencies": [
          "error",
          { devDependencies: true },
        ],
      },
    },
  ],
};
