import { loadDescriptor } from "../descriptor/index.ts"
import { cache } from "./cache.ts"
import type { ProfileType } from "./Profile.ts"
import { assertProfile } from "./assert.ts"

export async function loadProfile(
  path: string,
  options?: { type?: ProfileType },
) {
  let profile = cache.get(path)

  if (!profile) {
    const descriptor = await loadDescriptor(path, { onlyRemote: true })
    profile = await assertProfile(descriptor, { path, type: options?.type })
    cache.set(path, profile)
  }

  return profile
}
