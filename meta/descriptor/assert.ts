import type { Descriptor } from "./Descriptor.js"
import type { DescriptorError } from "./Error.js"
import { validateDescriptor } from "./validate.js"

/**
 * Validate a descriptor (JSON Object) against a JSON Schema
 * It uses Ajv for JSON Schema validation under the hood
 * It returns a list of errors (empty if valid)
 *
 * @throws {AssertionError} if validation fails
 */
export async function assertDescriptor<T extends Descriptor>(props: {
  descriptor: Descriptor
  defaultProfile: Descriptor
}) {
  const { valid, errors } = await validateDescriptor(props)

  if (!valid) {
    throw new AssertionError(errors)
  }

  return props.descriptor as T
}

export class AssertionError extends Error {
  readonly errors: DescriptorError[]

  constructor(errors: DescriptorError[]) {
    super("Assertion failed")
    this.errors = errors
  }
}
