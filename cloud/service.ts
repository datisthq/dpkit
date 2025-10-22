import type { Client } from "@dpkit/service"
import { createORPCClient } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import * as settings from "#settings.ts"

export const service: Client = createORPCClient(
  new RPCLink({
    url: import.meta.env.PROD
      ? new URL("/api", settings.URL).toString()
      : "/api",
  }),
)
