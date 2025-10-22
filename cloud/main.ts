import { Container, getContainer } from "@cloudflare/containers"
import { createRequestHandler } from "react-router"

export interface Env {
  SERVICE: DurableObjectNamespace<Service>
}

export class Service extends Container {
  defaultPort = 8080
  sleepAfter = "1h"
}

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env
      ctx: ExecutionContext
    }
  }
}

const requestHandler = createRequestHandler(
  // @ts-ignore
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
)

export default {
  async fetch(request, env, ctx) {
    const path = new URL(request.url).pathname

    if (path.startsWith("/api")) {
      const containerInstance = getContainer(env.SERVICE, path)
      return await containerInstance.fetch(request)
    }

    return await requestHandler(request, {
      cloudflare: { env, ctx },
    })
  },
} satisfies ExportedHandler<Env>
