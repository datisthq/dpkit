//import { Container, getContainer } from "@cloudflare/containers"
import { createRequestHandler } from "react-router"
import * as settings from "#settings.ts"

// https://github.com/cloudflare/containers/issues/101
//
//export interface Env {
//  API: DurableObjectNamespace<API>
//}

//export class API extends Container {
//  defaultPort = 8080
//  sleepAfter = "1h"
//}

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
  async fetch(req, env, ctx) {
    const path = new URL(req.url).pathname

    if (path.startsWith(settings.API_PREFIX)) {
      //const containerInstance = getContainer(env.API, settings.API_PREFIX)
      //return await containerInstance.containerFetch(req)

      const clientUrl = new URL(req.url)
      const serverUrl = new URL(
        import.meta.env.PROD
          ? settings.API_ORIGIN_PROD
          : settings.API_ORIGIN_DEV,
      )

      serverUrl.pathname = clientUrl.pathname
      serverUrl.search = clientUrl.search
      serverUrl.hash = clientUrl.hash

      return await fetch(serverUrl, req)
    }

    return await requestHandler(req, {
      cloudflare: { env, ctx },
    })
  },
} satisfies ExportedHandler<Env>
