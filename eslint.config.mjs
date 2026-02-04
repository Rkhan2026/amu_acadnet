import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,

  {
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },

  globalIgnores([
    // Next.js defaults
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",

    // Tooling / deps
    "node_modules/**",
    "coverage/**",

    // Custom
    ".kiro/**",
  ]),
]);
