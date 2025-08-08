import QuickLRU from "quick-lru"
import type { Descriptor } from "../descriptor/Descriptor.ts"
import { profileRegistry } from "./registry.ts"

export const cache = new QuickLRU<string, Descriptor>({ maxSize: 100 })
for (const { path, profile } of Object.values(profileRegistry)) {
  cache.set(path, profile)
}
