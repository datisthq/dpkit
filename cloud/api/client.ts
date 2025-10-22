import "client-only"
import type { Client } from "@dpkit/service"
import { createORPCClient } from "@orpc/client"
import { createORPCClient, onError } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import type { ContractRouterClient } from "@orpc/contract"
import type { JsonifiedClient } from "@orpc/openapi-client"
import { OpenAPILink } from "@orpc/openapi-client/fetch"
import * as settings from "#settings.ts"

export const api: Client = createORPCClient(
  new RPCLink({
    url: import.meta.env.PROD
      ? new URL("/api", settings.URL).toString()
      : "/api",
  }),
)

const link = new OpenAPILink(contract, {
  url: "http://localhost:3000/api",
  headers: () => ({
    "x-api-key": "my-api-key",
  }),
  fetch: (request, init) => {
    return globalThis.fetch(request, {
      ...init,
      credentials: "include", // Include cookies for cross-origin requests
    })
  },
  interceptors: [
    onError(error => {
      console.error(error)
    }),
  ],
})

const client: JsonifiedClient<ContractRouterClient<typeof contract>> =
  createORPCClient(link)
