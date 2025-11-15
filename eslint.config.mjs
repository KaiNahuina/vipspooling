import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Ignore build artifacts and auto generated code
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "amplify/**",
      "src/graphql/**",
      "src/models/**",
      "src/aws-exports.js",
    ],
  },

  // Base config from next
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    rules: {
      // Relaxed rules for now to remove most warnings
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",

      // Generated API and GraphQL cause many of these
      "@typescript-eslint/no-explicit-any": "off",

      // Helps avoid hook dependency spam
      "react-hooks/exhaustive-deps": "off",

      // Allow ts-ignore while transitioning code
      "@typescript-eslint/ban-ts-comment": "off",

      // Disable prop types rule (common in TS projects)
      "react/prop-types": "off",
    },
  },
];
