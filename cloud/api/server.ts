import { createServer } from "@dpkit/service/server"
import * as settings from "#settings.ts"

createServer({
  start: true,
  prefix: settings.API_PREFIX,
  origin: settings.API_ORIGIN_INTERNAL,
})
