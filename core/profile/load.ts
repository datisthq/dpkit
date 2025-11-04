import { loadJsonSchema } from "../json/index.ts"
import type { ProfileType } from "./Profile.ts"
import { assertProfile } from "./assert.ts"
import { profileRegistry } from "./registry.ts"

export async function loadProfile(
  path: string,
  options?: { type?: ProfileType },
) {
  const profile = profileRegistry.find(profile => profile.path === path)?.profile
  if (profile) {
    return profile
  }

  const jsonSchema = await loadJsonSchema(path, { onlyRemote: true })
  return await assertProfile(jsonSchema, { path, type: options?.type })
}
