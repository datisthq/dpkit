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
  contract: ContractRouter<any>
  logger?: Logger<any>
  protocol?: "http" | "https"
  host?: string
  port?: number
  prefix?: `/${string}`
}) {
  const config = {
    contract: options?.contract ?? contract,
    logger: options?.logger ?? logger,
    protocol: options?.protocol ?? settings.PROTOCOL,
    host: options?.host ?? settings.HOST,
    port: options?.port ?? settings.PORT,
    prefix: options?.prefix ?? settings.PREFIX,
  }

  const url = new URL(
    config.prefix,
    `${config.protocol}://${config.host}:${config.port}`,
  )

  const link = new OpenAPILink(config.contract, {
    url,
  })

  const client: JsonifiedClient<ContractRouterClient<typeof contract>> =
    createORPCClient(link)

  return client
}
