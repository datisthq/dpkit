import QuickLRU from "quick-lru"
import type { JsonSchema } from "./JsonSchema.ts"

export const jsonSchemaCache = new QuickLRU<string, JsonSchema>({
  maxSize: 100,
})
