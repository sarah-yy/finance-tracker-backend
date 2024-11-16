import stylisticTs from "@stylistic/eslint-plugin-ts";
import tsParser from "@typescript-eslint/parser";

export default [{
  files: ["src/**/*.ts"],
  languageOptions: {
    ecmaVersion: "latest",
    parser: tsParser,
  },
  plugins: {
    "@stylistic/ts": stylisticTs,
  },
  rules: {
    "@stylistic/ts/comma-dangle": [
      "warn",
      "always-multiline",
    ],
    "@stylistic/ts/block-spacing": "warn",
    "@stylistic/ts/brace-style": "warn",
    "@stylistic/ts/comma-spacing": ["warn", { "before": false, "after": true }],
    "@stylistic/ts/quotes": ["warn", "double"],
    "@stylistic/ts/semi": ["warn", "always", {
      "omitLastInOneLineBlock": true,
    }],
    "@stylistic/ts/space-before-blocks": "warn",
    "@stylistic/ts/space-before-function-paren": ["warn", {
      "anonymous": "never",
      "named": "never",
      "asyncArrow": "always",
    }],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    camelcase: "off",
    "default-case": "error",
    "no-dupe-args": "error",
    "no-unused-vars": "error",
  }
}];