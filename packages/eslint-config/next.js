// @ts-check

import { FlatCompat } from "@eslint/eslintrc";

import { config as baseConfig } from "./base.js";

/**
 * @param {string} dirname
 * */
export const config = (dirname) => [
  { ignores: ["**/.next/"] },
  ...new FlatCompat({ baseDirectory: dirname }).extends("next/core-web-vitals"),
  ...baseConfig(dirname),
];
