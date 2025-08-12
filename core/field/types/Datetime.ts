import type { BaseConstraints, BaseField } from "./Base.ts"

/**
 * Datetime field type
 */
export interface DatetimeField extends BaseField<DatetimeConstraints> {
  /**
   * Field type - discriminator property
   */
  type: "datetime"

  /**
   * Format of the datetime
   * - default: ISO8601 format
   * - any: flexible datetime parsing (not recommended)
   * - Or custom strptime/strftime format string
   */
  format?: string
}

/**
 * Datetime-specific constraints
 */
export interface DatetimeConstraints extends BaseConstraints {
  /**
   * Minimum allowed datetime value
   */
  minimum?: string

  /**
   * Maximum allowed datetime value
   */
  maximum?: string

  /**
   * Restrict values to a specified set of datetimes
   * Should be in string datetime format (e.g., ISO8601)
   */
  enum?: string[]
}
