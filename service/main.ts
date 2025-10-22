import { logger } from "./logger.ts"
import { createServer } from "./server.ts"
import * as settings from "./settings.ts"

const server = createServer({
  protocol: settings.PROTOCOL,
  host: settings.HOST,
  port: settings.PORT,
  prefix: settings.PREFIX,
  corsMethods: settings.CORS_METHODS,
  withDocumentation: true,
})

server.listen(settings.PORT, () =>
  logger.info(`Listening on port ${settings.PORT}`),
)
