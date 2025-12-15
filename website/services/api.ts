import { createClient } from "@dpkit/service/client"

export const api = createClient({
  url: import.meta.env.VITE_API_URL,
})
