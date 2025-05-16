import { Ajv } from "ajv"
import type { Descriptor } from "./Descriptor.js"
import type { DescriptorError } from "./Error.js"
import { loadDescriptor } from "./load.js"

/**
 * Validate a descriptor (JSON Object) against a JSON Schema
 * It uses Ajv for JSON Schema validation under the hood
 * It returns a list of errors (empty if valid)
 */
export async function validateDescriptor(props: {
  descriptor: Descriptor
  defaultProfile: Descriptor
}) {
  const { descriptor, defaultProfile } = props

  const ajv = new Ajv({
    loadSchema,
    strict: false,
    validateFormats: false,
  })

  const profile = descriptor.$schema
    ? await loadSchema(descriptor.$schema)
    : defaultProfile

  const validate = await ajv.compileAsync(profile)
  const valid = validate(descriptor)

  const errors: DescriptorError[] = validate.errors
    ? validate.errors?.map(error => ({ ...error, type: "descriptor" }))
    : []

  return { valid, errors }
}

async function loadSchema(path: string) {
  const descriptor = await loadDescriptor({ path, secure: true })
  return descriptor
}
