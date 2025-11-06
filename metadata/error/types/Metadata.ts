import type { BaseError } from "./Base.ts"

/**
 * A descriptor error
 */
export interface MetadataError extends BaseError {
  type: "metadata"
  pointer: string
  message: string
}
