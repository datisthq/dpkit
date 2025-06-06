import type { Descriptor } from "../descriptor/Descriptor.js"
import type { Profile } from "./Profile.js"
import { ajv } from "./ajv.js"
import type { ProfileType } from "./registry.js"
import { profileRegistry } from "./registry.js"

export async function validateProfile(
  descriptor: Descriptor,
  options?: {
    path?: string
    type?: ProfileType
  },
) {
  const errors: { message: string }[] = []

  await ajv.validateSchema(descriptor)
  for (const error of ajv.errors ?? []) {
    errors.push({ message: error.message ?? error.keyword })
  }

  if (!checkProfileType(descriptor, options)) {
    errors.push({
      message: `Profile at ${options?.path} is not a valid ${options?.type} profile`,
    })
  }

  return {
    errors,
    valid: !errors.length,
    profile: !errors.length ? (descriptor as Profile) : undefined,
  }
}

function checkProfileType(
  descriptor: Descriptor,
  options?: {
    path?: string
    type?: ProfileType
  },
) {
  if (!options?.path || !options?.type) {
    return true
  }

  // This type official profiles
  const typeProfiles = Object.values(profileRegistry).filter(
    profile => profile.type === options.type,
  )

  for (const typeProfile of typeProfiles) {
    // The profile itself is from the official registry
    if (options.path === typeProfile.path) return true

    // The profile extends one of the official profiles
    if (Array.isArray(descriptor.allOf)) {
      for (const ref of Object.values(descriptor.allOf)) {
        if (ref === typeProfile.path) return true
      }
    }
  }

  return false
}
