import type { Metadata } from "../../metadata/index.ts"

/**
 * Base field properties common to all field types
 */
export interface BaseField<T = BaseConstraints> extends Metadata {
  /**
   * Name of the field matching the column name
   */
  name: string

  /**
   * Field format -- optional addition to the type
   */
  format?: string

  /**
   * Human-readable title
   */
  title?: string

  /**
   * Human-readable description
   */
  description?: string

  /**
   * Example value for this field
   */
  example?: any

  /**
   * Examples for this field
   */
  examples?: any[]

  /**
   * URI for semantic type (RDF)
   */
  rdfType?: string

  /**
   * Values representing missing data for this field
   * Can be a simple array of strings or an array of {value, label} objects
   * where label provides context for why the data is missing
   */
  missingValues?: (string | { value: string; label: string })[]

  /**
   * Validation constraints applied to values
   */
  constraints?: T
}

/**
 * Base constraints that can be applied to any field type
 */
export interface BaseConstraints {
  /**
   * Indicates if field is allowed to be null/empty
   */
  required?: boolean

  /**
   * Indicates if values must be unique within the column
   */
  unique?: boolean
}
