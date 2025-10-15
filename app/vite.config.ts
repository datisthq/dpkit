import { cloudflare } from "@cloudflare/vite-plugin"
import { reactRouter } from "@react-router/dev/vite"
import { defineConfig } from "vite"

export default defineConfig({
  assetsInclude: ["**/*.md"],
  plugins: [
    // @ts-ignore
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    // @ts-ignore
    reactRouter(),
  ],
  resolve: {
    alias: [{ find: "@dpkit/app", replacement: import.meta.dirname }],
  },
})
