import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
  },
  {
    ignores: ["build/", "vite.config.js", "coverage/"],
  },
  { languageOptions: { globals: globals.browser } },
  {
    settings: {
      react: {
        // workaround for eslint-plugin-react compat with eslint 10
        // change to 'detect' for auto-detection of react version after eslint-plugin-react will support eslint 10+
        version: "19.2",
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  {
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      ...pluginReactHooks.configs.recommended.rules,
    },
  },
];
