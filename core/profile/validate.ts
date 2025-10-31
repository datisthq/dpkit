import type { Descriptor } from "../descriptor/index.ts"
import type { MetadataError } from "../error/index.ts"
import { ajv } from "../profile/ajv.ts"
import type { Profile } from "./Profile.ts"
import { loadProfile } from "./load.ts"

/**
 * Validate a descriptor (JSON Object) against a JSON Schema
 * It uses Ajv for JSON Schema validation under the hood
 * It returns a list of errors (empty if valid)
 */
export async function validateDescriptor(
  descriptor: Descriptor,
  options: {
    profile: Profile | string
  },
) {
  const profile =
    typeof options.profile === "string"
      ? await loadProfile(options.profile)
      : options.profile

  const validate = await ajv.compileAsync(profile)
  const valid = validate(descriptor)

  const errors: MetadataError[] = validate.errors
    ? validate.errors?.map(error => ({ ...error, type: "metadata" }))
    : []

  return { valid, errors }
}
