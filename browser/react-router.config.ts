import type { Config } from "@react-router/dev/config"

// TODO: Rebase on DPKIT_MODE = 'app/site'?
export default {
  ssr: !process.env.SPA,
  buildDirectory: !process.env.SPA ? "build/ssr" : "build/spa",
} satisfies Config
