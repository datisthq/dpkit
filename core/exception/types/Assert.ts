import type { MetadataError } from "../../error/index.ts"

/**
 * Thrown when a descriptor assertion fails
 */
export class AssertException extends Error {
  readonly errors: MetadataError[]

  constructor(errors: MetadataError[]) {
    super("Assertion failed")
    this.errors = errors
  }
}
