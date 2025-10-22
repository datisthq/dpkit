import "client-only"
import { createClient } from "@dpkit/service/client"
import * as settings from "#settings.ts"

export const api = createClient({
  protocol: import.meta.env.PROD ? "https" : "http",
  host: import.meta.env.PROD ? settings.URL : "localhost",
  port: import.meta.env.PROD ? 80 : 4000,
})
