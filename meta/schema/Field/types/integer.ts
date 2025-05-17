import type { BaseConstraints, BaseField } from "./base.js"

/**
 * Integer field type
 */
export interface IntegerField extends BaseField<IntegerConstraints> {
  /**
   * Field type - discriminator property
   */
  type: "integer"

  /**
   * Character used as thousands separator
   */
  groupChar?: string

  /**
   * Whether number is presented without currency symbols or percent signs
   */
  bareNumber?: boolean
}

/**
 * Integer-specific constraints
 * @internal
 */
export interface IntegerConstraints extends BaseConstraints {
  /**
   * Minimum allowed value
   */
  minimum?: number

  /**
   * Maximum allowed value
   */
  maximum?: number

  /**
   * Restrict values to a specified set
   * Can be an array of integers or strings that parse to integers
   */
  enum?: number[] | string[]
}
