import type { Config } from "@react-router/dev/config"

export default {
  appDirectory: "routes",
  ssr: true,
  future: {
    unstable_viteEnvironmentApi: true,
  },
} satisfies Config
