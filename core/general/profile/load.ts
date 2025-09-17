import { loadDescriptor } from "../descriptor/load.ts"
import { cache } from "./cache.ts"
import type { ProfileType } from "./registry.ts"
import { validateProfile } from "./validate.ts"

// TODO: Narrow return type to valid JSON Schema

export async function loadProfile(
  path: string,
  options?: { type?: ProfileType },
) {
  let profile = cache.get(path)

  if (!profile) {
    const descriptor = await loadDescriptor(path, { onlyRemote: true })
    const result = await validateProfile({
      descriptor,
      path,
      type: options?.type,
    })

    if (!result.profile) {
      throw new Error(`Profile at path ${path} is invalid`)
    }

    profile = result.profile
    cache.set(path, profile)
  }

  return profile
}
