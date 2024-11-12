import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import json from "@rollup/plugin-json";
import css from "rollup-plugin-import-css";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      sourcemap: true,
      exports: "auto"
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      extensions: [".js", ".jsx"],
      preferBuiltins: false
    }),
    babel({
      exclude: "node_modules/**",
      presets: ["@babel/preset-react"],
      babelHelpers: "bundled",
      extensions: [".js", ".jsx"]
    }),
    commonjs({
      include: /node_modules/,
      ignoreGlobal: true,
      strictRequires: true,
      transformMixedEsModules: true
    }),
    postcss({
      extract: true, // This will extract the CSS to a separate file
      minimize: true // Optionally minimize the CSS
    }),
    json(),
    css()
  ],
  external: ["guidance-sim", "guidance-replay", "crypto"]
};
