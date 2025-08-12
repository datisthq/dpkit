import type { BaseConstraints, BaseField } from "./Base.ts"

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

  /**
   * Categories for enum values
   * Can be an array of values or an array of {value, label} objects
   */
  categories?: number[] | Array<{ value: number; label: string }>

  /**
   * Whether categories should be considered to have a natural order
   */
  categoriesOrdered?: boolean
}

/**
 * Integer-specific constraints
 * @internal
 */
export interface IntegerConstraints extends BaseConstraints {
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
   * Can be an array of integers or strings that parse to integers
   */
  enum?: number[] | string[]
}
