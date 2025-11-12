import type { Config } from "@react-router/dev/config"

export default {
  ssr: !process.env.SPA,
  buildDirectory: !process.env.SPA ? "build/ssr" : "build/spa",
} satisfies Config
