import { lingui } from "@lingui/vite-plugin"
import { reactRouter } from "@react-router/dev/vite"
import { defineConfig, externalizeDepsPlugin } from "electron-vite"
import babel from "vite-plugin-babel"
import svgr from "vite-plugin-svgr"

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: { entry: "desktop/main.ts" },
      outDir: "desktop/build",
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: { entry: "desktop/preload.ts" },
      outDir: "desktop/build",
    },
  },
  renderer: {
    root: import.meta.dirname,
    plugins: [
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
  },
})
