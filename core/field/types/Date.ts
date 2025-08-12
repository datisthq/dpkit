import type { BaseConstraints, BaseField } from "./Base.ts"

/**
 * Date field type
 */
export interface DateField extends BaseField<DateConstraints> {
  /**
   * Field type - discriminator property
   */
  type: "date"

  /**
   * Format of the date
   * - default: YYYY-MM-DD
   * - any: flexible date parsing (not recommended)
   * - Or custom strptime/strftime format string
   */
  format?: string
}

/**
 * Date-specific constraints
 */
export interface DateConstraints extends BaseConstraints {
  /**
   * Minimum allowed date value
   */
  minimum?: string

  /**
   * Maximum allowed date value
   */
  maximum?: string

  /**
   * Restrict values to a specified set of dates
   * Should be in string date format (e.g., "YYYY-MM-DD")
   */
  enum?: string[]
}
