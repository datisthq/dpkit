import { Ajv } from "ajv"
import type { Descriptor } from "./Descriptor.js"
import { validateDescriptor } from "./validate.js"

/**
 * Validate a descriptor (JSON Object) against a JSON Schema
 * It uses Ajv for JSON Schema validation under the hood
 * It returns a list of errors (empty if valid)
 *
 * @throws {Ajv.ValidationError} if `props.orThrow` and the descriptor is invalid
 */
export async function assertDescriptor<T extends Descriptor>(props: {
  descriptor: Descriptor
  defaultProfile: Descriptor
}) {
  const errors = await validateDescriptor(props)

  if (errors.length) {
    throw new Ajv.ValidationError(errors)
  }

  return props.descriptor as T
}
