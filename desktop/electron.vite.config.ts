import { defineConfig, externalizeDepsPlugin } from "electron-vite"

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: { entry: "desktop/main.ts" },
      outDir: "build/main",
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: { entry: "desktop/preload.ts" },
      outDir: "build/preload",
    },
  },
  renderer: {
    root: "node_modules/@dpkit/website/build/spa/client",
    build: {
      outDir: "build/renderer",
      rollupOptions: {
        input: {
          index: "node_modules/@dpkit/website/build/spa/client/index.html",
        },
      },
    },
  },
})
