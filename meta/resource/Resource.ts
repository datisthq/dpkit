import type { License } from "./License.js"
import type { Source } from "./Source.js"

/**
 * Data Resource interface based on the Frictionless Data specification
 * @see https://datapackage.org/standard/data-resource/
 */
export interface Resource {
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
  data?: unknown

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
}
