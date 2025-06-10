import type { ErrorObject } from "ajv"

/**
 * A descriptor error
 */
export interface MetadataError extends ErrorObject {
  type: "metadata"
}

/**
 * Thrown when a descriptor assertion fails
 */
export class AssertionError extends Error {
  readonly errors: MetadataError[]

  constructor(errors: MetadataError[]) {
    super("Assertion failed")
    this.errors = errors
  }
}
