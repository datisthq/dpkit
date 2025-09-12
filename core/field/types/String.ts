import type { BaseConstraints, BaseField } from "./Base.ts"

/**
 * String field type
 */
export interface StringField extends BaseField<StringConstraints> {
  /**
   * Field type - discriminator property
   */
  type: "string"

  /**
   * Format of the string
   * - email: valid email address
   * - uri: valid URI
   * - binary: base64 encoded string
   * - uuid: valid UUID string
   */
  format?: "email" | "uri" | "binary" | "uuid"

  /**
   * Categories for enum values
   * Can be an array of string values or an array of {value, label} objects
   */
  categories?: string[] | Array<{ value: string; label: string }>

  /**
   * Whether categories should be considered to have a natural order
   */
  categoriesOrdered?: boolean
}

/**
 * String-specific constraints
 */
export interface StringConstraints extends BaseConstraints {
  /**
   * Minimum string length
   */
  minLength?: number

  /**
   * Maximum string length
   */
  maxLength?: number

  /**
   * Regular expression pattern to match
   */
  pattern?: string

  /**
   * Restrict values to a specified set of strings
   */
  enum?: string[]
}
