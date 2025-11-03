import type { Descriptor } from "../descriptor/index.ts"
import type { Profile } from "./Profile.ts"
import type { ProfileType } from "./Profile.ts"
import { ajv } from "./ajv.ts"
import { profileRegistry } from "./registry.ts"

// TODO: It should narrow to JSON Schema

export async function assertProfile(
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

  // TODO: Improve consolidated error message
  if (errors.length) {
    throw new Error(`Profile at path ${options?.path} is invalid`)
  }

  return descriptor as Profile
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
