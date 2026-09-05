import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "coverage/**",
      "test-results/**",
      "playwright-report/**",
      "output.css",
    ],
  },

  js.configs.recommended,

  {
    files: ["scripts/**/*.js"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",

      globals: {
        ...globals.browser,
        Toastify: "readonly",
      },
    },

    rules: {
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],

      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },

  {
    files: ["tests/**/*.js"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",

      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    rules: {
      "no-console": "off",
    },
  },

  {
    files: ["*.config.js", "playwright.config.js", "vite.config.js"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",

      globals: {
        ...globals.node,
      },
    },
  },
];
