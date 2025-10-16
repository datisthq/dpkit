import { cloudflare } from "@cloudflare/vite-plugin"
import { reactRouter } from "@react-router/dev/vite"
import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"

export default defineConfig({
  assetsInclude: ["**/*.md"],
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    reactRouter(),
    svgr(),
  ],
  resolve: {
    alias: [{ find: "@dpkit/app", replacement: import.meta.dirname }],
  },
})
