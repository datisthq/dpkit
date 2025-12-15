import { lingui } from "@lingui/vite-plugin"
import { reactRouter } from "@react-router/dev/vite"
import { defineConfig } from "vite"
import babel from "vite-plugin-babel"
import devtoolsJson from "vite-plugin-devtools-json"
import svgr from "vite-plugin-svgr"

export default defineConfig({
  plugins: [
    devtoolsJson(),
    reactRouter(),
    // @ts-ignore
    babel({
      filter: /\.tsx?$/u,
      babelConfig: {
        presets: ["@babel/preset-typescript"],
        plugins: ["@lingui/babel-plugin-lingui-macro"],
      },
    }),
    lingui(),
    svgr(),
  ],
})
