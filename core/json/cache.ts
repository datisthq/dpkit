import QuickLRU from "quick-lru"
import type { JsonSchema } from "./JsonSchema.ts"

export const cache = new QuickLRU<string, JsonSchema>({
  maxSize: 100,
})
