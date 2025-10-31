import QuickLRU from "quick-lru"
import type { Profile } from "./Profile.ts"
import { profileRegistry } from "./registry.ts"

export const cache = new QuickLRU<string, Profile>({ maxSize: 100 })
for (const { path, profile } of Object.values(profileRegistry)) {
  cache.set(path, profile)
}
