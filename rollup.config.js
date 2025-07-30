// rollup.config.js
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
  input: {
    index: "src/index.ts",
    "models/account": "src/models/account.ts",
    "scripts/_setup": "src/scripts/_setup.ts",
    "scripts/init_accounts": "src/scripts/init_accounts.ts",
    "scripts/init_psql_extensions": "src/scripts/init_psql_extensions.ts",
  },
  output: {
    dir: "build",
    format: "esm",
    entryFileNames: "[name].mjs"
  },
  plugins: [
    typescript(),
    terser({
      format: {
        comments: "some",
        beautify: true,
        ecma: "2022",
        indent_level: 2,
      },
      compress: false,
      mangle: false,
      module: true,
    }),
  ],
  external: [
    "cors",
    "express",
    "jsonwebtoken",
    "bcryptjs",
    "validate-ts-obj",
    "dotenv",
    "pg",
  ],
};