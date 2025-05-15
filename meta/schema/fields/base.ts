/**
 * Base field properties common to all field types
 */
export interface BaseField<T = BaseConstraints> {
  /**
   * Name of the field matching the column name
   */
  name: string

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
   * URI for semantic type (RDF)
   */
  rdfType?: string

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
