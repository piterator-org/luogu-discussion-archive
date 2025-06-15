// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

/**
 * @param {string} dirname
 */
export const config = (dirname) =>
  tseslint.config(
    { ignores: ["**/dist/"] },
    eslint.configs.recommended,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    {
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir: dirname,
        },
      },
      rules: {
        "@typescript-eslint/consistent-type-imports": "error",
      },
    },
    {
      files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
      extends: [tseslint.configs.disableTypeChecked],
    },
    {
      files: ["**/*.cjs"],
      languageOptions: {
        sourceType: "commonjs",
      },
    },
  );
