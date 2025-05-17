import { Ajv } from "ajv"
import type { Descriptor } from "../Descriptor.js"
import type { Profile } from "./Profile.js"
import type { ProfileType } from "./registry.js"
import { profileRegistry } from "./registry.js"

type ValidateProps = {
  descriptor: Descriptor
  path?: string
  type?: ProfileType
}

export async function validateProfile(props: ValidateProps) {
  const errors: { message: string }[] = []

  const ajv = new Ajv({
    strict: false,
    validateFormats: false,
  })

  await ajv.validateSchema(props.descriptor)
  for (const error of ajv.errors ?? []) {
    errors.push({ message: error.message ?? error.keyword })
  }

  if (!checkProfileType(props)) {
    errors.push({
      message: `Profile at ${props.path} is not a valid ${props.type} profile`,
    })
  }

  return {
    errors,
    valid: !errors.length,
    profile: props.descriptor as Profile,
  }
}

function checkProfileType(props: ValidateProps) {
  if (!props.path || !props.type) {
    return true
  }

  // This type official profiles
  const typeProfiles = Object.values(profileRegistry).filter(
    profile => profile.type === props.type,
  )

  for (const typeProfile of typeProfiles) {
    // The profile itself is from the official registry
    if (props.path === typeProfile.path) return true

    // The profile extends one of the official profiles
    if (Array.isArray(props.descriptor.allOf)) {
      for (const ref of Object.values(props.descriptor.allOf)) {
        if (ref === typeProfile.path) return true
      }
    }
  }

  return false
}
