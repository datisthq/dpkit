//import { randomUUID } from "node:crypto"
import { Container, getContainer } from "@cloudflare/containers"
import { createRequestHandler } from "react-router"

export interface Env {
  RPC: DurableObjectNamespace<Rpc>
}

export class Rpc extends Container {
  defaultPort = 8080
  //sleepAfter = import.meta.env.PROD ? "0h" : "1h"
  sleepAfter = import.meta.env.PROD ? "1h" : "1h"
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

    if (path === "/rpc") {
      //const name = import.meta.env.PROD ? randomUUID() : "dev"
      const name = import.meta.env.PROD ? "dev" : "dev"
      const containerInstance = getContainer(env.RPC, name)
      return containerInstance.fetch(request)
    }

    return requestHandler(request, {
      cloudflare: { env, ctx },
    })
  },
} satisfies ExportedHandler<Env>
