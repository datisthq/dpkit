import * as http from "node:http"
import { OpenAPIGenerator } from "@orpc/openapi"
import { OpenAPIHandler } from "@orpc/openapi/node"
import type { Router } from "@orpc/server"
import { CORSPlugin } from "@orpc/server/plugins"
import { ZodSmartCoercionPlugin, ZodToJsonSchemaConverter } from "@orpc/zod"
import type { Logger } from "tslog"
import { logger } from "./logger.ts"
import metadata from "./package.json" with { type: "json" }
import { router } from "./router.ts"
import * as settings from "./settings.ts"

export function createServer(options?: {
  start?: boolean
  router?: Router<any, any>
  logger?: Logger<any>
  protocol?: "http" | "https"
  host?: string
  port?: number
  prefix?: `/${string}`
  corsMethods?: string[]
  withDocumentation?: boolean
}) {
  const config = {
    start: options?.start ?? settings.START,
    router: options?.router ?? router,
    logger: options?.logger ?? logger,
    protocol: options?.protocol ?? settings.PROTOCOL,
    host: options?.host ?? settings.HOST,
    port: options?.port ?? settings.PORT,
    prefix: options?.prefix ?? settings.PREFIX,
    corsMethods: options?.corsMethods ?? settings.CORS_METHODS,
    withDocumentation:
      options?.withDocumentation ?? settings.WITH_DOCUMENTATION,
  }

  const url = new URL(
    config.prefix,
    `${config.protocol}://${config.host}:${config.port}`,
  )

  const openAPIHandler = new OpenAPIHandler(config.router, {
    plugins: [
      new CORSPlugin({ allowMethods: config.corsMethods }),
      new ZodSmartCoercionPlugin(),
    ],
  })

  const openAPIGenerator = new OpenAPIGenerator({
    schemaConverters: [new ZodToJsonSchemaConverter()],
  })

  const server = http.createServer(async (req, res) => {
    console.log(req.url)

    const { matched } = await openAPIHandler.handle(req, res, {
      prefix: config.prefix,
    })

    if (matched) {
      return
    }

    if (req.url === `${config.prefix}/spec.json`) {
      const spec = await openAPIGenerator.generate(config.router, {
        info: {
          title: "dpkit Service",
          version: metadata.version,
        },
        servers: [{ url: url.toString() }],
        security: [{ bearerAuth: [] }],
      })

      res.writeHead(200, { "Content-Type": "application/json" })
      res.end(JSON.stringify(spec))
      return
    }

    if (req.url === config.prefix) {
      const html = `
      <!doctype html>
      <html>
        <head>
          <title>dpkit Service</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" type="image/png" href="https://dpkit.dev/favicon.png" />
        </head>
        <body>
          <div id="root"></div>
          <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
          <script>
            Scalar.createApiReference('#root', {
              url: '${config.prefix}/spec.json',
            })
          </script>
        </body>
      </html>
    `

      res.writeHead(200, { "Content-Type": "text/html" })
      res.end(html)
      return
    }

    res.writeHead(404)
    res.end()
  })

  if (config.start) {
    server.listen(config.port, () =>
      logger.info(`Listening on ${url.toString()}`),
    )
  }

  return server
}
