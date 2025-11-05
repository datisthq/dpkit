import type { BaseConstraints, BaseField } from "./Base.ts"

/**
 * Boolean field type
 */
export interface BooleanField extends BaseField<BooleanConstraints> {
  /**
   * Field type - discriminator property
   */
  type: "boolean"

  /**
   * Values that represent true
   */
  trueValues?: string[]

  /**
   * Values that represent false
   */
  falseValues?: string[]
}

/**
 * Boolean-specific constraints
 */
export interface BooleanConstraints extends BaseConstraints {
  /**
   * Restrict values to a specified set
   * Can be an array of booleans or strings that parse to booleans
   */
  enum?: boolean[] | string[]
}
