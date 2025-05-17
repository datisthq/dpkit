import { loadDescriptor } from "../load.js"
import { cache } from "./cache.js"
import type { ProfileType } from "./registry.js"
import { validateProfile } from "./validate.js"

export async function loadProfile(props: { path: string; type?: ProfileType }) {
  const { path, type } = props

  let profile = cache.get(path)

  if (!profile) {
    const descriptor = await loadDescriptor({ path, onlyRemote: true })
    const result = await validateProfile({ descriptor, path, type })
    profile = result.profile
    cache.set(path, profile)
  }

  return profile
}
