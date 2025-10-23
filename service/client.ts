import { createORPCClient } from "@orpc/client"
import type { ContractRouterClient } from "@orpc/contract"
import type { ContractRouter } from "@orpc/contract"
import type { JsonifiedClient } from "@orpc/openapi-client"
import { OpenAPILink } from "@orpc/openapi-client/fetch"
import type { Logger } from "tslog"
import { contract } from "./contract.ts"
import { logger } from "./logger.ts"
import * as settings from "./settings.ts"

export function createClient(options?: {
  contract?: ContractRouter<any>
  logger?: Logger<any>
  origin?: string
  prefix?: `/${string}`
}) {
  const config = {
    contract: options?.contract ?? contract,
    logger: options?.logger ?? logger,
    origin: options?.origin ?? settings.ORIGIN,
    prefix: options?.prefix ?? settings.PREFIX,
  }

  const url = new URL(config.prefix, config.origin)

  const client: JsonifiedClient<ContractRouterClient<typeof contract>> =
    createORPCClient(new OpenAPILink(config.contract, { url }))

  return client
}
