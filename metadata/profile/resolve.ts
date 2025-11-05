import type { Profile } from "./Profile.ts"
import { loadProfile } from "./load.ts"

export async function resolveProfile(profile: Profile | string) {
  if (typeof profile !== "string") {
    return profile
  }

  return await loadProfile(profile)
}
