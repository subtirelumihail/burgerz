import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import jsxA11y from "eslint-plugin-jsx-a11y";

function promoteA11yRulesToError(rules) {
  return Object.fromEntries(
    Object.entries(rules).map(([ruleName, ruleConfig]) => {
      if (ruleConfig === "off") {
        return [ruleName, "off"];
      }

      if (Array.isArray(ruleConfig)) {
        return [ruleName, ["error", ...ruleConfig.slice(1)]];
      }

      return [ruleName, "error"];
    }),
  );
}

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{jsx,tsx}"],
    rules: {
      ...promoteA11yRulesToError(jsxA11y.flatConfigs.recommended.rules),
      "jsx-a11y/alt-text": ["error", { elements: ["img"], img: ["Image"] }],
      "jsx-a11y/no-noninteractive-tabindex": [
        "error",
        {
          roles: ["group", "tabpanel"],
        },
      ],
    },
  },
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "public/mockServiceWorker.js",
    "pa11y-ci.config.cjs",
  ]),
]);

export default eslintConfig;
