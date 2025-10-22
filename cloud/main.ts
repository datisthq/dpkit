import { Container, getContainer } from "@cloudflare/containers"
import { createRequestHandler } from "react-router"
import * as settings from "#settings.ts"

export interface Env {
  API: DurableObjectNamespace<API>
}

export class API extends Container {
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

    if (path.startsWith(settings.API_PREFIX)) {
      const containerInstance = getContainer(env.API, settings.API_PREFIX)
      return await containerInstance.containerFetch(request)
    }

    return await requestHandler(request, {
      cloudflare: { env, ctx },
    })
  },
} satisfies ExportedHandler<Env>
