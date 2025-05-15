import type { BaseConstraints, BaseField } from "./base.js"

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
   * - default: any valid string
   * - email: valid email address
   * - uri: valid URI
   * - binary: base64 encoded string
   * - uuid: valid UUID string
   */
  format?: "default" | "email" | "uri" | "binary" | "uuid" | string
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
