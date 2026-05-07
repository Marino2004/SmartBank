export default {
  "no-warning-comments": ["warn", {
    terms: ["TODO", "FIXME", "HACK", "XXX", "TEMP", "REFACTOR"],
    location: "start",
  }],
  "no-unused-vars": ["error", { vars: "all", args: "after-used", ignoreRestSiblings: true }],
  "no-empty": ["error", { allowEmptyCatch: false }],
  "no-useless-return": "warn",
  "no-else-return": "warn",
  "no-nested-ternary": "warn",
  "no-magic-numbers": ["warn", {
    ignore: [-1, 0, 1, 2, 100],
    ignoreArrayIndexes: true,
    ignoreDefaultValues: true,
    enforceConst: true,
  }],
  "no-console": ["warn", { allow: ["warn", "error"] }],
  "no-eval": "error",
  "id-length": ["warn", { min: 2, exceptions: ["i", "j", "k", "x", "y", "z", "_"] }],
};