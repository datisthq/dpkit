import * as http from "node:http"
import { OpenAPIGenerator } from "@orpc/openapi"
import { OpenAPIHandler } from "@orpc/openapi/node"
import type { Router } from "@orpc/server"
import { CORSPlugin } from "@orpc/server/plugins"
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4"
import type { Logger } from "tslog"
import { router } from "./router.ts"
import { logger } from "./services/logger.ts"
import * as settings from "./settings.ts"

export function createServer(options?: {
  start?: boolean
  router?: Router<any, any>
  logger?: Logger<any>
  origin?: string
  prefix?: `/${string}`
  corsMethods?: string[]
  withDocumentation?: boolean
}) {
  const config = {
    start: options?.start ?? settings.START,
    router: options?.router ?? router,
    logger: options?.logger ?? logger,
    origin: options?.origin ?? settings.ORIGIN,
    prefix: options?.prefix ?? settings.PREFIX,
    corsMethods: options?.corsMethods ?? settings.CORS_METHODS,
    withDocumentation:
      options?.withDocumentation ?? settings.WITH_DOCUMENTATION,
  }

  const url = new URL(config.prefix, config.origin)
  const port = url.port ?? (url.protocol === "https:" ? 443 : 80)
  const version = config.prefix.match(/v(\d+)/)?.[1] ?? "1"

  const openAPIHandler = new OpenAPIHandler(config.router, {
    plugins: [
      new CORSPlugin({
        allowMethods: config.corsMethods,
        exposeHeaders: ["Content-Disposition"],
      }),
    ],
  })

  const openAPIGenerator = new OpenAPIGenerator({
    schemaConverters: [new ZodToJsonSchemaConverter()],
  })

  const server = http.createServer(async (req, res) => {
    try {
      if (req.url === "/") {
        // Handle health checks
        res.writeHead(200)
        res.end()
      } else if (req.url === config.prefix) {
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
      } else if (req.url === `${config.prefix}/spec.json`) {
        const spec = await openAPIGenerator.generate(config.router, {
          info: {
            title: "dpkit Service",
            version,
          },
          servers: [{ url: url.toString() }],
        })

        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(JSON.stringify(spec))
        return
      } else {
        const { matched } = await openAPIHandler.handle(req, res, {
          prefix: config.prefix,
        })

        if (!matched) {
          res.writeHead(404)
          res.end()
        }
      }
    } catch (error: any) {
      logger.error(error)

      res.writeHead(500)
      res.end()
    } finally {
      logger.info(`[${req.method}] ${req.url} → ${res.statusCode}`)
    }
  })

  if (config.start) {
    server.listen(port, () => {
      logger.info(`Listening on ${url.toString()}`)
    })
  }

  return server
}
