import type { BaseConstraints, BaseField } from "./base.js"

/**
 * Duration field type (ISO 8601 duration)
 */
export interface DurationField extends BaseField<DurationConstraints> {
  /**
   * Field type - discriminator property
   */
  type: "duration"
}

/**
 * Duration-specific constraints
 */
export interface DurationConstraints extends BaseConstraints {
  /**
   * Minimum allowed duration (ISO 8601 format)
   */
  minimum?: string

  /**
   * Maximum allowed duration (ISO 8601 format)
   */
  maximum?: string

  /**
   * Restrict values to a specified set of durations
   * Should be in ISO 8601 duration format
   */
  enum?: string[]
}
