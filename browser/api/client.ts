import { createClient } from "@dpkit/service/browser"
import * as settings from "#settings.ts"

export const api = createClient({
  prefix: settings.API_PREFIX,
  origin: globalThis.location?.origin,
})
