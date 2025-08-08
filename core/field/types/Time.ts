import type { BaseConstraints, BaseField } from "./Base.ts"

/**
 * Time field type
 */
export interface TimeField extends BaseField<TimeConstraints> {
  /**
   * Field type - discriminator property
   */
  type: "time"

  /**
   * Format of the time
   * - default: HH:MM:SS
   * - any: flexible time parsing (not recommended)
   * - Or custom strptime/strftime format string
   */
  format?: string
}

/**
 * Time-specific constraints
 */
export interface TimeConstraints extends BaseConstraints {
  /**
   * Minimum allowed time value
   */
  minimum?: string

  /**
   * Maximum allowed time value
   */
  maximum?: string

  /**
   * Restrict values to a specified set of times
   * Should be in string time format (e.g., "HH:MM:SS")
   */
  enum?: string[]
}
