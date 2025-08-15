import type { MetadataError } from "./Metadata.ts"

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
