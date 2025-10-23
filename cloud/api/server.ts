import { createServer } from "@dpkit/service/server"
import * as settings from "#settings.ts"

createServer({
  start: true,
  prefix: settings.API_PREFIX,
  origin:
    process.env.NODE_ENV === "production"
      ? settings.API_ORIGIN_PROD
      : settings.API_ORIGIN_DEV,
})
