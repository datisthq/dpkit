import { createServer } from "node:http"
import { RPCHandler } from "@orpc/server/node"
import { logger } from "./logger.ts"
import { router } from "./router.ts"
import * as settings from "./settings.ts"

const handler = new RPCHandler(router)

const server = createServer(async (req, res) => {
  const result = await handler.handle(req, res, {
    context: { headers: req.headers },
  })

  if (!result.matched) {
    res.statusCode = 404
    res.end()
  }
})

server.listen(settings.PORT, () =>
  logger.info(`Listening on port ${settings.PORT}`),
)
