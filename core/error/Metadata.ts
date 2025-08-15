import type { ErrorObject } from "ajv"

/**
 * A descriptor error
 */
export interface MetadataError extends ErrorObject {
  type: "metadata"
}
