import { loadDescriptor } from "../descriptor/load.js"
import { cache } from "./cache.js"
import type { ProfileType } from "./registry.js"
import { validateProfile } from "./validate.js"

export async function loadProfile(path: string, options?: { type?: ProfileType }) {
  let profile = cache.get(path)

  if (!profile) {
    const descriptor = await loadDescriptor(path, { onlyRemote: true })
    const result = await validateProfile({ descriptor, path, type: options?.type })

    if (!result.profile) {
      throw new Error(`Profile at path ${path} is invalid`)
    }

    profile = result.profile
    cache.set(path, profile)
  }

  return profile
}
