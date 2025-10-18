import { Container, getContainer } from "@cloudflare/containers"
import { createRequestHandler } from "react-router"

export interface Env {
  RPC: DurableObjectNamespace<Rpc>
}

export class Rpc extends Container {
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

    if (path.startsWith("/rpc")) {
      const containerInstance = getContainer(env.RPC, path)
      return containerInstance.fetch(request)
    }

    return requestHandler(request, {
      cloudflare: { env, ctx },
    })
  },
} satisfies ExportedHandler<Env>
