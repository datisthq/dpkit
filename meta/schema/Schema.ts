import type { Field } from "./Field.js"

/**
 * Table Schema definition
 * Based on the specification at https://datapackage.org/standard/table-schema/
 */
export interface Schema {
  /**
   * Fields in this schema (required)
   */
  fields: Field[]

  /**
   * URL of schema (optional)
   */
  $schema?: string

  /**
   * Field matching rule (optional)
   * Default: "exact"
   */
  fieldsMatch?: "exact" | "equal" | "subset" | "superset" | "partial"

  /**
   * Values representing missing data (optional)
   * Default: [""]
   */
  missingValues?: string[]

  /**
   * Fields uniquely identifying each row (optional)
   */
  primaryKey?: string[]

  /**
   * Field combinations that must be unique (optional)
   */
  uniqueKeys?: string[][]

  /**
   * Foreign key relationships (optional)
   */
  foreignKeys?: {
    /**
     * Source field(s) in this schema
     */
    fields: string[]

    /**
     * Reference to fields in another resource
     */
    reference: {
      /**
       * Target resource name (optional)
       */
      resource?: string

      /**
       * Target field(s) in the referenced resource
       */
      fields: string[]
    }
  }[]
}
