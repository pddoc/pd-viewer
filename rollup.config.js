import { nodeResolve } from "@rollup/plugin-node-resolve";
// import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
// import copy from "rollup-plugin-copy";

export default {
  input: "./index.js",
  output: {
    exports: "auto",
    file: "./dist/index.js",
    format: "es",
    name: "pdf-viewer",
  },
  plugins: [
    // commonjs(),
    nodeResolve({
      preferBuiltins: true,
    }),
    terser(),
    // copy({ targets: [{ src: "pdfjs/*", dest: "dist/pdfjs" }] }),
  ],
};
