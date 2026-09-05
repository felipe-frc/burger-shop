import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",

      include: ["scripts/**/*.js"],

      exclude: ["node_modules/**", "dist/**", "coverage/**", "tests/**"],

      reporter: ["text", "json-summary", "lcov"],

      thresholds: {
        statements: 75,
        branches: 55,
        functions: 80,
        lines: 75,
      },
    },
  },
});
