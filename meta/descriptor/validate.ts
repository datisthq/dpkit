import { Ajv } from "ajv"
import type { Descriptor } from "./Descriptor.js"
import { loadDescriptor } from "./load.js"

/**
 * Validate a descriptor (JSON Object) against a JSON Schema
 * It uses Ajv for JSON Schema validation under the hood
 * It returns a list of errors (empty if valid)
 *
 * @throws {Ajv.ValidationError} if `props.orThrow` and the descriptor is invalid
 */
export async function validateDescriptor(props: {
  descriptor: Descriptor
  profile: Descriptor
  orThrow?: boolean
}) {
  const { descriptor, profile } = props

  const ajv = new Ajv({
    strict: false,
    loadSchema: path => loadDescriptor({ path, remoteOnly: true }),
  })

  const validate = await ajv.compileAsync(profile)
  validate(descriptor)

  if (props.orThrow) {
    if (validate.errors) {
      throw new Ajv.ValidationError(validate.errors)
    }
  }

  return validate.errors ?? []
}
