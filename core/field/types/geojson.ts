import type { BaseConstraints, BaseField } from "./base.js"

/**
 * GeoJSON field type
 */
export interface GeojsonField extends BaseField<GeojsonConstraints> {
  /**
   * Field type - discriminator property
   */
  type: "geojson"

  /**
   * Format of the geojson
   * - default: standard GeoJSON
   * - topojson: TopoJSON format
   */
  format?: "default" | "topojson"
}

/**
 * GeoJSON-specific constraints
 */
export interface GeojsonConstraints extends BaseConstraints {
  /**
   * Restrict values to a specified set of GeoJSON objects
   * Serialized as strings or GeoJSON object literals
   */
  enum?: string[] | Record<string, any>[]
}
