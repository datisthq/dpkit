import QuickLRU from "quick-lru"
import type { Descriptor } from "../Descriptor.js"
import { profileRegistry } from "./registry.js"

export const cache = new QuickLRU<string, Descriptor>({ maxSize: 100 })
for (const { path, profile } of Object.values(profileRegistry)) {
  cache.set(path, profile)
}
