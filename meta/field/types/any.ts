import type { BaseConstraints, BaseField } from "./base.js"

/**
 * Any field type (unspecified/mixed)
 */
export interface AnyField extends BaseField<AnyConstraints> {
  /**
   * Field type - discriminator property
   */
  type?: "any"
}

/**
 * Any field constraints
 */
export interface AnyConstraints extends BaseConstraints {
  /**
   * Restrict values to a specified set
   * For any field type, can be an array of any values
   */
  enum?: any[]
}
