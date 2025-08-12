import type { CkanField } from "./Field.ts"

/**
 * CKAN Schema interface
 */
export interface CkanSchema {
  /**
   * List of fields
   */
  fields: CkanField[]
}
