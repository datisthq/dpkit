import { defineConfig, externalizeDepsPlugin } from "electron-vite"

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
  },
})
