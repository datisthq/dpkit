import type { BaseConstraints, BaseField } from "./Base.js"

/**
 * Year field type
 */
export interface YearField extends BaseField<YearConstraints> {
  /**
   * Field type - discriminator property
   */
  type: "year"
}

/**
 * Year-specific constraints
 */
export interface YearConstraints extends BaseConstraints {
  /**
   * Minimum allowed year
   */
  minimum?: number

  /**
   * Maximum allowed year
   */
  maximum?: number

  /**
   * Restrict values to a specified set of years
   * Can be an array of numbers or strings that parse to years
   */
  enum?: number[] | string[]
}
