import type { Field } from "../field/index.ts"
import type { Metadata } from "../general/index.ts"
import type { ForeignKey } from "./ForeignKey.ts"

/**
 * Table Schema definition
 * Based on the specification at https://datapackage.org/standard/table-schema/
 */
export interface Schema extends Metadata {
  /**
   * URL of profile (optional)
   */
  $schema?: string

  /**
   * Name of schema (optional)
   */
  name?: string

  /**
   * Title of schema (optional)
   */
  title?: string

  /**
   * Description of schema (optional)
   */
  description?: string

  /**
   * Fields in this schema (required)
   */
  fields: Field[]

  /**
   * Field matching rule (optional)
   * Default: "exact"
   */
  fieldsMatch?: "exact" | "equal" | "subset" | "superset" | "partial"

  /**
   * Values representing missing data (optional)
   * Default: [""]
   * Can be a simple array of strings or an array of {value, label} objects
   * where label provides context for why the data is missing
   */
  missingValues?: (string | { value: string; label: string })[]

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
  foreignKeys?: ForeignKey[]
}
