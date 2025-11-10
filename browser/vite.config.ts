import { cloudflare } from "@cloudflare/vite-plugin"
import { lingui } from "@lingui/vite-plugin"
import { reactRouter } from "@react-router/dev/vite"
import { defineConfig } from "vite"
import macrosPlugin from "vite-plugin-babel-macros"
import devtoolsJson from "vite-plugin-devtools-json"
import svgr from "vite-plugin-svgr"

export default defineConfig({
  assetsInclude: ["**/*.md"],
  plugins: [
    // @ts-ignore
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    devtoolsJson(),
    macrosPlugin(),
    lingui(),
    reactRouter(),
    svgr(),
  ],
  resolve: {
    alias: [{ find: "@dpkit/browser", replacement: import.meta.dirname }],
  },
})
