import type { BaseConstraints, BaseField } from "./Base.ts"

/**
 * Object field type (serialized JSON object)
 */
export interface ObjectField extends BaseField<ObjectConstraints> {
  /**
   * Field type - discriminator property
   */
  type: "object"
}

/**
 * Object-specific constraints
 */
export interface ObjectConstraints extends BaseConstraints {
  /**
   * Minimum number of properties
   */
  minLength?: number

  /**
   * Maximum number of properties
   */
  maxLength?: number

  /**
   * JSON Schema object for validating the object structure and properties
   */
  jsonSchema?: Record<string, any>

  /**
   * Restrict values to a specified set of objects
   * Serialized as JSON strings or object literals
   */
  enum?: string[] | Record<string, any>[]
}
