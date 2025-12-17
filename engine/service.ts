import { createORPCClient } from "@orpc/client"
import type { ContractRouterClient } from "@orpc/contract"
import type { ContractRouter } from "@orpc/contract"
import type { JsonifiedClient } from "@orpc/openapi-client"
import { OpenAPILink } from "@orpc/openapi-client/fetch"
import type { Logger } from "tslog"
import { contract } from "./contract.ts"
import { logger } from "./services/logger.ts"
import * as settings from "./settings.ts"

export function createEngineService(options?: {
  contract?: ContractRouter<any>
  logger?: Logger<any>
  url?: string
}) {
  const config = {
    contract: options?.contract ?? contract,
    logger: options?.logger ?? logger,
    url: options?.url ?? settings.URL,
  }

  const client: JsonifiedClient<ContractRouterClient<typeof contract>> =
    createORPCClient(new OpenAPILink(config.contract, { url: config.url }))

  return client
}
