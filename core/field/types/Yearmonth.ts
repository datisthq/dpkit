import type { BaseConstraints, BaseField } from "./Base.js"

/**
 * Year and month field type
 */
export interface YearmonthField extends BaseField<YearmonthConstraints> {
  /**
   * Field type - discriminator property
   */
  type: "yearmonth"
}

/**
 * Yearmonth-specific constraints
 */
export interface YearmonthConstraints extends BaseConstraints {
  /**
   * Minimum allowed yearmonth value (format: YYYY-MM)
   */
  minimum?: string

  /**
   * Maximum allowed yearmonth value (format: YYYY-MM)
   */
  maximum?: string

  /**
   * Restrict values to a specified set of yearmonths
   * Should be in string format (e.g., "YYYY-MM")
   */
  enum?: string[]
}
