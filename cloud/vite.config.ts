import { cloudflare } from "@cloudflare/vite-plugin"
import { reactRouter } from "@react-router/dev/vite"
import { defineConfig } from "vite"
import devtoolsJson from "vite-plugin-devtools-json"
import svgr from "vite-plugin-svgr"

export default defineConfig({
  assetsInclude: ["**/*.md"],
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    devtoolsJson(),
    reactRouter(),
    svgr(),
  ],
  resolve: {
    alias: [{ find: "@dpkit/cloud", replacement: import.meta.dirname }],
  },
})
