import { cloudflare } from "@cloudflare/vite-plugin"
import { lingui } from "@lingui/vite-plugin"
import { reactRouter } from "@react-router/dev/vite"
import { defineConfig } from "vite"
import babel from "vite-plugin-babel"
import devtoolsJson from "vite-plugin-devtools-json"
import svgr from "vite-plugin-svgr"

export default defineConfig({
  assetsInclude: ["**/*.md"],
  plugins: [
    // @ts-ignore
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    devtoolsJson(),
    {
      // @ts-ignore
      ...babel({
        filter: /\.(ts|tsx)$/,
        babelConfig: {
          presets: ["@babel/preset-typescript"],
          plugins: ["babel-plugin-macros", "@lingui/babel-plugin-lingui-macro"],
        },
      }),
      apply: "build",
    },
    lingui(),
    reactRouter(),
    svgr(),
  ],
  resolve: {
    alias: [{ find: "@dpkit/browser", replacement: import.meta.dirname }],
  },
})
