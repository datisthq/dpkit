import { createServer } from "@dpkit/service/server"
import * as settings from "#settings.ts"

createServer({
  start: true,
  origin: undefined, // use default
  prefix: settings.API_PREFIX,
})
