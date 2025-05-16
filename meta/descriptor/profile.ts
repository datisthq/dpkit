import QuickLRU from "quick-lru"
import type { Descriptor } from "./Descriptor.js"
import { loadRemoteDescriptor } from "./load.js"
import { profiles } from "./profiles/index.js"

export async function loadProfile(props: { path: string }) {
  const { path } = props

  const profile = cache.get(path) ?? (await loadRemoteDescriptor({ path }))
  cache.set(path, profile)

  return profile
}

const cache = new QuickLRU<string, Descriptor>({ maxSize: 100 })
for (const [path, profile] of Object.entries(profiles)) {
  cache.set(path, profile)
}
