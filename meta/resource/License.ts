/**
 * License information
 */
export interface License {
  /**
   * The name of the license
   * @example "MIT", "Apache-2.0"
   */
  name?: string

  /**
   * A URL to the license text
   */
  path?: string

  /**
   * Human-readable title of the license
   */
  title?: string
}
