/**
 * Foreign key definition for Table Schema
 * Based on the specification at https://datapackage.org/standard/table-schema/#foreign-keys
 */
export interface ForeignKey {
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
}
