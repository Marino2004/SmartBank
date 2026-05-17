import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import rules from "./eslint/index.js";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules,
  },
  {
    files: ["tests/**"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      "no-magic-numbers": "off",
      "max-lines-per-function": "off",
      "id-length": "off",
    },
  },
]);
