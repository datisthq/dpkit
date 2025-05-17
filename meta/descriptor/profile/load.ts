import QuickLRU from "quick-lru"
import type { Descriptor } from "../Descriptor.js"
import { loadDescriptor } from "../load.js"
import { profileRegistry } from "./registry.js"

export async function loadProfile(props: { path: string }) {
  const { path } = props

  const profile =
    cache.get(path) ?? (await loadDescriptor({ path, onlyRemote: true }))

  cache.set(path, profile)
  return profile
}

const cache = new QuickLRU<string, Descriptor>({ maxSize: 100 })
for (const { path, profile } of Object.values(profileRegistry)) {
  cache.set(path, profile)
}
