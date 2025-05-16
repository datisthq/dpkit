import type { Dialect } from "../../dialect/Dialect.js"
import type { Resource } from "../../resource/Resource.js"
import type { Schema } from "../../schema/Schema.js"

/**
 * Check if a resource is a Table Resource and narrow the type
 */
export function isTableResource(resource: Resource): resource is TableResource {
  return resource.type === "table"
}

/**
 * Table Resource interface extending the base Resource interface
 * @see https://datapackage.org/standard/table-resource/
 */
export interface TableResource extends Resource {
  /**
   * Resource type must be "table"
   */
  type: "table"

  /**
   * Inline tabular data
   */
  data: any[][] | Record<string, any>[]

  /**
   * CSV dialect specification
   * Describes delimiters, quote characters, etc.
   * @see https://datapackage.org/standard/table-dialect/
   */
  dialect?: string | Dialect

  /**
   * Schema for the tabular data
   * Describes fields in the table, constraints, etc.
   * @see https://datapackage.org/standard/table-schema/
   */
  schema: string | Schema
}
