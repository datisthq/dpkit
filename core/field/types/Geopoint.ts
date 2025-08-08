import type { BaseConstraints, BaseField } from "./Base.ts"

/**
 * Geopoint field type
 */
export interface GeopointField extends BaseField<GeopointConstraints> {
  /**
   * Field type - discriminator property
   */
  type: "geopoint"

  /**
   * Format of the geopoint
   * - default: "lon,lat" string with comma separator
   * - array: [lon,lat] array
   * - object: {lon:x, lat:y} object
   */
  format?: "default" | "array" | "object"
}

/**
 * Geopoint-specific constraints
 */
export interface GeopointConstraints extends BaseConstraints {
  /**
   * Restrict values to a specified set of geopoints
   * Format depends on the field's format setting
   */
  enum?: string[] | number[][] | Record<string, number>[]
}
