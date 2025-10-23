import "client-only"
import { createClient } from "@dpkit/service/client"
import * as settings from "#settings.ts"

export const api = createClient({
  origin: import.meta.env.PROD ? settings.URL : undefined, // use default in dev
  prefix: settings.API_PREFIX,
})
