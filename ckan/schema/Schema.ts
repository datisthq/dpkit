import type { CkanField } from "./Field.js"

/**
 * CKAN Schema interface
 */
export interface CkanSchema {
  /**
   * List of fields
   */
  fields: CkanField[]
}
