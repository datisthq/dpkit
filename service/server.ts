import * as http from "node:http"
import { OpenAPIGenerator } from "@orpc/openapi"
import { OpenAPIHandler } from "@orpc/openapi/node"
import type { Router } from "@orpc/server"
import { CORSPlugin } from "@orpc/server/plugins"
import { ZodSmartCoercionPlugin, ZodToJsonSchemaConverter } from "@orpc/zod"
import metadata from "./package.json" with { type: "json" }
import * as settings from "./settings.ts"

export function createServer(
  router: Router<any, any>,
  options: {
    protocol: "http" | "https"
    host: string
    port: number
    prefix: `/${string}`
    withCors: boolean
    withSpec: boolean
  },
) {
  const url = new URL(
    options.prefix,
    `${options.protocol}://${options.host}:${options.port}`,
  )

  const openAPIHandler = new OpenAPIHandler(router, {
    plugins: [
      new ZodSmartCoercionPlugin(),
      new CORSPlugin({
        allowMethods: options.withCors ? settings.CORS_METHODS : [],
      }),
    ],
  })

  const openAPIGenerator = new OpenAPIGenerator({
    schemaConverters: [new ZodToJsonSchemaConverter()],
  })

  return http.createServer(async (req, res) => {
    const { matched } = await openAPIHandler.handle(req, res, {
      prefix: options.prefix,
    })

    if (matched) {
      return
    }

    if (req.url === "/spec.json") {
      const spec = await openAPIGenerator.generate(router, {
        info: {
          title: "dpkit Service",
          version: metadata.version,
        },
        servers: [{ url: url.toString() }],
        security: [{ bearerAuth: [] }],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
            },
          },
        },
      })

      res.writeHead(200, { "Content-Type": "application/json" })
      res.end(JSON.stringify(spec))
      return
    }

    const html = `
    <!doctype html>
    <html>
      <head>
        <title>dpkit Service</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="https://dpkit/favicon.png" />
      </head>
      <body>
        <div id="root"></div>

        <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
        <script>
          Scalar.createApiReference('#root', {
            url: '/spec.json',
            authentication: {
              securitySchemes: {
                bearerAuth: {
                  token: 'default-token',
                },
              },
            },
          })
        </script>
      </body>
    </html>
  `

    res.writeHead(200, { "Content-Type": "text/html" })
    res.end(html)
  })
}
