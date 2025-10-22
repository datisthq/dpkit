import * as http from "node:http"
import { OpenAPIGenerator } from "@orpc/openapi"
import { OpenAPIHandler } from "@orpc/openapi/node"
import { CORSPlugin } from "@orpc/server/plugins"
import { ZodSmartCoercionPlugin, ZodToJsonSchemaConverter } from "@orpc/zod"
import metadata from "./package.json" with { type: "json" }
import { router } from "./router.ts"

export function createServer(options: {
  protocol: "http" | "https"
  host: string
  port: number
  prefix: `/${string}`
  corsMethods: string[]
  withDocumentation: boolean
}) {
  const url = new URL(
    options.prefix,
    `${options.protocol}://${options.host}:${options.port}`,
  )

  const openAPIHandler = new OpenAPIHandler(router, {
    plugins: [
      new CORSPlugin({ allowMethods: options.corsMethods }),
      new ZodSmartCoercionPlugin(),
    ],
  })

  const openAPIGenerator = new OpenAPIGenerator({
    schemaConverters: [new ZodToJsonSchemaConverter()],
  })

  return http.createServer(async (req, res) => {
    console.log(req.url)

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
      })

      res.writeHead(200, { "Content-Type": "application/json" })
      res.end(JSON.stringify(spec))
      return
    }

    if (req.url === "/") {
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
              url: '/spec.json',
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
}
