import type { ErrorObject } from "ajv"

/**
 * A descriptor error
 */
export interface DescriptorError extends ErrorObject {
  type: "descriptor"
}

/**
 * Thrown when a descriptor assertion fails
 */
export class AssertionError extends Error {
  readonly errors: DescriptorError[]

  constructor(errors: DescriptorError[]) {
    super("Assertion failed")
    this.errors = errors
  }
}
