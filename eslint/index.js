import complexity from "./rules/complexity.js";
import techDebt from "./rules/tech-debt.js";
import testability from "./rules/testability.js";

export default {
  ...complexity,
  ...techDebt,
  ...testability,
};