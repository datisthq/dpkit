import { loadDescriptor } from "../descriptor/index.ts"
import { cache } from "./cache.ts"
import type { ProfileType } from "./Profile.ts"
import { inspectProfile } from "./inspect.ts"

export async function loadProfile(
  path: string,
  options?: { type?: ProfileType },
) {
  let profile = cache.get(path)

  if (!profile) {
    const descriptor = await loadDescriptor(path, { onlyRemote: true })
    const errors = await inspectProfile(descriptor, { path, type: options?.type })

    if (errors.length) {
      throw new Error(`Profile at path ${path} is invalid`)
    }

    profile = descriptor
    cache.set(path, descriptor)
  }

  return profile
}
