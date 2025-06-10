import type { BaseConstraints, BaseField } from "./Base.js"

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
  minimum?: number | string

  /**
   * Maximum allowed value
   */
  maximum?: number | string

  /**
   * Exclusive minimum allowed value
   */
  exclusiveMinimum?: number | string

  /**
   * Exclusive maximum allowed value
   */
  exclusiveMaximum?: number | string

  /**
   * Restrict values to a specified set
   * Can be an array of numbers or strings that parse to numbers
   */
  enum?: number[] | string[]
}
