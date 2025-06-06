import type { BaseConstraints, BaseField } from "./base.js"

/**
 * Number field type
 */
export interface NumberField extends BaseField<NumberConstraints> {
  /**
   * Field type - discriminator property
   */
  type: "number"

  /**
   * Character used as decimal separator
   */
  decimalChar?: string

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
 * Number-specific constraints
 */
export interface NumberConstraints extends BaseConstraints {
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
   * Can be an array of numbers or strings that parse to numbers
   */
  enum?: number[] | string[]
}
