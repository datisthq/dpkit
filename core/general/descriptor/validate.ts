import type { MetadataError } from "../Error.ts"
import { ajv } from "../profile/ajv.ts"
import type { Descriptor } from "./Descriptor.ts"

/**
 * Validate a descriptor (JSON Object) against a JSON Schema
 * It uses Ajv for JSON Schema validation under the hood
 * It returns a list of errors (empty if valid)
 */
export async function validateDescriptor(
  descriptor: Descriptor,
  options: {
    profile: Descriptor
  },
) {
  const validate = await ajv.compileAsync(options.profile)
  const valid = validate(descriptor)

  const errors: MetadataError[] = validate.errors
    ? validate.errors?.map(error => ({ ...error, type: "metadata" }))
    : []

  return { valid, errors }
}
