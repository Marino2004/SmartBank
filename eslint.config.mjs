import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import rules from "./eslint/index.js";   // ← une seule import

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
]);