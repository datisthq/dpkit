import { createClient } from "@dpkit/engine/client"

export const api = createClient({
  url: import.meta.env.VITE_API_URL,
})
