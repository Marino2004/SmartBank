/* eslint-disable no-magic-numbers */

export default {
  complexity: ["warn", 10],
  "max-depth": ["warn", 4],
  "max-statements": ["warn", 20],
  "max-params": ["warn", 4],
  "max-lines-per-function": ["warn", { max: 50, skipComments: true, skipBlankLines: true }],
  "max-lines": ["warn", { max: 300, skipComments: true, skipBlankLines: true }],
  "max-nested-callbacks": ["warn", 3],
};