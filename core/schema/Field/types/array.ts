import type { BaseConstraints, BaseField } from "./base.js"

/**
 * Array field type (serialized JSON array)
 */
export interface ArrayField extends BaseField<ArrayConstraints> {
  /**
   * Field type - discriminator property
   */
  type: "array"
}

/**
 * Array-specific constraints
 */
export interface ArrayConstraints extends BaseConstraints {
  /**
   * Minimum array length
   */
  minLength?: number

  /**
   * Maximum array length
   */
  maxLength?: number

  /**
   * JSON Schema object for validating array items
   */
  jsonSchema?: Record<string, any>

  /**
   * Restrict values to a specified set of arrays
   * Serialized as JSON strings or parsed array objects
   */
  enum?: string[] | any[][]
}
