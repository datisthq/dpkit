import type { BaseConstraints, BaseField } from "./Base.ts"

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
  minimum?: number | string

  /**
   * Maximum allowed year
   */
  maximum?: number | string

  /**
   * Exclusive minimum year value
   */
  exclusiveMinimum?: number | string

  /**
   * Exclusive maximum year value
   */
  exclusiveMaximum?: number | string

  /**
   * Restrict values to a specified set of years
   * Can be an array of numbers or strings that parse to years
   */
  enum?: number[] | string[]
}
