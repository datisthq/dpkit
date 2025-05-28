import type { Dialect } from "../dialect/Dialect.js"
import type { Metadata } from "../general/index.js"
import type { Schema } from "../schema/Schema.js"
import type { License } from "./License.js"
import type { Source } from "./Source.js"

/**
 * Data Resource interface built on top of the Data Package standard and Polars DataFrames
 * @see https://datapackage.org/standard/data-resource/
 */
export interface Resource extends Metadata {
  /**
   * Unique resource identifier
   * Should use lowercase alphanumeric characters, periods, hyphens, and underscores
   */
  name: string

  /**
   * A reference to the data itself, can be a path URL or array of paths
   * Either path or data must be provided
   */
  path?: string | string[]

  /**
   * Inline data content instead of referencing an external file
   * Either path or data must be provided
   */
  data?: unknown | unknown[][] | Record<string, unknown>[]

  /**
   * The resource type
   * @example "table"
   */
  type?: "table"

  /**
   * The file format
   * @example "csv", "json", "xlsx"
   */
  format?: string

  /**
   * The media type of the resource
   * @example "text/csv", "application/json"
   */
  mediatype?: string

  /**
   * Character encoding of the resource
   * @default "utf-8"
   */
  encoding?: string

  /**
   * Human-readable title
   */
  title?: string

  /**
   * A description of the resource
   */
  description?: string

  /**
   * Size of the file in bytes
   */
  bytes?: number

  /**
   * Hash of the resource data
   */
  hash?: string

  /**
   * Data sources
   */
  sources?: Source[]

  /**
   * License information
   */
  licenses?: License[]

  /**
   * Table dialect specification
   * Describes delimiters, quote characters, etc.
   * @see https://datapackage.org/standard/table-dialect/
   */
  dialect?: string | Dialect

  /**
   * Schema for the tabular data
   * Describes fields in the table, constraints, etc.
   * @see https://datapackage.org/standard/table-schema/
   */
  schema?: string | Schema
}
