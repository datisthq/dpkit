import { createEngineService } from "@dpkit/engine"

export const engine = createEngineService({
  url: import.meta.env.VITE_API_URL,
})
